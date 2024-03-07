import { AsyncPipe, CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentRecord } from '../../core/models/student-record.model';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { AttentionTrackingService } from '../../core/services/attention-tracking.service';
import { Router, RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    UpperCasePipe,
  ],
  templateUrl: './attention-tracking-list.component.html',
  styleUrl: './attention-tracking-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AttentionTrackingListComponent {

  
  private _router = inject(Router);

  private _attentionTrackingService = inject(AttentionTrackingService);

  private _spinner = inject(NgxSpinnerService);

  private _snackBar = inject(MatSnackBar);
  
  @Input() attentionTracking$: Observable<StudentRecord[]>;

  constructor(public dialog: MatDialog) {}

  async delete(id: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: false,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this._spinner.show();
        await this._attentionTrackingService.deleteAttentionTracking(id);
        this._spinner.hide();

        this._snackBar.open("Registro eliminado.", 'Cerrar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      }
    });
  }

}