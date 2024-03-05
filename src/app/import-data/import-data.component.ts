import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxCsvParserModule, NgxCsvParser } from 'ngx-csv-parser';
import { StudentRecordForm, StudentRecordImport } from '../core/models/student-record.model';
import { MatInputModule } from '@angular/material/input';
import { AttentionTrackingService } from '../core/services/attention-tracking.service';

@Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [
    CommonModule,
    NgxCsvParserModule,
    MatInputModule,
  ],
  templateUrl: './import-data.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportDataComponent {

  private _csvParser = inject(NgxCsvParser);

  private _attentionTrackingService = inject(AttentionTrackingService);

  private recordsToImport: StudentRecordImport[] = [];

  importData(event: any) {
    const file = event.target.files[0];

    console.log('Cargando archivo');
    this._csvParser.parse(file, { header: false, delimiter: ',', encoding: 'utf8' })
      .subscribe((result: any[]) => {
        const models = result.map((record) => {
          var reverseSearchTokens = this._attentionTrackingService.generateReverseSearchTokens((record[0] as string).toLowerCase().trim());
          return {
            reverseSearchTokens: reverseSearchTokens,
            nombres: (record[0] as string).toLowerCase().trim(),
            documento: (record[1] as string).toLowerCase().trim(),
            grado: (record[2] as string).toLowerCase().trim(),
            fechaNacimiento: new Date(record[3]),
            edad: (record[4] as string).toLowerCase().trim(),
            sexo: (record[5] as string).toLowerCase().trim(),
            ciudadOrigen: (record[6] as string).toLowerCase().trim(),
            paisOrigen: (record[7] as string).toLowerCase().trim(),
            direccionResidencia: (record[8] as string).toLowerCase().trim(),
            barrio: (record[9] as string).toLowerCase().trim(),
            telefono: (record[10] as string).toLowerCase().trim(),
            correoElectronico: (record[11] as string).toLowerCase().trim(),
            estrato: (record[12] as string).toLowerCase().trim(),
            eps: (record[13] as string).toLowerCase().trim(),
            sisben: (record[14] as string).toLowerCase().trim(),
            acudiente: {
              nombres: (record[16] as string).toLowerCase().trim(),
              edad: (record[17] as string).toLowerCase().trim(),
              documento: (record[18] as string).toLowerCase().trim(),
              telefono: (record[19] as string).toLowerCase().trim(),
              parentesco: (record[20] as string).toLowerCase().trim(),
              ocupacion: (record[21] as string).toLowerCase().trim(),
              lugarTrabajo: (record[22] as string).toLowerCase().trim(),
            },            
            padre: {
              nombres: (record[23] as string).toLowerCase().trim(),
              documento: (record[24] as string).toLowerCase().trim(),
              viveConEstudiante: (record[25] as string).toLowerCase().trim() === 'si',
              ocupacion: '',
              lugarTrabajo: '',
              telefono: '',
            },
            madre: {
              nombres: (record[26] as string).toLowerCase().trim(),
              documento: (record[27] as string).toLowerCase().trim(),
              viveConEstudiante: (record[28] as string).toLowerCase().trim() === 'si',
              ocupacion: '',
              lugarTrabajo: '',
              telefono: '',
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
              puntualidad: false,
              participacion: false,
              asertividad: false,
              tolerancia: false,
              respeto: false,
              presentacionPersonal: false,
              empatia: false,
              colaboracion: false,
              problemasResueltos: false,
            },
            userId: record[29],
            fechaActualizacion: new Date(),
            fechaCreacion: new Date(),
            eliminado: false,
          };
        });

        this._attentionTrackingService.createManyAttentionTracking(models);

      });
  }

}
