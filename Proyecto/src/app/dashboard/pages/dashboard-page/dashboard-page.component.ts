import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export default class DashboardPageComponent implements OnInit {

  userName: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerNombreUsuario();
  }

  obtenerNombreUsuario(): void {
    this.dashboardService.checkStatus().subscribe(
      (response) => {
        this.userName = response.username; // Asumiendo que el backend devuelve el username
      },
      (error) => {
        console.error('Error al verificar el estado del usuario:', error);
      }
    );
  }
}
