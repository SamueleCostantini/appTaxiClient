import { TestBed } from '@angular/core/testing';

import { TassistaService } from './tassista.service';

describe('TassistaService', () => {
  let service: TassistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TassistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
