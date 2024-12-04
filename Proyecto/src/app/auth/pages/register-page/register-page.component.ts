import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../models/passwordMatch';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export default class RegisterPageComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>(); // Evento para éxito
  @Output() onError = new EventEmitter<void>();   // Evento para error
  @Output() openLoginModal = new EventEmitter<void>();  // Nuevo EventEmitter

  router = inject(Router);
  registerform: FormGroup;
  authService = inject(AuthService);

  constructor() {
    this.registerform = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[\\w\\.-]+@(gmail|hotmail|outlook|yahoo)\\.com$') // Validación del dominio
      ]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, [passwordMatch('password', 'confirmpassword')]);
  }

  onSubmit(): void {
    if (this.registerform.valid) {
      const { username, email, password } = this.registerform.value;
      this.authService.register({ email, username, password }).subscribe({
        next: (response) => {
          console.log('Usuario Registrado', response);
          this.onSuccess.emit(); // Emitir evento de éxito
          this.close();          // Cerrar el modal
        },
        error: (error) => {
          console.error('Error al registrar el usuario', error);
          this.onError.emit();  // Emitir evento de error
        }
      });
    }
  }

  close() {
    this.closeModal.emit();
  }


  goToLogin() {
    this.openLoginModal.emit(); // Emitir evento para abrir el modal de registro
  }

}
