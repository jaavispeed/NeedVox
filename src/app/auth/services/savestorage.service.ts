import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class SaveStorage {
  private userName: string = '';
  private userEmail: string = '';

  saveUserName(name: string): void {
    this.userName = name;
  }
  getUserName(): string {
    return this.userName;
  }
  saveUserEmail(email: string): void {
    this.userEmail = email;
  }
  getUserEmail(): string {
    return this.userEmail;
  }

  saveLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }
}
