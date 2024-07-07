import { TestBed } from '@angular/core/testing';

import { RecordGovernmentReceiptsService } from './record-government-receipts.service';

describe('RecordGovernmentReceiptsService', () => {
  let service: RecordGovernmentReceiptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordGovernmentReceiptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
