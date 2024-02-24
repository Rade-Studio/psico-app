import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { TrackingForm } from '../../core/models/tracking.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttentionTrackingService } from '../../core/services/attention-tracking.service';
import { Timestamp } from '@angular/fire/firestore';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

export interface CreateTrackingForm {
  academicos: FormControl<string>;
  conductuales: FormControl<string>;
  emocionales: FormControl<string>;
  socioFamiliar: FormControl<string>;
  motivoAtencion: FormControl<string>;
  evaluacion: FormControl<string>;
  fechaIngreso: FormControl<Date | Timestamp>;

}

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent implements OnInit  {

  private _route = inject(ActivatedRoute);

  private _attentionTrackingId = '';

  @Input() dataSource = new Observable<TrackingForm[]>();

  displayedColumns: string[] = ['fecha-registro', 'academicos', 'conductuales', 'emocionales', 'socio-familiar', 'motivo-atencion', 'evaluacion', 'acciones'];

  constructor(public dialog: MatDialog) {}

  openTrackingDialog(trackingId: string | undefined) {
    const dialogRef = this.dialog.open(TrackingFormComponent, {
      data: { Id: this._attentionTrackingId, trackingId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this._attentionTrackingId = this._route.snapshot.params['id'];
  }


}

@Component({
  selector: 'dialog-new-tracking',
  templateUrl: './tracking-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class TrackingFormComponent implements OnInit {

  private _attentionTrackingService = inject(AttentionTrackingService);
  
  private _formBuilder = inject(FormBuilder).nonNullable;

  private _trackingId = '';

  form = this._formBuilder.group<CreateTrackingForm>({
    academicos: new FormControl('', Validators.maxLength(256)),
    conductuales: new FormControl('', Validators.maxLength(256)),
    emocionales: new FormControl('', Validators.maxLength(256)),
    socioFamiliar: new FormControl('', Validators.maxLength(256)),
    motivoAtencion: new FormControl('', Validators.maxLength(1000)),
    evaluacion: new FormControl('', Validators.required),
    fechaIngreso: new FormControl(new Date(), Validators.required),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { Id: string, trackingId: string | undefined }) {
  }

  ngOnInit() {
    if (this.data.trackingId) {
      this.setFormValues(this.data.trackingId);
    }
  }

  private async setFormValues(trackingId: string) {
    const data = await this._attentionTrackingService.getTrackingById(this.data.Id, this.data.trackingId);
    const fechaIngreso = (data.fechaIngreso as Timestamp).toDate();
    this.form.setValue({
      academicos: data.academicos,
      conductuales: data.conductuales,
      emocionales: data.emocionales,
      socioFamiliar: data.socioFamiliar,
      motivoAtencion: data.motivoAtencion,
      evaluacion: data.evaluacion,
      fechaIngreso: fechaIngreso,
    });
  }

}

