import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Item {
  name: string
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    MatToolbarModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'psico-app';

  private _authService = inject(AuthService);
  private _router = inject(Router);
  isAuthenticated = false;

  constructor() {
    this._authService.authState$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  logout() {
    this._authService.logOut();
    this._router.navigate(['/log-in']);
  }
}
