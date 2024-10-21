// src/app/admin/pages/totalusers/total-users/total-users.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { UsuariosComponent } from './usuarios.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    // otros componentes si los hay
  ],
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté aquí
    FormsModule,   // Agrega FormsModule aquí
    // otros módulos si los hay
  ],
  exports: [
    UsuariosComponent // Exporta si es necesario
  ]
})
export class TotalUsersModule {}
