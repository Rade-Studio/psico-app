import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentRecord } from '../../../core/models/student-record.model';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { AttentionTrackingService } from '../../../core/services/attention-tracking.service';

@Component({
  selector: 'attention-tracking-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    AsyncPipe,
  ],
  templateUrl: './attention-tracking-list.component.html',
  styleUrl: './attention-tracking-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AttentionTrackingListComponent {

  attentionTrackingService = inject(AttentionTrackingService);

  attentionTracking$ = this.attentionTrackingService.getAllAttentionTracking();


}