import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

constructor(private router: Router) {}

canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Si el token existe, el usuario ya está autenticado, redirige a otra página
    this.router.navigate(['/index']);
      return false;
    } else {

    return true;
    }
}
}
