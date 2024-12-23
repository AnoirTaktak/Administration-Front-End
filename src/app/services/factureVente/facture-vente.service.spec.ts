import { TestBed } from '@angular/core/testing';

import { FactureVenteService } from './facture-vente.service';

describe('FactureVenteService', () => {
  let service: FactureVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
