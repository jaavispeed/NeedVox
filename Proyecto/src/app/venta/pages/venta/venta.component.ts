import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { Product } from '../../../products/models/product.model';
import { VentaService } from '../../service/venta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class VentaComponent {
  searchTerm: string = '';
  productosFiltrados: Product[] = [];
  carrito: { product: Product; cantidad: number }[] = [];
  totalPrecio: number = 0;
  userId: string = ''; // Inicializa el userId
  errorMessage: string = '';
  horaCarrito: string | null = null; // Propiedad para almacenar la hora del carrito
  userID: string = ''; // Propiedad para almacenar el userId

  constructor(private ventaService: VentaService) {
    this.cargarProductos(); // Cargar productos al inicializar el componente
  }

  ngOnInit(): void {
    this.obtenerUserID(); // Obtener el userId al iniciar
  }

  obtenerUserID(): void {
    this.ventaService.checkStatus().subscribe(
      (response) => {
        this.userID = response.id; // Almacena el userId del backend
      },
      (error) => {
        console.error('Error al verificar el estado del userID:', error);
      }
    );
  }

  cargarProductos() {
    this.ventaService.getProducts().subscribe(
      (productos: Product[]) => {
        this.productosFiltrados = productos; // Asigna los productos filtrados
      },
      error => {
        console.error("Error al obtener los productos:", error);
        this.errorMessage = "Error al cargar los productos. Intenta de nuevo más tarde.";
      }
    );
  }

  filtrarProductos() {
    this.productosFiltrados = this.productosFiltrados.filter(producto =>
      producto.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.barcode?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  agregarProductoDesdeBusqueda() {
    const productoEncontrado = this.productosFiltrados.find(
      producto => producto.barcode === this.searchTerm || producto.title === this.searchTerm
    );

    if (productoEncontrado) {
      this.agregarAlCarrito(productoEncontrado);
      this.searchTerm = ''; // Limpia el término de búsqueda
    } else {
      this.errorMessage = "Producto no encontrado.";
      console.log("Producto no encontrado.");
    }
  }

  agregarAlCarrito(producto: Product) {
    const existingItem = this.carrito.find(item => item.product.id === producto.id);

    if (existingItem) {
      existingItem.cantidad++;
    } else {
      this.carrito.push({ product: producto, cantidad: 1 });
      this.horaCarrito = new Date().toLocaleTimeString(); // Establecer la hora al agregar un producto
    }

    this.actualizarTotal();
  }

  eliminarDelCarrito(item: { product: Product; cantidad: number }) {
    this.carrito = this.carrito.filter(carritoItem => carritoItem !== item);
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.totalPrecio = this.carrito.reduce(
      (total, item) => total + item.product.ventaPrice * item.cantidad,
      0
    );
  }

  procesarVenta() {
    if (this.carrito.length === 0) {
      this.errorMessage = "No hay productos en el carrito";
      console.error(this.errorMessage);
      return;
    }

    if (!this.userID) { // Asegúrate de verificar userID
      this.errorMessage = "El ID del usuario no está disponible.";
      console.error(this.errorMessage);
      return;
    }

    const venta = {
      userId: this.userID, // Usa el userID recogido
      productos: this.carrito.map(item => ({
        productId: item.product.id || '',
        cantidad: item.cantidad,
        ventaPrice: item.product.ventaPrice // Precio del producto
      }))
    };

    this.ventaService.crearVenta(venta).subscribe(
      response => {
        console.log("Venta creada con éxito:", response);
        this.reiniciarCarrito();
        this.errorMessage = ''; // Limpia cualquier mensaje de error
      },
      error => {
        this.errorMessage = "Error al crear la venta. Verifica los detalles e intenta de nuevo.";
        console.error("Error al crear la venta:", error);
      }
    );
  }

  reiniciarCarrito() {
    this.carrito = [];
    this.totalPrecio = 0;
  }

  enfocarInput() {
    const input = document.getElementById('codigo-barra-input') as HTMLInputElement;
    input.focus();
  }
}
