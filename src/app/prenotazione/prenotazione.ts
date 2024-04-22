import { Time } from "@angular/common";

export class prenotazione{
    DataOra? : Date;
    Stato? : string;
    id_passeggero?: number;
    id_tassista?: number;
    partenza?: string;
    destinazione?: string;
}