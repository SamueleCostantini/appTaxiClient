import { Component } from '@angular/core';
import { Credenziali } from './credenziali-login';
import { ViewChild, ElementRef,Injectable, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { TassistaService } from './tassista.service';
import { Tassista } from './tassista';
import { prenotazione } from '../prenotazione/prenotazione';
import { PrenotazioneService } from '../prenotazione/prenotazione.service';
import { Route, RouterLink, Router } from '@angular/router';
import { response } from 'express';


@Component({
  selector: 'app-tassista',
  templateUrl: './tassista.component.html',
  styleUrl: './tassista.component.css'
})
export class TassistaComponent {

  ngOnInit(): void {
    if(sessionStorage.length != 0) { 
      this.logged = true;
      this.isVisible = false;
      this.utenteIsVisible = true;
      this.tassista = this.tassistaService.getLocalStorageTassista();
      }
      navigator.geolocation.getCurrentPosition(
        position =>{
          alert('Location accessed')
          console.log(position);
          if(this.tassista){
             this.tassista.lat = position.coords.latitude;
             this.tassista.lng = position.coords.longitude;
             this.tassistaService.editTassista(this.tassista.idtassista, "lat", ''+this.tassista.lat).subscribe(response => {console.log('posizione aggiornata lat')});
             this.tassistaService.editTassista(this.tassista.idtassista, "lng", ''+this.tassista.lng).subscribe(response => {console.log('posizione aggiornata lng')});
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
  
   tassista : Tassista = new Tassista();
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
   constructor(private tassistaService: TassistaService, private prenorazioneService: PrenotazioneService, private router: Router){}
   
   dataOra: number[] = [0,0,0,0,0];
   filtroPrenotazione: string = "In attesa";
  login(){
    

    console.log(this.credenziali);
    let errore : string = "";
    this.tassistaService.login(this.credenziali).subscribe(
      response => {
        this.logged=true;
       
        this.tassista = response; console.log("response: "); console.log(response);
         console.log("id tassista: "+this.tassista.idtassista)},
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
    console.log(this.tassista);
    this.tassistaService.postLocalStorageTassista(this.tassista);
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
        this.tassista.email = attributoDomArray[i].nativeElement.value;
      break;
      case "password": 
        i=3; 
        this.tassista.password = attributoDomArray[i].nativeElement.value;
      break;
      case "targa": i=4; break;
    }
    console.log(this.tassista.email+" modifica "+attributo+" in "+ attributoDomArray[i].nativeElement.value);
    this.tassistaService.editTassista(this.tassista.idtassista, attributo, attributoDomArray[i].nativeElement.value).subscribe(
      response => {
        console.log(response)
        this.credenziali.email = this.tassista.email;
        this.credenziali.password = this.tassista.password;
        alert("Modifica avvenuta con successo");
        this.tassistaService.login(this.credenziali).subscribe(response => { 
          this.tassista = response;
          this.tassistaService.postLocalStorageTassista(this.tassista); 
          location.reload();
        } 
      );
       
      },
      error => {
        alert("La modifica non è andata a buon fine, verifica i campi e riprova.")
        console.error(error)
      }
      
  );
  }
  esci(){
    sessionStorage.clear();
    location.reload();
  }
  showTaxi(){
    this.showTaxiIsVisible = true;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = false;
    
  }
  launchRichiesta(idtassista: number){
    if(idtassista !== undefined){
    this.router.navigate(['/richiesta-prenotazione']);
    sessionStorage.setItem('id-tassista-scelto', JSON.stringify(idtassista));
    console.log("Tassista %d caricato nel localstorage con successo", idtassista);
    }
  }
  showCronologia(){

    this.showTaxiIsVisible = false;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = true;
    if(this.tassista.idtassista !== undefined){ 
      this.tassistaService.getPenotazioniByIdTass(this.tassista.idtassista).subscribe(data => {
       
        this.prenotazioni = data;
        console.log(this.prenotazioni);
      });
      
      
    }
      else 
      console.error("Id tassista non presente");
    
    }
    dataOraLeggibile(dataOra:string[]):string {
      if(dataOra!==undefined)
      return `${dataOra[2]}-${dataOra[1]}-${dataOra[0]}, ${dataOra[3]}:${dataOra[4]}:${dataOra[5]}`;
      else return "errore"
    }
   
    confermaPrenotazione(idprenotazione : number){
      this.prenorazioneService.editPrenotazioneStato(idprenotazione, "Confermata").subscribe(response => {
        alert("Prenotazione confermata");
      },
      error => {
        alert("Errore durante la conferma, riprova");
      }
    );
  }
    concludiPrenotazione(idprenotazione : number){
      this.prenorazioneService.editPrenotazioneStato(idprenotazione, "Conclusa").subscribe(response => {
        alert("Prenotazione conclusa");
      },
      error => {
        alert("Errore durante la conferma, riprova");
      }
    );
    }
    aggiornaPosizione(){
      location.reload();
      location.reload();
    }

  }
