import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para tipar los productos (ajusta según tu estructura)
interface Product {
  id: number;
  name: string;
  price: number;
  // Otros campos que el producto tenga
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private httpClient: HttpClient) {}

  // Método para obtener el token y los headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl, { headers: this.getHeaders() })
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
