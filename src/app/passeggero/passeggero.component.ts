import { Component, ViewChild, ElementRef,Injectable, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Passeggero } from './passeggero';
import { PasseggeroService } from "./passeggero.service";
import { Credenziali } from "./credenziali-login"
import { prenotazione } from '../prenotazione/prenotazione';
import { PrenotazioneService } from '../prenotazione/prenotazione.service';
import { response } from 'express';
import { stringify } from 'querystring';
import { Tassista } from '../tassista/tassista';
import { Route, RouterLink, Router } from '@angular/router';
import { RichiestaPrenotazioneComponent } from '../prenotazione/richiesta-prenotazione/richiesta-prenotazione.component';

@Component({
  selector: 'app-passeggero',
  templateUrl: './passeggero.component.html',
  styleUrl: './passeggero.component.css'
})
export class PasseggeroComponent implements OnInit{
  ngOnInit(): void {
    if(sessionStorage.length != 0) { 
      this.logged = true;
      this.isVisible = false;
      this.utenteIsVisible = true;
      this.passeggero = this.passeggeroService.getLocalStoragePasseggero();
      }
      navigator.geolocation.getCurrentPosition(
        position =>{
          alert('Location accessed')
          console.log(position);
          if(this.passeggero){
             this.passeggero.lat = position.coords.latitude;
             this.passeggero.lng = position.coords.longitude;
             this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, "lat", ''+this.passeggero.lat).subscribe(response => {console.log('posizione aggiornata lat')});
             this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, "lng", ''+this.passeggero.lng).subscribe(response => {console.log('posizione aggiornata lng')});
         }
         },error => {
              alert('Geolocalizzazione rifiutata')
         },
         {
              timeout:10000
         }
        )
  }
  @ViewChildren('attributo') attributoDom!: QueryList<ElementRef>;
  
   passeggero : Passeggero = new Passeggero();
   credenziali: Credenziali = new Credenziali();
   logged: boolean = false;
   isVisible: boolean = true;
   utenteIsVisible: boolean = false;
   modCredenzialiIsVisible : boolean = false;
   showTaxiIsVisible : boolean = false;
   showCronologiaIsVisible: boolean = false;
   prenotazioni?: prenotazione[];
   tassisti?: Tassista[];
   tassistaScelto?: Tassista = new Tassista();
   
   constructor(private passeggeroService: PasseggeroService, private prenorazioneService: PrenotazioneService, private router: Router){}
   
   dataOra: number[] = [0,0,0,0,0];
   filtroPrenotazione: string = "In attesa";
  
  login(){
    

    console.log(this.credenziali);
    let errore : string = "";
    this.passeggeroService.login(this.credenziali).subscribe(
      response => {
        this.logged=true;
        this.passeggero = response; console.log("response: "); console.log(response);
        console.log("id Passeggero: "+this.passeggero.idpasseggero)
        
        },
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
      case "email": 
          i = 2; 
          this.passeggero.email = attributoDomArray[i].nativeElement.value;
          break;
      case "password": 
          i=3; 
          this.passeggero.password = attributoDomArray[i].nativeElement.value;
          break;
    }
    console.log(this.passeggero.email+" modifica "+attributo+" in "+ attributoDomArray[i].nativeElement.value);
    this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, attributo, attributoDomArray[i].nativeElement.value).subscribe(
      response => {
        console.log(response);
          this.credenziali.email = this.passeggero.email;
          this.credenziali.password = this.passeggero.password;
          this.passeggeroService.login(this.credenziali).subscribe( response => {
              this.passeggero = response; 
              this.passeggeroService.postLocalStoragePasseggero(this.passeggero);
              location.reload();
              alert("Modifica avvenuta con successo");
            });
      },
      error => {
        alert("La modifica non è andata a buon fine, verifica i campi e riprova.")
        console.error(error)
      }
  
  );
  }
  esci(){
    location.reload();
    sessionStorage.clear();
  }
  showTaxi(){
    this.showTaxiIsVisible = true;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = false;
    let distanzaDalTassista: number | undefined;
    let positionP: {lat: number, lng: number};
    let positionT: {lat: number, lng: number};
    this.passeggeroService.getTassisti().subscribe(response => { 
      this.tassisti = response;
     if(this.passeggero.lat && this.passeggero.lng)
        positionP = {lat: this.passeggero.lat, lng : this.passeggero.lng};
     for(let t of this.tassisti){
        
        if(t.lat && t.lng)
          positionT = {lat: t.lat, lng : t.lng};
        this.prenorazioneService.calculateDistance(positionT, positionP).subscribe(response => {
          t.distanza = response;
          });
          
      }
      this.tassisti = this.tassisti.sort(function(a:Tassista,b:Tassista){if(a.distanza && b.distanza) return a.distanza - b.distanza; else return -1});
    },
    error => {
      alert("Si è verificato un errore");
      console.log(error);
    } );
  }
  launchRichiesta(idtassista: number){
    if(idtassista !== undefined){
    this.router.navigate(['/richiesta-prenotazione']);
    sessionStorage.setItem('id-tassista-scelto', JSON.stringify(idtassista));
    console.log("Tassista %d caricato nel localstorage con successo", idtassista);
    }
  }
  showCronologia(){

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
   aggiornaPosizione(){
    location.reload();
    location.reload();
   }


}


