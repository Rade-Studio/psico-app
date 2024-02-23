import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { StudentRecord } from '../core/models/student-record.model';
import { AuthService } from '../core/services/auth.service';
import { AttentionTrackingService } from '../core/services/attention-tracking.service';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  authStateObs$ = () => inject(AuthService).authState$;

  _attentionTrackingService = inject(AttentionTrackingService);

  attentionTracking$ = new Observable<StudentRecord[]>();

  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.attentionTracking$ = this._attentionTrackingService.getAllAttentionTracking(user.uid);
      }
    });
  };

  async searchByQuery(name: string) {
    console.log('searchByQuery', name);
    const auth = getAuth();
    let userId = "";
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
      }
    });

    try {
      this.attentionTracking$ = this._attentionTrackingService.searchByQuery(name, userId);
    } catch (error) {
      console.error(error);
    }
  }
}
