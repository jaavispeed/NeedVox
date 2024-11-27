import { Component, OnInit } from '@angular/core';
import { TotalProductosService } from './total-productos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-productos.component.html',

})
export class TotalProductosComponent implements OnInit {
  productos: any= [];
  error: string | null = null; // Manejo de errores

  constructor(private totalProductosService: TotalProductosService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.totalProductosService.obtenerProductos().subscribe(
      (response) => {
        console.log('Datos recibidos:', response); // Verifica los datos recibidos
        this.productos = response;
        console.log(this.productos)
      },
      (error) => {
        this.error = 'Error al obtener productos'; // Mensaje de error
        console.error('Error al obtener productos:', error);
      }
    );
  }
}
