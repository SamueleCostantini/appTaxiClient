import { Component, OnInit, Injectable } from '@angular/core';
import { prenotazione } from '../prenotazione';
import { PrenotazioneService } from '../prenotazione.service';
import { Passeggero } from '../../passeggero/passeggero';
import { Tassista } from '../../tassista/tassista';
import { response } from 'express';
import { posizione } from './posizione';

@Component({
  selector: 'app-richiesta-prenotazione',
  templateUrl: './richiesta-prenotazione.component.html',
  styleUrl: './richiesta-prenotazione.component.css'
})
export class RichiestaPrenotazioneComponent{
  
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
  
  constructor(private prenotazioneService: PrenotazioneService){  }
  

  

  calculateDistance(origin : string, destination : string) {
    console.log("calculate distance");
    if (origin && destination) {
      // Prima otteniamo le coordinate delle città
      this.prenotazioneService.searchCity(origin).subscribe(
        originCoords => {
          this.prenotazioneService.searchCity(destination).subscribe(
            destinationCoords => {
              // Poi calcoliamo la distanza usando le coordinate
              this.prenotazioneService.calculateDistance(originCoords, destinationCoords).subscribe(
                (distance: number) => {
                  this.distance = distance;
                  this.prenotazione.km = this.distance;
                  if(this.prenotazione.costoXkm)
                    this.prenotazione.costoTratta = this.distance*this.prenotazione.costoXkm;
                  this.errorMessage = undefined;
                  this.inviaButton = true;
                  console.log('Distanza tra le città:', this.distance);
                },
                (error) => {
                  this.errorMessage = 'Errore nel calcolo della distanza. Verifica i dati inseriti.';
                  console.error('Errore nel calcolo della distanza:', error);
                }
              );
            },
            (error) => {
              this.errorMessage = 'Errore nel trovare la destinazione. Verifica i dati inseriti.';
              console.error('Errore nel trovare la destinazione:', error);
            }
          );
        },
        (error) => {
          this.errorMessage = 'Errore nel trovare l\'origine. Verifica i dati inseriti.';
          console.error('Errore nel trovare l\'origine:', error);
        }
      );
    } else {
      this.errorMessage = 'Per favore, inserisci sia l\'origine che la destinazione.';
    }
  }
  genRiepilogo(){
    let idtassistaJSON:any = sessionStorage.getItem('id-tassista-scelto');
    
    let idtassista:number = JSON.parse(idtassistaJSON);
    console.log("tassista sessione storage: "+idtassista);
    this.passeggero = this.prenotazioneService.getLocalStoragePasseggero();
    this.prenotazioneService.getTassista(idtassista).subscribe(data => {this.tassista = data});
    this.prenotazione.costoXkm = 20.0; //indicativo
    this.prenotazione.stato = "In attesa";
    if(this.prenotazione.partenza && this.prenotazione.destinazione)
      this.calculateDistance(this.prenotazione.partenza, this.prenotazione.destinazione);
    
    if(this.prenotazione.km !== undefined)
      this.prenotazione.costoTratta = this.prenotazione.km*this.prenotazione.costoXkm;
    this.prenotazione.idPasseggero = this.passeggero.idpasseggero;
    this.prenotazione.idTassista = idtassista;
    
    console.log("id passeggero "+this.passeggero.idpasseggero);
    this.riepilogo=true; //facciamo apparire il riepilogo
  }
  addPrenotazione(){
    
    //this.prenotazione.id_tassista = this.tasssista.id
    console.table(this.prenotazione);
    this.prenotazioneService.addPrenotazione(this.prenotazione).subscribe( 
    response => {
      console.log(response)
      alert("Prenotazione inviata al tassista, ora attendi che il tassista approvi la richiesta.");
    },
    error => {
      alert("Il processo di prenotazione ha riscontrato un errore, riprova.")
      console.error(error)
    });
  }
  risposta?: any;
  pos?: posizione = new posizione();
  /*cerca(){
    this.prenotazioneService.getApiHere().subscribe(response => {this.risposta = response; console.log("risposta here: "); console.log(response.position[0] + " " + response.position[1]);})
  }*/
}
