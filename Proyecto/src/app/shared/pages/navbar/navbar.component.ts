import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export default class NavbarComponent {
  router=inject(Router)

  logout(): void {
    // Eliminar el token del localStorage
    console.log("entro aca")
    localStorage.removeItem('token');
    this.router.navigate(['/home'])

    // Opcional: Redirigir a la página de inicio o login
  }
}
