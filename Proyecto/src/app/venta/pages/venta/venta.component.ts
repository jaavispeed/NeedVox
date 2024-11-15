import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../products/models/product.model';
import { VentaService } from '../../service/venta.service';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { Lote } from '../../../compras/models/lotes.models';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule,AlertComponent],
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
  itemsPerPage = 10;
  hasMoreProducts = true;

  // Propiedades para el modal
  modalAbierto: boolean = false;
  montoIngresado: number = 0;

  constructor(private ventaService: VentaService) {
    this.cargarProductos();
  }

  ngOnInit(): void {
    this.obtenerUserID();
    this.enfocarInput();
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
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.ventaService.getProducts(this.itemsPerPage, offset).subscribe(
      (response) => {
        const productos: Product[] = response.products; // Especifica el tipo de productos

        productos.forEach((producto: Product) => {  // Agrega el tipo Product a producto
          producto.lotes = producto.lotes || [];

          if (producto.lotes.length > 0) {
            producto.lotes.sort((a, b) => {
              const fechaA = new Date(a.fechaCreacion).getTime();
              const fechaB = new Date(b.fechaCreacion).getTime();
              return fechaA - fechaB;
            });
          }

          const oldestLote = producto.lotes[0] || null;
          producto.oldestLotPrice = oldestLote ? oldestLote.precioVenta : null;
        });

        this.productosFiltrados = productos;
        this.hasMoreProducts = productos.length === this.itemsPerPage;
      },
      (error) => {
        console.error("Error al obtener los productos:", error);
        this.errorMessage = "Error al cargar los productos. Intenta de nuevo más tarde.";
      }
    );
  }


  nextPage() {
    if (this.hasMoreProducts) {
      this.currentPage++;
      this.cargarProductos();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarProductos();
    }
  }

  filtrarProductos() {
    if (this.searchTerm.trim() === '') {
      this.cargarProductos();
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
      if (productoEncontrado.lotes && productoEncontrado.lotes.length > 0) {
        const loteSeleccionado = productoEncontrado.lotes[0]; // Elegir el primer lote disponible
        this.agregarAlCarrito(productoEncontrado, loteSeleccionado);
      } else {
        this.errorMessage = "No hay lotes disponibles para este producto.";
        console.log("No hay lotes disponibles para este producto.");
      }

      this.searchTerm = '';
      this.filtrarProductos();
      this.enfocarInput();
    } else {
      this.errorMessage = "Producto no encontrado.";
      console.log("Producto no encontrado.");
    }
  }

  agregarAlCarrito(producto: Product, lote: any, ) {
    const itemEnCarrito = this.carrito.find(item => item.product.id === producto.id && item.lote.id === lote.id);

    if (itemEnCarrito) {
      if (itemEnCarrito.cantidad < lote.stock) {
        itemEnCarrito.cantidad++;
      } else {
        alert('No puedes agregar más de este lote. Stock máximo alcanzado.');
      }
    } else {
      if (lote.stock > 0) {
        this.carrito.push({ product: producto, lote: lote, cantidad: 1 });
      } else {
        alert('No puedes agregar este lote. Stock agotado.');
      }
    }
    this.actualizarTotal();
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
      return total + (item.lote.precioVenta * item.cantidad); // Usar el precio de venta del lote
    }, 0);
  }

  procesarVenta() {
    if (this.carrito.length === 0) {
      this.errorMessage = "No hay productos en el carrito";
      console.error(this.errorMessage);
      return;
    }

    if (!this.userID) {
      this.errorMessage = "El ID del usuario no está disponible.";
      console.error(this.errorMessage);
      return;
    }

    const venta = {
      userId: this.userID,
      productos: this.carrito.map(item => ({
        productId: item.product.id || '',
        loteId: item.lote.id || '',
        cantidad: item.cantidad,
        ventaPrice: item.lote.precioVenta // Precio del lote
      }))
    };
    console.log("Objeto venta a enviar:", venta);

    this.ventaService.crearVenta(venta).subscribe(
      response => {
        console.log("Venta creada con éxito:", response);
        this.reiniciarCarrito();
        this.horaCarrito = null;
        this.errorMessage = '';

        // Mostrar la alerta de éxito
        this.showAlert('Venta realizada con éxito.', 'success');
      },
      error => {
        this.errorMessage = "Error al crear la venta. Verifica los detalles e intenta de nuevo.";
        console.error("Error al crear la venta:", error);

        // Mostrar la alerta de error
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

  abrirModal() {
    this.modalAbierto = true;
    this.enfocarInputMonto();
    this.codigoBarraInput.nativeElement.blur();
  }

  enfocarInputMonto() {
    setTimeout(() => {
      this.montoInput.nativeElement.focus();
    }, 0);
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.montoIngresado = 0;
    this.codigoBarraInput.nativeElement.focus();
  }

  confirmarMonto() {
    if (this.montoIngresado > 0) {
      const productoEspecial: Product = {
        id: '' + Date.now(), // O utiliza un UUID
        title: 'Otro',
        stockTotal: 1, // Define un stock total, puede ser un valor fijo o calculado
        slug: '', // Puedes dejarlo vacío o generarlo si lo necesitas
        user: { id: this.userID }, // Asignar el ID del usuario
        barcode: null, // Puede ser nulo si no es necesario
        fechaCreacion: new Date().toISOString(), // Establecer la fecha de creación
      };

      const loteFicticio = {
        id: uuidv4(),
        precioVenta: this.montoIngresado,
        stock: 1,
      };

      this.agregarAlCarrito(productoEspecial, loteFicticio); // Añadir lote ficticio
      this.cerrarModal();
    } else {
      this.errorMessage = "Por favor, ingresa un monto válido.";
    }
  }

  hayLotesDisponibles(producto: Product): boolean {
    return producto.lotes?.some(lote => lote.stock > 0) || false;
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




}
