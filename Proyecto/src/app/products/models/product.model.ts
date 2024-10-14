export interface Product {
  id?: string; // Opcional si se crea uno nuevo
  title: string;
  compraPrice: number; // Precio de Compra
  ventaPrice: number; // Precio de Venta
  stock: number;
  slug?: string; // Opcional, si se genera automáticamente en el backend
  user: {
    id: string;
  };
  expiryDate?: string; // Añadir la propiedad de fecha de vencimiento
  barcode?: string;
}
