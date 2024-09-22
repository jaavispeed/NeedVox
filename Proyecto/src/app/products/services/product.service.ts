import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private httpClient: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado correctamente
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agrega el token en los encabezados
    });
    return this.httpClient.get<any[]>(this.apiUrl, { headers });
  }

  // Crear un producto
  createProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<any>(this.apiUrl, productData, { headers });
  }

  // Obtener un producto por ID
  getProductById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Actualizar un producto
  updateProduct(id: string, productData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put<any>(`${this.apiUrl}/${id}`, productData, { headers });
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
