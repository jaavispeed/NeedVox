import { Component } from '@angular/core';
import { HistorialService } from '../../services/historial.service';
import { CommonModule } from '@angular/common';

// Define la interfaz para las ventas
interface Venta {
  id: string; // Asumiendo que id es un string (UUID)
  cantidadTotal: number;
  total: number;
  fecha: string; // Asumiendo que la fecha es un string (puede ser Date si lo prefieres)
  productos: any[]; // Reemplaza 'any' con el tipo específico de tus productos si es posible
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  ventas: Venta[] = []; // Cambiar a tipo Venta
  ventaSeleccionada: Venta | null = null; // Cambiar a tipo Venta o null

  // Cambiar a 5 ventas por página
  ventasPorPagina: number = 5;
  paginaActual: number = 1;

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void {
    this.historialService.getVentas().subscribe(
      (data: Venta[]) => { // Especificar el tipo de 'data'
        // Ordenar las ventas por fecha de forma descendente
        this.ventas = data.sort((a: Venta, b: Venta) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      (error) => {
        console.error('Error al obtener ventas', error);
      }
    );
  }

  abrirModal(venta: Venta): void {
    this.ventaSeleccionada = venta;
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }

  // Métodos para paginación
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

  // Método para calcular las ventas a mostrar
  getVentasParaMostrar(): Venta[] {
    const inicio = (this.paginaActual - 1) * this.ventasPorPagina;
    return this.ventas.slice(inicio, inicio + this.ventasPorPagina);
  }

  // Método para saber si hay más ventas
  hayMasVentas(): boolean {
    return this.paginaActual * this.ventasPorPagina < this.ventas.length;
  }

  // Método para saber si hay páginas anteriores
  hayPaginasPrevias(): boolean {
    return this.paginaActual > 1;
  }

  // Método para obtener el número de venta para mostrar
  obtenerNumeroVenta(i: number): number {
    const indiceGlobal = (this.paginaActual - 1) * this.ventasPorPagina + i + 1;
    return this.ventas.length - indiceGlobal + 1; // Para que el número sea decreciente
  }
}
