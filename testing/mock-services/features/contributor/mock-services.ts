import { of } from 'rxjs';
import { GosiCalendar, TransactionReferenceData, bindToObject } from '@gosi-ui/core';
import { transactionReferenceData } from 'testing';

export class ValidateWageUpdateServiceStub {
  getOccupationAndWageDetails() {
    return of({
      joiningDate: new GosiCalendar(),
      transactionRefNo: 13456,
      transactionReferenceData: [bindToObject(new TransactionReferenceData(), transactionReferenceData)],
      updateWageList: []
    });
  }
  rejectOrReturnEst() {
    return of({ arabic: 'ر.س', english: 'returned successfully' });
  }
}
