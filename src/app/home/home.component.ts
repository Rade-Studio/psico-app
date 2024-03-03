import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AttentionTrackingListComponent } from '../attention-tracking/attention-tracking-list/attention-tracking-list.component';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { BehaviorSubject, Observable, concat, concatMap, from, map, of, takeLast  } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { StudentRecord } from '../core/models/student-record.model';
import { AuthService } from '../core/services/auth.service';
import { AttentionTrackingService } from '../core/services/attention-tracking.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    RouterLink,
    AttentionTrackingListComponent,
    SearchBarComponent,
    NgxSpinnerModule,
    InfiniteScrollModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  authStateObs$ = () => inject(AuthService).authState$;

  _attentionTrackingService = inject(AttentionTrackingService);

  private _spinner = inject(NgxSpinnerService);

  attentionTracking$ = new BehaviorSubject<StudentRecord[]>([]);

  lastRecord: StudentRecord;

  userId = '';

  private recordsSpinner = 'recordListSpinner';
  private loading = false;

  constructor() {
  };

  ngOnInit() {
    const auth = getAuth();
    this._spinner.show(this.recordsSpinner);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this._attentionTrackingService.getAllAttentionTracking(user.uid).subscribe((data) => {
          this.attentionTracking$.next(data);
          this.lastRecord = data[data.length - 1];
          this._spinner.hide(this.recordsSpinner);
        });
      }
    });
  }

  onScroll(ev) {
    console.log(ev);
    this._spinner.show(this.recordsSpinner);
    this.loading = true;

    // Obtener ultimo registro del observable para luego traer a partir de ese en el servicio y concatenarlo con los actuales que tenemos dentro del observable
    this._attentionTrackingService.getAllAttentionTracking(this.userId, this.lastRecord).subscribe((data) => {
      this.attentionTracking$.next(this.attentionTracking$.getValue().concat(data));
      this.lastRecord = data[data.length - 1];
      this._spinner.hide(this.recordsSpinner);
      this.loading = false;
    });

    
}

  async searchByQuery(name: string) {
    if (!name) {
      this._spinner.show(this.recordsSpinner);
      this._attentionTrackingService.getAllAttentionTracking(this.userId).subscribe((data) => {
        this.attentionTracking$.next(data);
        this._spinner.hide(this.recordsSpinner);
      });
      return;
    }

    try {
      this._spinner.show(this.recordsSpinner);
      this._attentionTrackingService.searchByQuery(name, this.userId).subscribe((data) => {
        this.attentionTracking$.next(data);
        this._spinner.hide(this.recordsSpinner);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
