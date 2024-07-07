import { TestBed } from '@angular/core/testing';

import { ParticipantQueueService } from './participant-queue.service';

describe('ParticipantQueueService', () => {
  let service: ParticipantQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
