import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../products/models/product.model';
import { VentaService } from '../../service/venta.service';
import { CommonModule } from '@angular/common';
import { Lote } from '../../../compras/models/lotes.models';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent, SpinnerComponent],
})
export class VentaComponent {
  @ViewChild('codigoBarraInput') codigoBarraInput!: ElementRef;
  @ViewChild('montoInput') montoInput!: ElementRef;
  searchTerm: string = '';
  productosFiltrados: Product[] = [];
  carrito: { product: Product; lote: any; cantidad: number }[] = []; // Ajustado para incluir lote
  totalPrecio: number = 0;
  userID: string = '';
  errorMessage: string = '';
  horaCarrito: string | null = null;
  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  currentPage = 1;
  itemsPerPage = 5;
  hasMoreProducts = true;
  metodoPagoSeleccionado: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO' = 'EFECTIVO';
  totalPages: number = 1;


  isLoading: boolean = false; // Para controlar la visualización del spinner
  isLoadingList: boolean = false; // Para controlar la visualización del spinner


  // Propiedades para el modal
  modalAbierto: boolean = false;

  constructor(private ventaService: VentaService) {
    this.cargarProductos();
  }

  ngOnInit(): void {
    this.obtenerUserID();
    this.enfocarInput();
    this.establecerHoraCarrito();
  }

  // Escuchar clics en el documento
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!this.codigoBarraInput.nativeElement.contains(target)) {
      this.enfocarInput();
    }
  }

  obtenerUserID(): void {
    this.ventaService.checkStatus().subscribe(
      (response) => {
        this.userID = response.id;
      },
      (error) => {
        console.error('Error al verificar el estado del userID:', error);
      }
    );
  }

  cargarProductos() {
    this.isLoadingList = true;
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.ventaService.getProducts(this.itemsPerPage, offset).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
        const productos: Product[] = response.products;

        // Ordenar los productos por stockTotal (de mayor a menor)
        productos.sort((a, b) => b.stockTotal - a.stockTotal); // Ordena de mayor a menor

        this.productosFiltrados = productos;

        // Calcular el total de páginas
        this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPerPage);
        this.hasMoreProducts = productos.length === this.itemsPerPage;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los productos.';
        console.error("Error al obtener los productos:", error);
      }
    ).add(() => {
      this.isLoadingList = false;
    });
  }




  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;  // Avanzar a la siguiente página
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;  // Retroceder a la página anterior
    }
  }


  filtrarProductos() {
    if (this.searchTerm.trim() === '') {
      this.cargarProductos(); // Cargar productos si no hay búsqueda
      return;
    }

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
      // Verificar si hay lotes disponibles o stock global
      if ((productoEncontrado.lotes && productoEncontrado.lotes.length > 0) || productoEncontrado.stockTotal > 0) {
        const loteSeleccionado = productoEncontrado.lotes?.find(lote => lote.stock > 0) || null;
        this.agregarAlCarrito(productoEncontrado, loteSeleccionado);
      } else {
        this.errorMessage = "No hay stock disponible para este producto.";
        console.log("No hay stock disponible para este producto.");
      }

      this.searchTerm = '';
      this.filtrarProductos();
      this.enfocarInput();
    } else {
      this.errorMessage = "Producto no encontrado.";
      console.log("Producto no encontrado.");
    }
  }

  agregarAlCarrito(producto: Product, lote: any) {
    let loteAgregado = false;

    const productId = producto.id ?? '';

    this.ventaService.getLotesByProduct(productId).subscribe({
      next: (lotesResponse) => {
        console.log("Lotes obtenidos para el producto con ID:", productId);
        console.log("Lotes en la respuesta:", lotesResponse);

        const lotesDisponibles = lotesResponse.lotes || [];

        if (lotesDisponibles.length > 0) {
          for (const loteActual of lotesDisponibles) {
            console.log("Lote actual:", loteActual);

            if (loteActual.stock && loteActual.stock > 0) {
              const itemEnCarrito = this.carrito.find(
                item => item.product.id === producto.id && item.lote.id === loteActual.id
              );

              if (itemEnCarrito) {
                if (itemEnCarrito.cantidad < loteActual.stock) {
                  itemEnCarrito.cantidad++;
                  loteAgregado = true;
                  console.log(`Cantidad incrementada en el carrito para el lote: ${loteActual.id}`);
                  break;
                }
              } else {
                this.carrito.push({ product: producto, lote: loteActual, cantidad: 1 });
                loteAgregado = true;
                console.log(`Lote agregado al carrito: ${loteActual.id}`);
                break;
              }
            } else {
              console.log(`No hay stock disponible para el lote: ${loteActual.id}`);
            }
          }
        } else {
          console.log('No hay lotes disponibles para este producto.');
        }

        if (!loteAgregado) {
          alert('No puedes agregar más productos. Stock máximo alcanzado o agotado.');
        }

        this.actualizarTotal();
      },
      error: (err) => {
        console.error('Error al obtener los lotes:', err);
        alert('Hubo un problema al obtener los lotes. Intenta nuevamente.');
      }
    });
  }


  eliminarDelCarrito(item: { product: Product; lote: any; cantidad: number }) {
    const existingItem = this.carrito.find(carritoItem => carritoItem.product.id === item.product.id && carritoItem.lote.id === item.lote.id);

    if (existingItem) {
      if (existingItem.cantidad > 1) {
        existingItem.cantidad--;
      } else {
        this.carrito = this.carrito.filter(carritoItem => carritoItem.product.id !== item.product.id || carritoItem.lote.id !== item.lote.id);
      }
    }

    this.actualizarTotal();
    this.enfocarInput();
  }

  actualizarTotal() {
    this.totalPrecio = this.carrito.reduce((total, item) => {
      // Usamos el precio del producto (precioVenta)
      const precioProducto = item.product.precioVenta;  // Precio del producto

      // Verificar si el precioVenta está definido
      if (precioProducto !== undefined) {
        return total + (precioProducto * item.cantidad);  // Calculamos el total
      } else {
        // Si no tiene precioVenta, puedes decidir cómo manejarlo
        console.warn('Producto sin precioVenta', item.product);
        return total;  // No añadir nada si no tiene precio
      }
    }, 0);
  }


  procesarVenta() {
    // Verificar si el carrito está vacío
    if (this.carrito.length === 0) {
      this.errorMessage = "No hay productos en el carrito";
      console.error(this.errorMessage);
      return;
    }

    // Verificar si el ID del usuario está disponible
    if (!this.userID) {
      this.errorMessage = "El ID del usuario no está disponible.";
      console.error(this.errorMessage);
      return;
    }

    // Filtrar los productos que tienen stock disponible (stock > 0)
    const productosDisponibles = this.carrito.filter(item => item.lote.stock > 0);

    // Si no hay productos con stock disponible
    if (productosDisponibles.length === 0) {
      this.errorMessage = "No hay productos disponibles en el carrito.";
      console.error(this.errorMessage);
      return;
    }

    // Crear el objeto de venta solo con los productos disponibles
    const venta = {
      userId: this.userID,
      productos: productosDisponibles.map(item => ({
        productId: item.product.id || '',
        loteId: item.lote.id || '',
        cantidad: item.cantidad,
        ventaPrice: item.lote.precioVenta // Precio del lote
      })),
      metodo_pago: this.metodoPagoSeleccionado // Método de pago elegido por el usuario
    };

    this.isLoading = true;

    console.log("Objeto venta a enviar:", venta);

    // Enviar la venta al backend
    this.ventaService.crearVenta(venta).subscribe(
      response => {
        console.log("Venta creada con éxito:", response);
        this.reiniciarCarrito();
        this.horaCarrito = null;
        this.errorMessage = '';

        // Recargar la lista de productos después de realizar la venta
        this.cargarProductos();  // Aquí recargas los productos

        // Mostrar la alerta de éxito
        this.isLoading = false;
        this.showAlert('Venta realizada con éxito.', 'success');
      },
      error => {
        this.errorMessage = "Error al crear la venta. Verifica los detalles e intenta de nuevo.";
        console.error("Error al crear la venta:", error);

        // Mostrar la alerta de error
        this.isLoading = false;
        this.showAlert('Error al realizar la venta. Intenta nuevamente.', 'error');
      }
    );
  }


  reiniciarCarrito() {
    this.carrito = [];
    this.totalPrecio = 0;
    this.horaCarrito = null;
    this.enfocarInput();
  }

  enfocarInput() {
    setTimeout(() => {
      this.codigoBarraInput.nativeElement.focus();
    }, 0);
  }


  enfocarInputMonto() {
    setTimeout(() => {
      this.montoInput.nativeElement.focus();
    }, 0);
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.codigoBarraInput.nativeElement.focus();
  }

  hayLotesDisponibles(producto: Product): boolean {
    // Verifica si hay lotes con stock disponible
    return producto.lotes?.some(lote => lote.stock > 0) || producto.stockTotal > 0;
  }



  obtenerLoteDisponible(producto: Product): Lote | undefined {
    return producto.lotes?.find(lote => lote.stock > 0);
  }

  formatPrecio(precio: number): string {
    return precio.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  private onSuccess(message: string, type: 'success' | 'error'): void {
    this.showAlert(message, type);

  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }

  establecerHoraCarrito(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.horaCarrito = `${hours}:${minutes}`;
  }

  // Abrir el modal
  abrirModal() {
    this.modalAbierto = true;
  }

  confirmarVenta() {
    console.log('Método de pago seleccionado:', this.metodoPagoSeleccionado); // Verificar el valor
    this.procesarVenta();
    this.cerrarModal();
  }

  cantidadEnCarrito(producto: any): number {
    const item = this.carrito.find((p: any) => p.product.id === producto.id);
    return item ? item.cantidad : 0;
  }

  // Getter para obtener los productos de la página actual
  get productosPagina() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.productosFiltrados.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Getter para saber si el botón "Siguiente" está desactivado
  // Getter para saber si el botón "Siguiente" está desactivado
  get isNextButtonDisabled() {
    return this.currentPage >= this.totalPages || this.productosFiltrados.length < this.itemsPerPage;
  }


}
