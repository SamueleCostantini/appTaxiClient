import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Taxi } from './taxi'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {
  
  baseUrl = "http://localhost:8080/taxi";

  constructor(private httpClient: HttpClient){}

  getAllTaxi(): Observable<Taxi[]>{
    return this.httpClient.get<Taxi[]>(`${this.baseUrl}`);
  }

  addTaxi(taxi?: Taxi): Observable<Object>{
    return this.httpClient.post<Object>(`${this.baseUrl}`, taxi);
  }
}
