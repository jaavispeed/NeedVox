import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../products/models/product.model';
import { Lote } from '../../compras/models/lotes.models';
import { LotesService } from '../../compras/services/compras.service';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/products'; // URL para obtener productos
  private loteApiUrl = 'http://localhost:3000/api/lotes'; // URL para obtener lotes
  private authApiUrl = 'http://localhost:3000/api/auth'; // URL para autenticación

  constructor(private httpClient: HttpClient, private lotesService: LotesService) {}

  checkStatus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<any>(`${this.authApiUrl}/check-status`, { headers });
  }

  // Método para obtener el token y los headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // En tu VentaService, actualiza el método crearVenta
  crearVenta(venta: { userId: string; productos: { productId: string; cantidad: number; ventaPrice: number; }[] }): Observable<any> {
    return this.httpClient.post<any>('http://localhost:3000/api/ventas', venta, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  getProducts(limit = 10, offset = 0): Observable<any[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.httpClient.get<any[]>(this.apiUrl, { headers, params }).pipe(
      tap((response) => console.log('Respuesta de productos:', response)), // Log de respuesta
      switchMap((products) => {
        const productObservables = products.map((product) =>
          this.lotesService.getLotesByProduct(product.id).pipe(
            map((response) => {
              const lotes: Lote[] = response.lotes; // Obtenemos el arreglo de lotes

              // Obtener el precio de venta más antiguo
              const oldestLote = lotes.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())[0];
              const oldestLotPrice = oldestLote ? oldestLote.precioVenta : null;

              return {
                ...product,
                oldestLotPrice: oldestLotPrice, // Añadir el precioVenta del lote más antiguo
                fechaCreacion: new Date(product.fechaCreacion) // Convierte a objeto Date
              };
            })
          )
        );

        // Esperar a que todos los observables de lotes se completen
        return forkJoin(productObservables).pipe(
          map(productsWithDates => {
            // Asegúrate de que todos los productos tengan la fecha como Date
            return productsWithDates.map(product => ({
              ...product,
              fechaCreacion: new Date(product.fechaCreacion) // Asegúrate de que se esté convirtiendo
            }));
          })
        );
      }),
      tap((finalProducts) => console.log('Productos después de agregar precios de lotes:', finalProducts)), // Log de productos finales
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return of([]); // Retornar un arreglo vacío en caso de error
      })
    );
  }


  // Obtener todos los lotes
  getLotes(): Observable<Lote[]> {
    return this.httpClient.get<Lote[]>(this.loteApiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `El servidor respondió con el código ${error.status}, ` +
        `detalle: ${error.error}`);
    }
    // Retornar un observable con un mensaje de error
    return throwError('Algo salió mal; por favor intente nuevamente más tarde.');
  }
}
