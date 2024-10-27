// models/lotes.models.ts

import { Product } from "./product.model";

export interface Lote {
  id: string;               // ID del lote (UUID)
  precioCompra: number;     // Precio de compra del lote
  precioVenta: number;      // Precio de venta del lote
  stock: number;            // Stock disponible del lote
  fechaCaducidad: Date;     // Fecha de caducidad del lote
  fechaCreacion: string;    // Fecha de creación del lote (puede ser string según tu DTO)
  product: Product;         // Producto asociado al lote
  user?: { id: string };    // Usuario asociado, opcional si es necesario
}

// Nuevo tipo para la creación de un lote
export interface LoteCreate {
  precioCompra: number;     // Precio de compra del lote
  precioVenta: number;      // Precio de venta del lote
  stock: number;            // Stock disponible del lote
  fechaCaducidad: string;    // Fecha de caducidad del lote en formato string
  productId: string;        // ID del producto asociado (en lugar del objeto Product)
}
