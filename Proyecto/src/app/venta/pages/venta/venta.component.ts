import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../../../products/models/product.model';
import { FormsModule } from '@angular/forms';
import { VentaCar } from '../../models/venta-car.model';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, AfterViewInit {
  private apiUrl = 'http://localhost:3000/api/products';
  productos: Product[] = [];
  carrito: VentaCar[] = [];
  productosFiltrados: Product[] = [];
  searchTerm: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.cargarCarritoDesdeLocalStorage(); // Cargar el carrito al iniciar
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
        this.productos = data;
        this.productosFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.productos = [];
      }
    );
  }

  // Cargar el carrito desde localStorage
  cargarCarritoDesdeLocalStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado); // Convierte el JSON a un objeto
    }
  }

  // Filtrar productos según el término de búsqueda
  filtrarProductos(): void {
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.title.toLowerCase().includes(term) ||
      (producto.barcode && producto.barcode.includes(term))
    );
  }

  // Agregar producto al carrito desde la búsqueda
  agregarProductoDesdeBusqueda(): void {
    const productoEncontrado = this.productosFiltrados.find(producto =>
      producto.title.toLowerCase() === this.searchTerm.toLowerCase() ||
      (producto.barcode && producto.barcode === this.searchTerm)
    );

    if (productoEncontrado) {
      this.agregarAlCarrito(productoEncontrado);
      this.searchTerm = '';
      this.filtrarProductos();
    } else {
      alert('Producto no encontrado.');
    }
  }

  agregarAlCarrito(producto: Product): void {
    const itemEnCarrito = this.carrito.find(item => item.product.id === producto.id);
    const ahora = new Date();
    const horaLocal = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (itemEnCarrito) {
      itemEnCarrito.cantidad++;
    } else {
      this.carrito.push({
        product: producto,
        cantidad: 1,
        hora: horaLocal,
        ventaPrice: producto.ventaPrice
      });
    }

    this.guardarCarritoEnLocalStorage(); // Guardar el carrito actualizado
  }

  eliminarDelCarrito(item: VentaCar): void {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.carrito = this.carrito.filter(cartItem => cartItem.product.id !== item.product.id);
    }

    this.guardarCarritoEnLocalStorage(); // Guardar el carrito actualizado
  }

  // Método para guardar el carrito en localStorage
  guardarCarritoEnLocalStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Convierte el objeto a JSON y lo guarda
  }

  get totalPrecio(): number {
    return this.carrito.reduce((total, item) => total + (item.product.ventaPrice * item.cantidad), 0);
  }

  ngAfterViewInit(): void {
    this.enfocarInput();
  }

  enfocarInput(): void {
    const input = document.getElementById('codigo-barra-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  reiniciarCarrito(): void {
    this.carrito = [];
    this.guardarCarritoEnLocalStorage(); // Guardar el carrito vacío
  }
}
