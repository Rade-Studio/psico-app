import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'attention-tracking-details',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './attention-tracking-details.component.html',
  styleUrl: './attention-tracking-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionTrackingDetailsComponent { }
