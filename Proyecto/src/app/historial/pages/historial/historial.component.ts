import { Component } from '@angular/core';
import { HistorialService } from '../../services/historial.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Venta } from '../../../venta/models/venta-car.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  ventas: Venta[] = [];
  ventaSeleccionada: any | null = null; // Cambiado a any para incluir los detalles del producto
  productos: any[] = []; // Lista de productos
  fechaSeleccionada: string = ''; // Fecha seleccionada para filtrar
  ventasPorPagina: number = 5;
  paginaActual: number = 1;

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void {
    this.cargarProductos(); // Cargar productos al iniciar
    this.navegarHoy(); // Cargar ventas de hoy al iniciar
  }

  cargarProductos(): void {
    this.historialService.getVentasProductVenta().subscribe(
      (data) => {
        this.productos = data.map(item => item.product); // Almacenar la lista de productos
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  cargarVentas(): void {
    this.historialService.getVentas().subscribe(
      (data: Venta[]) => {
        this.ventas = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      (error) => {
        console.error('Error al obtener ventas', error);
      }
    );
  }


  filtrarVentasPorFecha(): void {
    if (!this.fechaSeleccionada) {
      this.cargarVentas(); // Cargar todas las ventas si no hay filtro
    } else {
      this.historialService.getVentasPorFecha(this.fechaSeleccionada).subscribe(
        (data: Venta[]) => {
          this.ventas = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
        },
        (error) => {
          console.error('Error al obtener ventas por fecha', error);
        }
      );
    }
  }

  navegarHoy(): void {
    const hoy = new Date();
    this.fechaSeleccionada = this.formatearFecha(hoy);
    this.filtrarVentasPorFecha();
  }

  cambiarDiaAnterior(): void {
    const fecha = new Date(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() - 1);
    this.fechaSeleccionada = this.formatearFecha(fecha);
    this.filtrarVentasPorFecha();
  }

  cambiarDiaSiguiente(): void {
    const fecha = new Date(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() + 1);
    this.fechaSeleccionada = this.formatearFecha(fecha);
    this.filtrarVentasPorFecha();
  }

  abrirModal(venta: any): void {
    this.ventaSeleccionada = venta;
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }

  getVentasParaMostrar(): Venta[] {
    const inicio = (this.paginaActual - 1) * this.ventasPorPagina;
    return this.ventas.slice(inicio, inicio + this.ventasPorPagina);
  }

  obtenerNumeroVenta(i: number): number {
    const indiceGlobal = (this.paginaActual - 1) * this.ventasPorPagina + i + 1;
    return this.ventas.length - indiceGlobal + 1; // Para que el número sea decreciente
  }

  siguientePagina(): void {
    if (this.hayMasVentas()) {
      this.paginaActual++;
    }
  }

  paginaAnterior(): void {
    if (this.hayPaginasPrevias()) {
      this.paginaActual--;
    }
  }

  hayMasVentas(): boolean {
    return this.paginaActual * this.ventasPorPagina < this.ventas.length;
  }

  hayPaginasPrevias(): boolean {
    return this.paginaActual > 1;
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  // Método para obtener el producto por ID
  obtenerProductoPorId(productId: string) {
    return this.productos.find(producto => producto.id === productId);
  }
}
