import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tassista } from './tassista';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TassistaService {
  
  private url = 'http://localhost:8080/utente/tassista';
   
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }
  createPost(data: any){
    return this.httpClient.post(this.url, data);
  }
  addTassista(tassista?: Tassista): Observable<Object>{
    return this.httpClient.post<Object>(`${this.url}`, tassista);
  }
}