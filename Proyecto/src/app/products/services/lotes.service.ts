import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Lote } from '../models/lotes.models';

@Injectable({
  providedIn: 'root',
})
export class LotesService {
  private apiUrl = 'http://localhost:3000/api/lotes';

  constructor(private http: HttpClient) {}

  // Configurar encabezados de autorización
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Configura el encabezado de autorización
      'Content-Type': 'application/json', // También incluye el tipo de contenido
    });
  }

  // Obtener todos los lotes
  getLotes(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<Lote[]>('getLotes', []))
    );
  }

  // Obtener un lote por ID
  getLoteById(id: string): Observable<Lote> {
    return this.http.get<Lote>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<Lote>('getLoteById'))
    );
  }

  // Crear un nuevo lote
  createLote(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(this.apiUrl, lote, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<Lote>('createLote'))
    );
  }

  // Actualizar un lote existente
  updateLote(id: string, lote: Lote): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/${id}`, lote, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<Lote>('updateLote'))
    );
  }

  // Eliminar un lote
  deleteLote(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError('deleteLote'))
    );
  }

  // Obtener lotes por producto
  getLotesByProduct(productId: string): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.apiUrl}/producto/${productId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<Lote[]>('getLotesByProduct', []))
    );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
