import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasseggeroComponent } from './passeggero.component';

describe('PasseggeroComponent', () => {
  let component: PasseggeroComponent;
  let fixture: ComponentFixture<PasseggeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasseggeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasseggeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
