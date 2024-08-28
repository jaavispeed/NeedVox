import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch:'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/pages/landing-page/landing-page.component')
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
