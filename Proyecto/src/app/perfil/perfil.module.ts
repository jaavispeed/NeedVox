import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../shared/pages/alert/alert.component';

@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de importar CommonModule
    AlertComponent
  ],
  exports: [
    PerfilComponent // Exporta si es necesario
  ]
})
export class PerfilModule { }
