import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';

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
  product: Product = { title: '', compraPrice: 0, ventaPrice: 0, stock: 0, slug: '', user: { id: '' }, expiryDate: undefined, barcode: null };
  isEditing: boolean = false;
  isModalOpen: boolean = false;
  searchTerm: string = '';

  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  crudForm: FormGroup;

  showConfirm: boolean = false; // Variable para mostrar el cuadro de confirmación
  productIdToDelete: string | null = null; // Almacena el id del producto que se eliminará

  constructor(private productService: ProductService) {
    this.crudForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      compraPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      ventaPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      slug: new FormControl(''),
      expiryDate: new FormControl(null),
      barcode: new FormControl(null) //// Campo agregado
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => this.showAlert('Error al obtener los productos.', 'error')
    });
  }

  // Método para activar el cuadro de confirmación de eliminación
  promptDelete(id: string): void {
    this.productIdToDelete = id;
    this.showConfirm = true;  // Muestra el cuadro de confirmación
  }

  // Método que se llama cuando se confirma la eliminación
  confirmDelete(): void {
    if (this.productIdToDelete) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: () => this.onSuccess('Producto eliminado con éxito.', 'success'),
        error: () => this.showAlert('Error al eliminar el producto.', 'error')
      });
      this.resetConfirmation(); // Resetea el estado de confirmación
    }
  }

  // Método que se llama cuando se cancela la eliminación
  cancelDelete(): void {
    this.resetConfirmation();  // Oculta el cuadro de confirmación
  }

  // Método para restablecer la confirmación
  private resetConfirmation(): void {
    this.showConfirm = false;  // Oculta el cuadro de confirmación
    this.productIdToDelete = null;  // Limpia el id del producto
  }

  createOrUpdateProduct(): void {
    this.crudForm.markAllAsTouched();
    if (this.crudForm.invalid) {
      this.showAlert('Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const productToSend = {
      ...this.crudForm.value,
      compraPrice: Number(this.crudForm.value.compraPrice),
      ventaPrice: Number(this.crudForm.value.ventaPrice),
      expiryDate: this.crudForm.value.expiryDate === '' ? null : this.crudForm.value.expiryDate,
      barcode: this.crudForm.value.barcode === '' ? null : this.crudForm.value.barcode // Asegurarse de que barcode sea null si está vacío
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, productToSend).subscribe({
        next: () => this.onSuccess('Producto actualizado con éxito.', 'success'),
        error: (error) => {
          this.handleError(error, 'actualizar'); // Manejo de errores para la actualización
        }
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => this.onSuccess('Producto creado con éxito.', 'success'),
        error: (error) => {
          this.handleError(error, 'crear'); // Manejo de errores para la creación
        }
      });
    }
  }

  private handleError(error: any, action: 'crear' | 'actualizar'): void {
    const errorMessage = error.error?.message || 'Error desconocido';

    console.log('Error recibido:', error); // Para depurar el error

    switch (error.status) {
      case 400: // Bad Request
        if (errorMessage.includes('Nombre ya creado')) {
          this.showAlert('El nombre del producto ya existe.', 'error');
        } else if (errorMessage.includes('Código de barras ya creado')) {
          this.showAlert('El código de barras ya existe.', 'error');
        } else {
          this.showAlert(errorMessage, 'error'); // Usar solo el mensaje específico
        }
        break;

      case 500: // Internal Server Error
        this.showAlert(`Por favor, inténtelo de nuevo más tarde.`, 'error');
        break;

      default:
        this.showAlert(errorMessage, 'error'); // Usar solo el mensaje específico
        break;
    }
  }

  editProduct(product: Product): void {
    this.product = { ...product };
    this.isEditing = true;
    this.openModal();

    this.crudForm.setValue({
      title: product.title,
      compraPrice: product.compraPrice,
      ventaPrice: product.ventaPrice,
      stock: product.stock,
      slug: product.slug,
      expiryDate: product.expiryDate || null,
      barcode: product.barcode ||  null// Cargar el código de barras, permitir vacío
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
      compraPrice: 0,
      ventaPrice: 0,
      stock: 0,
      slug: '',
      expiryDate: null,
      barcode: null // Reiniciar el código de barras como vacío
    });
    this.product = { title: '', compraPrice: 0, ventaPrice: 0, stock: 0, slug: '', user: { id: '' }, expiryDate: undefined, barcode: null };
    this.isEditing = false;
  }

  openModal(): void {
    this.isModalOpen = true;
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }
}
