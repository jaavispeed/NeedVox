import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-crud-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule, AlertComponent, SpinnerComponent],
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  product: Product = { title: '', stockTotal: 0, slug: '', user: { id: '' }, barcode: null };
  isEditing: boolean = false;
  isModalOpen: boolean = false;
  searchTerm: string = '';
  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  crudForm: FormGroup;
  showConfirm: boolean = false;
  productIdToDelete: string | null = null;
  selectedProduct: Product | null = null; // Almacena el producto seleccionado
  totalStock: number = 0;
  hasMoreProducts: boolean = true; // Flag para indicar si hay más productos disponibles

  isLoading: boolean = false; // Para controlar la visualización del spinner
  isLoadingList: boolean = false;



  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {
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
    // Mostrar el spinner
    this.isLoadingList = true;

    const offset = (this.currentPage - 1) * this.itemsPerPage; // Calcular el offset según la página actual
    this.productService.getProducts(this.itemsPerPage, offset).subscribe({
      next: (data) => {
        console.log("Datos de productos: ", data); // Verifica qué datos recibes

        // Si estamos en la primera página, actualiza todos los productos
        if (this.currentPage === 1) {
          this.products = data.products.map((product: Product) => ({
            ...product,
            fechaCreacion: product.fechaCreacion ? new Date(product.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'America/Santiago'
            }) : 'Fecha no disponible'
          }));
        } else {
          // Si no estamos en la primera página, agrega los productos formateando las fechas
          this.products = [...this.products, ...data.products.map((product: Product) => ({
            ...product,
            fechaCreacion: product.fechaCreacion ? new Date(product.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'America/Santiago'
            }) : 'Fecha no disponible'
          }))];
        }

        this.hasMoreProducts = data.hasMore;
        this.filteredProducts = this.products; // Asegúrate de que filteredProducts siempre esté actualizado
      },
      error: () => {
        this.showAlert('Error al obtener los productos.', 'error');
      },
      // Finalmente ocultamos el spinner, ya sea con éxito o error
      complete: () => {
      this.isLoadingList = false; // Ocultar el spinner después de la carga
      }
    });
  }



  // Métodos de paginación
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.hasMoreProducts) {
      this.currentPage++;
      this.getProducts(); // Cargar productos de la nueva página
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProducts(); // Cargar productos de la página anterior
    }
  }



  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }


  promptDelete(id: string): void {
    this.productIdToDelete = id;
    this.showConfirm = true;
  }

  confirmDelete(): void {
    if (this.productIdToDelete) {
      this.isLoading = true;
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: () => {
          console.log(`Producto ${this.productIdToDelete} eliminado con éxito`);

          // Eliminar el producto de la lista localmente
          this.products = this.products.filter(product => product.id !== this.productIdToDelete);
          this.filteredProducts = this.filteredProducts.filter(product => product.id !== this.productIdToDelete);

          this.showAlert('Producto eliminado con éxito.', 'success');
        },
        error: () => this.showAlert('Error al eliminar el producto.', 'error'),
        complete: () => {
          // Ocultar el spinner después de la eliminación
          this.isLoading = false;
          this.resetConfirmation(); // Reinicia la confirmación solo después de que la eliminación ha sido procesada
        }      });
    } else {
      this.resetConfirmation(); // Si no hay ID, también reinicia
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

    this.isLoading = true; // Mostrar el spinner antes de iniciar la operación

    const productToSend = {
      ...this.crudForm.value,
      barcode: this.crudForm.value.barcode === '' ? null : this.crudForm.value.barcode
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, productToSend).subscribe({
        next: () => {
          this.onSuccess('Producto actualizado con éxito.', 'success');
          this.closeModal(); // Cerrar el modal después de actualizar
        },
        error: (error) => this.handleError(error, 'actualizar'),
        complete: () => this.isLoading = false // Ocultar el spinner
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => {
          this.onSuccess('Producto creado con éxito.', 'success');
          this.closeModal(); // Cerrar el modal después de crear
        },
        error: (error) => this.handleError(error, 'crear'),
        complete: () => this.isLoading = false // Ocultar el spinner
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
    if (this.searchTerm.trim()) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Restablece los productos si no hay término de búsqueda
    }
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

  closeModal(): void {
    this.isModalOpen = false; // Cambia el estado para cerrar el modal
    this.resetForm(); // Resetea el formulario al cerrar
  }
}
