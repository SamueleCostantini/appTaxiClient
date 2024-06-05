import { Component, OnInit } from '@angular/core';
import { PrenotazioneService } from './prenotazione.service';
import { prenotazione } from './prenotazione';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrl: './prenotazione.component.css'
})
export class PrenotazioneComponent implements OnInit{


  constructor(private prenotazioneService: PrenotazioneService, protected p: prenotazione, private route: ActivatedRoute){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if(id != null)
        this.p.id = parseInt(id);
    }
    )
    if(this.p.id)
      this.prenotazioneService.getPrenotazioneById(this.p.id).subscribe(response => {
    this.p = response;
    })
  }


}
