import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { TrackingForm } from '../../core/models/tracking.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent {

  @Input() dataSource = new Observable<TrackingForm[]>();

  displayedColumns: string[] = ['fecha-registro', 'academicos', 'conductuales', 'emocionales', 'socio-familiar', 'motivo-atencion', 'evaluacion', 'acciones'];

}
