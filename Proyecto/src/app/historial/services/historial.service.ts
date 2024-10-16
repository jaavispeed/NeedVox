import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) { }

  getVentas(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local o desde donde lo almacenes.

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token al encabezado de la solicitud
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
