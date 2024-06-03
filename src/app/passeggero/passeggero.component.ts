/** Script della pagina del passeggero */
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
import { log } from 'console';

@Component({
  selector: 'app-passeggero',
  templateUrl: './passeggero.component.html',
  styleUrl: './passeggero.component.css'
})
export class PasseggeroComponent implements OnInit{
  ngOnInit(): void { //istruzioni che vengono eseguite al load della pagina
    if(sessionStorage.length != 0) { //se il sessionstorage non è vuoto allora c'è un utente loggato
      console.log("session storage non vuoto");
      this.logged = true; //imposto la visualizzazione della dashboard
      this.isVisible = false;
      this.utenteIsVisible = true;
      this.passeggero = this.passeggeroService.getLocalStoragePasseggero(); //prendo il passeggero dal session storage
      }
      navigator.geolocation.getCurrentPosition( //aggiorno la posizione del passeggero
        position =>{
          
          console.log(position);
          if(this.passeggero){
             this.passeggero.lat = position.coords.latitude; //ricavo coordinate da geolocalizzazione
             this.passeggero.lng = position.coords.longitude;
             this.prenorazioneService.searchCityByCoords(this.passeggero.lat,this.passeggero.lng).subscribe(
              nomeCitt => {
                console.log("Nome citta from search: ");
                console.log(nomeCitt);
                this.stringaPosizione = nomeCitt;
              }
            )
             //con una richiesta put al server modifico le coordinate del passeggero nel database
             this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, "lat", ''+this.passeggero.lat).subscribe(
              response => {
                console.log('posizione aggiornata lat'); 
                this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, "lng", ''+this.passeggero.lng).subscribe(response => {console.log('posizione aggiornata lng')});}
              );
             
         }
         },error => {
              alert('Geolocalizzazione rifiutata')
         },
         {
              timeout:10000 //ogni 10 secondi aggiorno la posizione
         }
        )
  }
  @ViewChildren('attributo') attributoDom!: QueryList<ElementRef>; //prendo gli elementi attributo dal dom per la modifica degli attributi
  /** Variabili utili */
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
   dataOra: number[] = [0,0,0,0,0];
   filtroPrenotazione: string = "In attesa";
   stringaPosizione: string = "Posizione non acquisita";
   /** Fine variabili */
   //costruttore con classi private di cui ho bisogno
   /** 
    * PasseggeroService: contiene funzioni per le chiamate al server per il passeggero
    * PrenotazioneService: contiene funzuoni per gestisce le chiamate al server per le prenotazioni
    * Router: di angular, per il redirect delle pagine
    */
   constructor(private passeggeroService: PasseggeroService, private prenorazioneService: PrenotazioneService, private router: Router){}
   
   
  //funzione per il login
  login(){
    console.log(this.credenziali);
    let errore : string = "";
    //funzione di passeggeeroService per il login, mando una richiest post con un json delle credenziali di accesso email e password
    this.passeggeroService.login(this.credenziali).subscribe(
      response => { //gestisco risposta positiva
        this.logged=true;
        //salvo le informazioni del passeggero in locale
        this.passeggero = response; //ricevo come risposta del post un json che viene convertito in oggetto dal service
        //test
        console.log("response: "); 
        console.log(response); 
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
    //se loggato visualizzo la dashboard dinamicamente
    if(this.logged){
      this.logged = true; 
      this.isVisible = false;
      this.utenteIsVisible = true;
    console.log(this.passeggero);
    this.passeggeroService.postLocalStoragePasseggero(this.passeggero); //carico il passeggero nel sessionStorage cosi da renderlo comune
    //tra gli script
    }
  }
  //funzione che mosta la sezione edit attributo del passeggero
  edit(){
    this.modCredenzialiIsVisible = true; //visualizzo
    this.showTaxiIsVisible = false; //oscuro
    this.showCronologiaIsVisible = false;
  }
  //funzione che gestisce l'edit degli attributi del passeggero
  edit1(attributo : string){ //come parametro ho il nuovo valore dell'attributo
    let i:number = 0; //con i devico quale attributo deve essere modificato
    let attributoDomArray = this.attributoDom.toArray(); //trasformo in array la lista di elementi con #attributo
    switch(attributo){ //in base a quale attributo sceglie la i prende un valore
      case "name" : 
        i=0; 
        break;
      case "surname" :
         i=1; 
         break;
      case "email": 
          i = 2; 
          //modifico la email anche il locale per evitare il mismatching con la email che riceve dal server
          this.passeggero.email = attributoDomArray[i].nativeElement.value;
          break;
      case "password": 
          i=3; 
          this.passeggero.password = attributoDomArray[i].nativeElement.value;
          break;
    }
    console.log(this.passeggero.email+" modifica "+attributo+" in "+ attributoDomArray[i].nativeElement.value);
    //richiamo funzione edit dal service che effettua chiamata put con i parametri sottostanti
    this.passeggeroService.editPasseggero(this.passeggero.idpasseggero, attributo, attributoDomArray[i].nativeElement.value).subscribe(
      /**
       * 
       * idpasseggero: l'id del passeggero da modificare
       * attributo: il nuovo valore
       * attributoDomArray[i]: quale attributo modificare
       */
      response => { //modifica andata a buon fine put ok
        console.log(response);
          this.credenziali.email = this.passeggero.email;
          this.credenziali.password = this.passeggero.password;
          this.passeggeroService.login(this.credenziali).subscribe( response => { 
            //faccio una richiesta post per ricevere il passeggero aggiornato
            //con i nuovi dati
              this.passeggero = response; 
              this.passeggeroService.postLocalStoragePasseggero(this.passeggero); //ricarico il nuovo passeggero nel sessionStorage
              location.reload(); //ricarico la pagina
              alert("Modifica avvenuta con successo");
            });
      },
      error => {
        //errore con la chiamata put
        alert("La modifica non è andata a buon fine, verifica i campi e riprova.")
        console.error(error)
      }
  
  );
  }
  //funzione per il logout
  esci(){ 
    //svuoto il session storage e ricarico la pagina
    sessionStorage.clear();
    location.reload();
   
  }
  //funzione per mostrare i tassisti vicini al passeggero
  showTaxi(){
    //imposto la visualizzazione
    this.showTaxiIsVisible = true;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = false;
    /** Variabili temporanee utili */
    let distanzaDalTassista: number | undefined;
    let positionP: {lat: number, lng: number};
    let positionT: {lat: number, lng: number};
    /** */
    //richiamo la funzione getTassisti dal service che effettua una chiamata get che riceve tutti i tassisti presenti nel db dal server
    this.passeggeroService.getTassisti().subscribe(response => { //risposta positiva
      this.tassisti = response; //riempimento dell'array locale per l'elendo dei tassisti
     if(this.passeggero.lat && this.passeggero.lng)
        positionP = {lat: this.passeggero.lat, lng : this.passeggero.lng}; //ricavo la posizione dalle coordinate del passeggero locale
     //for per scorrere tutto l'array e calcolare la distanza
     for(let t of this.tassisti){
      //se le coordinare del tassista esistono e non sono zero, se sono 0 non è presente una posizione: o il tassista non ha dato il consenso o si è verificato un errore
        if(t.lat && t.lng && t.lat != 0 && t.lng!=0){
          positionT = {lat: t.lat, lng : t.lng}; //ricavo la posizione del tassista
        //chiamata alla funzione del service che calcola la distanza tramite una chiamata api al servizio HereMaps, nei parametri c'è origine e destinazione
        this.prenorazioneService.calculateDistance(positionT, positionP).subscribe(response => {
          t.distanza = response/1000; //distanza ricevuta in mt, converto in km
          console.log(positionT+' to '+positionP+' = '+t.distanza);
          }, error => {console.log(error)}); //errore nella chiamata api
          
      }
    }
    //ordino i tassisti in base alla distanza calcolata in ordine crescente
      this.tassisti = this.tassisti.sort(function(a:Tassista,b:Tassista){
        if(a.distanza && b.distanza) 
          return a.distanza - b.distanza; 
        else return -1});
    },
    error => { //errore nella chiamata getTassisti
      alert("Si è verificato un errore");
      console.log(error);
    } );
  }
  //funzione che lancia una richiesta di prenotazione al tassista scelto
  launchRichiesta(idtassista: number){
    if(idtassista !== undefined){
      this.router.navigate(['/richiesta-prenotazione']); //redirect alla pagina con il form di richiesta prenotazione
      sessionStorage.setItem('id-tassista-scelto', JSON.stringify(idtassista)); //salvo il tassista scelto nel sessionStorage per inserirlo nella prenotazione
      console.log("Tassista %d caricato nel localstorage con successo", idtassista);
    }
  }
  //visualizza sezione storico prenotazioni
  showCronologia(){

    this.showTaxiIsVisible =false;
    this.modCredenzialiIsVisible = false;
    this.showCronologiaIsVisible = true;
    if(this.passeggero.idpasseggero !== undefined){ 
      //chiamata get al server per visualiuzzare prenotazioni del passeggero locale
      this.passeggeroService.getPenotazioniByIdPass(this.passeggero.idpasseggero).subscribe(data => {
       
        this.prenotazioni = data;
        
      });
      
      
    }
      else 
      console.error("Id passeggero non  presente");
    
    }
    //conversione della formattazione della data e dell'ora per renderla leggibile
    dataOraLeggibile(dataOra:string[]):string {
      if(dataOra!==undefined)
      return `${dataOra[2]}-${dataOra[1]}-${dataOra[0]}, ${dataOra[3]}:${dataOra[4]}:${dataOra[5]}`;
      else return "errore"
    }

    //aggiorna posizione manualmente
   aggiornaPosizione(){
    location.reload();
    location.reload();
   }


}


