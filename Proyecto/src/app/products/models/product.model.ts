import { Lote } from "../../compras/models/lotes.models";

export interface Product {
  id?: string; // Opcional si se crea uno nuevo
  title: string;
  stockTotal: number; // Cambiado a stockTotal según tu backend
  slug?: string; // Opcional, si se genera automáticamente en el backend
  user: {
    id: string;
  };
  barcode?: string | null; // Código de barras puede ser nulo
  fechaCreacion?: string; // Propiedad de fecha de creación
  lotes?: Lote[]; // Agregar la propiedad de lotes
}
