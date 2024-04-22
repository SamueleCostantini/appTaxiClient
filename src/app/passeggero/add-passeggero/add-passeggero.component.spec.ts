import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPasseggeroComponent } from './add-passeggero.component';

describe('AddPasseggeroComponent', () => {
  let component: AddPasseggeroComponent;
  let fixture: ComponentFixture<AddPasseggeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPasseggeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPasseggeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
