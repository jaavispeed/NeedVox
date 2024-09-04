import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../models/passwordMatch';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export default class RegisterPageComponent {

  router = inject(Router);
  registerform: FormGroup;
  AuthService = inject(AuthService);

  constructor() {
    this.registerform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, [passwordMatch('password', 'confirmpassword')]);
  }

  onSubmit(): void {
    const Form = this.registerform.getRawValue();
    this.AuthService.register(Form.email, Form.username, Form.password)
      .pipe(
        catchError(error => {
          console.error("Error during registration:", error);
          // Mostrar mensaje de error al usuario
          alert("Ha ocurrido un error durante el registro. Por favor, inténtelo de nuevo.");
          return of();
        })
      )
      .subscribe(() => {
        // Informar al usuario que revise su correo para verificar su cuenta
        alert("Se ha enviado un correo electrónico de verificación. Por favor, verifica tu correo antes de iniciar sesión.");
        // Redirigir a la página de inicio de sesión o confirmación
        this.router.navigateByUrl('/login');
      });
  }
}
