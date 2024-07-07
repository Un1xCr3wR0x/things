import { Injectable } from '@angular/core';
import { FlagEstablishmentService, FlagQueryParam, FlagRequest } from '@gosi-ui/features/establishment';
import { of, throwError } from 'rxjs';
import { flagDetailsMock, genericError } from 'testing';
import { TransactionFeedback } from '@gosi-ui/core';

@Injectable()
export class FlagEstablishmentStubService extends FlagEstablishmentService {
  getFlags(regNo: number) {
    if (regNo) {
      return of([flagDetailsMock]);
    } else {
      return throwError(genericError);
    }
  }
  getFlagDetails(regNo: number, params: FlagQueryParam) {
    if (regNo || params) {
      return of([flagDetailsMock]);
    } else {
      return throwError(genericError);
    }
  }
  submitFlagDetails(isFinalSubmit: boolean) {
    if (isFinalSubmit) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  saveModifiedFlagDetails(registrationNo: number, flagRequest: FlagRequest, flagId: number) {
    if (registrationNo || flagRequest || flagId) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }
  saveFlagDetails(registrationNo: number, flagRequest: FlagRequest) {
    if (registrationNo || flagRequest) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }
}
