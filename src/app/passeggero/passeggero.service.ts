import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Passeggero } from './passeggero';
import { Observable } from 'rxjs';
import { Credenziali } from './credenziali-login';

@Injectable({
  providedIn: 'root'
})
export class PasseggeroService {
  
  private url = 'http://localhost:8080/utente/passeggero';
  private urlLogin  = 'http://localhost:8080/utente/passeggero/login'
  
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
  editPasseggero(id? : string, attributo?: string, valore?:string){
    console.log("editpasseggero");
    return this.httpClient.put<String>(this.url+'/'+id+'='+attributo+'='+valore, "modifica");
  }
}