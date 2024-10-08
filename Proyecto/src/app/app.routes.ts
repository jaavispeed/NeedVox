// import { Routes } from '@angular/router';
// import IndexComponent from './index/pages/index/index.component';
// import DashboardPageComponent from './dashboard/pages/dashboard-page/dashboard-page.component';
// import ProductComponent from './products/pages/product/product.component';
// import { CrudProductComponent } from './products/pages/crud-product/crud-product.component';
// import LoginPageComponent from './auth/pages/login-page/login-page.component';
// import { AuthGuard } from './auth/guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: '',  // Ruta raíz
//     redirectTo: '/home',  // Redirige a la página de inicio
//     pathMatch: 'full'  // Asegura que coincida con la ruta completa
//   },
//   {
//     path: 'home',  // Ruta para la página de inicio
//     loadComponent: () => import('./home/pages/landing-page/landing-page.component')  // Carga el componente de la página de inicio de manera diferida
//   },
//   {
//     path: 'login',  // Ruta para la página de login
//     component: LoginPageComponent  // Asocia el componente de login a esta ruta
//   },
//   {
//     path: 'index',  // Ruta para el índice
//     component: IndexComponent,  // Asocia el componente de índice
//     children: [  // Rutas hijas dentro de la ruta de índice
//       {
//         path: '',  // Ruta vacía dentro de 'index'
//         redirectTo: 'dashboard',  // Redirige a la página del dashboard
//         pathMatch: 'full'  // Asegura que coincida con la ruta completa
//       },
//       {
//         path: 'dashboard',  // Ruta para el dashboard
//         component: DashboardPageComponent,  // Asocia el componente del dashboard
//         canActivate: [AuthGuard], // Protege la ruta con AuthGuard, requiere autenticación
//       },
//       {
//         path: 'productos',  // Ruta para productos
//         component: ProductComponent,  // Asocia el componente de productos
//         canActivate: [AuthGuard], // Protege la ruta con AuthGuard
//       },
//       {
//         path: 'crud-productos',  // Ruta para el CRUD de productos
//         component: CrudProductComponent,  // Asocia el componente para CRUD de productos
//         canActivate: [AuthGuard], // Protege la ruta con AuthGuard
//       }
//     ]
//   },
//   {
//     path: 'navbar',  // Ruta para la barra de navegación
//     loadComponent: () => import('./shared/pages/navbar/navbar.component')  // Carga el componente de la barra de navegación de manera diferida
//   },
//   {
//     path: '404',  // Ruta para la página 404 (no encontrado)
//     loadComponent: () => import('./shared/pages/error404/error404.component')  // Carga el componente de error 404 de manera diferida
//   },
//   {
//     path: '**',  // Ruta comodín para manejar cualquier otra ruta no definida
//     redirectTo: '404'  // Redirige a la página 404 para rutas no encontradas
//   }
// ];

import { Routes } from '@angular/router';
import IndexComponent from './index/pages/index/index.component';
import DashboardPageComponent from './dashboard/pages/dashboard-page/dashboard-page.component';
import ProductComponent from './products/pages/product/product.component';
import { CrudProductComponent } from './products/pages/crud-product/crud-product.component';
import LoginPageComponent from './auth/pages/login-page/login-page.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/pages/landing-page/landing-page.component')
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'index',
    component: IndexComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        canActivate: [AuthGuard] // Protegido por AuthGuard
      },
      {
        path: 'productos',
        component: ProductComponent,
        canActivate: [AuthGuard] // Protegido por AuthGuard
      },
      {
        path: 'crud-productos',
        component: CrudProductComponent,
        canActivate: [AuthGuard] // Protegido por AuthGuard
      }
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

