import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaPrenotazioneComponent } from './richiesta-prenotazione.component';

describe('RichiestaPrenotazioneComponent', () => {
  let component: RichiestaPrenotazioneComponent;
  let fixture: ComponentFixture<RichiestaPrenotazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RichiestaPrenotazioneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichiestaPrenotazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
