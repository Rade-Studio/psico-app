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
import {provideNativeDateAdapter} from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AttentionTrackingService } from '../../../core/services/attention-tracking.service';
import { Router, RouterLink } from '@angular/router';
import { StudentRecord, StudentRecordForm } from '../../../core/models/student-record.model';
import { authStateObs$ } from '../../../core/guards/auth.guard';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface CreateAttentionTrackingForm {
  apellidos: FormControl<string>;
  nombres: FormControl<string>;
  documento: FormControl<string>;
  grado: FormControl<string>;
  sexo: FormControl<string>;
  edad: FormControl<string>;
  sisben?: FormControl<string | undefined>;
  fechaNacimiento?: FormControl<string | undefined>;
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
}

@Component({
  selector: 'attention-tracking-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
    MatTabsModule,
    FlexLayoutModule,
    RouterLink,
  ],
  templateUrl: './attention-tracking-form.component.html',
  styleUrl: './attention-tracking-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionTrackingFormComponent {

  private _formBuilder = inject(FormBuilder).nonNullable;

  private _attentionTrackingService = inject(AttentionTrackingService);

  private _router = inject(Router);

  private _snackBar = inject(MatSnackBar);

  private _attentionTrackingId = '';

  panelOpenState = true;

  trackingTabIsDisabled = true;

  userId = "";

  @Input() set id(value: string) {
    if (value) {
      this._attentionTrackingId = value;
      this.setFormValue(value);
    }
  }

  form = this._formBuilder.group<CreateAttentionTrackingForm>({
    apellidos: this._formBuilder.control('', Validators.required),
    nombres: this._formBuilder.control('', Validators.required),
    documento: this._formBuilder.control('', Validators.required),
    grado: this._formBuilder.control('', Validators.required),
    sexo: this._formBuilder.control('', Validators.required),
    edad: this._formBuilder.control('', Validators.required),
    sisben: this._formBuilder.control(''),
    fechaNacimiento: this._formBuilder.control(''),
    ciudadOrigen: this._formBuilder.control('', Validators.required),
    paisOrigen: this._formBuilder.control('', Validators.required),
    direccionResidencia: this._formBuilder.control(''),
    barrio: this._formBuilder.control(''),
    telefono: this._formBuilder.control('', Validators.required),
    estrato: this._formBuilder.control('', Validators.required),
    correoElectronico: this._formBuilder.control('', [Validators.required, Validators.email]),
    eps: this._formBuilder.control(''),
    acudiente: this._formBuilder.group({
      nombre: new FormControl(''),
      ocupacion: new FormControl(''),
      lugarTrabajo: new FormControl(''),
      edad: new FormControl(''),
      parentesco: new FormControl('')
    }),
    padre: this._formBuilder.group({
      nombre: new FormControl(''),
      documento: new FormControl(''),
      ocupacion: new FormControl(''),
      telefono: new FormControl(''),
      viveConEstudiante: false,
    }),
    madre: this._formBuilder.group({
      nombre: new FormControl(''),
      documento: new FormControl(''),
      ocupacion: new FormControl(''),
      telefono: new FormControl(''),
      viveConEstudiante: false,
    }),
    caracteristicasPersonalidad: this._formBuilder.group({
      gradoActividad: new FormControl(''),
      sentidoRespeto: new FormControl(''),
      gradoTolerancia: new FormControl(''),
      gradoSociabilidad: new FormControl(''),
      gradoEmotividad: new FormControl(''),
      principioAutoridad: new FormControl(''),
      aceptacionErrores: new FormControl(''),
      manejoAgresion: new FormControl(''),
      sentidoResponsabilidad: new FormControl(''),
      aceptacionOrientacion: new FormControl(''),
      sentidoPertenencia: new FormControl(''),
      aceptacionGrupal: new FormControl(''),
      nivelExtroversion: new FormControl(''),
      gradoColaboracion: new FormControl(''),
    }),
    estadoSalud: this._formBuilder.group({
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
      medicamentos: new FormControl(''),
    }),
    seguimientoEducativos: this._formBuilder.group({
      areasPreferencias: new FormControl(''),
      areasNoPreferidas: new FormControl(''),
      preferenciasVocacionales: new FormControl(''),
    }),
    seguimientoComportamental: this._formBuilder.group({
      tratoAfectuoso: new FormControl(false),
      puntualidad: new FormControl(false),
      participacion: new FormControl(false),
      asertividad: new FormControl(false),
      tolerancia: new FormControl(false),
      respeto: new FormControl(false),
      presentacionPersonal: new FormControl(false),
      empatia: new FormControl(false),
      colaboracion: new FormControl(false),
      problemasResueltos: new FormControl(''),
    })
  });

  constructor() { 
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async createOrUpdateAttentionTracking() {
    if (this.form.invalid) return;

    try {
      if (!this._attentionTrackingId) {
        console.log('create');
        const doc = await this.createAttentionTracking();
        const snackBarRef = this.openSnackBar('Registro creado exitosamente. ✅');

        snackBarRef.afterDismissed().subscribe(() => {
          this._router.navigate(['/attention-tracking/edit', doc.id]);
        })
      } else {
        console.log('update');
        await this.updateAttentionTracking();
        
        this.openSnackBar('Registro actualizado exitosamente. ✅');
      }
    } catch (error) {
      console.error('Error creating attention tracking:', error);
    }
  }

  async updateAttentionTracking() {
    const attentionTracking = this.form.value as StudentRecordForm;
    attentionTracking.fechaActualizacion = new Date();
    const doc = await this._attentionTrackingService.updateAttentionTracking(this._attentionTrackingId, attentionTracking);
  }

  async createAttentionTracking() {
    const attentionTracking = this.form.value as StudentRecordForm;
    attentionTracking.fechaCreacion = new Date();
    attentionTracking.fechaActualizacion = new Date();
    attentionTracking.userId = this.userId;
    const doc = await this._attentionTrackingService.createAttentionTracking(attentionTracking);
    return doc;
  }

  private async setFormValue(id: string) {
    try {
      const attentionTracking = await this._attentionTrackingService.getAttentionTrackingById(id);
      this.form.setValue({
        apellidos: attentionTracking.apellidos,
        nombres: attentionTracking.nombres,
        documento: attentionTracking.documento || '',
        grado: attentionTracking.grado || '',
        sexo: attentionTracking.sexo || '',
        edad: attentionTracking.edad || '',
        sisben: attentionTracking.sisben || '',
        fechaNacimiento: attentionTracking.fechaNacimiento || '',
        ciudadOrigen: attentionTracking.ciudadOrigen || '',
        paisOrigen: attentionTracking.paisOrigen || '',
        direccionResidencia: attentionTracking.direccionResidencia || '',
        barrio: attentionTracking.barrio || '',
        telefono: attentionTracking.telefono || '',
        estrato: attentionTracking.estrato || '',
        correoElectronico: attentionTracking.correoElectronico || '',
        eps: attentionTracking.eps || '',
        acudiente: {
          nombre: attentionTracking.acudiente.nombre || '',
          ocupacion: attentionTracking.acudiente.ocupacion || '',
          lugarTrabajo: attentionTracking.acudiente.lugarTrabajo || '',
          edad: attentionTracking.acudiente.edad || '',
          parentesco: attentionTracking.acudiente.parentesco || ''
        },
        padre: {
          nombre: attentionTracking.padre.nombre || '',
          documento: attentionTracking.padre.documento || '',
          ocupacion: attentionTracking.padre.ocupacion || '',
          telefono: attentionTracking.padre.telefono || '',
          viveConEstudiante: attentionTracking.padre.viveConEstudiante || false,
        },
        madre: {
          nombre: attentionTracking.madre.nombre || '',
          documento: attentionTracking.madre.documento || '',
          ocupacion: attentionTracking.madre.ocupacion || '',
          telefono: attentionTracking.madre.telefono || '',
          viveConEstudiante: attentionTracking.madre.viveConEstudiante || false,
        },
        caracteristicasPersonalidad: {
          gradoActividad: attentionTracking.caracteristicasPersonalidad.gradoActividad || '',
          sentidoRespeto: attentionTracking.caracteristicasPersonalidad.sentidoRespeto || '',
          gradoTolerancia: attentionTracking.caracteristicasPersonalidad.gradoTolerancia || '',
          gradoSociabilidad: attentionTracking.caracteristicasPersonalidad.gradoSociabilidad || '',
          gradoEmotividad: attentionTracking.caracteristicasPersonalidad.gradoEmotividad || '',
          principioAutoridad: attentionTracking.caracteristicasPersonalidad.principioAutoridad || '',
          aceptacionErrores: attentionTracking.caracteristicasPersonalidad.aceptacionErrores || '',
          manejoAgresion: attentionTracking.caracteristicasPersonalidad.manejoAgresion || '',
          sentidoResponsabilidad: attentionTracking.caracteristicasPersonalidad.sentidoResponsabilidad || '',
          aceptacionOrientacion: attentionTracking.caracteristicasPersonalidad.aceptacionOrientacion || '',
          sentidoPertenencia: attentionTracking.caracteristicasPersonalidad.sentidoPertenencia || '',
          aceptacionGrupal: attentionTracking.caracteristicasPersonalidad.aceptacionGrupal || '',
          nivelExtroversion: attentionTracking.caracteristicasPersonalidad.nivelExtroversion || '',
          gradoColaboracion: attentionTracking.caracteristicasPersonalidad.gradoColaboracion || '',
        },
        estadoSalud: {
          desmayos: attentionTracking.estadoSalud.desmayos || false,
          insomnio: attentionTracking.estadoSalud.insomnio || false,
          convulsiones: attentionTracking.estadoSalud.convulsiones || false,
          nerviosismo: attentionTracking.estadoSalud.nerviosismo || false,
          alergias: attentionTracking.estadoSalud.alergias || false,
          gripasFrecuentes: attentionTracking.estadoSalud.gripasFrecuentes || false,
          otitis: attentionTracking.estadoSalud.otitis || false,
          colicos: attentionTracking.estadoSalud.colicos || false,
          cefaleas: attentionTracking.estadoSalud.cefaleas || false,
          asma: attentionTracking.estadoSalud.asma || false,
          medicamentos: attentionTracking.estadoSalud.medicamentos || '',
        },
        seguimientoEducativos: {
          areasPreferencias: attentionTracking.seguimientoEducativos.areasPreferencias || '',
          areasNoPreferidas: attentionTracking.seguimientoEducativos.areasNoPreferidas || '',
          preferenciasVocacionales: attentionTracking.seguimientoEducativos.preferenciasVocacionales || '',
        },
        seguimientoComportamental: {
          tratoAfectuoso: attentionTracking.seguimientoComportamental.tratoAfectuoso || false,
          puntualidad: attentionTracking.seguimientoComportamental.puntualidad || false,
          participacion: attentionTracking.seguimientoComportamental.participacion || false,
          asertividad: attentionTracking.seguimientoComportamental.asertividad || false,
          tolerancia: attentionTracking.seguimientoComportamental.tolerancia || false,
          respeto: attentionTracking.seguimientoComportamental.respeto || false,
          presentacionPersonal: attentionTracking.seguimientoComportamental.presentacionPersonal || false,
          empatia: attentionTracking.seguimientoComportamental.empatia || false,
          colaboracion: attentionTracking.seguimientoComportamental.colaboracion || false,
          problemasResueltos: attentionTracking.seguimientoComportamental.problemasResueltos || '',
        }
      })
      this.trackingTabIsDisabled = false;
    } catch (error) {
      console.error('Error getting attention tracking:', error);
    }
  }

  goTo(elemento: HTMLElement): void {
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openSnackBar(message: string) {
    return this._snackBar.open(message, 'Cerrar', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    })
  }
}