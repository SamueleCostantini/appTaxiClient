import { Component } from '@angular/core';
import { Tassista } from '../tassista';
import { TassistaService } from '../tassista.service';
import { Route, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-add-tassista',
  templateUrl: './add-tassista.component.html',
  styleUrl: './add-tassista.component.css'
})
/* script della pagina registrazione per i tassisti */
export class AddTassistaComponent {
  tassista : Tassista = new Tassista();

  //costruttore che dichiara l'oggetto tassista service che contiene le chiamate api per i tassisti
  constructor(private tassistaService: TassistaService, private router: Router){}
  
  //funzione che richiama funzione di tassista service che manda una richiesta post per aggiungere un tassista
  addtassista(){
    console.log(this.tassista); //stampa del json allegato alla richiesta nella console per debug

    //richiamo della funzione in tassista service
    this.tassistaService.addTassista(this.tassista).subscribe(response => { 
      //richiesta a buon fine
      console.log(response)
      alert("La registrazione è andata a buon fine, effettua l'accesso per accedere alla pagina utente");
      this.router.navigate(['/tassista']); //redirect alla pagina utente
    }, 
    error => {
      //richiesta riceve un errore
      if(error.status === 500){
        alert("Non siamo riusciti a soddisfare la tua richiesta, rincontrolla i dati inseriti e riprova più tardi")
      }
      
    });
  }
}
