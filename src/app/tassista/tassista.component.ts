/**
 * Script che definisce le funzioni per gestire le azioni che deve eseguire un tassista
 */
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

  //funzione che viene eseguita al load della pagina
  ngOnInit(): void {
    if(sessionStorage.length != 0) {  //se il sessionstorage non è vuoto allora l'utente è loggato e carica la pagina dell'utente
      //rendo visibili/non visibili le parti dell'html interessate
      this.logged = true;
      this.isVisible = false;
      this.utenteIsVisible = true;
      this.tassista = this.tassistaService.getLocalStorageTassista();
      }
      //acquisizione della posizione
      navigator.geolocation.getCurrentPosition(
        position =>{
          console.log(position);
          if(this.tassista){
             this.tassista.lat = position.coords.latitude; //caricamento coordinate nell'oggetto tassista
             this.tassista.lng = position.coords.longitude;
             this.prenorazioneService.searchCityByCoords(this.tassista.lat,this.tassista.lng).subscribe(
              nomeCitt => {
                console.log("Nome citta from search: ");
                console.log(nomeCitt);
                this.stringPosizione = nomeCitt;
              }
            )
             //chiamata funzione di tassistaService con una chiamata put per la modifica dei campi del database della posizione
             this.tassistaService.editTassista(this.tassista.idtassista, "lat", ''+this.tassista.lat).subscribe( //effettuo chiamata per latitudine
              response => { //risposta positiva
                console.log('posizione aggiornata lat');
                this.tassistaService.editTassista(this.tassista.idtassista, "lng", ''+this.tassista.lng).subscribe( //effettuo chiamata per longitudine
                  response => { //risposta positiva
                    console.log('posizione aggiornata lng')
                  });
              
              });
             
         }
         },error => {
              alert('Geolocalizzazione rifiutata') //nel caso in cui l'utente rifiuta la geolocalizzazione
         },
         {
              timeout:10000
         }
        )
    
    
  }

  @ViewChildren('attributo') attributoDom!: QueryList<ElementRef>; //Acquisizione elemento del dom per la modifica degi campi di tassista
  
  /** variabili utili */
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
   dataOra: number[] = [0,0,0,0,0];
   filtroPrenotazione: string = "In attesa";
   stringPosizione: string = "Posizione non acquisita";
   /** fine variabili */

   constructor(private tassistaService: TassistaService, private prenorazioneService: PrenotazioneService, private router: Router){}
   
   
  login(){ //funzione eseguita al login dell'utente
    
    console.log(this.credenziali);
    let errore : string = "";
    //chiamata funzione login dal service che effettua richiesta post con il json delle credeziali inserite dall'utente
    this.tassistaService.login(this.credenziali).subscribe(
      response => { 
        //istruzioni eseguite se il login va a buon fine
        this.logged=true;
        this.tassista = response; //all'oggetto tassista locale viene assegnato il json con le informazioni tassista 
        //ricevuto come risposta dalla richiesta post
        console.log("response: "); 
        console.log(response);
         console.log("id tassista: "+this.tassista.idtassista)},
      error => {
          //istruzioni eseguite se il login restituisce un errore
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
    //se il login risulta effettuato vengono visualizzate dinamicamente le sezioni della dashboard
    if(this.logged){
    this.logged = true;
    this.isVisible = false;
    this.utenteIsVisible = true;
    console.log(this.tassista);
    this.tassistaService.postLocalStorageTassista(this.tassista);
    }
  }
  //attivazione sezione modifica
  edit(){
    this.modCredenzialiIsVisible = true;
    this.showTaxiIsVisible = false;
    this.showCronologiaIsVisible = false;
  }
  //funzione modifica attributi
  edit1(attributo : string){
    let i:number = 0;
    let attributoDomArray = this.attributoDom.toArray(); //prendo gli elementi del dom con il #attributo e li metto in un array
    //vedo cosa l'utente sta modificando ed in base a quello che vuole modificare la i assume un valore indicativo
    switch(attributo){
      case "name" : 
        i=0; 
        break;
      case "surname" : 
        i=1; 
        break;
      case "email": 
        i=2; 
        this.tassista.email = attributoDomArray[i].nativeElement.value; //modifico la email locale
      break;
      case "password": 
        i=3; 
        this.tassista.password = attributoDomArray[i].nativeElement.value; //modifoco la password locale
      break;
      case "targa":  
        i=4; 
        break;
    }
    console.log(this.tassista.email+" modifica "+attributo+" in "+ attributoDomArray[i].nativeElement.value);
    //chiamo funzione del service che effettua una richiesta put per la modifica degli attributi
    this.tassistaService.editTassista(this.tassista.idtassista, attributo, attributoDomArray[i].nativeElement.value).subscribe(
      //in base all'attributo scelto e al valore della i assegnato corrispondente e all'id del tassista mando la richiesta
      response => { //risposta positiva
        console.log(response)
        this.credenziali.email = this.tassista.email;
        this.credenziali.password = this.tassista.password;
        alert("Modifica avvenuta con successo");
        this.tassistaService.login(this.credenziali).subscribe(response => { //richiamo dal server il tassista aggiornato
          this.tassista = response;
          this.tassistaService.postLocalStorageTassista(this.tassista); 
          location.reload();
        } 
      );
       
      },
      error => { //risposta negativa
        alert("La modifica non è andata a buon fine, verifica i campi e riprova.")
        console.error(error)
      }
      
  );
  }
  //funzione per il logout
  esci(){
    sessionStorage.clear(); //cancello il localstorage cosi che lo script capisca che nessuno è piu loggato
    location.reload(); //ricarico la pagina
  }

  launchRichiesta(idtassista: number){
    if(idtassista !== undefined){
    this.router.navigate(['/richiesta-prenotazione']);
    sessionStorage.setItem('id-tassista-scelto', JSON.stringify(idtassista));
    console.log("Tassista %d caricato nel localstorage con successo", idtassista);
    }
  }

  //visualizza gestione delle prenotazioni
  showCronologia(){

    this.showTaxiIsVisible = false;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = true;
    if(this.tassista.idtassista !== undefined){ 
      //rischiesta get delle prenotazioni con la selezione in base all'id tassista
      this.tassistaService.getPenotazioniByIdTass(this.tassista.idtassista).subscribe(data => {      
        this.prenotazioni = data; //riempio l'array prenotazioni locale con la risposta del server
        console.log(this.prenotazioni);
      });
      
      
    }
      else 
      console.error("Id tassista non presente");
    
    }

    //conversione data e ora per renderla leggibile
    dataOraLeggibile(dataOra:string[]):string {
      if(dataOra!==undefined)
      return `${dataOra[2]}-${dataOra[1]}-${dataOra[0]}, ${dataOra[3]}:${dataOra[4]}:${dataOra[5]}`;
      else return "errore"
    }
   
    //conferma una prenotazione che è in attesa con un put dell'attributo stato
    confermaPrenotazione(idprenotazione : number){
      this.prenorazioneService.editPrenotazioneStato(idprenotazione, "Confermata").subscribe(response => {
        alert("Prenotazione confermata");
      },
      error => {
        alert("Errore durante la conferma, riprova");
      }
    );
  }
    //conclude prenotazione confermata
    concludiPrenotazione(idprenotazione : number){
      this.prenorazioneService.editPrenotazioneStato(idprenotazione, "Conclusa").subscribe(response => {
        alert("Prenotazione conclusa");
      },
      error => {
        alert("Errore durante la conferma, riprova");
      }
    );
    }
    //elimina prenotazione con un delete
    eliminaPrenotazione(idprenotazione : number){
      this.prenorazioneService.delete(idprenotazione).subscribe(response => { console.log(response); alert("Prenotazione eliminata"); location.reload});
      
    }

    //aggiorna posizione manualmente
    aggiornaPosizione(){
      location.reload();
      location.reload();
    }

  }
