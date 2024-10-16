import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnChanges{

  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Input() type: 'success' | 'error' = 'success';

  showAlert = false;
  alertClass = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.showAlert = true;
        this.alertClass = 'alert-show';
        setTimeout(() => {
          this.alertClass = 'alert-hide';
          setTimeout(() => {
            this.showAlert = false;
          }, 3000); // Duración de la transición
        }, 5000); // Mostrar durante 5 segundos
      } else {
        this.alertClass = 'alert-hide';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000); // Duración de la transición
      }
    }
  }

  closeAlert(){
    this.showAlert = false;
  }
}
