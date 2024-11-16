import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Asegúrate de que esta ruta sea correcta
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  changePassword(changePasswordDto: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post('/api/auth/change-password', changePasswordDto);
  }
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

  // Método para obtener el usuario actual
  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    
    // Configuramos los headers para enviar el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/perfil`, { headers }); 
  }
  
  updateProfile(updatedData: { username: string; email: string }): Observable<User> {
    const token = localStorage.getItem('token');
    
    // Configuramos los headers para enviar el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.patch<User>(`${this.apiUrl}/update-profile`, updatedData, { headers });
  }
  
}