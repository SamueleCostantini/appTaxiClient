import { Component } from '@angular/core';
import { prenotazione } from '../prenotazione';
import { PrenotazioneService } from '../prenotazione.service';
import { Passeggero } from '../../passeggero/passeggero';
import { Tassista } from '../../tassista/tassista';

@Component({
  selector: 'app-richiesta-prenotazione',
  templateUrl: './richiesta-prenotazione.component.html',
  styleUrl: './richiesta-prenotazione.component.css'
})
export class RichiestaPrenotazioneComponent {
  prenotazione: prenotazione = new prenotazione();
  passeggero: Passeggero = new Passeggero();
  tassista: Tassista = new Tassista();

  prezzoTratta?: number;
  riepilogo: boolean = false;

  constructor(private prenotazioneService: PrenotazioneService){}

  genRiepilogo(){

    
    this.riepilogo=true;
  }

}
