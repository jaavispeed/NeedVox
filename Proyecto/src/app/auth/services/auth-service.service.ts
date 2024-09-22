import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';


  constructor(private httpClient: HttpClient) {}

  login(credentials: { email: string, password: string }) {
    return this.httpClient.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: { username: string, email: string, password: string }) {
    return this.httpClient.post(`${this.apiUrl}/register`, userData);
  }

}
