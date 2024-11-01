import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { Product } from '../../../products/models/product.model';
import { Lote } from '../../models/lotes.models';
import { ProductService } from '../../../products/services/product.service';
import { LotesService } from '../../services/compras.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  lotes: Lote[] = [];
  searchTerm: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  selectedLotes: Lote[] = [];
  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  viewMode: 'form' | 'historial' | 'default' = 'default';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5; // Ajusta la cantidad de productos por página

  // FormGroup para el formulario de lotes
  loteForm: FormGroup;

  constructor(private productService: ProductService, private loteService: LotesService) {
    this.loteForm = new FormGroup({
      precioCompra: new FormControl(0, Validators.required),
      precioVenta: new FormControl(0, Validators.required),
      stock: new FormControl(0, Validators.required),
      fechaCaducidad: new FormControl(new Date().toISOString(), Validators.required),
      productId: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.setDefaultFechaCaducidad(); // Establece la fecha de caducidad predeterminada
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = this.products; // Inicializa los productos filtrados
      },
      error: () => this.showAlert('Error al obtener los productos.', 'error')
    });
  }

  filterProducts(): void {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Restablece la lista si no hay término de búsqueda
    }
    this.currentPage = 1; // Reinicia la página actual al filtrar
  }

  // Métodos de paginación
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.hasMorePages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  hasMorePages(): boolean {
    return this.currentPage * this.itemsPerPage < this.filteredProducts.length;
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Resto del código...
  openAddLoteForm(product: Product): void {
    this.selectedProduct = product;
    this.loteForm.patchValue({ productId: product.id });
    this.viewMode = 'form';
  }

  createLote(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.loteService.createLote(this.loteForm.value).subscribe({
        next: () => this.onLoteSuccess('Lote creado con éxito.'),
        error: (error) => {
          console.error('Error al crear el lote:', error);
          this.showAlert('Error al crear el lote.', 'error');
        }
      });
    } else {
      this.showAlert('Producto no seleccionado.', 'error');
    }
  }

  private onLoteSuccess(message: string): void {
    this.showAlert(message, 'success');
    this.resetLoteForm();
    this.selectedLotes = [];
    this.viewMode = 'default'; // Regresar a la vista predeterminada
  }

  resetLoteForm(): void {
    this.loteForm.reset({
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      fechaCaducidad: new Date().toISOString().split('T')[0],
      productId: ''
    });
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }

  onHistorialCompras(product: Product): void {
    if (product.id) {
      this.viewMode = 'historial'; // Cambia a la vista de historial
      this.mostrarLotes(product.id);
      this.selectedProduct = product; // Actualiza el producto seleccionado
    } else {
      console.error('El producto no tiene un ID válido.');
      this.showAlert('Error: Producto no válido.', 'error');
    }
  }

  mostrarLotes(productId: string): void {
    this.loteService.getLotesByProduct(productId).subscribe({
      next: (response) => {
        this.selectedLotes = response.lotes; // Almacena los lotes en la propiedad
        console.log('Lotes:', this.selectedLotes); // Opcional: Log para verificar los lotes
      },
      error: (error) => {
        console.error('Error al obtener lotes:', error);
        this.showAlert('Error al obtener los lotes.', 'error');
      }
    });
  }

  goBack(): void {
    this.viewMode = 'default';
    this.resetLoteForm(); // Resetea el formulario al volver
  }

  setDefaultFechaCaducidad(): void {
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    this.loteForm.patchValue({ fechaCaducidad: defaultDate });
  }
}
