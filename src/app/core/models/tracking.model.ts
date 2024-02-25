import { Timestamp } from "@angular/fire/firestore";

export interface Tracking extends TrackingForm {
    id: string;
}

export interface TrackingForm {
    academicos: boolean;
    conductuales: boolean;
    emocionales: boolean;
    socioFamiliar: boolean;
    motivoAtencion: string;
    evaluacion: string;
    fechaIngreso: Date | Timestamp | string;
}