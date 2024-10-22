import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngFor
import { TotalProductosComponent } from './total-productos.component'; // Asegúrate de que la ruta sea correcta
import { TotalProductosService } from './total-productos.service'; // Asegúrate de que la ruta sea correcta
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [TotalProductosComponent], // Declara el componente
  imports: [
    CommonModule,  // Importa CommonModule aquí
    HttpClientModule // Importa HttpClientModule aquí
  ],
  providers: [TotalProductosService] // Proporciona el servicio
})
export class TotalProductosModule {}
