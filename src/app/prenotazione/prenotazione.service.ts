import { Injectable } from '@angular/core';;
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prenotazione } from './prenotazione';
import { Passeggero } from '../passeggero/passeggero';
import { Tassista } from '../tassista/tassista';
@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  private url = 'http://localhost:8080/prenotazione';
  private tassistaUrl = 'http://localhost:8080/utente/tassista'
  private passeggeroUrl = 'http://localhost:8080/utente/passeggero'

  constructor(private httpClient: HttpClient) { }

  addPrenotazione(prenotazione: prenotazione){
    return this.httpClient.post<Object>(this.url, prenotazione);
  }
  getTassista(id_tassista: number){
    return this.httpClient.get<Object>(this.tassistaUrl+"/"+id_tassista);
  }
  getPassegero(id_passeggero: number){
    return this.httpClient.get<Object>(this.passeggeroUrl+"/"+id_passeggero);
  }
  
}
