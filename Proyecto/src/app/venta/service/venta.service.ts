import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../../products/models/product.model';
import { Lote } from '../../compras/models/lotes.models';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/products'; // URL para obtener productos
  private loteApiUrl = 'http://localhost:3000/api/lotes'; // URL para obtener lotes
  private authApiUrl = 'http://localhost:3000/api/auth'; // URL para autenticación

  constructor(private httpClient: HttpClient) {}

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

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError) // Manejo de errores
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
