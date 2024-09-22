import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {

  products: any[] = [];
  product: any = { id: '', title: '', price: 0, stock: 0, slug: '' };
  isEditing: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();  // Cargar productos al iniciar el componente
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error al obtener los productos', error)
    });
  }

  createOrUpdateProduct(): void {
    if (this.isEditing) {
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: () => this.onSuccess(),
        error: (error) => console.error('Error al actualizar el producto', error)
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: () => this.onSuccess(),
        error: (error) => console.error('Error creando el producto', error)
      });
    }
  }

  editProduct(product: any): void {
    this.product = { ...product };  // Crea una copia del producto para editar
    this.isEditing = true;
  }

  deleteProduct(id: string): void {  // Asegúrate de que el ID es de tipo string
    this.productService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),  // Refrescar la lista después de eliminar
      error: (error) => console.error('Error al eliminar el producto', error)
    });
  }

  onSuccess(): void {
    this.getProducts();  // Refrescar la lista
    this.resetForm();    // Limpiar el formulario
  }

  resetForm(): void {
    this.product = { id: '', title: '', price: 0, stock: 0, slug: '' };
    this.isEditing = false;
  }
}
