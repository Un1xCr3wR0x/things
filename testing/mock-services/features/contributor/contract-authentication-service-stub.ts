import { BilingualText, TransactionFeedback } from '@gosi-ui/core';
import { ClausesWrapper, ViolationRequest, ValidateContractResponse } from '@gosi-ui/features/contributor';
import { of } from 'rxjs';
import { contractDetails } from 'testing';
import { HttpResponse } from '@angular/common/http';

export class ContractAuthenticationServiceStub {
  getContracts() {
    return of({ contracts: contractDetails, count: 1 });
  }

  getListOfClauses() {
    return of(new ClausesWrapper());
  }

  addContractDetails() {
    return of({ message: new BilingualText(), contractId: 1600765 });
  }

  generateOTP() {
    return of(654321);
  }

  verifyOTP() {
    return of(new HttpResponse());
  }

  reSendOTP() {
    return of(true);
  }

  validateContract() {
    return of(new ValidateContractResponse());
  }

  validateCaptchaContract() {
    return of(new ValidateContractResponse());
  }

  getUnifiedContract() {
    return of(contractByRef);
  }

  getPendingContractByRef() {
    return of({ daysLeft: 7, autoCancellationDate: { gregorian: '22/07/2020' } });
  }

  acceptPendingContract() {
    return of(new TransactionFeedback());
  }

  rejectPendingContract() {
    return of(new TransactionFeedback());
  }

  saveClauseDetails() {
    return of(new TransactionFeedback());
  }

  cancelPendingContract() {
    return of(new TransactionFeedback());
  }

  getViolationRequest() {
    return of(new ViolationRequest());
  }

  approveEngagement() {
    return of(new BilingualText());
  }

  modifyDate() {
    return of(new BilingualText());
  }

  printPreview() {
    return of(new Blob());
  }

  printPreviewByRef() {
    return of(new Blob());
  }

  getNoAuthHeaders() {
    return {};
  }
}

export const contractByRef = {
  contract: {
    wage: {
      basic: 100,
      housing: 200,
      transportationAllowance: 0,
      total: 300
    }
  },
  firstPartyInfo: {},
  secondPartyInfo: {},
  workDomain: 'inside Saudi',
  workType: { english: 'Full Time', arabic: 'Full Time' },
  bankAccount: { ibanBankAccountNo: 'SA206030023156478954211245', bankName: 'Emirates' }
};
