/** Pagina per la gestione delle routes e dei redirect in base al nome del component */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxiComponent } from './taxi/taxi.component';
import { HomeComponent } from './home/home.component';
import { PasseggeroComponent } from './passeggero/passeggero.component';
import { AddPasseggeroComponent } from './passeggero/add-passeggero/add-passeggero.component';
import { AddTassistaComponent } from './tassista/add-tassista/add-tassista.component';
import { TassistaComponent } from './tassista/tassista.component';
import { RichiestaPrenotazioneComponent } from './prenotazione/richiesta-prenotazione/richiesta-prenotazione.component';

//routes da una stringa/nominativo ad un percorso di una pagina specifica
const routes: Routes = [
  {path: "taxi", component: TaxiComponent},
  {path: 'home', component: HomeComponent},
  {path: "passeggero", component: PasseggeroComponent},
  {path: "tassista", component: TassistaComponent},
  {path: "registrati", component: AddPasseggeroComponent},
  {path: "registrati-tassista", component: AddTassistaComponent},
  {path: "richiesta-prenotazione", component: RichiestaPrenotazioneComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
