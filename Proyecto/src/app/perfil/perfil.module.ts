import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de importar CommonModule
  ],
  exports: [
    PerfilComponent // Exporta si es necesario
  ]
})
export class PerfilModule { }