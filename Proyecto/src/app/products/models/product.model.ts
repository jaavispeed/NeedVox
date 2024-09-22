export interface Product {
  id?: string; // Opcional si se crea uno nuevo
  title: string;
  price: number;
  stock: number;
  slug?: string; // Opcional, si se genera automáticamente en el backend
  user: {
    id: string;
  };
}
