import { Observable, Subject } from 'rxjs';
import { UpdateAvailableEvent } from '@angular/service-worker';

export class SwUpdateStub {
  available: Observable<UpdateAvailableEvent> = new Subject();
  isEnabled: boolean;
  activateUpdate(): Promise<void> {
    return new Promise(resolve => resolve());
  }
  checkForUpdate(): Promise<void> {
    return new Promise(resolve => resolve());
  }
}
