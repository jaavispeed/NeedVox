import { Component } from '@angular/core';
import NavbarComponent from '../../../shared/pages/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export default class DashboardPageComponent {

}
