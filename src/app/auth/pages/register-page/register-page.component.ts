import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../models/passwordMatch';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export default class RegisterPageComponent {

  registerform: FormGroup;

  constructor() {
    this.registerform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, [passwordMatch('password', 'confirmpassword')]);
  }
}
