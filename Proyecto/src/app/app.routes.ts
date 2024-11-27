import { Routes } from '@angular/router';
import IndexComponent from './index/pages/index/index.component';
import DashboardPageComponent from './dashboard/pages/dashboard-page/dashboard-page.component';
import { CrudProductComponent } from './products/pages/crud-product/crud-product.component';
import LoginPageComponent from './auth/pages/login-page/login-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/noAuth.guard';
import { VentaComponent } from './venta/pages/venta/venta.component';
import { UsuariosComponent } from './admin/pages/totalusers/total-users/usuarios.component';
import { HistorialComponent } from './historial/pages/historial/historial.component';
import { TotalProductosComponent } from './admin/pages/totalusers/total-users/total-productos.component'; // Verifica que la ruta sea correcta
import { ComprasComponent } from './compras/pages/compras/compras.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/pages/landing-page/landing-page.component'),
    canActivate: [NoAuthGuard]
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
        loadComponent: () => import('./products/pages/crud-product/crud-product.component').then(m => m.CrudProductComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'venta',
        loadComponent: () => import('./venta/pages/venta/venta.component').then(m =>m.VentaComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'historial',
        loadComponent: () => import('./historial/pages/historial/historial.component').then(m=>m.HistorialComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'total-users',
        loadComponent: () => import('./admin/pages/totalusers/total-users/usuarios.component').then(m=>m.UsuariosComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'total-productos', // Ruta para TotalProductosComponent
        loadComponent: () => import('./admin/pages/totalusers/total-users/total-productos.component').then(m=>m.TotalProductosComponent),
        canActivate: [AuthGuard] // Protege la ruta con AuthGuard
      },
      {
        path:'compras',
        loadComponent: () => import('./compras/pages/compras/compras.component').then(m=>m.ComprasComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.component').then(m=>m.PerfilComponent),
        canActivate: [AuthGuard] // Protegemos la ruta para usuarios autenticados
      }
    ]
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
