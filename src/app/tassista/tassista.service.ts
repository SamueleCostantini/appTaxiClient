import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Tassista } from './tassista';

import { Observable, catchError, throwError} from 'rxjs';
import { Credenziali } from './credenziali-login';

@Injectable({
  providedIn: 'root'
})
export class TassistaService {
  
  private url = 'http://localhost:8080/utente/tassista';
  private urlLogin  = 'http://localhost:8080/utente/tassista/login'
  
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }
  createPost(data: any){
    return this.httpClient.post(this.url, data);
  }
  login(credenziali?: Credenziali): Observable<Object>{
    let risposta:any=this.httpClient.post<Object>(`${this.urlLogin}`, credenziali);
    
    return risposta;

  }
  addTassista(tassista?: Tassista  ): Observable<Object>{
    return this.httpClient.post<Object>(`${this.url}`, tassista);
  }
  edittassista(id? : string, attributo?: string, valore?:string){
    console.log("edittassista");
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
}
}