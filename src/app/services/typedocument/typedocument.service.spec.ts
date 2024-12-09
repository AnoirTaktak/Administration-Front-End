import { TestBed } from '@angular/core/testing';

import { TypedocumentService } from './typedocument.service';

describe('TypedocumentService', () => {
  let service: TypedocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypedocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
