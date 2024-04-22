import { Component } from '@angular/core';
import { Tassista } from '../tassista';
import { TassistaService } from '../tassista.service';

@Component({
  selector: 'app-add-tassista',
  templateUrl: './add-tassista.component.html',
  styleUrl: './add-tassista.component.css'
})
export class AddTassistaComponent {
  tassista : Tassista = new Tassista();

  constructor(private tassistaService: TassistaService){}
  addtassista(){
    console.log(this.tassista);
    this.tassistaService.addTassista(this.tassista).subscribe();
  }
}
