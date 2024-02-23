export interface Tracking extends TrackingForm {
    id: string;
}

export interface TrackingForm {
    acadamicos: string;
    conductuales: string;
    emocionales: string;
    socioFamiliar: string;
    motivoAtencion: string;
    evaluacion: string;
    fechaIngreso: Date;
}