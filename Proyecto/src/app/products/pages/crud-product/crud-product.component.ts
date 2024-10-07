import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-crud-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {
  products: Product[] = [];  // Lista original de productos
  filteredProducts: Product[] = [];  // Productos filtrados
  currentPage = 1;
  itemsPerPage = 5;
  product: Product = {
    title: '',
    compraPrice: 0,
    ventaPrice: 0,
    stock: 0,
    slug: '',
    user: { id: '' },
    expiryDate: undefined // Añadido expiryDate
  };
  isEditing: boolean = false;
  isModalOpen: boolean = false;  // Estado del modal
  searchTerm: string = '';  // Término de búsqueda

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();  // Cargar productos al iniciar el componente
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;  // Inicializa los productos filtrados
      },
      error: (error) => console.error('Error al obtener los productos', error)
    });
  }

  createOrUpdateProduct(): void {
    const productToSend = {
      title: this.product.title, // Obligatorio
      compraPrice: Number(this.product.compraPrice) || 0, // No obligatorio
      ventaPrice: Number(this.product.ventaPrice) || 0,   // No obligatorio
      stock: Number(this.product.stock) || 0, // No obligatorio
      slug: this.product.slug || '', // No obligatorio
      expiryDate: this.product.expiryDate // No obligatorio
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, productToSend).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          console.error('Error al actualizar el producto', error);
          console.error('Detalles del error', error.error); // Muestra detalles del error
        }
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          console.error('Error creando el producto', error);
          console.error('Detalles del error', error.error); // Muestra detalles del error
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.product = { ...product };  // Crea una copia del producto para editar
    this.isEditing = true;
    this.openModal();  // Abre el modal al editar
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),  // Refrescar la lista después de eliminar
      error: (error) => console.error('Error al eliminar el producto', error)
    });
  }

  onSuccess(): void {
    this.getProducts();  // Refrescar la lista
    this.resetForm();    // Limpiar el formulario
    this.closeModal();   // Cerrar el modal después de agregar/editar
  }

  resetForm(): void {
    this.product = {
      title: '',
      compraPrice: 0,
      ventaPrice: 0,
      stock: 0,
      slug: '',  // Reinicia slug a una cadena vacía
      user: { id: '' },
      expiryDate: undefined // Reinicia expiryDate
    };
    this.isEditing = false;
  }

  openModal(): void {
    this.isModalOpen = true;  // Cambia el estado del modal a abierto
  }

  closeModal(): void {
    this.isModalOpen = false;  // Cambia el estado del modal a cerrado
    this.resetForm();          // Reinicia el formulario al cerrar el modal
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
