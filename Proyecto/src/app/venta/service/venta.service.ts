import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../products/models/product.model';
import { Lote } from '../../compras/models/lotes.models';
import { LotesService } from '../../compras/services/compras.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/products`; // URL para obtener productos
  private loteApiUrl = `${environment.apiUrl}/lotes`; // URL para obtener lotes
  private authApiUrl = `${environment.apiUrl}/auth`; // URL para autenticación

  constructor(private httpClient: HttpClient, private lotesService: LotesService) {}

  checkStatus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<any>(`${this.authApiUrl}/check-status`, { headers });
  }

  // Método para obtener el token y los headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // En tu VentaService, actualiza el método crearVenta
  crearVenta(venta: {
    userId: string;
    productos: {
      productId: string;
      cantidad: number;
      ventaPrice: number;
    }[];
    metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO'; // Añadimos el campo metodo_pago
  }): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/ventas`, venta, {
      headers: this.getHeaders()
    })
    .pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }



  getProducts(limit = 10, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.httpClient.get<any>(this.apiUrl, { headers, params }).pipe(
      tap((response) => console.log('Respuesta de productos:', response)), // Log de respuesta
      map(response => ({
        products: response.data,  // Aquí almacenamos los productos
        hasMore: response.hasMore // Y aquí el valor de "hasMore"
      })),
      switchMap((response) => {
        const productObservables = response.products.map((product: Product) => {
          const productId = product.id ?? ''; // Si id es undefined, asigna una cadena vacía (o algún otro valor predeterminado)

          return this.lotesService.getLotesByProduct(productId).pipe(
            map((loteResponse) => {
              let lotes: Lote[] = loteResponse.lotes; // Obtenemos el arreglo de lotes

              // Log de lotes obtenidos
              console.log('Lotes para el producto:', product.id, lotes);

              // Filtrar los lotes con stock disponible
              lotes = lotes.filter(lote => lote.stock > 0);

              if (lotes.length > 0) {
                // Ordenar los lotes por fecha de creación (descendente) para obtener el más reciente
                const sortedLotesDesc = [...lotes].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
                const lastLote = sortedLotesDesc[0]; // El más reciente
                const lastLotPrice = lastLote ? lastLote.precioVenta : null;

                // Ordenar los lotes por fecha de creación (ascendente) para obtener el más antiguo
                const sortedLotesAsc = [...lotes].sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
                let oldestLote = sortedLotesAsc[0]; // El más antiguo

                // Si el lote más antiguo no tiene stock, buscamos el siguiente lote más antiguo con stock
                if (oldestLote && oldestLote.stock <= 0) {
                  // Buscar el siguiente lote más antiguo con stock
                  for (let i = 1; i < sortedLotesAsc.length; i++) {
                    if (sortedLotesAsc[i].stock > 0) {
                      oldestLote = sortedLotesAsc[i];
                      break;
                    }
                  }
                }

                const oldestLotPrice = oldestLote ? oldestLote.precioVenta : null;

                // Log del lote más reciente y más antiguo y sus precios
                console.log('Lote más reciente para el producto', product.id, lastLote);
                console.log('Precio del lote más reciente:', lastLotPrice);
                console.log('Lote más antiguo para el producto', product.id, oldestLote);
                console.log('Precio del lote más antiguo:', oldestLotPrice);

                // Verificar que fechaCreacion no sea undefined
                const fechaCreacion = product.fechaCreacion ? new Date(product.fechaCreacion) : new Date(); // Usamos la fecha actual si es undefined

                return {
                  ...product,
                  lastLotPrice: lastLotPrice,  // Añadir el precioVenta del último lote
                  oldestLotPrice: oldestLotPrice,  // Añadir el precioVenta del primer (más antiguo) lote
                  fechaCreacion: fechaCreacion,  // Convierte a objeto Date
                  lotes: lotes  // Mantener los lotes en el producto
                };
              } else {
                // Si no tiene lotes, asegurarnos de asignar null a lastLotPrice y oldestLotPrice, y lotes vacíos
                return {
                  ...product,
                  lastLotPrice: null,
                  oldestLotPrice: null,
                  fechaCreacion: product.fechaCreacion ? new Date(product.fechaCreacion) : new Date(),
                  lotes: []  // Asegurarse de que la propiedad 'lotes' esté vacía si no tiene lotes
                };
              }
            })
          );
        });

        return forkJoin(productObservables).pipe(
          map(productsWithDates => ({
            products: productsWithDates,
            hasMore: response.hasMore,  // Seguimos pasando el "hasMore"
          }))
        );
      }),
      tap((finalResponse) => console.log('Productos con lotes:', finalResponse)),
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return of({ products: [], hasMore: false }); // Retornar productos vacíos si hay error
      })
    );
  }








  // Obtener todos los lotes
  getLotes(): Observable<Lote[]> {
    return this.httpClient.get<Lote[]>(this.loteApiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `El servidor respondió con el código ${error.status}, ` +
        `detalle: ${error.error}`);
    }
    // Retornar un observable con un mensaje de error
    return throwError('Algo salió mal; por favor intente nuevamente más tarde.');
  }
}
