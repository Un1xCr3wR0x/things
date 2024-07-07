import { GosiCalendar } from '@gosi-ui/core';
import { of } from 'rxjs';

export class CalendarServiceStub {
  addToHijiriDate() {
    return of(new GosiCalendar());
  }
}
