import { Routes } from '@angular/router';
import IndexComponent from './index/pages/index/index.component';
import DashboardPageComponent from './dashboard/pages/dashboard-page/dashboard-page.component';
import { CrudProductComponent } from './products/pages/crud-product/crud-product.component';
import LoginPageComponent from './auth/pages/login-page/login-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/noAuth.guard';
import { VentaComponent } from './venta/pages/venta/venta.component';
import { UsuariosComponent } from './admin/pages/totalusers/total-users/usuarios.component'; // Ruta actualizada
import { HistorialComponent } from './historial/pages/historial/historial.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/pages/landing-page/landing-page.component'),
    canActivate: [NoAuthGuard]  // Protege la página de inicio con NoAuthGuard
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'index',
    component: IndexComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'crud-productos',
        component: CrudProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'venta',
        component: VentaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'historial',
        component: HistorialComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'total-users', // Ruta para acceder al componente de usuarios
        component: UsuariosComponent,
        canActivate: [AuthGuard] // Solo accesible por usuarios autenticados
      },
    ]
  },
  {
    path: 'navbar',
    loadComponent: () => import('./shared/pages/navbar/navbar.component')
  },
  {
    path: '404',
    loadComponent: () => import('./shared/pages/error404/error404.component')
  },
  {
    path: '**',
    redirectTo: '404'
  }
];