import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Lote, LoteResponse } from '../../compras/models/lotes.models';
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
      map(response => ({
        products: response.data,  // Solo los productos
        hasMore: response.hasMore  // Indicador de más productos
      })),
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return of({ products: [], hasMore: false }); // Retorna productos vacíos si ocurre un error
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
    // Imprimir más detalles para depurar
    console.error('Error completo:', error);
    return throwError('Algo salió mal; por favor intente nuevamente más tarde.');
  }


  // Obtener lotes de un producto
  getLotesByProduct(productId: string): Observable<LoteResponse> {
    const lotesUrl = `${this.loteApiUrl}/producto/${productId}`;
    return this.httpClient.get<LoteResponse>(lotesUrl, { headers: this.getHeaders() }).pipe(
      tap(response => {
        console.log('Lotes obtenidos para el producto:', response);

        if (Array.isArray(response.lotes)) {
          response.lotes.forEach(lote => {
            console.log('Lote:', lote);

            // Acceder correctamente a la propiedad 'product' en lugar de 'producto'
            if (lote.producto && lote.producto.title) {
              console.log(`Lote ID: ${lote.id}, Stock: ${lote.stock}, Producto: ${lote.producto.title}`);
            } else {
              console.error('El lote no tiene un producto asignado o el producto no tiene título:', lote);
            }
          });
        } else {
          console.error('La respuesta no contiene un arreglo de lotes:', response);
        }
      }),
      catchError(this.handleError)
    );
  }
}
