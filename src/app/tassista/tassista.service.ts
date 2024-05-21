/** pagina con script che gestisce le chiamate api get, post, delete e put */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Tassista } from './tassista';
import { prenotazione } from '../prenotazione/prenotazione';
import { Observable, catchError, throwError} from 'rxjs';
import { Credenziali } from './credenziali-login';

@Injectable({
  providedIn: 'root'
})
export class TassistaService {
  
  /** Url per le chiamate api al server */
  private url = 'http://localhost:8080/utente/tassista';
  private urlLogin  = 'http://localhost:8080/utente/tassista/login'
  private urlPrenotazioni = 'http://localhost:8080/prenotazione/tassista';

  
  constructor(private httpClient: HttpClient) { }
  
  //chiamata api per login
  login(credenziali?: Credenziali): Observable<Object>{
    //richiesta post al server con json credenziali e riceve un json con informazioni tassista o errore
    return this.httpClient.post<Object>(`${this.urlLogin}`, credenziali);

  }

  //chiamata api per la registrazione di un nuovo tassista
  addTassista(tassista?: Tassista): Observable<Object>{
    //richiesta post con json dati tassista da aggiungere e risposta con json dati tassista o errore
    return this.httpClient.post<Object>(`${this.url}`, tassista);
  }

  //chiamata api per modifica di attributi tassist
  editTassista(id? : number, attributo?: string, valore?:string){
    console.log("editpasseggero");
    //richiesta put con informazioni
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
    
  }
  //chiamata api get per ricevere la lista prenotazioni del tassista loggato
  getPenotazioniByIdTass(idtassista: number){
    return this.httpClient.get<prenotazione[]>(this.urlPrenotazioni+"="+idtassista);
  }
  //carica nel Session storage un tassista per poi rendere le informazioni comuni tra tutte le pagine della sessione
  postLocalStorageTassista(tassista : Tassista){
    sessionStorage.setItem('tassista', JSON.stringify(tassista));
    console.log("passeggero id: "+tassista.idtassista)
  }
  //prende il tassista dal session storage
  getLocalStorageTassista(): Tassista{
    const tassistaJSON = sessionStorage.getItem('tassista');
    let tassista = new Tassista();
    if (tassistaJSON !== null) {
      tassista = JSON.parse(tassistaJSON);
    } else {
      console.log('Nessun dato trovato nel localStorage per la chiave "tassista".');
    } 
    return tassista;
   
  }
}