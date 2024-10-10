import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export default class NavbarComponent {
  router = inject(Router);
  isUserMenuOpen = false; // Propiedad para controlar el menú de usuario

  toggleMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen; // Alterna el estado del menú
  }

  logout(): void {
    console.log("entro aca");
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}
