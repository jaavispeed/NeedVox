import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../products/models/product.model';
import { Lote } from '../../compras/models/lotes.models';
import { LotesService } from '../../compras/services/compras.service';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/products'; // URL para obtener productos
  private loteApiUrl = 'http://localhost:3000/api/lotes'; // URL para obtener lotes
  private authApiUrl = 'http://localhost:3000/api/auth'; // URL para autenticación

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
  crearVenta(venta: { userId: string; productos: { productId: string; cantidad: number; ventaPrice: number; }[] }): Observable<any> {
    return this.httpClient.post<any>('http://localhost:3000/api/ventas', venta, { headers: this.getHeaders() })
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
              const lotes: Lote[] = loteResponse.lotes; // Obtenemos el arreglo de lotes

              // Obtener el precio de venta más reciente
              const lastLote = lotes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())[0];
              const lastLotPrice = lastLote ? lastLote.precioVenta : null;

              // Verificar que fechaCreacion no sea undefined
              const fechaCreacion = product.fechaCreacion ? new Date(product.fechaCreacion) : new Date(); // Usamos la fecha actual si es undefined

              return {
                ...product,
                lastLotPrice: lastLotPrice, // Añadir el precioVenta del último lote
                fechaCreacion: fechaCreacion // Convierte a objeto Date
              };
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
