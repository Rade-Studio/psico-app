import { Timestamp } from "@angular/fire/firestore";
import { BehavioralFollowUp } from "./behavioral-follow-up.model";
import { Caretaker } from "./caretaker.model";
import { EducationalFollowUp } from "./educational-follow-up.model";
import { FamilyMember } from "./family-member.model";
import { HealthStatus } from "./health-status.model";
import { PersonalityTraits } from "./personality-traits.model";

export interface StudentRecord extends StudentRecordForm {
  id: string;
}

export interface StudentRecordForm {
    reverseSearchTokens: string[];
    nombres: string;
    documento: string;
    grado: string;
    sexo: string;
    edad: string;
    sisben: string;
    fechaNacimiento: Date | Timestamp;
    ciudadOrigen: string;
    paisOrigen: string;
    direccionResidencia: string;
    barrio: string;
    telefono: string;
    estrato: string;
    correoElectronico: string;
    eps: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    userId: string;
    acudiente: Caretaker;
    padre: FamilyMember;
    madre: FamilyMember;
    caracteristicasPersonalidad: PersonalityTraits;
    estadoSalud: HealthStatus;
    seguimientoEducativos: EducationalFollowUp;
    seguimientoComportamental: BehavioralFollowUp;
    eliminado: boolean;
  }

  export interface StudentRecordImport {
    reverseSearchTokens: string[];
    nombres: string;
    documento: string;
    grado: string;
    sexo: string;
    edad: string;
    sisben: string;
    fechaNacimiento: Date | Timestamp;
    ciudadOrigen: string;
    paisOrigen: string;
    direccionResidencia: string;
    barrio: string;
    telefono: string;
    estrato: string;
    correoElectronico: string;
    eps: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    userId: string;
    acudiente: Caretaker;
    padre: FamilyMember;
    madre: FamilyMember;
    eliminado: boolean;
  }