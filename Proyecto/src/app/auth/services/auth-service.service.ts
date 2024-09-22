import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';


  constructor(private httpClient: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/login`, credentials);
  }


  register(userData: { username: string, email: string, password: string }) {
    return this.httpClient.post(`${this.apiUrl}/register`, userData);
  }

}
