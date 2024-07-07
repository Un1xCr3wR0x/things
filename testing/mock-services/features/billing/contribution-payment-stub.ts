import { of } from 'rxjs';
import {
  contributionPaymentMockToken,
  paymentDetailsMockData,
  paymentResponseMockData,
  workFlowStatusMock
} from 'testing/test-data';
import { LovList } from '@gosi-ui/core';

export class ContributionPaymentServiceStub {
  savePaymentDetails() {
    return of(paymentResponseMockData);
  }

  submitPaymentDetails() {
    return of(paymentResponseMockData);
  }

  submitAfterEdit() {
    return of(contributionPaymentMockToken);
  }

  updatePayment() {
    return of(paymentResponseMockData);
  }
  getWorkFlowStatus() {
    return of(workFlowStatusMock);
  }
  cancelPayment() {
    return of(paymentResponseMockData);
  }

  getReceiptDetails() {
    return of(paymentDetailsMockData);
  }

  revertPaymentDetails() {
    return of('');
  }

  approvePayment() {
    return of({ bilingualMessage: null });
  }

  rejectPayment() {
    return of({ bilingualMessage: null });
  }

  returnPayment() {
    return of({ bilingualMessage: null });
  }

  handleWorkflowActions() {
    return of('');
  }

  sortLovList() {
    return of(new LovList([]));
  }
  cancelPaymentDetails() {
    return of('');
  }
}
