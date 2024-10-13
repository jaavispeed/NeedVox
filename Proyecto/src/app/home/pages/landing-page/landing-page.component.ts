import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import LoginPageComponent from '../../../auth/pages/login-page/login-page.component';
import RegisterPageComponent from '../../../auth/pages/register-page/register-page.component';
import { AlertComponent } from '../../../shared/pages/alert/alert.component'; // Asegúrate de que la ruta sea correcta
import { SpinnerComponent } from '../../../shared/pages/spinner/spinner.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [CommonModule, LoginPageComponent, RegisterPageComponent, AlertComponent, SpinnerComponent]
})
export default class LandingPageComponent {
  isModalOpen = false; // Controla si el modal está abierto o cerrado
  modalType: string = ''; // Almacena el tipo de modal (login o registro)
  isLoading = false; // Controla la visibilidad del spinner

  // Propiedades para la alerta
  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success'; // Asegúrate de que este tipo sea correcto

  // Método para abrir el modal y establecer el tipo
  openModal(type: string) {
    this.modalType = type; // Establece el tipo de modal
    this.isModalOpen = true; // Abre el modal
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para mostrar la alerta
  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    // Ocultar la alerta después de un tiempo
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // 3 segundos
  }

  // Método para iniciar el spinner
  startLoading() {
    this.isLoading = true;
  }

  // Método para detener el spinner
  stopLoading() {
    this.isLoading = false;
  }
}
