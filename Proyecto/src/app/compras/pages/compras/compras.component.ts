import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { Product } from '../../../products/models/product.model';
import { Lote } from '../../../products/models/lotes.models';
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
  viewMode: 'form' | 'historial' | 'default' = 'default'; // Nueva propiedad para controlar la vista

  // FormGroup para el formulario de lotes
  loteForm: FormGroup;

  constructor(private productService: ProductService, private loteService: LotesService) {
    // Inicialización del formulario de lotes
    this.loteForm = new FormGroup({
      precioCompra: new FormControl(0, Validators.required),
      precioVenta: new FormControl(0, Validators.required),
      stock: new FormControl(0, Validators.required),
      fechaCaducidad: new FormControl('', Validators.required), // Inicializar sin valor
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
        this.filteredProducts = this.products;
      },
      error: () => this.showAlert('Error al obtener los productos.', 'error')
    });
  }

  openAddLoteForm(product: Product): void {
    this.selectedProduct = product;
    this.loteForm.patchValue({ productId: product.id }); // Establece el ID del producto en el formulario
    this.viewMode = 'form'; // Cambia a la vista del formulario
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
      // Convierte a string en formato yyyy-MM-dd
      fechaCaducidad: new Date().toISOString().split('T')[0], // Esto devuelve 'yyyy-MM-dd'
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

  filterProducts(): void {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Restablece la lista si no hay término de búsqueda
    }
  }

  onHistorialCompras(product: Product): void {
    if (product.id) {
      this.viewMode = 'historial'; // Cambia a la vista de historial
      this.mostrarLotes(product.id); // Asegúrate de que el ID se pase correctamente
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



  // Método para regresar a la vista predeterminada
  goBack(): void {
    this.viewMode = 'default';
    this.resetLoteForm(); // Resetea el formulario al volver
  }

  // Método para establecer la fecha de caducidad predeterminada
  setDefaultFechaCaducidad(): void {
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0]; // Obtener solo la parte de la fecha
    this.loteForm.patchValue({ fechaCaducidad: defaultDate });
  }

  formatFecha(fechaCaducidad: string): string {
    const date = new Date(fechaCaducidad);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  }




}
