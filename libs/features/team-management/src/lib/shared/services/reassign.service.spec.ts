import { TestBed } from '@angular/core/testing';

import { ReassignService } from './reassign.service';

describe('ReassignService', () => {
  let service: ReassignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReassignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
