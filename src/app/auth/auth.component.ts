import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Flex
import { FlexLayoutModule } from '@angular/flex-layout'

// Material
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from '../core/services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credential } from '../core/models/credential.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent { 
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  private authService = inject(AuthService);

  private router = inject(Router);

  private _snackBar = inject(MatSnackBar);

  private _spinner = inject(NgxSpinnerService);

  constructor() {}

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Este campo es requerido.'
        : 'Ingrese un correo electronico valido.'
    }

    return false;
  }

  async logIn(): Promise<void> {
    if (this.form.valid) {

      this._spinner.show();

      const credential: Credential = {
        email: this.form.value.email,
        password: this.form.value.password
      }

      try {
        await this.authService.loginWithEmailAndPassword(credential);
        this.router.navigateByUrl('/');
        this._spinner.hide();
        
        this.openSnackBar('Iniciaste session exitosamente ✅');
      } catch (error) {
        this.openSnackBar('Datos invalidos ❌')
        console.log(error);
      }

      
    }
  }

  openSnackBar(message: string) {
    return this._snackBar.open(message, 'Cerrar', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    })
  }
}
