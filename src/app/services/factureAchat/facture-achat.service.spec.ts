import { TestBed } from '@angular/core/testing';

import { FactureAchatService } from './facture-achat.service';

describe('FactureAchatService', () => {
  let service: FactureAchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureAchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
