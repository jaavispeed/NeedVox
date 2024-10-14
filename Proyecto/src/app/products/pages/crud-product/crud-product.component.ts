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
  product: Product = { title: '', compraPrice: 0, ventaPrice: 0, stock: 0, slug: '', user: { id: '' }, expiryDate: undefined, barcode: '' };
  isEditing: boolean = false;
  isModalOpen: boolean = false;
  searchTerm: string = '';

  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  crudForm: FormGroup;

  constructor(private productService: ProductService) {
    this.crudForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      compraPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      ventaPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      slug: new FormControl(''),
      expiryDate: new FormControl(null),
      barcode: new FormControl('', [Validators.required])  // Campo agregado
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

  createOrUpdateProduct(): void {
    if (this.crudForm.invalid) {
      this.showAlert('Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const productToSend = {
      ...this.crudForm.value,
      compraPrice: Number(this.crudForm.value.compraPrice),
      ventaPrice: Number(this.crudForm.value.ventaPrice),
      expiryDate: this.crudForm.value.expiryDate === '' ? null : this.crudForm.value.expiryDate // Conviértelo a null si está vacío
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, productToSend).subscribe({
        next: () => this.onSuccess('Producto actualizado con éxito.', 'success'),
        error: () => this.showAlert('Error al actualizar el producto.', 'error')
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => this.onSuccess('Producto creado con éxito.', 'success'),
        error: () => this.showAlert('Error al crear el producto.', 'error')
      });
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
      barcode: product.barcode || ''  // Campo agregado
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.onSuccess('Producto eliminado con éxito.', 'success'),
      error: () => this.showAlert('Error al eliminar el producto.', 'error')
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

    // Ocultar la alerta después de 3 segundos
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
      barcode: ''  // Campo agregado
    });
    this.product = { title: '', compraPrice: 0, ventaPrice: 0, stock: 0, slug: '', user: { id: '' }, expiryDate: undefined, barcode: '' };  // Campo agregado
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
