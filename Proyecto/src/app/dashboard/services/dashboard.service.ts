import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private apiUrlprod = `${environment.apiUrl}/products`;
  private apiUrlStats = `${environment.apiUrl}/lotes/estadisticas`;


  constructor(private http: HttpClient) {}

  checkStatus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/check-status`, { headers });
  }

  getProductCount(userId: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<number>(`${this.apiUrlprod}/count/${userId}`, { headers });
  }

  getGastos(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Añadir el encabezado de autorización
    });
    return this.http.get<any>(`${this.apiUrlStats}`, { headers })
  }


  getVentasResumen(): Observable<any> {
    const token = localStorage.getItem('token'); // Asegúrate de usar el token si es necesario
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${environment.apiUrl}/ventas/resumen`, { headers });
  }



}
