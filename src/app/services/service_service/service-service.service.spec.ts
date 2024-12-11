import { TestBed } from '@angular/core/testing';

import { ServiceServiceService } from './service-service.service';

describe('ServiceServiceService', () => {
  let service: ServiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
