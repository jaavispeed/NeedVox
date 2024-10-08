// import { Injectable } from "@angular/core";
// import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, Router } from "@angular/router";
// import { Observable, tap } from "rxjs";
// import { AuthService } from '../services/auth-service.service';

// @Injectable({ providedIn: 'root'})
// export class AuthGuard implements CanMatch, CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   // Método privado para verificar el estado de autenticación
//   private checkAuthStatus(): boolean | Observable<boolean> {
//     // Llama al servicio de autenticación para comprobar si el usuario está autenticado
//     return this.authService.checkAuthentication()
//       .pipe(
//         // Usa tap para realizar efectos secundarios
//         tap(isAuthenticated => {
//           // Si el usuario no está autenticado, redirige a la página de login
//           if (!isAuthenticated) {
//             this.router.navigate(['/login']); // Redirige a la ruta de login
//           }
//         })
//       );
//   }

//   // Método para determinar si se puede coincidir con la ruta
//   canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
//     // Llama al método checkAuthStatus para verificar la autenticación
//     return this.checkAuthStatus();
//   }

//   // Método para determinar si se puede activar la ruta
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
//     // Llama al método checkAuthStatus para verificar la autenticación
//     return this.checkAuthStatus();
//   }
// }

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
      this.router.navigate(['/login']);
      return false;
    }
  }
}





