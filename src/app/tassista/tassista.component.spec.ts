import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TassistaComponent } from './tassista.component';

describe('TassistaComponent', () => {
  let component: TassistaComponent;
  let fixture: ComponentFixture<TassistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TassistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TassistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
