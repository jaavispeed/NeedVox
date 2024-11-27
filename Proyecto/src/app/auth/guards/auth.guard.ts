import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Cambia 'token' al nombre que estés usando para guardar el token

    if (token) {
      // Si hay un token, el usuario está autenticado
      return true;
    } else {
      // Si no hay token, redirige al login
      this.router.navigate(['/home']);
      return false;
    }
  }
}





