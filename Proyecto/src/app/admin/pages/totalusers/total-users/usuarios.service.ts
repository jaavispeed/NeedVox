import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../auth/models/user.model';
import { environment } from '../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }


  // Método para actualizar el estado de un usuario
  updateEstado(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/estado`, { isActive });
  }
}
