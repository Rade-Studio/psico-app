import { Timestamp } from "@angular/fire/firestore";

export interface Tracking extends TrackingForm {
    id: string;
}

export interface TrackingForm {
    academicos: string;
    conductuales: string;
    emocionales: string;
    socioFamiliar: string;
    motivoAtencion: string;
    evaluacion: string;
    fechaIngreso: Date | Timestamp;
}