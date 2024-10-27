// src/app/auth/components/login-page.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'] // Asegúrate de que sea 'style**s**Url' con una "s"
})
export default class LoginPageComponent {
  router = inject(Router);
  authService = inject(AuthService);
  @Output() closeModal = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>(); // Evento de éxito
  @Output() onError = new EventEmitter<string>(); // Evento de error
  @Output() startLoading = new EventEmitter<void>();
  @Output() stopLoading = new EventEmitter<void>();

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.loginform.valid) {
      const email = this.loginform.get('email')?.value;
      const password = this.loginform.get('password')?.value;

      this.startLoading.emit(); // Emitir el evento para iniciar el spinner

      if (email && password) {
        this.authService.login({ email, password }).subscribe({
          next: (response: User) => {
            if (response && response.token) { // Verifica que la respuesta sea válida
              console.log('Login correcto', response);
              localStorage.setItem('token', response.token);
              this.onSuccess.emit(); // Emitir evento de éxito

              this.close(); // Cerrar el modal solo si el login es exitoso

              setTimeout(() => {
                this.router.navigate(['/index']);
                this.stopLoading.emit(); // Detener el spinner después de redirigir
              }, 1000);
            } else {
              this.handleLoginError(); // Manejar el caso cuando la respuesta es inválida
            }
          },
          error: (err) => {
            console.error('Login fallido', err);
            this.stopLoading.emit(); // Detener el spinner en caso de error
            this.onError.emit('Error al iniciar sesión. Verifica tus credenciales.'); // Emitir evento de error
            // No cerrar el modal aquí, permitir que el usuario corrija sus credenciales
          }
        });
      } else {
        console.error('Email o contraseña no válidos');
        this.stopLoading.emit(); // Detener el spinner si el formulario es inválido
      }
    } else {
      console.error('Formulario inválido');
      this.stopLoading.emit(); // Detener el spinner si el formulario es inválido
    }
  }

  // Función para manejar errores de inicio de sesión
  private handleLoginError() {
    this.stopLoading.emit();
    this.onError.emit('Error al iniciar sesión. Inténtalo de nuevo.'); // Emitir evento de error
  }

  close() {
    this.closeModal.emit();
  }
}
