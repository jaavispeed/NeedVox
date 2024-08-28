import { Component } from '@angular/core';
import HeaderComponent from "../../../shared/pages/header/header.component";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export default class DashboardPageComponent {

}
