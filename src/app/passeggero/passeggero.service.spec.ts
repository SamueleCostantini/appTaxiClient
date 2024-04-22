import { TestBed } from '@angular/core/testing';

import { PasseggeroService } from './passeggero.service';

describe('PasseggeroService', () => {
  let service: PasseggeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasseggeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
