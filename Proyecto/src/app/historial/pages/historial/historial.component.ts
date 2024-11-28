import { Component } from '@angular/core';
import { HistorialService } from '../../services/historial.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Venta } from '../../../venta/models/venta-car.model';
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  ventas: Venta[] = [];
  ventaSeleccionada: any | null = null; // Cambiado a any para incluir los detalles del producto
  productos: any[] = []; // Lista de productos
  fechaSeleccionada: string = ''; // Fecha seleccionada para filtrar
  ventasPorPagina: number = 10;
  paginaActual: number = 1;
  isLoading: boolean = false; // Para controlar la visualización del spinner


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
    this.isLoading = true; // Activar el spinner antes de la carga
    this.historialService.getVentas().subscribe(
      (data: Venta[]) => {
        this.ventas = data
          .map(venta => {
            // Convertir la fecha UTC a hora local en Chile
            const fechaUTC = new Date(venta.fecha);
            fechaUTC.setHours(fechaUTC.getHours() - 3);  // Ajusta la diferencia de zona horaria manualmente
            return {
              ...venta,
              fecha: fechaUTC.toISOString().split('T')[0] // Formato YYYY-MM-DD
            };
          })
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          this.isLoading = false; // Desactivar el spinner cuando termine de cargar

      },
      (error) => {
        console.error('Error al obtener ventas', error);
        this.isLoading = false; // Desactivar el spinner cuando termine de cargar

      }
    );
  }




  filtrarVentasPorFecha(): void {
    if (!this.fechaSeleccionada) {
      this.isLoading = true; // Activar el spinner antes de la carga

      this.cargarVentas(); // Cargar todas las ventas si no hay filtro
    } else {
      // Convertir la fecha seleccionada a YYYY-MM-DD para comparación sin hora
      const fechaFiltro = this.fechaSeleccionada.split('T')[0];

      this.historialService.getVentas().subscribe(
        (data: Venta[]) => {
          // Filtrar las ventas para la fecha seleccionada
          this.ventas = data.filter(venta => {
            // Convertir la fecha de la venta al formato YYYY-MM-DD (sin hora)
            const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
            return fechaVenta === fechaFiltro; // Compara solo la parte de la fecha
          }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

          // Mostrar un log con las ventas filtradas para la fecha seleccionada
          console.log(`Ventas recibidas para el día ${fechaFiltro}:`, this.ventas);

          this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
          this.isLoading = false; // Desactivar el spinner después de filtrar

        },
        (error) => {
          console.error('Error al obtener ventas por fecha', error);
          this.isLoading = false; // Desactivar el spinner después de filtrar

        }
      );
    }
  }

// Método que verifica si el día siguiente es válido
esDiaSiguienteNoValido(): boolean {
  // Obtener la fecha actual
  const fechaHoy = new Date();

  // Comprobar si la fecha seleccionada es hoy o posterior
  const fechaSeleccionada = new Date(this.fechaSeleccionada);

  // Comparar si la fecha seleccionada es mayor o igual a hoy (no se puede navegar al día siguiente si aún no es ese día)
  return fechaSeleccionada >= fechaHoy; // Si la fecha seleccionada es hoy o después, deshabilitar el botón
}


navegarHoy(): void {
  this.isLoading = true; // Activar spinner

  const hoy = new Date();
  this.fechaSeleccionada = this.formatearFecha(hoy);
  this.filtrarVentasPorFecha();
}


  cambiarDiaSiguiente(): void {
    this.isLoading = true; // Activar spinner
    const fecha = new Date(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() + 1);
    this.fechaSeleccionada = this.formatearFecha(fecha);
    this.filtrarVentasPorFecha();  // Llamar para obtener ventas para la nueva fecha
  }

  cambiarDiaAnterior(): void {
    this.isLoading = true; // Activar spinner

    const fecha = new Date(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() - 1);
    this.fechaSeleccionada = this.formatearFecha(fecha);
    this.filtrarVentasPorFecha();  // Llamar para obtener ventas para la nueva fecha
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

  formatCurrency(value: any): string {
    if (typeof value === 'number') {
      return `$${value.toFixed(0)}`;
    } else if (typeof value === 'string') {
      const numberValue = parseFloat(value); // Convierte la cadena a número
      return isNaN(numberValue) ? '$0' : `$${numberValue.toFixed(0)}`;
    }
    return '$0'; // Valor por defecto si no es un número ni una cadena válida
  }

  getColorMetodoPago(metodo_pago: string): string {
    switch (metodo_pago) {
      case 'EFECTIVO':
        return 'bg-green-500'; // Verde para efectivo
      case 'TRANSFERENCIA':
        return 'bg-blue-500'; // Azul para transferencia
      case 'TARJETA':
        return 'bg-purple-500'; // Morado para tarjeta
      case 'OTRO':
        return 'bg-gray-500'; // Gris para otros
      default:
        return 'bg-gray-300'; // Color por defecto si no coincide
    }
  }
}
