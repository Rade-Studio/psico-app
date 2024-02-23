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
    edad: string;
    sisben: string;
    fechaNacimiento: string;
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
  }