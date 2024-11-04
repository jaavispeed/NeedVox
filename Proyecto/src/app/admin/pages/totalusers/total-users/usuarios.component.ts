import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../total-users/usuarios.service';
import { User } from '../../../../auth/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './total-users.component.html',
  styleUrls: ['./total-users.component.css'],
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
        this.usuarios = data;
        // Filtrar los usuarios para excluir administradores
        this.usuariosFiltrados = this.usuarios.filter(usuario => !usuario.roles.includes('admin'));
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
