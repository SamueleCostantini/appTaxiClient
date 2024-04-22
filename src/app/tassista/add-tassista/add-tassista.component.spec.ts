import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTassistaComponent } from './add-tassista.component';

describe('AddTassistaComponent', () => {
  let component: AddTassistaComponent;
  let fixture: ComponentFixture<AddTassistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTassistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTassistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
