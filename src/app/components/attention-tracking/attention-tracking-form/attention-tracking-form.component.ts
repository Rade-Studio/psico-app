import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tracking } from '../../../core/models/tracking.model';
import { Caretaker } from '../../../core/models/caretaker.model';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AttentionTrackingService } from '../../../core/services/attention-tracking.service';
import { Router, RouterLink } from '@angular/router';

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

  private _attentionTrackingId = '';

  panelOpenState = true;

  @Input() set id(value: string) {
    this._attentionTrackingId = value;
    this.setFormValue(this._attentionTrackingId);
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
      comunicacion: new FormControl(false),
      participacion: new FormControl(false),
      asertividad: new FormControl(false),
      tolerancia: new FormControl(false),
      respeto: new FormControl(false),
      empatia: new FormControl(false),
      colaboracion: new FormControl(false),
      problemasResueltos: new FormControl(''),
    })
  });

  constructor() { 
    console.log(this.form);
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
          nombre: '',
          ocupacion: '',
          lugarTrabajo: '',
          edad: '',
          parentesco: ''
        },
        padre: {
          nombre: '',
          documento: '',
          ocupacion: '',
          telefono: '',
          viveConEstudiante: false,
        },
        madre: {
          nombre: '',
          documento: '',
          ocupacion: '',
          telefono: '',
          viveConEstudiante: false,
        },
        caracteristicasPersonalidad: {
          gradoActividad: '',
          sentidoRespeto: '',
          gradoTolerancia: '',
          gradoSociabilidad: '',
          gradoEmotividad: '',
          principioAutoridad: '',
          aceptacionErrores: '',
          manejoAgresion: '',
          sentidoResponsabilidad: '',
          aceptacionOrientacion: '',
          sentidoPertenencia: '',
          aceptacionGrupal: '',
          nivelExtroversion: '',
          gradoColaboracion: '',
        },
        estadoSalud: {
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
          medicamentos: '',
        },
        seguimientoEducativos: {
          areasPreferencias: '',
          areasNoPreferidas: '',
          preferenciasVocacionales: '',
        },
        seguimientoComportamental: {
          tratoAfectuoso: false,
          comunicacion: false,
          participacion: false,
          asertividad: false,
          tolerancia: false,
          respeto: false,
          empatia: false,
          colaboracion: false,
          problemasResueltos: '',
        }
      })
    } catch (error) {
      console.error('Error getting attention tracking:', error);
    }
  }

  goTo(elemento: HTMLElement): void {
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}