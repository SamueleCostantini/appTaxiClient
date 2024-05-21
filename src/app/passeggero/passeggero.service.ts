/**Script per la comunicazione con il server
 * Gestisce le chiamate api al server dell'appTaxi oppure a server di servizi di terze parti
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Passeggero } from './passeggero';
import { Tassista } from '../tassista/tassista';
import { Observable } from 'rxjs';
import { Credenziali } from './credenziali-login';
import { stringify } from 'querystring';
import { prenotazione } from '../prenotazione/prenotazione';

@Injectable({
  providedIn: 'root'
})
export class PasseggeroService {
  
  /** Url per la comunicazione con i server */
  private url = 'http://localhost:8080/utente/passeggero';
  private urlPrenotazioni = 'http://localhost:8080/prenotazione';
  private urlLogin  = 'http://localhost:8080/utente/passeggero/login';
  private urlTassisti  = 'http://localhost:8080/utente/tassista';
  
  constructor(private httpClient: HttpClient) { }
  
  //funzione login che effettua chiamata post con le credenziali di accesso tramite un json
  login(credenziali?: Credenziali): Observable<Object>{

    return this.httpClient.post<Object>(`${this.urlLogin}`, credenziali); //converte la risposta del post con un oggetto leggibile da typescript

  }
  //funzione per registrazione nuovo utente che fa una chiamata post con le informazioni fornite dall'utente in fase di iscrizione
  addPasseggero(passeggero?: Passeggero): Observable<Object>{
    return this.httpClient.post<Object>(`${this.url}`, passeggero); //converte la rispsota del server con un oggetto leggibile da typescript
  }
  //effettua chiamata put per la modifica degli attributi
  editPasseggero(id? : number, attributo?: string, valore?:string){
    /**
     * id: id passeggero
     * attributo: che attributo modifica
     * valore: nuovo valore dell'attributo da modificare
     */
    console.log("editpasseggero");
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
  }

  //chiamata get che come risposta restituisce la lista completa dei tassisti
  getTassisti(){
    return this.httpClient.get<Tassista[]>(this.urlTassisti); //converte la risosta in un array di tassisti
  }
  //chiamata get che riceve la lista delle prenotazioni in base all'id del passeggero
  getPenotazioniByIdPass(idpasseggero: number){
    return this.httpClient.get<prenotazione[]>(this.urlPrenotazioni+"/"+idpasseggero);
  }

  //funzione che carica il passeggero locale nel sessionstorage
  postLocalStoragePasseggero(passeggero: Passeggero){
    sessionStorage.setItem('passeggero', JSON.stringify(passeggero));
    console.log("passeggero id: "+passeggero.idpasseggero)
  }

  //prente il passeggero dal sessionstorage
  getLocalStoragePasseggero(): Passeggero{
    const passeggeroJSON = sessionStorage.getItem('passeggero');
    let passeggero = new Passeggero();
    if (passeggeroJSON !== null) {
      passeggero = JSON.parse(passeggeroJSON);
    } else {
      console.log('Nessun dato trovato nel localStorage per la chiave "passeggero".');
    } 
    return passeggero;
   
  }
}