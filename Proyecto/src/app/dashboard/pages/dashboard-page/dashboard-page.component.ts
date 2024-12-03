import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  imports: [CommonModule, AlertComponent, SpinnerComponent], // Importa el CommonModule aquí
})
export default class DashboardPageComponent implements OnInit {
  userName: string = '';
  totalProducts: number = 0; // Propiedad para almacenar el conteo
  welcomeMessage: string | null = null;

  isLoading: boolean = false; // Para controlar la visualización del spinner



  // Variables para mostrar los gastos
  gastosMensuales: number = 0;
  gastosDiarios: number = 0;
  gastosAnuales: number = 0;

  ventasResumen = {
    ventasDiarias: 0,
    ventasMensuales: 0,
    ventasAnuales: 0
  };


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerNombreUsuario();
    const storedMessage = localStorage.getItem('welcomeMessage');
    this.welcomeMessage = storedMessage || ''; // Asigna una cadena vacía si es null
    localStorage.removeItem('welcomeMessage');
    this.obtenerGastos();
    this.obtenerVentasResumen(); // Llamar al nuevo método

  }

  setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  obtenerNombreUsuario(): void {
    this.setLoadingState(true); // Activar el spinner

    this.dashboardService.checkStatus().subscribe(
      (response) => {
        this.userName = response.username; // Obtener el nombre del usuario
        this.obtenerConteoProductos(response.id); // Pasar el ID del usuario para el conteo
      },
      (error) => {
        console.error('Error al verificar el estado del usuario:', error);
        this.setLoadingState(false); // Desactivar el spinner

      }
    );
  }

  obtenerConteoProductos(userId: string): void {

    this.dashboardService.getProductCount(userId).subscribe(
      (count) => {
        this.totalProducts = count; // Asigna el conteo a la propiedad
        this.setLoadingState(false); // Desactivar el spinner

      },
      (error) => {
        console.error('Error al obtener el conteo de productos:', error);
        this.setLoadingState(false); // Desactivar el spinner

      }
    );
  }



  obtenerGastos(): void {
    this.setLoadingState(true); // Activar el spinner

    console.log('Llamando a obtener gastos...');

    this.dashboardService.getGastos().subscribe(
      (response) => {
        console.log('Respuesta de gastos:', response);

        // Asignar los valores de los gastos directamente desde la respuesta
        this.gastosDiarios = response.gastosDia || 0;
        this.gastosMensuales = response.gastosMes || 0;
        this.gastosAnuales = response.gastosAnio || 0;

        this.setLoadingState(false); // Desactivar el spinner después de obtener los gastos
      },
      (error) => {
        console.error('Error al obtener los gastos:', error);
        this.setLoadingState(false); // Desactivar el spinner si hay error
      }
    );
  }


  obtenerVentasResumen(): void {
    this.setLoadingState(true); // Activar el spinner

    this.dashboardService.getVentasResumen().subscribe(
      (response) => {
        console.log('Resumen de ventas:', response); // Depuración
        this.ventasResumen = response; // Asignar los datos del resumen
        this.setLoadingState(false); // Desactivar el spinner después de obtener las ventas

      },
      (error) => {
        console.error('Error al obtener el resumen de ventas:', error);
        this.setLoadingState(false); // Desactivar el spinner después de obtener las ventas

      }
    );
  }


}
