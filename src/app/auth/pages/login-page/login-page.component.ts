import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {
router = inject(Router);

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
}
