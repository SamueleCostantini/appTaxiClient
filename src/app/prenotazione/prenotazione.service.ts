import { Injectable } from '@angular/core';;
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
  editPrenotazioneStato(id?: number, valore?: string){
    return this.httpClient.put<String>(this.url+'/'+id+'=stato='+valore, "cambioStato");
  }

  getApiHere() : Observable<any>{
    return this.httpClient.get("https://geocode.search.hereapi.com/v1/geocode?q=Via+Quintina+63+Perugia+Italy&apiKey=wxyOU_md8thZjj8miRYCKLgGMF0MZFSP0-gCxiYInSE");
  }
  searchCity(city: string): Observable<{ lat: number, lng: number }> {
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(city)}&apiKey=wxyOU_md8thZjj8miRYCKLgGMF0MZFSP0-gCxiYInSE`;
    return this.httpClient.get(apiUrl).pipe(
      map((response: any) => {
        if (response.items && response.items.length > 0) {
          const location = response.items[0].position;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw new Error('No location found');
        }
      }),
      catchError((error) => {
        console.error('Error fetching geocode from HERE API:', error);
        return throwError(error);
      })
    );
  }

  calculateDistance(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }): Observable<number> {
    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${destination.lat},${destination.lng}`;
    const apiKey = "wxyOU_md8thZjj8miRYCKLgGMF0MZFSP0-gCxiYInSE";
    const apiUrl2 = `https://router.hereapi.com/v8/routes?origin=${originStr}&destination=${destinationStr}&return=polyline,summary&transportMode=taxi&departureTime=2022-11-08T02:30:11&lang=en-us&apikey=${apiKey}`;
    const apiUrl = `https://router.hereapi.com/v8/routes?transportMode=taxi&origin=${originStr}&destination=${destinationStr}&apiKey=${apiKey}`;
    //const url1 = `https://router.hereapi.com/routing/7.2/calculateroute.json?routeattributes=wp,sm,lg&mode=fastest;car;traffic:enabled&legattributes=wp,sm&maneuverattributes=none&language=en-us&jsonattributes=41&metricsystem=metric&waypoint0=geo!stopOver!${originStr}&waypoint1=geo!stopOver!${destinationStr};;End&app_code=wxyOU_md8thZjj8miRYCKLgGMF0MZFSP0-gCxiYInSE&app_id=2R45KsYWPmwWe0T8SgzE`
    //this.httpClient.get(url1).subscribe( response => {console.log(`risposta prova get ${response}`)});
    return this.httpClient.get(apiUrl2).pipe(
      map((response: any) => {
        console.log('Response from HERE API:', response);  // Log the entire response
        if (response.routes && response.routes.length > 0) {
          const distance = response.routes[0].sections[0].summary.length;
          console.log(response.routes[0].sections[0].summary)
          return distance/1000; // La distanza è in metri
        } else {
          throw new Error('No routes found in the response');
        }
      }),
      catchError((error) => {
        console.error('Error fetching distance from HERE API:', error);
        return throwError(error);
      })
    );
  }
}

 
