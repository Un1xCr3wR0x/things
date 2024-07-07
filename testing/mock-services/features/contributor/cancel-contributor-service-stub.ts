import { of } from 'rxjs';

export class CancelContributorServiceStub {
  submitCancelContributor() {
    return of({ message: { english: 'Transaction is successful', arabic: '' } });
  }

  getCancellationDetails() {
    return of(cancellationDetailsMock);
  }
}

export const cancellationDetailsMock = {
  joiningDate: {
    gregorian: new Date('2020-08-01T00:00:00.000Z'),
    hijiri: '1441-12-11'
  },
  leavingDate: {
    gregorian: new Date('2020-08-24T00:00:00.000Z')
  },
  leavingReason: {
    arabic: 'أخرى',
    english: 'Others'
  },
  cancellationReason: {
    arabic: 'Wrong Registration ',
    english: 'Wrong Registration'
  },
  cancellationDate: {
    gregorian: new Date('2020-08-24T00:00:00.000Z')
  }
};
