import { of } from 'rxjs';
import { eventDateDetailsMockData } from 'testing/test-data';

export class EventDateServiceStub {
  getEventDetails() {
    return of(eventDateDetailsMockData);
  }
  returnEventDate() {
    return of({ bilingualMessage: null });
  }
  approveEventDate() {
    return of({ bilingualMessage: null });
  }
  getEventDetailsByDate() {
    return of(eventDateDetailsMockData);
  }
  rejectEventDate() {
    return of('');
  }
}
