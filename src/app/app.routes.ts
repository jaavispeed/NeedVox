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
  },
  {
    path: 'header',
    loadComponent: () => import('./shared/pages/header/header.component')
  },
  {
    path:'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard-page/dashboard-page.component')

  },
  {
    path:'404',
    loadComponent: () => import('./shared/pages/error404/error404.component')

  },
  {
    path:'**',
    redirectTo: '404'
  }

];
