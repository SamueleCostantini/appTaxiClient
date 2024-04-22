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
    this.passeggeroService.login(this.credenziali).subscribe(response => {this.passeggero = response });
    console.log(this.passeggero);
    this.logged = true;
    this.isVisible = false;
    this.utenteIsVisible = true;
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
