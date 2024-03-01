import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { Tracking } from '../../core/models/tracking.model';
import { StudentRecord } from '../../core/models/student-record.model';
import { ActivatedRoute } from '@angular/router';
import { AttentionTrackingService } from '../../core/services/attention-tracking.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { DataMutatatorService } from '../../core/services/DataMutatator.service';

@Component({
  selector: 'attention-tracking-details',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatCheckboxModule,
  ],
  templateUrl: './attention-tracking-details.component.html',
  styleUrl: './attention-tracking-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionTrackingDetailsComponent {

  @Input() set idTracking(value: string) {
    if (value) {
      this._trackingId = value;
      const atentionTrackingId: string = this._route.snapshot.params['id'];
      this.setValues(value, atentionTrackingId);
    }
  }
  
  private _route = inject(ActivatedRoute);

  private _attentionTrackingService = inject(AttentionTrackingService);

  private _spinner = inject(NgxSpinnerService);

  private _formBuilder = inject(FormBuilder);

  private _dataMutator = inject(DataMutatatorService);

  private _attentionTrackingId = '';

  private _trackingId = '';

  form = this._formBuilder.group({
    nombres: this._formBuilder.control({value: '', disabled: true}),
    documento: this._formBuilder.control({value: '', disabled: true}),
    fechaNacimiento: this._formBuilder.control({value: undefined, disabled: true}),
    grado: this._formBuilder.control({value: '', disabled: true}),
    edad: this._formBuilder.control({value: '', disabled: true}),
    paisOrigen: this._formBuilder.control({value: '', disabled: true}),
    ciudadOrigen: this._formBuilder.control({value: '', disabled: true}),
    sexo: this._formBuilder.control({value: '', disabled: true}),
    direccion: this._formBuilder.control({value: '', disabled: true}),
    barrio: this._formBuilder.control({value: '', disabled: true}),
    correoElectronico: this._formBuilder.control({value: '', disabled: true}),
    telefono: this._formBuilder.control({value: '', disabled: true}),
    eps: this._formBuilder.control({value: '', disabled: true}),
    viveConPadre: this._formBuilder.control({value: false, disabled: true}),
    viveConMadre: this._formBuilder.control({value: false, disabled: true}),
    estrato: this._formBuilder.control({value: '', disabled: true}),
    sisben: this._formBuilder.control({value: '', disabled: true}),
    nombreAcudiente: this._formBuilder.control({value: '', disabled: true}),
    documentoAcudiente: this._formBuilder.control({value: '', disabled: true}),
    ocupacionAcudiente: this._formBuilder.control({value: '', disabled: true}),
    telefonoAcudiente: this._formBuilder.control({value: '', disabled: true}),
    lugarTrabajoAcudiente: this._formBuilder.control({value: '', disabled: true}),
    parentescoAcudiente: this._formBuilder.control({value: '', disabled: true}),
    edadAcudiente: this._formBuilder.control({value: '', disabled: true}),
    nombrePadre: this._formBuilder.control({value: '', disabled: true}),
    documentoPadre: this._formBuilder.control({value: '', disabled: true}),
    nombreMadre: this._formBuilder.control({value: '', disabled: true}),
    documentoMadre: this._formBuilder.control({value: '', disabled: true}),
    academico: this._formBuilder.control({value: false, disabled: true}),
    emocional: this._formBuilder.control({value: false, disabled: true}),
    convivencial: this._formBuilder.control({value: false, disabled: true}),
    socioFamiliar: this._formBuilder.control({value: false, disabled: true}),
    evaluacion: this._formBuilder.control({value: '', disabled: true}),
  });

  _tracking: Tracking;

  _AttentionTracking: StudentRecord;

  private async setValues(trackingId: string, attentionTrackingId: string) {
    try {
      this._spinner.show();
      this._tracking = await this._attentionTrackingService.getTrackingById(attentionTrackingId, trackingId);
      const data = await this._attentionTrackingService.getAttentionTrackingById(attentionTrackingId);
      this._AttentionTracking = this._dataMutator.convertDataToTitleCase(data);
      const fechaNacimiento = (data.fechaNacimiento as Timestamp).toDate().toLocaleDateString('es-CO');
      this.form.setValue({
        nombres: this._AttentionTracking.nombres,
        documento: this._AttentionTracking.documento,
        fechaNacimiento: fechaNacimiento,
        grado: this._AttentionTracking.grado,
        edad: this._AttentionTracking.edad,
        paisOrigen: this._AttentionTracking.paisOrigen,
        ciudadOrigen: this._AttentionTracking.ciudadOrigen,
        sexo: this._AttentionTracking.sexo,
        direccion: this._AttentionTracking.direccionResidencia,
        barrio: this._AttentionTracking.barrio,
        correoElectronico: this._AttentionTracking.correoElectronico,
        telefono: this._AttentionTracking.telefono,
        eps: this._AttentionTracking.eps,
        viveConPadre: this._AttentionTracking.padre.viveConEstudiante,
        viveConMadre: this._AttentionTracking.madre.viveConEstudiante,
        estrato: this._AttentionTracking.estrato,
        sisben: this._AttentionTracking.sisben,
        nombreAcudiente: this._AttentionTracking.acudiente.nombre,
        documentoAcudiente: '',
        ocupacionAcudiente: this._AttentionTracking.acudiente.ocupacion,
        telefonoAcudiente: '',
        lugarTrabajoAcudiente: this._AttentionTracking.acudiente.lugarTrabajo,
        parentescoAcudiente: this._AttentionTracking.acudiente.parentesco,
        edadAcudiente: this._AttentionTracking.acudiente.edad,
        nombrePadre: this._AttentionTracking.padre.nombre,
        documentoPadre: this._AttentionTracking.padre.documento,
        nombreMadre: this._AttentionTracking.madre.nombre,
        documentoMadre: this._AttentionTracking.madre.documento,
        academico: this._tracking.academicos,
        emocional: this._tracking.emocionales,
        convivencial: this._tracking.conductuales,
        socioFamiliar: this._tracking.socioFamiliar,
        evaluacion: this._tracking.evaluacion,
      });
      this._spinner.hide();
    } catch (error) {
      console.error(error);
    }
  }

}
