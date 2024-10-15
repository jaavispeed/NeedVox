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
  productos: Product[] = []; // Variable para almacenar los productos
  carrito: VentaCar[] = []; // Variable para almacenar los productos en el carrito utilizando el modelo VentaCar
  productosFiltrados: Product[] = []; // Variable para almacenar los productos filtrados
  searchTerm: string = ''; // Variable para el término de búsqueda

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
        this.productos = data; // Almacena los productos obtenidos en la variable productos
        this.productosFiltrados = data; // Inicializa productos filtrados con todos los productos
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.productos = []; // Asigna un array vacío en caso de error
      }
    );
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
      this.searchTerm = ''; // Limpia el campo de búsqueda
      this.filtrarProductos(); // Reinicia la lista de productos filtrados
    } else {
      alert('Producto no encontrado.');
    }
  }

  agregarAlCarrito(producto: Product): void {
    // Comprueba si el producto ya está en el carrito
    const itemEnCarrito = this.carrito.find(item => item.product.id === producto.id);
    const ahora = new Date();
    const horaLocal = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (itemEnCarrito) {
      itemEnCarrito.cantidad++; // Incrementa la cantidad si el producto ya está en el carrito
    } else {
      // Agrega el producto con la hora actual si no está en el carrito
      this.carrito.push({
        product: producto,
        cantidad: 1,
        hora: horaLocal,
        ventaPrice: producto.ventaPrice // Incluye el precio de venta
      });
    }
  }

  eliminarDelCarrito(item: VentaCar): void {
    if (item.cantidad > 1) {
      item.cantidad--; // Decrementa la cantidad
    } else {
      this.carrito = this.carrito.filter(cartItem => cartItem.product.id !== item.product.id); // Elimina el producto del carrito
    }
  }

  get totalPrecio(): number {
    return this.carrito.reduce((total, item) => total + (item.product.ventaPrice * item.cantidad), 0);
  }

  ngAfterViewInit(): void {
    this.enfocarInput(); // Enfoca el input al cargar el componente
  }

  // Método para enfocar el input
  enfocarInput(): void {
    const input = document.getElementById('codigo-barra-input') as HTMLInputElement;
    if (input) {
      input.focus(); // Focaliza el input
    }
  }

  // Reiniciar el carrito
  reiniciarCarrito(): void {
    this.carrito = [];
  }
}
