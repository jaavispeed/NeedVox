import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';


@Component({
  selector: 'app-crud-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {

  products: Product[] = [];  // Usa el tipo Product
  product: Product = { title: '', price: 0, stock: 0, slug: '', user: { id: '' } };
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
    const productToSend = {
      title: this.product.title,
      price: Number(this.product.price), // Asegúrate de que price sea un número
      stock: Number(this.product.stock), // Asegúrate de que stock sea un número
      slug: this.product.slug
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
    this.product = { title: '', price: 0, stock: 0, slug: '', user: { id: '' } };
    this.isEditing = false;
  }
}
