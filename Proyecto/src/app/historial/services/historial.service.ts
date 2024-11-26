import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Venta } from '../../venta/models/venta-car.model';
import { environment } from '../../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private apiUrl = `${environment.apiUrl}/ventas`; // URL de la API
  private productVentaUrl = `${environment.apiUrl}/ventas/product-venta`; // URL de la API de ProductVenta

  constructor(private http: HttpClient) {}

  // Método para obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl, {
      headers: this.getHeaders(),
    }).pipe(tap(data => console.log('Ventas recibidas:', data)));
  }

  // Método para obtener ventas por fecha
  getVentasPorFecha(fecha: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/fecha/${fecha}`, {
      headers: this.getHeaders(),
    });
  }

  // Método para obtener el token y los headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para obtener todas las ventas con productos
  getVentasProductVenta(): Observable<any[]> {
    return this.http.get<any[]>(this.productVentaUrl, {
      headers: this.getHeaders(),
    }).pipe(tap(data => console.log('Ventas con productos recibidas:', data)));
  }
}
