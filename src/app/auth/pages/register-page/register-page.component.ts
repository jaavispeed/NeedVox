import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../models/passwordMatch';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  AuthService = inject(AuthService)

  constructor() {
    this.registerform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, [passwordMatch('password', 'confirmpassword')]);
  }

  onSubmit(): void{
    const rawForm = this.registerform.getRawValue()
    this.AuthService.register(rawForm.email, rawForm.username, rawForm.password).subscribe(()=> {
      this.router.navigateByUrl('/dashboard')
    })
  }
}
