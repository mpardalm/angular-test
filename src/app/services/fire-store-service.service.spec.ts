import { TestBed } from '@angular/core/testing';

import { FireStoreServiceService } from './fire-store-service.service';

describe('FireStoreServiceService', () => {
  let service: FireStoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireStoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
