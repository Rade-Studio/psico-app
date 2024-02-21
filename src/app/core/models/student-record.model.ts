import { BehavioralFollowUp } from "./behavioral-follow-up.model";
import { Caretaker } from "./caretaker.model";
import { EducationalFollowUp } from "./educational-follow-up.model";
import { FamilyMember } from "./family-member.model";
import { HealthStatus } from "./health-status.model";
import { PersonalityTraits } from "./personality-traits.model";
import { Tracking } from "./tracking.model";


export interface StudentRecord {
    id: string;
    apellidos: string;
    nombres: string;
    documento: string;
    grado: string;
    sexo: string;
    edad: number;
    fechaNacimiento: string;
    ciudadOrigen: string;
    paisOrigen: string;
    direccionResidencia: string;
    barrio: string;
    telefono: string;
    estrato: string;
    correoElectronico: string;
    eps: string;
    acudiente: Caretaker;
    padre: FamilyMember;
    madre: FamilyMember;
    caracteristicasPersonalidad: PersonalityTraits;
    estadoSalud: HealthStatus;
    seguimientosEducativos: EducationalFollowUp;
    seguimientoComportamental: BehavioralFollowUp;
    seguimientoAtencion: Tracking[];
    fechaCreacion: Date;
    fechaActualizacion: Date;
  }