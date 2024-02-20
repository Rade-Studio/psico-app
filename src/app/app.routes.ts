import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: HomeComponent
    },
    {
        path: 'log-in', 
        canActivate: [publicGuard],
        component: AuthComponent
    },
    // {
    //     path: 'estudiantes',
    //     canActivate: [authGuard],
    //     children: [
    //         {
    //             path: 'nuevo-estudiante',
    //             loadComponent: () => import(),
    //         },
    //         {
    //             path: 'editar-estudiante',
    //             loadComponent: () => import()
    //         }
    //     ]
    // }
];
