import { Component } from '@angular/core';
import { Credenziali } from './credenziali-login';
import { ElementRef,ViewChild } from '@angular/core';
import { TassistaService } from './tassista.service';
import { Tassista } from './tassista';

@Component({
  selector: 'app-tassista',
  templateUrl: './tassista.component.html',
  styleUrl: './tassista.component.css'
})
export class TassistaComponent {
  @ViewChild('name') name!: ElementRef;

  logged : boolean = false;
  tassista : Tassista = new Tassista();
  credenziali: Credenziali = new Credenziali();
 constructor(private tassistaService: TassistaService){}
  
  isVisible: boolean = true;
  utenteIsVisible: boolean = false;
  modCredenzialiIsVisible : boolean = false;
  showTaxiIsVisible : boolean = false;

 login(){
   

   console.log(this.credenziali);
  
   this.tassistaService.login(this.credenziali).subscribe(
    response => {
      this.logged = true;
      this.tassista = response; console.log(response) 
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
        }
  );
   console.table(this.tassista);
  
   if(this.logged === true){
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
   console.log(this.tassista.email+" modifica "+attributo+" in "+ this.name.nativeElement.value);
   this.tassistaService.edittassista(this.tassista.email, attributo, this.name.nativeElement.value).subscribe(response => {console.log(response)});
 }
 showTaxi(){
   this.showTaxiIsVisible = true;
   this.modCredenzialiIsVisible = false;
 }
 showCronologia(){
   
 }
}
