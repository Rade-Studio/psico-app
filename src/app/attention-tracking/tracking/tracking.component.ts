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
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideNativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { es } from 'date-fns/locale';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

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

  private _attentionTrackingService = inject(AttentionTrackingService);

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

  deleteTracking(trackingId: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._attentionTrackingService.deleteTracking(this._attentionTrackingId, trackingId);
      }
    });
  }

  ngOnInit() {
    this._attentionTrackingId = this._route.snapshot.params['id'];
  }


}

export const DATE_FORMAT = {
  parse: { dateInput: 'dd/MM/yyyy'},
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'yyyy'
  }
};

@Component({
  selector: 'dialog-new-tracking',
  templateUrl: './tracking-form.component.html',
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: DateFnsAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
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
    MatDatepickerModule,
    FlexLayoutModule,
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

  constructor(
    public dialogRef: MatDialogRef<TrackingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Id: string, trackingId: string | undefined }
    ) {
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

  async save() {
    if (this.form.invalid) {
      return;
    }

    const tracking: TrackingForm = {
      academicos: this.form.value.academicos,
      conductuales: this.form.value.conductuales,
      emocionales: this.form.value.emocionales,
      socioFamiliar: this.form.value.socioFamiliar,
      motivoAtencion: this.form.value.motivoAtencion,
      evaluacion: this.form.value.evaluacion,
      fechaIngreso: this.form.value.fechaIngreso,
    };

    if (this.data.trackingId) {
      await this._attentionTrackingService.updateTracking(this.data.Id, this.data.trackingId, tracking);
    } else {
      await this._attentionTrackingService.createTracking(this.data.Id, tracking);
    }

    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

