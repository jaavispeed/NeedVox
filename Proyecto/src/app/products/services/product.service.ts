import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { LotesService } from '../../compras/services/compras.service';
import { Lote } from '../../compras/models/lotes.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // URL de tu API

  constructor(private httpClient: HttpClient, private lotesService: LotesService) {}

  // Configurar encabezados de autorización
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Configura el encabezado de autorización
    });
  }


  // Obtener todos los productos de un usuario con los precios de lotes
getProducts(limit = 10, offset = 0): Observable<any[]> {
  const headers = this.getHeaders();
  const params = new HttpParams()
    .set('limit', limit.toString())
    .set('offset', offset.toString());

  return this.httpClient.get<any[]>(this.apiUrl, { headers, params }).pipe(
    // Transformar la respuesta de productos
    switchMap((products) => {
      // Crear un arreglo de observables para los lotes
      const productObservables = products.map((product) =>
        this.lotesService.getLotesByProduct(product.id).pipe(
          map((response) => {
            const lotes: Lote[] = response.lotes; // Obtenemos el arreglo de lotes

            // Obtener el precio de venta más reciente, basado en la fecha de creación
            const lastLote = lotes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())[0];
            const lastLotPrice = lastLote ? lastLote.precioVenta : null;

            return {
              ...product,
              lastLotPrice: lastLotPrice, // Añadir el precioVenta del último lote
            };
          })
        )
      );

      // Esperar a que todos los observables de lotes se completen
      return forkJoin(productObservables); // Devolver un Observable<any[]> con los productos
    }),
    catchError((error) => {
      console.error('Error al obtener productos', error);
      return of([]); // Retornar un arreglo vacío en caso de error
    })
  );
}


  // Obtener todos los productos como admin
  getProductsAdmin(limit = 10, offset = 0): Observable<any[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.httpClient.get<any[]>(`${this.apiUrl}/admin`, { headers, params });
  }

  // Crear un producto
  createProduct(productData: {
    title: string;
    slug?: string; // Opcional, si se genera automáticamente en el backend
    barcode?: string | null; // Opcional
  }): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(this.apiUrl, productData, { headers });
  }

  // Obtener un producto por ID
  getProductById(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Actualizar un producto
  updateProduct(id: string, productData: {
    title: string;
    slug?: string; // Opcional
    barcode?: string | null; // Opcional
  }): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.patch<any>(`${this.apiUrl}/${id}`, productData, { headers });
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
