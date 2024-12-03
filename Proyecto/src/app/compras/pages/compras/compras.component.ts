import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from '../../../shared/pages/alert/alert.component';
import { Product } from '../../../products/models/product.model';
import { Lote } from '../../models/lotes.models';
import { ProductService } from '../../../products/services/product.service';
import { LotesService } from '../../services/compras.service';
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule, AlertComponent, SpinnerComponent],
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
  hasMoreProducts: boolean = true;

  isLoading: boolean = false; // Para controlar la visualización del spinner


  lotesPerPage: number = 10; // Puedes ajustarlo según el número de lotes por página
  currentLotesPage: number = 1;
  totalLotes: number = 0; // Total de lotes para el producto seleccionado

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10; // Ajusta la cantidad de productos por página

  // FormGroup para el formulario de lotes
  loteForm: FormGroup;

  constructor(private productService: ProductService, private loteService: LotesService) {
    this.loteForm = new FormGroup({
      precioCompra: new FormControl(0, [Validators.required, Validators.min(1)]),
      precioVenta: new FormControl(0, [Validators.required, Validators.min(1)]),
      stock: new FormControl(0, [Validators.required, Validators.min(1)]),
      fechaCaducidad: new FormControl(null), // Valor inicial como null
      productId: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.productService.getProducts(this.itemsPerPage, offset).subscribe({
      next: (data) => {
        console.log('Productos recibidos:', data);
        if (this.currentPage === 1) {
          this.products = data.products || [];
        } else {
          this.products = [...this.products, ...(data.products || [])];
        }

        this.filteredProducts = this.products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.showAlert('Error al obtener los productos.', 'error');
        this.isLoading = false;
      },
    });
  }




  filterProducts(): void {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter(product =>
        product.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products];
    }
    this.currentPage = 1;
  }



  // Métodos de paginación
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }



  nextPage(): void {
    if (this.hasMoreProducts) {
      this.currentPage++;
      this.getProducts();
    }
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProducts();
    }
  }





  hasMorePages(): boolean {
    return this.hasMoreProducts;
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
    this.isLoading = true; // Activar el spinner

    const formValue = this.loteForm.value;

    // Verifica si la fechaCaducidad es un objeto Date y conviértelo a cadena (YYYY-MM-DD)
    if (formValue.fechaCaducidad instanceof Date) {
      formValue.fechaCaducidad = formValue.fechaCaducidad.toISOString().split('T')[0];
    }

    console.log('Fecha de caducidad antes de enviar:', formValue.fechaCaducidad);

    // Verifica que el producto esté seleccionado y que tenga un ID válido
    if (this.selectedProduct && this.selectedProduct.id) {
      // Asegúrate de que el objeto formValue esté en el formato correcto
      console.log('Datos de la compra antes de enviarlos:', formValue);

      this.loteService.createLote(formValue).subscribe({
        next: () => {
          this.onLoteSuccess('Compra agregada con éxito.');
          this.isLoading = false; // Desactivar el spinner al finalizar
        },
        error: (error) => {
          console.error('Error al crear la compra:', error);
          this.isLoading = false; // Desactivar el spinner al finalizar
          // Muestra un mensaje de error detallado
          this.showAlert('Error al crear la compra. Detalles: ' + error.message, 'error');
        }
      });
    } else {
      // Si no hay producto seleccionado, muestra un mensaje de alerta
      this.showAlert('Producto no seleccionado.', 'error');
      this.isLoading = false; // Desactivar el spinner si no hay producto seleccionado
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
      fechaCaducidad: null,
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
    this.isLoading = true; // Activar el spinner
    this.loteService.getLotesByProduct(productId).subscribe({
      next: (response) => {
        // Filtrar los lotes con stock mayor que 0
        this.selectedLotes = response.lotes.filter(lote => lote.stock > 0);
        this.totalLotes = this.selectedLotes.length; // Actualiza el total de lotes
        this.currentLotesPage = 1; // Resetea la página a la primera cuando se muestran los lotes
        console.log('Lotes con stock mayor que 0:', this.selectedLotes); // Opcional: Log para verificar los lotes
        this.isLoading = false; // Desactivar el spinner

      },
      error: (error) => {
        console.error('Error al obtener lotes:', error);
        this.showAlert('Error al obtener los lotes.', 'error');
        this.isLoading = false; // Desactivar el spinner

      }
    });
  }



   // Paginación para los lotes
   get paginatedLotes(): Lote[] {
    const startIndex = (this.currentLotesPage - 1) * this.lotesPerPage;
    return this.selectedLotes.slice(startIndex, startIndex + this.lotesPerPage);
  }

  nextLotesPage(): void {
    if (this.currentLotesPage * this.lotesPerPage < this.totalLotes) {
      this.currentLotesPage++;
    }
  }

  previousLotesPage(): void {
    if (this.currentLotesPage > 1) {
      this.currentLotesPage--;
    }
  }

  hasMoreLotes(): boolean {
    return this.currentLotesPage * this.lotesPerPage < this.totalLotes;
  }

  totalLotesPages(): number {
    return Math.ceil(this.totalLotes / this.lotesPerPage);
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

  onSubmit() {
    if (this.loteForm.valid) {
      this.createLote();
    } else {
      console.error('Formulario no válido');
    }
  }





}



