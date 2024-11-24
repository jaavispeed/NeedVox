import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  imports: [CommonModule, AlertComponent], // Importa el CommonModule aquí
})
export default class DashboardPageComponent implements OnInit {
  userName: string = '';
  totalProducts: number = 0; // Propiedad para almacenar el conteo
  welcomeMessage: string | null = null;

  // Variables para mostrar los gastos
  gastosMensuales: number = 0;
  gastosDiarios: number = 0;
  gastosAnuales: number = 0;


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerNombreUsuario();
    const storedMessage = localStorage.getItem('welcomeMessage');
    this.welcomeMessage = storedMessage || ''; // Asigna una cadena vacía si es null
    localStorage.removeItem('welcomeMessage');
    this.obtenerGastos()
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



  obtenerGastos(): void {
    console.log('Llamando a obtener gastos...');

    this.dashboardService.getGastos('dia').subscribe(
      (response) => {
        console.log('Respuesta de gastos diarios:', response);
        this.gastosDiarios = response.estadisticas?.[0]?.totalcompra || 0;
      },
      (error) => {
        console.error('Error al obtener los gastos diarios:', error);
      }
    );

    this.dashboardService.getGastos('mes').subscribe(
      (response) => {
        console.log('Respuesta de gastos mensuales:', response);
        this.gastosMensuales = response.estadisticas?.[0]?.totalcompra || 0;
      },
      (error) => {
        console.error('Error al obtener los gastos mensuales:', error);
      }
    );

    this.dashboardService.getGastos('año').subscribe(
      (response) => {
        console.log('Respuesta de gastos anuales:', response);
        this.gastosAnuales = response.estadisticas?.[0]?.totalcompra || 0;
      },
      (error) => {
        console.error('Error al obtener los gastos anuales:', error);
      }
    );
  }



}
