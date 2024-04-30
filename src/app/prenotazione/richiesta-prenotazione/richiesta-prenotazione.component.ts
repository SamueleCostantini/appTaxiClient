import { Component, OnInit, Injectable } from '@angular/core';
import { prenotazione } from '../prenotazione';
import { PrenotazioneService } from '../prenotazione.service';
import { Passeggero } from '../../passeggero/passeggero';
import { Tassista } from '../../tassista/tassista';
import { response } from 'express';

@Component({
  selector: 'app-richiesta-prenotazione',
  templateUrl: './richiesta-prenotazione.component.html',
  styleUrl: './richiesta-prenotazione.component.css'
})
export class RichiestaPrenotazioneComponent{
  
  prenotazione: prenotazione = new prenotazione();
  passeggero: Passeggero = new Passeggero();
  tassista: Tassista = new Tassista();

  prezzoTratta?: number;
  riepilogo: boolean = false;

  constructor(private prenotazioneService: PrenotazioneService){  }
  

  genRiepilogo(){
    
    this.passeggero = this.prenotazioneService.getLocalStoragePasseggero();
    this.prenotazione.costoXkm = 20.0; //indicativo
    this.prenotazione.stato = "In attesa";
    this.prenotazione.km = 100; //da generare con qualche api
    this.prenotazione.costoTratta = this.prenotazione.km*this.prenotazione.costoXkm;
    this.prenotazione.idPasseggero = this.passeggero.idpasseggero;
    
    console.log("id passeggero "+this.passeggero.idpasseggero);
    this.riepilogo=true; //facciamo apparire il riepilogo
  }


  addPrenotazione(){
    
    //this.prenotazione.id_tassista = this.tasssista.id
    console.table(this.prenotazione);
    this.prenotazioneService.addPrenotazione(this.prenotazione).subscribe();
  }
}
