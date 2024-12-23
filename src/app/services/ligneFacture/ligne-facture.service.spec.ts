import { TestBed } from '@angular/core/testing';

import { LigneFactureService } from './ligne-facture.service';

describe('LigneFactureService', () => {
  let service: LigneFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigneFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
