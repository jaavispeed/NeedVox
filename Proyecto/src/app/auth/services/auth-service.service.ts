// src/app/auth/services/auth-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Asegúrate de que esta ruta sea correcta
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) { // Asegúrate de que el token exista
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(userData: { email: string; username: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}
