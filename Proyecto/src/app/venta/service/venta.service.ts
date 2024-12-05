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

  constructor(private httpClient: HttpClient, private lotesService: LotesService) { }

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
      ventaPrice: number;  // Aquí ahora usaremos el precio del producto, no de los lotes
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
      switchMap(response => {
        // Aquí declaramos explícitamente el tipo de productos
        const products: Product[] = response.data;  // Usamos el tipo Product para productos

        // Filtramos para asegurarnos de que todos los ids sean cadenas
        const productIds: string[] = products
          .map(product => product.id)
          .filter((id): id is string => id !== undefined);  // Filtramos undefined

        // Obtenemos los lotes para cada producto
        return forkJoin(
          productIds.map((productId: string) =>
            this.httpClient.get<any>(`${this.loteApiUrl}/producto/${productId}`, { headers })
              .pipe(
                map(lotesResponse => {
                  const product = products.find(product => product.id === productId);
                  return product ? {
                    ...product,  // Ahora product está tipado correctamente
                    lotes: lotesResponse.lotes || []  // Añadimos los lotes al producto
                  } : null;
                })
              )
          )
        ).pipe(
          map((productsWithLotes) => ({
            products: productsWithLotes.filter(product => product !== null),  // Filtramos los nulls si no se encuentra el producto
            hasMore: response.hasMore
          }))
        );
      }),
      catchError((error) => {
        console.error('Error al obtener productos o lotes', error);
        return of({ products: [], hasMore: false });
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
