import { Product } from "../../products/models/product.model";

export interface Lote {
  id: string;               // ID del lote (UUID)
  nombreLote: string;      // Nombre del lote
  precioCompra: number;    // Precio de compra del lote
  precioVenta: number;     // Precio de venta del lote
  stock: number;           // Stock disponible del lote
  fechaCaducidad: Date;    // Fecha de caducidad del lote
  fechaCreacion: Date;     // Fecha de creación del lote
  productos?: Product[];    // Opcional: lista de productos asociados al lote
}
