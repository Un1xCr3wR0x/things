import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseApiService {
  sseApiUrl = 'http://feaapplvd19:8030/fs-api/sse/register/110/110';
  eventSource: EventSource;
  constructor(private zone: NgZone) {}

  getServerSentEvent() {
    return new Observable(observer => {
      this.eventSource = this.getEventSource(this.sseApiUrl);
      this.eventSource.addEventListener('message', (event: MessageEvent) => {
        this.zone.run(() => {
          observer.next(event);
        });
      });
      this.eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
  closeEventSource() {
    this.eventSource.close();
  }
}
