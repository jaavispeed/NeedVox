import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';

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

  userRole: string[] = [];


  constructor(private navbarService: NavbarService){}

  ngOnInit(): void {
    this.obtenerRole();
  }

  toggleMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen; // Alterna el estado del menú
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
    localStorage.removeItem('userId'); // Elimina el carrito del localStorage
    this.router.navigate(['/home']);
  }


  obtenerRole(): void {
    this.navbarService.checkStatus().subscribe(
      (response) => {
        this.userRole= response.roles; // Asumiendo que el backend devuelve el username
      },
      (error) => {
        console.error('Error al verificar el rol', error);
      }
    );
  }

}
