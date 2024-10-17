import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrlprod = 'http://localhost:3000/api/products';

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

}
