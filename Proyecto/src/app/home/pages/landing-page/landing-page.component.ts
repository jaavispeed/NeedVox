import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import LoginPageComponent from '../../../auth/pages/login-page/login-page.component';
import RegisterPageComponent from '../../../auth/pages/register-page/register-page.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [CommonModule, LoginPageComponent, RegisterPageComponent]
})
export default class LandingPageComponent {
  isModalOpen = false; // Controla si el modal está abierto o cerrado
  modalType: string = ''; // Almacena el tipo de modal (login o registro)

  // Método para abrir el modal y establecer el tipo
  openModal(type: string) {
    this.modalType = type; // Establece el tipo de modal
    this.isModalOpen = true; // Abre el modal
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }
}
