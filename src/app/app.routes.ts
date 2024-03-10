import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';

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
    // CRUD FICHA DE ATENCION Y SEGUIMIENTO
    {
        path: 'attention-tracking',
        canActivate: [authGuard],
        children: [
            {
                path: 'add',
                loadComponent: () => import('./attention-tracking/attention-tracking-form/attention-tracking-form.component').then(m => m.AttentionTrackingFormComponent)
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./attention-tracking/attention-tracking-form/attention-tracking-form.component').then(m => m.AttentionTrackingFormComponent)
            },
            {
                path: 'new-tracking',
                loadComponent: () => import('./attention-tracking/tracking/tracking.component').then(m => m.TrackingComponent)
            },
            {
                path: 'ticket/:id/tracking/:idTracking',
                loadComponent: () => import('./attention-tracking/attention-tracking-details/attention-tracking-details.component').then(m => m.AttentionTrackingDetailsComponent)
            }
        ]
    },
    // {
    //     path: 'import-data',
    //     canActivate: [authGuard],
    //     loadComponent: () => import('./import-data/import-data.component').then(m => m.ImportDataComponent)
    // },
    {
        path: '**',
        redirectTo: ''
    }
];
