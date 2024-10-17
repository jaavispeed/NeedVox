import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export default class DashboardPageComponent implements OnInit {
  userName: string = '';
  totalProducts: number = 0; // Propiedad para almacenar el conteo

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerNombreUsuario();
  }

  obtenerNombreUsuario(): void {
    this.dashboardService.checkStatus().subscribe(
      (response) => {
        this.userName = response.username; // Obtener el nombre del usuario
        this.obtenerConteoProductos(response.id); // Pasar el ID del usuario para el conteo
      },
      (error) => {
        console.error('Error al verificar el estado del usuario:', error);
      }
    );
  }

  obtenerConteoProductos(userId: string): void {
    this.dashboardService.getProductCount(userId).subscribe(
      (count) => {
        this.totalProducts = count; // Asigna el conteo a la propiedad
      },
      (error) => {
        console.error('Error al obtener el conteo de productos:', error);
      }
    );
  }
}
