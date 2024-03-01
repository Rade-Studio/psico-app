import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

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
    NgxSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Seguimento Express';

  private _authService = inject(AuthService);

  private _router = inject(Router);

  private _spinner = inject(NgxSpinnerService);

  isAuthenticated = false;

  constructor() {
    this._authService.authState$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  async logout() {

    this._spinner.show();
    await this._authService.logOut();
    this._router.navigateByUrl('/log-in');
    this._spinner.hide();

  }
}
