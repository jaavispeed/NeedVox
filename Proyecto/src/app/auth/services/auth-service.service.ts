import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';  // URL base de la API de autenticación
  public currentUser: User | null = null;  // Propiedad para almacenar el usuario actual, inicialmente nulo

  constructor(private httpClient: HttpClient) {}  // Inyección de HttpClient

  // Método para iniciar sesión, recibe las credenciales y devuelve un observable de User
  login(credentials: { email: string; password: string }): Observable<User> {
    // Realizamos una solicitud POST a la API de login con las credenciales proporcionadas
    return this.httpClient.post<User>(`${this.apiUrl}/login`, credentials);
  }

  // Método para registrar un nuevo usuario, recibe los datos del usuario y devuelve un observable
  register(userData: { username: string, email: string, password: string }) {
    // Realizamos  una solicitud POST a la API de registro con los datos del nuevo usuario
    return this.httpClient.post(`${this.apiUrl}/register`, userData);
  }

  // Método para comprobar la autenticación del usuario
  checkAuthentication(): Observable<boolean> {
    // Verifica si existe un token en el localStorage, si no, devuelve un observable con false
    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');  // Obtiene el token del localStorage

    // Realizamos una solicitud GET a la API para verificar el usuario autenticado
    return this.httpClient.get<User>(`${this.apiUrl}/users/1`)
      .pipe(
        tap(user => this.currentUser = user),  // Asigna el usuario autenticado a `currentUser`
        map(user => !!user),  // Devuelve true si el usuario existe, false de lo contrario
        catchError(err => of(false))  // Maneja errores devolviendo un observable con false
      );
  }
}
