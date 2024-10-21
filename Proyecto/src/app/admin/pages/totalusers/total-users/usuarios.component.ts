import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../total-users/usuarios.service';
import { User } from '../../../../auth/models/user.model'; // Ruta del modelo actualizado
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
  error: string | null = null; // Manejo de errores

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data: User[]) => {
        this.usuarios = data;
      },
      (error: any) => {
        this.error = 'Error al obtener usuarios'; // Mensaje de error
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
}
