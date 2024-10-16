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
  styleUrls: ['./login-page.component.css']
})
export default class LoginPageComponent {
  router = inject(Router);
  authService = inject(AuthService);
  @Output() closeModal = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onError = new EventEmitter<string>();
  @Output() startLoading = new EventEmitter<void>();
  @Output() stopLoading = new EventEmitter<void>();

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.loginform.valid) {
      const email = this.loginform.get('email')?.value;
      const password = this.loginform.get('password')?.value;

      this.startLoading.emit(); // Iniciar el spinner

      if (email && password) {
        this.authService.login({ email, password }).subscribe({
          next: (response: User | null) => { // Manejar respuesta como User o null
            if (response) {
              console.log('Login correcto', response);
              localStorage.setItem('token', response.token);
              if (response.roles) {
                localStorage.setItem('roles', JSON.stringify(response.roles)); // Almacenar los roles
              }
              this.onSuccess.emit(); // Emitir evento de éxito
              this.close(); // Cerrar el modal

              setTimeout(() => {
                this.router.navigate(['/index']);
                this.stopLoading.emit(); // Detener el spinner
              }, 1000);
            } else {
              this.handleLoginError(); // Manejar error si response es null
            }
          },
          error: (err) => {
            console.error('Login fallido', err);
            this.stopLoading.emit(); // Detener el spinner
            this.onError.emit('Error al iniciar sesión. Verifica tus credenciales.'); // Emitir evento de error
          }
        });
      } else {
        console.error('Email o contraseña no válidos');
        this.stopLoading.emit(); // Detener el spinner
      }
    } else {
      console.error('Formulario inválido');
      this.stopLoading.emit(); // Detener el spinner
    }
  }

  private handleLoginError() {
    this.stopLoading.emit();
    this.onError.emit('Error al iniciar sesión. Inténtalo de nuevo.');
  }

  close() {
    this.closeModal.emit();
  }
}
