import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']  // Asegúrate de que sea 'style**s**Url' con una "s"
})
export default class LoginPageComponent {
  router = inject(Router);
  authService = inject(AuthService);

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.loginform.valid) {
      const email = this.loginform.get('email')?.value;
      const password = this.loginform.get('password')?.value;

      if (email && password) {
        this.authService.login({ email, password }).subscribe({
          next: (response: User) => {
            console.log('Login correcto', response);
            localStorage.setItem('userData', JSON.stringify(response));
            localStorage.setItem('token', response.token || ''); // Asegúrate de manejar el caso en que token sea undefined
            this.router.navigate(['/index']);
          },
          error: (err) => {
            console.error('Login fallido', err);
          }
        });
      }
    } else {
      console.error('Formulario inválido');
    }
  }}
