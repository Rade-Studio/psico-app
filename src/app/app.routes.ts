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
    // CRUD FICHA DE ATENCION Y SEGUIMIENTO
    {
        path: 'attention-tracking',
        canActivate: [authGuard],
        children: [
            {
                path: 'add',
                loadComponent: () => import('./components/attention-tracking/attention-tracking-form/attention-tracking-form.component').then(m => m.AttentionTrackingFormComponent)
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./components/attention-tracking/attention-tracking-form/attention-tracking-form.component').then(m => m.AttentionTrackingFormComponent)
            },
            {
                path: 'new-tracking',
                loadComponent: () => import('./components/attention-tracking/tracking/tracking.component').then(m => m.TrackingComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
