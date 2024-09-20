import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

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
      // Destructura de manera segura con el operador de nullish coalescing (?.)
      const email = this.loginform.get('email')?.value;
      const password = this.loginform.get('password')?.value;

      if (email && password) {
        // Llama al servicio de autenticación
        this.authService.login({ email, password }).subscribe({
          next: (response) => {
            console.log('Login correcto', response);
            // Redirige al usuario a una página protegida o maneja el login exitoso
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Login fallido', err);
          }
        });
      }
    } else {
      console.error('Formulario inválido');
    }
  }
}
