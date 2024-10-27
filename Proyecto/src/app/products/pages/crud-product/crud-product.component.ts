import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { Lote } from '../../models/lotes.models';
import { LotesService } from '../../services/lotes.service';

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
  isLoteModalOpen: boolean = false; // Controla el modal del lote
  searchTerm: string = '';
  lote: Lote = {
    id: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    fechaCaducidad: new Date(),
    fechaCreacion: '',
    product: { id: '', title: '', stockTotal: 0, slug: '', user: { id: '' }, barcode: '', fechaCreacion: '' },
    user: { id: '' } // opcional, si necesitas incluirlo
  };

  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  crudForm: FormGroup;
  showConfirm: boolean = false;
  productIdToDelete: string | null = null;
  selectedProduct: Product | null = null; // Almacena el producto seleccionado
  selectedLotes: Lote[] = []; // Almacena los lotes del producto seleccionado
  showAddLoteForm: boolean = false; // Controla la visibilidad del formulario para agregar un lote


  constructor(private productService: ProductService, private loteService: LotesService) {
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

  openLoteModal(product: Product): void {
    if (product.id) {
      this.loteService.getLotesByProduct(product.id).subscribe({
        next: (lotes) => {
          this.selectedLotes = lotes;
          this.selectedProduct = product; // Almacena el producto seleccionado
          this.isLoteModalOpen = true;
        },
        error: () => this.showAlert('Error al obtener los lotes del producto.', 'error')
      });
    } else {
      this.showAlert('ID del producto no disponible.', 'error');
    }
  }

  closeLoteModal(): void {
    this.isLoteModalOpen = false; // Cierra el modal
    this.selectedProduct = null; // Resetea el producto seleccionado
    this.selectedLotes = []; // Resetea los lotes seleccionados
  }

  // Método createLote para usar el objeto lote
  createLote(lote: Lote): void {
    if (this.selectedProduct) {
      const loteToCreate: Lote = {
        ...lote,
        product: this.selectedProduct // Asume que this.selectedProduct es de tipo Product
      };

      this.loteService.createLote(loteToCreate).subscribe({
        next: () => this.onLoteSuccess('Lote creado con éxito.'),
        error: () => this.showAlert('Error al crear el lote.', 'error')
      });
    } else {
      this.showAlert('Producto no seleccionado.', 'error');
    }
  }

  updateLote(lote: Lote): void {
    this.loteService.updateLote(lote.id, lote).subscribe({
      next: () => this.onLoteSuccess('Lote actualizado con éxito.'),
      error: () => this.showAlert('Error al actualizar el lote.', 'error')
    });
  }

  deleteLote(loteId: string): void {
    this.loteService.deleteLote(loteId).subscribe({
      next: () => this.onLoteSuccess('Lote eliminado con éxito.'),
      error: () => this.showAlert('Error al eliminar el lote.', 'error')
    });
  }

  private onLoteSuccess(message: string): void {
    this.showAlert(message, 'success');
    // Vuelve a obtener los lotes del producto seleccionado para reflejar cambios
    const productId = this.selectedProduct?.id;
    if (productId) {
      this.loteService.getLotesByProduct(productId).subscribe({
        next: (lotes) => (this.selectedLotes = lotes),
        error: () => this.showAlert('Error al obtener los lotes actualizados.', 'error'),
      });
    }
  }

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
          this.showAlert(errorMessage, 'error');
        }
        break;

      case 500:
        this.showAlert(`Por favor, inténtelo de nuevo más tarde.`, 'error');
        break;

      default:
        this.showAlert(errorMessage, 'error');
        break;
    }
  }

  editProduct(product: Product): void {
    this.product = { ...product };
    this.isEditing = true;
    this.openModal();

    this.crudForm.setValue({
      title: product.title,
      slug: product.slug,
      barcode: product.barcode || null
    });
  }

  onSuccess(message: string, type: 'success' | 'error'): void {
    this.getProducts();
    this.resetForm();
    this.closeModal();
    this.showAlert(message, type);
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => this.alertVisible = false, 3000);
  }

  resetForm(): void {
    this.crudForm.reset({
      title: '',
      stockTotal: 0,
      slug: '',
      barcode: null
    });
    this.product = { title: '', stockTotal: 0, slug: '', user: { id: '' }, barcode: null };
    this.isEditing = false;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1; // Reinicia la página al filtrar
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
