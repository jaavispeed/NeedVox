import { Component } from '@angular/core';
import { HistorialService } from '../../services/historial.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  ventas: any[] = [];
  ventaSeleccionada: any = null;

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void {
    this.historialService.getVentas().subscribe(
      (data) => {
        this.ventas = data;
      },
      (error) => {
        console.error('Error al obtener ventas', error);
      }
    );
  }

  abrirModal(venta: any): void {
    this.ventaSeleccionada = venta;
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }
}
