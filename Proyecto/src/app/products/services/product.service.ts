import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // URL de tu API

  constructor(private httpClient: HttpClient) {}

  // Configurar encabezados de autorización
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Configura el encabezado de autorización
    });
  }

  // Obtener todos los productos de un usuario con paginación opcional
  getProducts(limit = 10, offset = 0): Observable<any[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.httpClient.get<any[]>(this.apiUrl, { headers, params });
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
