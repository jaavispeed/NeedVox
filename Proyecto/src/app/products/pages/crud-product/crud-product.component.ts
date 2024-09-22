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
        error: (error) => {
          console.error('Error al actualizar el producto', error);
          console.error('Detalles del error', error.error); // Muestra detalles del error
        }
      });
    } else {
      const productToSend = {
        title: this.product.title,
        price: this.product.price,
        stock: this.product.stock,
        slug: this.product.slug // Asegúrate de que el slug se envíe
      };

      this.productService.createProduct(productToSend).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          console.error('Error creando el producto', error);
          console.error('Detalles del error', error.error); // Muestra detalles del error
        }
      });
    }
  }

  editProduct(product: any): void {
    this.product = { ...product };  // Crea una copia del producto para editar
    this.isEditing = true;
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
  }

  resetForm(): void {
    this.product = { id: '', title: '', price: 0, stock: 0, slug: '' };
    this.isEditing = false;
  }
}
