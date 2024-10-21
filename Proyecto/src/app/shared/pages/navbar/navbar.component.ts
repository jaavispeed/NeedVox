import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
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

  @HostListener('document:click', ['$event'])
  closeMenuOnClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Referencias al botón del menú y al menú de usuario
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');

    // Verifica si el clic fue fuera del botón y del menú
    if (
      this.isUserMenuOpen &&
      userMenuButton &&
      !userMenuButton.contains(target) &&
      userMenu &&
      !userMenu.contains(target)
    ) {
      this.isUserMenuOpen = false; // Cierra el menú
    }
  }


}