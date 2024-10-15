import { Product } from "../../products/models/product.model";

export interface VentaCar {
  product: Product; // Tu objeto de producto
  cantidad: number; // Cantidad del producto en el carrito
  hora: string; // Hora local al agregar el producto
  ventaPrice: number; // Precio de venta del producto
}
