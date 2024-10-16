export interface Venta {
  id: string; // ID de la venta
  productos: {
    productId: string; // ID del producto
    cantidad: number; // Cantidad de este producto
    precioUnitario: number; // Precio unitario del producto
  }[]; // Array de productos
  hora: string; // Hora de la venta
  total: number; // Total de la venta
}
