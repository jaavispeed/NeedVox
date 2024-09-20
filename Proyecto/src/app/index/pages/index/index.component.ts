import { Component } from '@angular/core';
import NavbarComponent from '../../../shared/pages/navbar/navbar.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export default class IndexComponent {

}
