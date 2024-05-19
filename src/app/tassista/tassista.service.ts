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
  
  private url = 'http://localhost:8080/utente/tassista';
  private urlLogin  = 'http://localhost:8080/utente/tassista/login'
  private urlPrenotazioni = 'http://localhost:8080/prenotazione/tassista';

  
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
  addTassista(tassista?: Tassista): Observable<Object>{
    return this.httpClient.post<Object>(`${this.url}`, tassista);
  }

  editTassista(id? : number, attributo?: string, valore?:string){
    console.log("editpasseggero");
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
    
  }

  
 
  getPenotazioniByIdTass(idtassista: number){
    return this.httpClient.get<prenotazione[]>(this.urlPrenotazioni+"="+idtassista);
  }

  postLocalStorageTassista(tassista : Tassista){
    sessionStorage.setItem('tassista', JSON.stringify(tassista));
    console.log("passeggero id: "+tassista.idtassista)
  }

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