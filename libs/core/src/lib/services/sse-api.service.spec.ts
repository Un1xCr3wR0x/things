import { TestBed } from '@angular/core/testing';

import { SseApiService } from './sse-api.service';

let sseApiService: SseApiService;
describe('SseApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SseApiService]
    });
    sseApiService = TestBed.inject(SseApiService);
  });

  it('should be created', () => {
    const service: SseApiService = TestBed.get(SseApiService);
    expect(service).toBeTruthy();
  });
  describe('getEventSource', () => {
    it('should get event source', () => {
      expect(sseApiService.getEventSource(sseApiService.sseApiUrl)).toEqual(new EventSource(sseApiService.sseApiUrl));
    });
  });
  describe('closeEventSource', () => {
    it('should close event source', () => {
      sseApiService.eventSource = sseApiService.getEventSource(sseApiService.sseApiUrl);
      sseApiService.closeEventSource();
      expect(sseApiService.eventSource.readyState).toEqual(sseApiService.eventSource.CLOSED);
    });
  });
  describe('getServerSentEvent', () => {
    it('should get server event source', () => {
      expect(sseApiService.getServerSentEvent()).toBeDefined();
    });
  });
});
