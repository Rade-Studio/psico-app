import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent { }
