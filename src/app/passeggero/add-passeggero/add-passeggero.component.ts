import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasseggeroService} from '../passeggero.service'
import { Passeggero } from '../passeggero';
import { response } from 'express';

@Component({
  selector: 'app-add-passeggero',
  templateUrl: './add-passeggero.component.html',
  styleUrl: './add-passeggero.component.css'
})
export class AddPasseggeroComponent{
 //dichiarazione passeggero locale
  passeggero : Passeggero = new Passeggero();

  constructor(private passeggeroService: PasseggeroService,private router: Router){}

  //funzione che richiama una funzione di passeggeroService che manda una richiesta post per la registrazione
  addPasseggero(){
    console.log(this.passeggero); 
    //gestione la risposta del server alla chiamata api
    this.passeggeroService.addPasseggero(this.passeggero).subscribe(response => { //se positiva 
       //richiesta a buon fine
       console.log(response)
       alert("La registrazione è andata a buon fine, effettua l'accesso per accedere alla pagina utente");
       this.router.navigate(['/passeggero']); //redirect alla pagina utente

    }, error => { //se riceve un errore
      if(error.status === 500){
        alert("Non siamo riusciti a soddisfare la tua richiesta, rincontrolla i dati inseriti e riprova più tardi")
      }
      
    });
    ;
  }
}
