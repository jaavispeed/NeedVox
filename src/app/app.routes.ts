import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch:'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login-page/login-page.component')
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register-page/register-page.component')
  }
];
