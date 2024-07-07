import { of } from 'rxjs';

export class TransferContributorServiceStub {
  updateTansferContributor() {
    return of({ message: { english: 'Transaction is Successful', arabic: '' } });
  }

  getTransferDetails() {
    return of(transferDetailsMock);
  }

  getTransferAllDetails() {
    return of(transferAllDetailsMock);
  }

  submitTransferRequest() {
    return of({ message: { english: 'Transaction is Successful', arabic: '' } });
  }

  revertTransactionAll() {
    return of(true);
  }
}

export const transferDetailsMock = {
  formSubmissionDate: {
    gregorian: new Date()
  },
  transferTo: 0
};

export const transferAllDetailsMock = {
  transferFrom: 929908589,
  transferTo: 929908031,
  transferDate: {
    gregorian: new Date(),
    hijiri: '1440-07-06'
  },
  referenceNo: 494954
};
