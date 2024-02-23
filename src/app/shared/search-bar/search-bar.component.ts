import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, effect } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    RouterLink,
  ],
  template: `
      <div class="container" 
        fxLayout 
        fxLayout.xs="column"
        fxLayoutAlign="center" 
        fxLayoutGap="20px">
        <mat-form-field class="input-search">
            <mat-label>Buscar</mat-label>
            <input 
              matInput 
              #message 
              maxlength="256" 
              placeholder="Nombre del estudiante."
              [formControl]="control">
            <mat-hint align="start"><strong>Ingrese el nombre del estudiante para filtar.</strong> </mat-hint>
        </mat-form-field>
        <!-- Boton para agregar nuevo con icono estudiante -->
        <button mat-fab extended color="primary" [routerLink]="['attention-tracking/add']">
            <mat-icon>add</mat-icon> Nuevo registro
      </button>
    </div>
  `,
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  @Output() changeQuery = new EventEmitter<string>();

  control = new FormControl('');

  query = toSignal(
    this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
  );

  newQuery = computed(() => this.query());

  constructor() {
    effect(() => {
      this.changeQuery.emit(this.newQuery()!)
    });
  }
  
}

