/** Script che gestisce le chiamate api al server di appTaxi e al server del servizio
 * Here Maps
 */
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

  /** Url utili per le chiamate api al server appTaxi */
  private url = 'http://localhost:8080/prenotazione';
  private tassistaUrl = 'http://localhost:8080/utente/tassista'
  private passeggeroUrl = 'http://localhost:8080/utente/passeggero'
  private apiKey = "wxyOU_md8thZjj8miRYCKLgGMF0MZFSP0-gCxiYInSE"; //api key per il servizio di terze parti Here Maps

  constructor(private httpClient: HttpClient) { }

  //richiesta post per salvare la prenotazioen
  addPrenotazione(prenotazione: prenotazione){
    return this.httpClient.post<Object>(this.url, prenotazione);
  }
  //richiesta get che riceve il tassista 
  getTassista(id_tassista: number){
    return this.httpClient.get<Object>(this.tassistaUrl+"/"+id_tassista);
  }
  //richiesta get che riceve il passeggero
  getPassegero(id_passeggero: number){
    return this.httpClient.get<Object>(this.passeggeroUrl+"/"+id_passeggero);
  }
  //funzione per prendere le informazini sul passeggero dal sessionstorage
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
  //richiesta put per il cambio di stato di una prenotazione
  editPrenotazioneStato(id?: number, valore?: string){
    return this.httpClient.put<String>(this.url+'/'+id+'=stato='+valore, "cambioStato");
  }

  //funzione per api di here maps
  getApiHere() : Observable<any>{
    return this.httpClient.get("https://geocode.search.hereapi.com/v1/geocode?q=Via+Quintina+63+Perugia+Italy&apiKey="+this.apiKey);
  }
  //funzione cerca citta che da una stringa ricava una serie di informazioni sulla posizione tra cui le coordinate che ci servono
  searchCity(city: string): Observable<{ lat: number, lng: number }> {
    //url per la chiamata api a here maps con la apikey in fondo
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(city)}&apiKey=${this.apiKey}`;
    //codice preso dal sito ufficiale di Here Maps
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
  searchCityByCoords(lat: number, lng: number): Observable<string> {
    //url per la chiamata api a here maps con la apikey in fondo
    let coords=lat+','+lng;
    
    //https://revgeocode.search.hereapi.com/v1/revgeocode?at=41.89993%2C12.45447&lang=en-US&apiKey={YOUR_API_KEY}


    const apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${encodeURIComponent(coords)}&lang=en-US&apiKey=${this.apiKey}`;
    //codice preso dal sito ufficiale di Here Maps
    return this.httpClient.get(apiUrl).pipe(
      map((response: any) => {
        if (response.items && response.items.length > 0) {
          let location:string = response.items[0].address.label;
          return location;
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
  //richeista delete per la cancellazione di una prenotazione
  delete(idprenotazione: number): Observable<Object>{
    return this.httpClient.delete(this.url+'/'+idprenotazione);
  }

  //richiesta api get che con due coppie di coordinare ricava una serie di informazioni sulla strada tra le due posizioni tra cui la distanza e la durata
  calculateDistance(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }): Observable<number> {
    const originStr = `${origin.lat},${origin.lng}`; //converto coordinate in stringhe per inserirle nell'utl della richiesta
    const destinationStr = `${destination.lat},${destination.lng}`;
    
    const apiUrl2 = `https://router.hereapi.com/v8/routes?origin=${originStr}&destination=${destinationStr}&return=polyline,summary&transportMode=taxi&departureTime=2022-11-08T02:30:11&lang=en-us&apikey=${this.apiKey}`;
    
    //effettuo la get richiesta api a Here Maps
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

 
