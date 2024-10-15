import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../products/models/product.model';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api/products';
  productos: Product[] = []; // Variable para almacenar los productos
  carrito: { product: Product; cantidad: number; hora: Date }[] = []; // Cambiado para incluir cantidad y hora
  totalPrecio: number = 0; // Variable para almacenar el precio total

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  // Obtener todos los productos
  obtenerProductos(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.httpClient.get<Product[]>(this.apiUrl, { headers }).subscribe(
      (data) => {
        // Almacena los productos obtenidos en la variable productos
        this.productos = data.map(item => ({
          id: item.id,
          title: item.title,
          compraPrice: item.compraPrice,
          ventaPrice: item.ventaPrice,
          stock: item.stock,
          slug: item.slug || '',
          user: { id: item.user.id },
          expiryDate: item.expiryDate || undefined,
          barcode: item.barcode || null
        }));
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.productos = []; // Asigna un array vacío en caso de error
      }
    );
  }

  agregarAlCarrito(producto: Product): void {
    // Comprueba si el producto ya está en el carrito
    const existe = this.carrito.find(item => item.product.id === producto.id);
    if (existe) {
      existe.cantidad++; // Incrementa la cantidad si ya está en el carrito
    } else {
      // Agrega el producto si no está en el carrito
      this.carrito.push({ product: producto, cantidad: 1, hora: new Date() });
    }
    this.calcularTotal(); // Recalcula el total después de agregar
  }

  eliminarDelCarrito(item: { product: Product; cantidad: number; hora: Date }): void {
    const existe = this.carrito.find(i => i.product.id === item.product.id);
    if (existe) {
      existe.cantidad--; // Decrementa la cantidad
      if (existe.cantidad <= 0) {
        this.carrito = this.carrito.filter(i => i.product.id !== item.product.id); // Elimina el producto si la cantidad es 0
      }
    }
    this.calcularTotal(); // Recalcula el total después de eliminar
  }

  calcularTotal(): void {
    this.totalPrecio = this.carrito.reduce((total, item) => total + (item.product.ventaPrice * item.cantidad), 0);
  }
}
