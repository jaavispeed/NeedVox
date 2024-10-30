import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
// Eliminar importaciones relacionadas con lotes
// import { Lote, LoteCreate } from '../../../compras/models/lotes.models';
// import { LotesService } from '../../../compras/services/compras.service';

@Component({
  selector: 'app-crud-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  product: Product = { title: '', stockTotal: 0, slug: '', user: { id: '' }, barcode: null };
  isEditing: boolean = false;
  isModalOpen: boolean = false;
  // isLoteModalOpen: boolean = false; // Controla el modal del lote
  searchTerm: string = '';
  // lote: Lote = { ... }; // Información de lote eliminada
  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  crudForm: FormGroup;
  showConfirm: boolean = false;
  productIdToDelete: string | null = null;
  selectedProduct: Product | null = null; // Almacena el producto seleccionado
  // selectedLotes: Lote[] = []; // Almacena los lotes del producto seleccionado
  // showAddLoteForm: boolean = false; // Controla la visibilidad del formulario para agregar un lote
  totalStock: number = 0;

  constructor(private productService: ProductService) {
    this.crudForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      slug: new FormControl(''),
      barcode: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          fechaCreacion: new Date(product.fechaCreacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Santiago'
          })
        }));
        this.filteredProducts = this.products;
      },
      error: () => this.showAlert('Error al obtener los productos.', 'error')
    });
  }

  // Métodos relacionados con lotes eliminados
  // openLoteModal(product: Product): void { ... }
  // closeLoteModal(): void { ... }
  // createLote(lote: Lote): void { ... }
  // updateLote(lote: Lote): void { ... }
  // deleteLote(loteId: string): void { ... }
  // private onLoteSuccess(message: string): void { ... }

  promptDelete(id: string): void {
    this.productIdToDelete = id;
    this.showConfirm = true;
  }

  confirmDelete(): void {
    if (this.productIdToDelete) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: () => this.onSuccess('Producto eliminado con éxito.', 'success'),
        error: () => this.showAlert('Error al eliminar el producto.', 'error')
      });
      this.resetConfirmation();
    }
  }

  cancelDelete(): void {
    this.resetConfirmation();
  }

  private resetConfirmation(): void {
    this.showConfirm = false;
    this.productIdToDelete = null;
  }

  createOrUpdateProduct(): void {
    if (this.crudForm.invalid) {
      this.showAlert('Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const productToSend = {
      ...this.crudForm.value,
      barcode: this.crudForm.value.barcode === '' ? null : this.crudForm.value.barcode
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, productToSend).subscribe({
        next: () => this.onSuccess('Producto actualizado con éxito.', 'success'),
        error: (error) => this.handleError(error, 'actualizar')
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => this.onSuccess('Producto creado con éxito.', 'success'),
        error: (error) => this.handleError(error, 'crear')
      });
    }
  }

  private handleError(error: any, action: 'crear' | 'actualizar'): void {
    const errorMessage = error.error?.message || 'Error desconocido';
    console.log('Error recibido:', error);

    switch (error.status) {
      case 400:
        if (errorMessage.includes('Nombre ya creado')) {
          this.showAlert('El nombre del producto ya existe.', 'error');
        } else if (errorMessage.includes('Código de barras ya creado')) {
          this.showAlert('El código de barras ya existe.', 'error');
        } else {
          this.showAlert(`Error al ${action} el producto: ${errorMessage}`, 'error');
        }
        break;
      case 500:
        this.showAlert(`Error interno al ${action} el producto. Intente nuevamente más tarde.`, 'error');
        break;
      default:
        this.showAlert('Ocurrió un error inesperado. Intente nuevamente.', 'error');
    }
  }

  private onSuccess(message: string, type: 'success' | 'error'): void {
    this.showAlert(message, type);
    this.getProducts(); // Refresca la lista de productos
    this.resetForm();
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }

  private resetForm(): void {
    this.crudForm.reset();
    this.isEditing = false;
    this.product = { title: '', stockTotal: 0, slug: '', user: { id: '' }, barcode: null };
  }

  editProduct(product: Product): void {
    this.product = product;
    this.isEditing = true;
    this.crudForm.patchValue({
      title: product.title,
      slug: product.slug,
      barcode: product.barcode
    });
    this.isModalOpen = true; // Abre el modal
  }

  onSearchTermChange(): void {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterProducts(): void {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Restablece la lista si no hay término de búsqueda
    }
  }

  openModal(): void {
    this.resetForm(); // Resetea el formulario antes de abrir el modal
    this.isModalOpen = true; // Cambia el estado para abrir el modal
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  closeModal(): void {
    this.isModalOpen = false; // Cambia el estado para cerrar el modal
    this.resetForm(); // Resetea el formulario al cerrar
  }
}
