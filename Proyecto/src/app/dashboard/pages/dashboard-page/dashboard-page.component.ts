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



  gastosResumen = {
    gastosDiarios: { totalCompra: 0, cantidad: 0 },
    gastosMensuales: { totalCompra: 0, cantidad: 0 },
    gastosAnuales: { totalCompra: 0, cantidad: 0 },
  };

  ventasResumen = {
    ventasDiarias: { total: 0, suma: 0 },
    ventasMensuales: { total: 0, suma: 0 },
    ventasAnuales: { total: 0, suma: 0 },
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



// Actualiza la función para obtener los gastos
obtenerGastos(): void {
  this.setLoadingState(true); // Activar el spinner

  this.dashboardService.getGastos().subscribe(
    (response) => {
      // Asignar los valores de los gastos directamente desde la respuesta
      this.gastosResumen = {
        gastosDiarios: {
          totalCompra: response.gastosDia.totalCompra || 0,
          cantidad: response.gastosDia.cantidad || 0,
        },
        gastosMensuales: {
          totalCompra: response.gastosMes.totalCompra || 0,
          cantidad: response.gastosMes.cantidad || 0,
        },
        gastosAnuales: {
          totalCompra: response.gastosAnio.totalCompra || 0,
          cantidad: response.gastosAnio.cantidad || 0,
        },
      };

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

        // Asignar los valores del resumen directamente
        this.ventasResumen = {
          ventasDiarias: {
            total: response.ventasDiarias?.total || 0,
            suma: response.ventasDiarias?.suma || 0,
          },
          ventasMensuales: {
            total: response.ventasMensuales?.total || 0,
            suma: response.ventasMensuales?.suma || 0,
          },
          ventasAnuales: {
            total: response.ventasAnuales?.total || 0,
            suma: response.ventasAnuales?.suma || 0,
          },
        };

        this.setLoadingState(false); // Desactivar el spinner
      },
      (error) => {
        console.error('Error al obtener el resumen de ventas:', error);
        this.setLoadingState(false); // Desactivar el spinner si hay error
      }
    );
  }



}
