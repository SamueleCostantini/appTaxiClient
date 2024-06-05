/** Scriprt che gestisce l'aggiunta di una prenotazione */
import { Component, OnInit, Injectable } from '@angular/core';
import { prenotazione } from '../prenotazione';
import { PrenotazioneService } from '../prenotazione.service';
import { Passeggero } from '../../passeggero/passeggero';
import { Tassista } from '../../tassista/tassista';
import { response } from 'express';
import { posizione } from './posizione';
import { Route, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-richiesta-prenotazione',
  templateUrl: './richiesta-prenotazione.component.html',
  styleUrl: './richiesta-prenotazione.component.css'
})

export class RichiestaPrenotazioneComponent implements OnInit{
  
  /** Variabili utili */
  prenotazione: prenotazione = new prenotazione();
  passeggero: Passeggero = new Passeggero();
  tassista: Tassista  =new Tassista();
  prezzoTratta?: number;
  origin: string = '';
  destination: string = '';
  distance: number | undefined;
  errorMessage: string | undefined;
  riepilogo: boolean = false;
  inviaButton: boolean = false;
  stringaPosizione: string = "";
  /** fine varibili */

  constructor(private prenotazioneService: PrenotazioneService, private router: Router){  }
  
  //funzione per il calcolo della distanza tra due coordinate: origin e destination
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition( //aggiorno la posizione del passeggero
        position =>{
          
          console.log(position);
          if(this.passeggero){
             this.passeggero.lat = position.coords.latitude; //ricavo coordinate da geolocalizzazione
             this.passeggero.lng = position.coords.longitude;
             this.prenotazioneService.searchCityByCoords(this.passeggero.lat,this.passeggero.lng).subscribe(
              nomeCitt => {
                console.log("Nome citta from search: ");
                console.log(nomeCitt);
                this.stringaPosizione = nomeCitt;
                this.prenotazione.partenza = nomeCitt;
              }
            )
             
            
             
         }
         },error => {
              alert('Geolocalizzazione rifiutata')
         },
         {
              timeout:10000 //ogni 10 secondi aggiorno la posizione
         }
        )
  }
  calculateDistance(origin : string, destination : string) {
    console.log("calculate distance");
    if (origin && destination) {
      // prima otteniamo le coordinate delle città/vie tramite il nome inserito nell'input
      this.prenotazioneService.searchCity(origin).subscribe(
        originCoords => { //ottengo le coordinate delle città dal server terzo
          this.prenotazioneService.searchCity(destination).subscribe(
            destinationCoords => {
              // poi calcoliamo la distanza usando le coordinate
              this.prenotazioneService.calculateDistance(originCoords, destinationCoords).subscribe( //calcolo la distanza con le coordinate ottenute, la distanza
              //la ottengo da un server di terze parti, approfondisco nel prenotazioneservice
                (distance: number) => {
                  this.distance = distance; //salvo la risposta del server
                  this.prenotazione.km = this.distance; //la metto nella prenotazione locale
                  if(this.prenotazione.costoXkm)
                    this.prenotazione.costoTratta = this.distance*this.prenotazione.costoXkm; //calcolo il costo della tratta
                  this.errorMessage = undefined;
                  this.inviaButton = true;//faccio comparire il bottone per il submit
                  console.log('Distanza tra le città:', this.distance);
                }, /** gestione degli errori */
                (error) => {
                  alert("Ricontrolla i campi, uno e più campi non sono validi");
                  this.errorMessage = 'Errore nel calcolo della distanza. Verifica i dati inseriti.';
                  console.error('Errore nel calcolo della distanza:', error);
                  location.reload();
                }
              );
            },
            (error) => {
              alert("Ricontrolla i campi, uno e più campi non sono validi");
              this.errorMessage = 'Errore nel trovare la destinazione. Verifica i dati inseriti.';
              console.error('Errore nel trovare la destinazione:', error);
              location.reload();
            }
          );
        },
        (error) => {
          alert("Ricontrolla i campi, uno e più campi non sono validi");
          this.errorMessage = 'Errore nel trovare l\'origine. Verifica i dati inseriti.';
          console.error('Errore nel trovare l\'origine:', error);
        }
      );
    } else {
      alert("Ricontrolla i campi, uno e più campi non sono validi");
      this.errorMessage = 'Per favore, inserisci sia l\'origine che la destinazione.';
    }
    /** fine gestione degli errori */
  }

  //genero il riepilogo dinamico
  genRiepilogo(){
    let idtassistaJSON:any = sessionStorage.getItem('id-tassista-scelto'); //prelevo l'id del tassista scelto dal passeggero dal sessionstorage
    
    let idtassista:number = JSON.parse(idtassistaJSON); //lo converto in number
    console.log("tassista sessione storage: "+idtassista);
    this.passeggero = this.prenotazioneService.getLocalStoragePasseggero(); //prelevo le informazioni del passeggero dal sessionstorage
    this.prenotazioneService.getTassista(idtassista).subscribe(data => {this.tassista = data}); //prelevo le informazioni del tassista dall'id e lo salvo in locale
    this.prenotazione.costoXkm = 2.0; //in base al prezzo medio dei taxi in italia
    this.prenotazione.stato = "In attesa"; 
    if(this.prenotazione.partenza && this.prenotazione.destinazione)
      this.calculateDistance(this.prenotazione.partenza, this.prenotazione.destinazione); //richiamo funzione precedente per il calcolo della distanza
    
    if(this.prenotazione.km !== undefined)
      this.prenotazione.costoTratta = this.prenotazione.km*this.prenotazione.costoXkm;
    this.prenotazione.idPasseggero = this.passeggero.idpasseggero;
    this.prenotazione.idTassista = idtassista;
    
    console.log("id passeggero "+this.passeggero.idpasseggero);
    this.riepilogo=true; //facciamo apparire il riepilogo
  }
  //funzione per inviare la prenotazione al server e comparirà nella dashboard del'tassista nella sezione storico
  addPrenotazione(){
    
    //this.prenotazione.id_tassista = this.tasssista.id
    console.table(this.prenotazione);
    this.prenotazioneService.addPrenotazione(this.prenotazione).subscribe( 
    response => {
      console.log(response)
      alert("Prenotazione inviata al tassista, ora attendi che il tassista approvi la richiesta.");
      this.router.navigate(['/passeggero']);
    },
    error => {
      alert("Il processo di prenotazione ha riscontrato un errore, riprova.")
      console.error(error)
    });
  }
  
  risposta?: any;
  pos?: posizione = new posizione();
  
}
