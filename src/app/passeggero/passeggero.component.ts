import { Component, ViewChild, ElementRef } from '@angular/core';
import { Passeggero } from './passeggero';
import { PasseggeroService } from "./passeggero.service";
import { Credenziali } from "./credenziali-login"
import { response } from 'express';

@Component({
  selector: 'app-passeggero',
  templateUrl: './passeggero.component.html',
  styleUrl: './passeggero.component.css'
})
export class PasseggeroComponent {
  
  @ViewChild('name') name!: ElementRef;

   passeggero : Passeggero = new Passeggero();
   credenziali: Credenziali = new Credenziali();
  constructor(private passeggeroService: PasseggeroService){}
   logged: boolean = false;
   isVisible: boolean = true;
   utenteIsVisible: boolean = false;
   modCredenzialiIsVisible : boolean = false;
   showTaxiIsVisible : boolean = false;

  login(){
    

    console.log(this.credenziali);
    let errore : string = "";
    this.passeggeroService.login(this.credenziali).subscribe(
      response => {
        this.logged=true;
        this.passeggero = response},
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
    console.log(this.passeggero);
    if(this.logged){
    this.logged = true;
    this.isVisible = false;
    this.utenteIsVisible = true;
    }
  }
  edit(){
    this.modCredenzialiIsVisible = true;
    this.showTaxiIsVisible = false;
  }
  edit1(attributo : string){
    console.log(this.passeggero.email+" modifica "+attributo+" in "+ this.name.nativeElement.value);
    this.passeggeroService.editPasseggero(this.passeggero.email, attributo, this.name.nativeElement.value).subscribe(response => {console.log(response)});
  }
  showTaxi(){
    this.showTaxiIsVisible = true;
    this.modCredenzialiIsVisible = false;
  }
  showCronologia(){
    
  }
 
}
