import { Component, OnInit } from '@angular/core';
import { Taxi } from './taxi';
import { HttpClient } from '@angular/common/http';
import { TaxiService } from './taxi.service';

@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent implements OnInit{

    
    taxi: Taxi = new Taxi();
    taxiList?: Taxi[];

    constructor(private taxiService: TaxiService) {}

    ngOnInit(): void {
      this.getAllTaxis();
    }

    getAllTaxis(){
      this.taxiService.getAllTaxi().subscribe(data => {this.taxiList = data;});
    }
    onSubmit(): void{

    }
    addTaxi(){
      console.log(this.taxi);
      this.taxiService.addTaxi(this.taxi).subscribe();
    }

}
