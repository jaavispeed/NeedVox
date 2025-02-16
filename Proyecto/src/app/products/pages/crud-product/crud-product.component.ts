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
      barcode: new FormControl(null),
      precioVenta: new FormControl(null, [Validators.required, Validators.min(1)]),  // Cambiado a FormControl

    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.isLoadingList = true;

    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.productService.getProducts(this.itemsPerPage, offset).subscribe({
      next: (data) => {
        // Actualizar los productos según la respuesta
        if (this.currentPage === 1) {
          // Para la primera página, sobrescribir todos los productos
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
          // Para páginas siguientes, agregar solo los productos de esa página
          this.products = this.products.slice(0, (this.currentPage - 1) * this.itemsPerPage).concat(data.products.map((product: Product) => ({
            ...product,
            fechaCreacion: product.fechaCreacion ? new Date(product.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'America/Santiago'
            }) : 'Fecha no disponible'
          })));
        }

        // Filtrar los productos según el término de búsqueda
        this.filterProducts();

        this.hasMoreProducts = data.hasMore;  // Este es el valor que el backend te devuelve
      },
      error: () => {
        this.showAlert('Error al obtener los productos.', 'error');
      },
      complete: () => {
        this.isLoadingList = false;
      }
    });
  }





  get paginatedProducts(): Product[] {
    // Aplicar la paginación sobre los productos filtrados
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }



  nextPage(): void {
    // Habilitar "Siguiente" solo si hay más productos que los mostrados
    if (this.filteredProducts.length > this.currentPage * this.itemsPerPage) {
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
    // Asegúrate de que hasMoreProducts esté correctamente asignado
    return Math.ceil(this.products.length / this.itemsPerPage);
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
      // Si estamos editando un producto, asegúrate de que el ID esté presente
      if (!this.product.id) {
        console.error('ID del producto no encontrado para la actualización');
        this.isLoading = false;
        return;
      }

      // Enviar la solicitud de actualización al servidor
      this.productService.updateProduct(this.product.id, productToSend).subscribe({
        next: () => {
          this.onSuccess('Producto actualizado con éxito.', 'success');
          this.closeModal(); // Cerrar el modal después de actualizar
        },
        error: (error) => this.handleError(error, 'actualizar'),  // Maneja el error si es necesario
        complete: () => {
          this.isLoading = false;  // Asegúrate de que el spinner se oculte cuando termine
        }
      });
    } else {
      // Si estamos creando un nuevo producto
      this.productService.createProduct(productToSend).subscribe({
        next: () => {
          this.onSuccess('Producto creado con éxito.', 'success');
          this.closeModal(); // Cerrar el modal después de crear
        },
        error: (error) => {
          // Verifica si el error está relacionado con el nombre duplicado
          if (error.error?.message.includes('Nombre ya creado')) {
            this.showAlert('El nombre del producto ya fue creado.', 'error');
          } else {
            this.handleError(error, 'crear');  // Llama a handleError para otros errores
          }
        },
        complete: () => {
          this.isLoading = false;  // Asegúrate de que el spinner se oculte cuando termine
        }
      });
    }
  }





  private handleError(error: any, action: 'crear' | 'actualizar'): void {
    const errorMessage = error.error?.message || 'Error desconocido';
    console.log('Error recibido:', error);

    // Manejo de errores específicos
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

    // Asegúrate de que el spinner se oculte después de manejar el error
    this.isLoading = false;  // Esto asegura que el spinner se detiene independientemente del tipo de error
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
    if (!product.id) {
      console.error('El producto no tiene un ID válido');
      return; // Evita proceder si el ID no está presente
    }

    this.isEditing = true;
    this.isModalOpen = true;

    // Cargar los datos del producto en el formulario
    this.crudForm.patchValue({
      title: product.title,
      precioVenta: product.precioVenta,  // Aquí le pasas el valor de precioVenta
      barcode: product.barcode || ''     // Si no hay código de barras, se puede dejar vacío
    });

    // Asignar el ID del producto a this.product
    this.product = { ...product };  // Aquí se asigna todo el producto, incluyendo el ID
  }



  onSearchTermChange(): void {
    // Filtrar todos los productos (no solo los actuales)
    if (this.searchTerm.trim()) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Si no hay búsqueda, mostrar todos los productos
      this.filteredProducts = this.products;
    }

    // Reiniciar la página a la primera después de la búsqueda
    this.currentPage = 1;
  }




  filterProducts(): void {
    if (this.searchTerm.trim()) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.toString().includes(this.searchTerm.trim()))
      );
    } else {
      this.filteredProducts = this.products; // Si no hay término de búsqueda, muestra todos los productos
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
