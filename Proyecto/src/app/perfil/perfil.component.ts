import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth-service.service';
import { User } from '../auth/models/user.model';
import { UsuariosService } from '../admin/pages/totalusers/total-users/usuarios.service'; // Importa el servicio que has creado
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class PerfilComponent implements OnInit {
  user: User | null = null; // Inicia como null

  constructor(private authService: AuthService, private usuariosService: UsuariosService) {}

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
          // Actualiza los datos de usuario en el componente después de la actualización exitosa
          this.user = updatedUser;
          alert('Perfil actualizado exitosamente');
        },
        (error) => {
          console.error('Error al actualizar el perfil del usuario:', error);
          alert('Hubo un error al actualizar el perfil');
        }
      );
    }
  }
  

}
