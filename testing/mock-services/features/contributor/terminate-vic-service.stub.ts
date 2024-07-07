import { of } from 'rxjs';

export class TerminateVicServiceStub {
  saveVicTermination() {
    return of({ referenceNo: 665325, message: { english: 'Transaction is Successful', arabic: '' } });
  }

  submitVicTermination() {
    return of({ referenceNo: 663018, message: { english: 'Transaction is Successful', arabic: '' } });
  }

  getTerminateVicDetails() {
    return of(terminationVicDetailsMock);
  }
}

export const terminationVicDetailsMock = {
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
