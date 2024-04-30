import { Time } from "@angular/common";

export class prenotazione{
    id?: number;
    dataOra?: string[];
    stato? : string;
    idPasseggero?: number;
    idTassista?: number;
    km?: number;
    costoXkm?: number;
    costoTratta?: number;
    partenza?: string;
    destinazione?: string;
}