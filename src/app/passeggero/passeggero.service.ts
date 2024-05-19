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
  
  private url = 'http://localhost:8080/utente/passeggero';
  private urlPrenotazioni = 'http://localhost:8080/prenotazione';
  private urlLogin  = 'http://localhost:8080/utente/passeggero/login';
  private urlTassisti  = 'http://localhost:8080/utente/tassista';
  
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }

  createPost(data: any){
    return this.httpClient.post(this.url, data);
  }
  login(credenziali?: Credenziali): Observable<Object>{

    return this.httpClient.post<Object>(`${this.urlLogin}`, credenziali);

  }
  addPasseggero(passeggero?: Passeggero): Observable<Object>{
    return this.httpClient.post<Object>(`${this.url}`, passeggero);
  }
  editPasseggero(id? : number, attributo?: string, valore?:string){
    console.log("editpasseggero");
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
  }

  getTassisti(){
    return this.httpClient.get<Tassista[]>(this.urlTassisti);
  }
  getPenotazioniByIdPass(idpasseggero: number){
    return this.httpClient.get<prenotazione[]>(this.urlPrenotazioni+"/"+idpasseggero);
  }

  postLocalStoragePasseggero(passeggero: Passeggero){
    sessionStorage.setItem('passeggero', JSON.stringify(passeggero));
    console.log("passeggero id: "+passeggero.idpasseggero)
  }

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