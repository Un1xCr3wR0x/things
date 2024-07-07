import { of } from 'rxjs';

export class SecondedServiceStub {
  submitSecondedDetails() {
    return of({ message: { english: 'Transaction is successful', arabic: '' } });
  }

  getSecondedDetails() {
    return of(secondedDetailsMock);
  }

  revertTransaction() {
    return of(true);
  }
}

export const secondedDetailsMock = {
  contractDate: {
    gregorian: new Date('2020-08-01T00:00:00.000Z'),
    hijiri: '1441-12-11'
  },
  endDate: {
    gregorian: new Date('2020-08-24T00:00:00.000Z'),
    hijiri: '1441-12-11'
  },
  startDate: {
    gregorian: new Date('2020-08-24T00:00:00.000Z'),
    hijiri: '1441-12-11'
  },
  personId: 1019129538
};
