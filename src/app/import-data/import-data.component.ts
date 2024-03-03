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
          var reverseSearchTokens = this._attentionTrackingService.generateReverseSearchTokens(record[0]);
          return {
            reverseSearchTokens: reverseSearchTokens,
            nombres: record[0],
            documento: record[1],
            grado: record[2],
            fechaNacimiento: new Date(record[3]),
            edad: record[4],
            sexo: record[5],
            ciudadOrigen: record[6],
            paisOrigen: record[7],
            direccionResidencia: record[8],
            barrio: record[9],
            telefono: record[11],
            correoElectronico: record[12],
            estrato: record[13],
            eps: record[14],
            sisben: record[15],
            acudiente: {
              nombres: record[16],
              edad: record[17],
              documento: record[18],
              telefono: record[19],
              parentesco: record[20],
              ocupacion: record[21],
              lugarTrabajo: record[22],
            },            
            padre: {
              nombres: record[23],
              documento: record[24],
              viveConEstudiante: record[25] === 'Si',
              ocupacion: '',
              lugarTrabajo: '',
              telefono: '',
            },
            madre: {
              nombres: record[26],
              documento: record[27],
              viveConEstudiante: record[28] === 'Si',
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
