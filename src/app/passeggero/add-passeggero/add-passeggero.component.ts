import { Component, OnInit } from '@angular/core';
import { PasseggeroService} from '../passeggero.service'
import { Passeggero } from '../passeggero';

@Component({
  selector: 'app-add-passeggero',
  templateUrl: './add-passeggero.component.html',
  styleUrl: './add-passeggero.component.css'
})
export class AddPasseggeroComponent{

  passeggero : Passeggero = new Passeggero();

  constructor(private passeggeroService: PasseggeroService){}
  addPasseggero(){
    console.log(this.passeggero);
    this.passeggeroService.addPasseggero(this.passeggero).subscribe();
  }
}
