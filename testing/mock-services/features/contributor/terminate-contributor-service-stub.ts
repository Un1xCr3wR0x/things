import { of } from 'rxjs';

export class TerminateContributorServiceStub {
  submitTerminateTransaction() {
    return of({ message: { english: 'Transaction is Successful', arabic: '' } });
  }

  getTerminationDetails() {
    return of(terminationDetailsMock);
  }

  terminateAllActiveEngagements() {
    return of({ english: 'Transaction is Successful', arabic: '' });
  }
}

export const terminationDetailsMock = {
  formSubmissionDate: {
    gregorian: new Date()
  },
  joiningDate: {
    gregorian: new Date('2020-07-01T00:00:00.000Z'),
    hijiri: '1441-11-10'
  },
  leavingDate: {
    gregorian: '2020-07-28T00:00:00.000Z'
  },
  leavingReason: {
    arabic: 'تغيير التقويم',
    english: 'Calendar Change'
  },
  terminationType: 'Regular Termination'
};
