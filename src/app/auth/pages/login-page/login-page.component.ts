import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {
router = inject(Router);
authservice = inject(AuthService)

loginform = new FormGroup({
  email: new FormControl('',[Validators.required, Validators.email]),
  password: new FormControl('',[Validators.required, Validators.minLength(6)])
})

onSubmit(){
  if(this.loginform.valid){
    console.log(this.loginform.value)
    this.router.navigateByUrl('/dashboard')
  }else{
    console.log('No se envia')
  }
}

async signInWithGoogle() {
  try {
    const user = await this.authservice.signInWithGoogle();
    this.router.navigateByUrl('/dashboard')
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error durante el inicio de sesión con Google:', error);
  } finally {

  }
}
}
