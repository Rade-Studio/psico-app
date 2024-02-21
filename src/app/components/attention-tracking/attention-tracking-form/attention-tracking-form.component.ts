import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tracking } from '../../../core/models/tracking.model';
import { Caretaker } from '../../../core/models/caretaker.model';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';

export interface CreateAttentionTrackingForm {
  apellidos: FormControl<string>;
  nombres: FormControl<string>;
  documento: FormControl<string>;
  grado: FormControl<string>;
  sexo: FormControl<string>;
  edad: FormControl<string>;
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
    FlexLayoutModule,
  ],
  templateUrl: './attention-tracking-form.component.html',
  styleUrl: './attention-tracking-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionTrackingFormComponent {

  private _formBuilder = inject(FormBuilder).nonNullable;

  seguimientoAtencion: Tracking[] = [];

  panelOpenState = true;

  @Input() set id(id: string) {
    console.log(id);
  }

  form = this._formBuilder.group<CreateAttentionTrackingForm>({
    apellidos: this._formBuilder.control('', Validators.required),
    nombres: this._formBuilder.control('', Validators.required),
    documento: this._formBuilder.control('', Validators.required),
    grado: this._formBuilder.control('', Validators.required),
    sexo: this._formBuilder.control('', Validators.required),
    edad: this._formBuilder.control('', Validators.required),
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
      telefono: new FormControl('')
    }),
    madre: this._formBuilder.group({
      nombre: new FormControl(''),
      documento: new FormControl(''),
      ocupacion: new FormControl(''),
      telefono: new FormControl('')
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
      desmayos: new FormControl(false),
      insomnio: new FormControl(false),
      convulsiones: new FormControl(false),
      nerviosismo: new FormControl(false),
      alergias: new FormControl(false),
      gripasFrecuentes: new FormControl(false),
      otitis: new FormControl(false),
      colicos: new FormControl(false),
      cefaleas: new FormControl(false),
      asma: new FormControl(false),
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
}