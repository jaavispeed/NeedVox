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
  isModalOpen: boolean = false; // Controla si el modal está abierto o cerrado
  modalType: string | undefined; // Controla qué tipo de modal mostrar (puede ser undefined)

  // Método para abrir el modal y establecer el tipo
  openModal(type: string) {
    this.modalType = type;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.modalType = undefined; // Reiniciar modalType al cerrar el modal
  }
}
