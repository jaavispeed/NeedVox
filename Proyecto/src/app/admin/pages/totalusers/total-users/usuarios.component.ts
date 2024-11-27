import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../total-users/usuarios.service';
import { User } from '../../../../auth/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './total-users.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  error: string | null = null;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data: User[]) => {
        console.log(data); // Verifica que los datos sean correctos
        this.usuarios = data;
        // this.usuariosFiltrados = this.usuarios.filter(usuario => !usuario.roles.includes('admin'));
        this.usuariosFiltrados = this.usuarios;  // Mostrar todos los usuarios, incluyendo administradores
      },
      (error: any) => {
        this.error = 'Error al obtener usuarios';
        console.error('Error al obtener usuarios:', error);
      }
    );
  }



  // Método para activar/desactivar un usuario
  toggleUsuario(usuario: User) {
    const nuevoEstado = !usuario.isActive; // Cambiar el estado actual
    this.usuariosService.updateEstado(usuario.id, nuevoEstado).subscribe(
      (updatedUser: User) => {
        usuario.isActive = updatedUser.isActive; // Actualizar el estado local
      },
      (error: any) => {
        console.error('Error al actualizar el estado del usuario:', error);
      }
    );
  }
}
