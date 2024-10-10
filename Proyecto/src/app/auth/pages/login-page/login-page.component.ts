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
  styleUrls: ['./login-page.component.css']  // Asegúrate de que sea 'style**s**Url' con una "s"
})
export default class LoginPageComponent {
  router = inject(Router);
  authService = inject(AuthService);
  @Output() closeModal = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>(); // Evento de éxito
  @Output() onError = new EventEmitter<string>(); // Evento de error

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
            localStorage.setItem('token', response.token);
            this.onSuccess.emit(); // Emitir evento de éxito
            this.router.navigate(['/index']);
          },
          error: (err) => {
            console.error('Login fallido', err);
            this.onError.emit('Error al iniciar sesión. Verifica tus credenciales.'); // Emitir evento de error
          }
        });
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  close() {
    this.closeModal.emit();
  }
}
