import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  router = inject(Router);
  registerform: FormGroup;
  authService = inject(AuthService);

  constructor() {
    this.registerform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, [passwordMatch('password', 'confirmpassword')]);
  }

  onSubmit(): void {
    if(this.registerform.valid){
      const { username, email, password } = this.registerform.value;
      this.authService.register({email, username, password}).subscribe({
        next: (response) => {
          console.log('Usuario Registrado', response);
          this.router.navigate(['/home']);
        },
        error: (error) => console.error('Error al registrar el usuario', error)
      });
    }

}}
