/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BehaviorSubject } from 'rxjs';
import { eventDateListMock } from 'testing';

/**
 * Stub class for ContributorService.
 *
 * @export
 * @class EventServiceStub
 */
export class EventServiceStub {
  EventDetails: BehaviorSubject<any> = new BehaviorSubject<any>(eventDateListMock);

  getEventDetailsByDate() {
    return this.EventDetails.asObservable();
  }
}
