import { Component, ViewChild, ElementRef,Injectable, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { Passeggero } from './passeggero';
import { PasseggeroService } from "./passeggero.service";
import { Credenziali } from "./credenziali-login"
import { prenotazione } from '../prenotazione/prenotazione';
import { PrenotazioneService } from '../prenotazione/prenotazione.service';
import { response } from 'express';
import { stringify } from 'querystring';

@Component({
  selector: 'app-passeggero',
  templateUrl: './passeggero.component.html',
  styleUrl: './passeggero.component.css'
})
export class PasseggeroComponent {
  
  @ViewChildren('attributo') attributoDom!: QueryList<ElementRef>;
  
   passeggero : Passeggero = new Passeggero();
   credenziali: Credenziali = new Credenziali();
  constructor(private passeggeroService: PasseggeroService, private prenorazioneService: PrenotazioneService){}
   logged: boolean = false;
   isVisible: boolean = true;
   utenteIsVisible: boolean = false;
   modCredenzialiIsVisible : boolean = false;
   showTaxiIsVisible : boolean = false;
   showCronologiaIsVisible: boolean = false;
   prenotazioni?: prenotazione[];
  
   dataOra: number[] = [0,0,0,0,0];
   filtroPrenotazione: string = "In attesa";
  login(){
    

    console.log(this.credenziali);
    let errore : string = "";
    this.passeggeroService.login(this.credenziali).subscribe(
      response => {
        this.logged=true;
       
        this.passeggero = response; console.log("response: "); console.log(response);
         console.log("id Passeggero: "+this.passeggero.idpasseggero)},
      error => {
          this.logged = false;
            console.error('Errore durante la richiesta POST:', error);
            // Gestione dell'errore
            if (error.status === 500) {
              // Credenziali non valide
              alert('Credenziali non valide. Riprova.');
            } else {
              // Altro tipo di errore
              alert('Si è verificato un errore. Riprova più tardi.');
            }
          });
    
    if(this.logged){
    this.logged = true;
    this.isVisible = false;
    this.utenteIsVisible = true;
    console.log(this.passeggero);
    this.passeggeroService.postLocalStoragePasseggero(this.passeggero);
    }
  }
  edit(){
    this.modCredenzialiIsVisible = true;
    this.showTaxiIsVisible = false;
    this.showCronologiaIsVisible = false;
  }
  edit1(attributo : string){
    let i:number = 0;
    let attributoDomArray = this.attributoDom.toArray();
    switch(attributo){
      case "name" : i=0; break;
      case "surname" : i=1; break;
      case "email": i = 2; break;
      case "password": i=3; break;
    }
    console.log(this.passeggero.email+" modifica "+attributo+" in "+ attributoDomArray[i].nativeElement.value);
    this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, attributo, attributoDomArray[i].nativeElement.value).subscribe(
      response => {
        console.log(response)
        alert("Modifica avvenuta con successo");
      },
      error => {
        alert("La modifica non è andata a buon fine, verifica i campi e riprova.")
        console.error(error)
      }
  
  );
  }
  showTaxi(){
    this.showTaxiIsVisible = true;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = false;
  }
  showCronologia(){
    let prenotazioniNoFiltro: prenotazione[];
    this.showTaxiIsVisible =false;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = true;
    if(this.passeggero.idpasseggero !== undefined){ 
      this.passeggeroService.getPenotazioniByIdPass(this.passeggero.idpasseggero).subscribe(data => {
       
        this.prenotazioni = data;
        
      });
      
      
    }
      else 
      console.error("Id passeggero non  presente");
    
    }
    dataOraLeggibile(dataOra:string[]):string {
      if(dataOra!==undefined)
      return `${dataOra[2]}-${dataOra[1]}-${dataOra[0]}, ${dataOra[3]}:${dataOra[4]}:${dataOra[5]}`;
      else return "errore"
    }
   


}


