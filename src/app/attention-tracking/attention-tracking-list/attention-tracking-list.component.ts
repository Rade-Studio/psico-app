import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentRecord } from '../../core/models/student-record.model';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { AttentionTrackingService } from '../../core/services/attention-tracking.service';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

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
    DatePipe,
    RouterLink,
  ],
  templateUrl: './attention-tracking-list.component.html',
  styleUrl: './attention-tracking-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AttentionTrackingListComponent {

  
  @Input() attentionTracking$: Observable<StudentRecord[]>;


}