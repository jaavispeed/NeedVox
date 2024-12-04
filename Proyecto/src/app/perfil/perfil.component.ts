import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth-service.service';
import { User } from '../auth/models/user.model';
import { UsuariosService } from '../admin/pages/totalusers/total-users/usuarios.service'; // Importa el servicio que has creado
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../shared/pages/alert/alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
})
export class PerfilComponent implements OnInit {
  user: User | null = null; // Inicia como null
  alertVisible: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  errorMessage: string = '';
  isEditing: boolean = false; // Nueva variable para el estado de edición

  constructor(private authService: AuthService, private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (userData) => {
        this.user = userData; // Asigna los datos del usuario a la variable
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }

  onUpdateProfile(): void {
    if (this.user) {
      this.authService.updateProfile({ username: this.user.username, email: this.user.email }).subscribe(
        (updatedUser) => {
          this.user = updatedUser; // Actualiza los datos del usuario en el componente
          this.showAlert('Perfil actualizado exitosamente.', 'success');
          this.isEditing = false; // Cambiar el estado a no editar

          // Recargar la página como F5
          window.location.reload(); // Esta línea fue añadida
        },
        (error) => {
          console.error('Error al actualizar el perfil del usuario:', error);
          this.showAlert('Hubo un error al actualizar el perfil.', 'error');
        }
      );
    }
  }


  // Método para activar el modo edición
  enableEditMode(): void {
    this.isEditing = true;
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // Ocultar el mensaje después de 3 segundos
  }
}
