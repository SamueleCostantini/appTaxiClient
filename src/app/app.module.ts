import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaxiComponent } from './taxi/taxi.component';
import { TassistaComponent } from './tassista/tassista.component';
import { PasseggeroComponent } from './passeggero/passeggero.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './home/home.component';
import { AddPasseggeroComponent } from './passeggero/add-passeggero/add-passeggero.component';
import { AddTassistaComponent } from './tassista/add-tassista/add-tassista.component'
import { Credenziali } from './passeggero/credenziali-login';
import { PrenotazioneComponent } from './prenotazione/prenotazione.component';



@NgModule({
  declarations: [
    AppComponent,
    TaxiComponent,
    TassistaComponent,
    PasseggeroComponent,
    HomeComponent,
    AddPasseggeroComponent,
    AddTassistaComponent,
    PrenotazioneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HttpClientModule, FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
