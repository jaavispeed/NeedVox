import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../auth/models/user.model';

@Injectable({
providedIn: 'root'
})
export class UsuariosService {
private apiUrl = 'http://localhost:3000/api/usuarios';

constructor(private http: HttpClient) {}

getUsuarios(): Observable<User[]> {
return this.http.get<User[]>(this.apiUrl);
}
}
