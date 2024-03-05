import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import { DateFnsAdapter, DateFnsModule } from "@angular/material-date-fns-adapter";
import { es } from "date-fns/locale";
import { FlexLayoutModule } from '@angular/flex-layout';
import { AttentionTrackingService } from '../../core/services/attention-tracking.service';
import { Router, RouterLink } from '@angular/router';
import { StudentRecord, StudentRecordForm } from '../../core/models/student-record.model';
import { authStateObs$ } from '../../core/guards/auth.guard';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TrackingComponent } from '../tracking/tracking.component';
import { TrackingForm } from '../../core/models/tracking.model';
import { Observable } from 'rxjs';
import { DataMutatatorService } from '../../core/services/DataMutatator.service';
import { Timestamp } from '@angular/fire/firestore';
import { AutocompleteDataService } from '../../core/services/autocomplete-data.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';

export interface CreateAttentionTrackingForm {
  nombres: FormControl<string>;
  documento: FormControl<string>;
  grado: FormControl<string>;
  sexo: FormControl<string>;
  edad: FormControl<string>;
  sisben?: FormControl<string | undefined>;
  fechaNacimiento?: FormControl<Date | Timestamp>;
  ciudadOrigen: FormControl<string>;
  paisOrigen: FormControl<string>;
  direccionResidencia?: FormControl<string | undefined>;
  barrio?: FormControl<string | undefined>;
  telefono: FormControl<string>;
  estrato: FormControl<string>;
  correoElectronico: FormControl<string>;
  eps?: FormControl<string | undefined>;
  acudiente: FormGroup;
  padre: FormGroup;
  madre: FormGroup;
  caracteristicasPersonalidad: FormGroup;
  estadoSalud: FormGroup;
  seguimientoEducativos: FormGroup;
  seguimientoComportamental: FormGroup;
  eliminado: boolean,
  fechaActualizacion: Date;
  reverseSearchTokens?: string[];
  fechaCreacion: Date;
  userId: string;
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
  selector: 'attention-tracking-form',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: DateFnsAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTabsModule,
    FlexLayoutModule,
    RouterLink,
    TrackingComponent,
  ],
  templateUrl: './attention-tracking-form.component.html',
  styleUrl: './attention-tracking-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionTrackingFormComponent implements OnInit {

  private _formBuilder = inject(FormBuilder).nonNullable;

  private _attentionTrackingService = inject(AttentionTrackingService);

  private _router = inject(Router);

  private _snackBar = inject(MatSnackBar);

  private _dataMutatorService = inject(DataMutatatorService);

  private _autocompleteDataService = inject(AutocompleteDataService);

  private _spinner = inject(NgxSpinnerService);

  private _attentionTrackingId = '';

  trackingList$ = new Observable<TrackingForm[]>();

  panelOpenState = true;

  form: FormGroup;

  trackingTabIsDisabled = true;

  userId = "";

  epsData$ = this._autocompleteDataService.getEpsData(getAuth().currentUser?.uid);

  cityData$ = this._autocompleteDataService.getCitiesData(getAuth().currentUser?.uid);

  countryData$ = this._autocompleteDataService.getCountryData(getAuth().currentUser?.uid);

  neighborhoodData$ = this._autocompleteDataService.getNeighborhoodData(getAuth().currentUser?.uid);

  genders$ = this._autocompleteDataService.getGendersData(getAuth().currentUser?.uid);

  grades$ = this._autocompleteDataService.getGradesData(getAuth().currentUser?.uid);

  @Input() set id(value: string) {
    if (value) {
      this._attentionTrackingId = value;
      this.setFormValue(value);
    }
  }

  constructor() { 
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.getUserId();
  }

  async getUserId(): Promise<void> {
    this.userId = getAuth().currentUser?.uid as string;
  }

  async createOrUpdateAttentionTracking() {
    if (this.form.invalid) {
      this.openSnackBar('Por favor, complete los campos obligatorios. ❌');
      return;
    };

    try {
      this._spinner.show();
      if (!this._attentionTrackingId) {
        const doc = await this.createAttentionTracking();
        this.handleCreateSuccess(doc.id);
      } else {
        await this.updateAttentionTracking();
        this.openSnackBar('Registro actualizado exitosamente. ✅');
        
        this._spinner.hide();
      }
    } catch (error) {
      console.error('Error creating attention tracking:', error);
    }
  }

  async updateAttentionTracking() {
    const dataForm = this.form.value as StudentRecordForm;
    dataForm.fechaActualizacion = new Date();
    dataForm.fechaNacimiento = new Date(dataForm.fechaNacimiento as Date)

    await this._attentionTrackingService.updateAttentionTracking(this._attentionTrackingId, dataForm);
  }

  async createAttentionTracking() {
    const attentionTracking = this.getDataForm();
    const doc = await this._attentionTrackingService.createAttentionTracking(attentionTracking);
    return doc;
  }

  handleCreateSuccess(attentionTrackingId): void {
    const snackBarRef = this.openSnackBar('Registro creado exitosamente. ✅');
    snackBarRef.afterOpened().subscribe(() => {
      this._router.navigate(['/attention-tracking/edit', attentionTrackingId]);
      this._spinner.hide();
    });
  }

  getDataForm(): StudentRecordForm {
    const dataForm = this.form.value as StudentRecordForm
    return dataForm;
  }

  prepareDataForUpdate(dataForm: StudentRecordForm, fechaNacimiento: Date): StudentRecordForm {
    this.trackingList$ = this._attentionTrackingService.getAllTracking(this._attentionTrackingId);

    return {
      ...dataForm,
      fechaNacimiento: fechaNacimiento
    }
  }

  private async setFormValue(id: string) {
    try {

      this._spinner.show();
      this.trackingList$ = await this._attentionTrackingService.getAllTracking(id);
      const data = await this._attentionTrackingService.getAttentionTrackingById(id);
      const fechaNacimiento = (data.fechaNacimiento as Timestamp).toDate();
      const attentionTracking = this._dataMutatorService.convertDataToTitleCase(data) as StudentRecordForm;

      this.form.setValue(this.prepareDataForUpdate(data, fechaNacimiento));
      this.trackingTabIsDisabled = false;

    } catch (error) {
      console.error('Error getting attention tracking:', error);
    } finally {
      this._spinner.hide();
    }
  }

  goTo(elemento: HTMLElement): void {
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openSnackBar(message: string) {
    return this._snackBar.open(message, 'Cerrar', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    })
  }

  

  buildForm(): FormGroup {

    const personalDataGroup = this._formBuilder.group({
      nombres: ['', Validators.required],
      documento: ['', Validators.required],
      grado: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', Validators.required],
      sisben: [''],
      fechaNacimiento: [undefined, Validators.required],
      ciudadOrigen: ['', Validators.required],
      paisOrigen: ['', Validators.required],
    });

    const contactDataGroup = this._formBuilder.group({
      direccionResidencia: [''],
      barrio: [''],
      telefono: ['', Validators.required],
      estrato: ['', Validators.required],
      correoElectronico: ['', Validators.email],
      eps: [''],
    });

    const acudiente = this._formBuilder.group({
      nombre: [''],
      ocupacion: [''],
      lugarTrabajo: [''],
      edad: [''],
      parentesco: ['']
    });

    const padre = this._formBuilder.group({
      nombre: [''],
      documento: [''],
      ocupacion: [''],
      telefono: [''],
      viveConEstudiante: false,
    });

    const madre = this._formBuilder.group({
      nombre: [''],
      documento: [''],
      ocupacion: [''],
      telefono: [''],
      viveConEstudiante: false,
    });

    const personalityDataGroup = this._formBuilder.group({
      gradoActividad: [''],
      sentidoRespeto: [''],
      gradoTolerancia: [''],
      gradoSociabilidad: [''],
      gradoEmotividad: [''],
      principioAutoridad: [''],
      aceptacionErrores: [''],
      manejoAgresion: [''],
      sentidoResponsabilidad: [''],
      aceptacionOrientacion: [''],
      sentidoPertenencia: [''],
      aceptacionGrupal: [''],
      nivelExtroversion: [''],
      gradoColaboracion: [''],
    });

    const healthDataGroup = this._formBuilder.group({
      desmayos: false,
      insomnio: false,
      convulsiones: false,
      nerviosismo: false,
      alergias: false,
      gripasFrecuentes: false,
      otitis: false,
      colicos: false,
      cefaleas: false,
      asma: false,
      medicamentos: [''],
    });

    const seguimientoEducativos = this._formBuilder.group({
      areasPreferencias: [''],
      areasNoPreferidas: [''],
      preferenciasVocacionales: [''],
    });

    const seguimientoComportamental = this._formBuilder.group({
      tratoAfectuoso: false,
      puntualidad: false,
      participacion: false,
      asertividad: false,
      tolerancia: false,
      respeto: false,
      presentacionPersonal: false,
      empatia: false,
      colaboracion: false,
      problemasResueltos: [''],
    });

    return this._formBuilder.group<CreateAttentionTrackingForm>({
      nombres: personalDataGroup.controls.nombres,
      documento: personalDataGroup.controls.documento,
      grado: personalDataGroup.controls.grado,
      sexo: personalDataGroup.controls.sexo,
      edad: personalDataGroup.controls.edad,
      sisben: personalDataGroup.controls.sisben,
      fechaNacimiento: personalDataGroup.controls.fechaNacimiento,
      ciudadOrigen: personalDataGroup.controls.ciudadOrigen,
      paisOrigen: personalDataGroup.controls.paisOrigen,
      direccionResidencia: contactDataGroup.controls.direccionResidencia,
      barrio: contactDataGroup.controls.barrio,
      telefono: contactDataGroup.controls.telefono,
      estrato: contactDataGroup.controls.estrato,
      correoElectronico: contactDataGroup.controls.correoElectronico,
      eps: contactDataGroup.controls.eps,
      acudiente: acudiente,
      padre: padre,
      madre: madre,
      caracteristicasPersonalidad: personalityDataGroup,
      estadoSalud: healthDataGroup,
      seguimientoEducativos: seguimientoEducativos,
      seguimientoComportamental: seguimientoComportamental,
      eliminado: false,
      fechaActualizacion: new Date(),
      fechaCreacion: new Date(),
      userId: getAuth().currentUser?.uid as string,
      reverseSearchTokens: [],
    });
  }

  calcAge(event: any) {
    const date = new Date(event.value);
    const today = new Date();
    const edadMiliseconds = today.getTime() - date.getTime();
    this.form.controls['edad'].setValue(Math.floor((edadMiliseconds / (1000 * 60 * 60 * 24 * 365.25))).toString());
  }
}