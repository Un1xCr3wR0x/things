import { Injectable } from '@angular/core';
import { DocumentItem, TransactionFeedback } from '@gosi-ui/core';
import {
  BranchEligibility,
  ChangeGroupEstablishmentService,
  ChangeMainRequest,
  DelinkRequest
} from '@gosi-ui/features/establishment';
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class ChangeGroupEstablishmentStubService extends ChangeGroupEstablishmentService {
  /**
   * Method to save the new main establishment details
   * @param registrationNo
   * @param changeMainRequest
   */
  saveMainEstablishment(registrationNo: number, changeMainRequest: ChangeMainRequest) {
    if (registrationNo || changeMainRequest) {
      return of(new TransactionFeedback());
    } else {
      return throwError('no inputs');
    }
  }

  checkEligibility(registrationNo: number): Observable<BranchEligibility[]> {
    if (registrationNo) {
      return of([new BranchEligibility()]);
    } else {
      return throwError('no inputs');
    }
  }
  saveDelinkedEstablishment(registrationNo: number, delinkRequest: DelinkRequest) {
    if (registrationNo || delinkRequest) {
      return of(new TransactionFeedback());
    } else {
      return throwError('no inputs');
    }
  }

  updateDelinkedEstablishment(registrationNo: number, delinkRequest: DelinkRequest) {
    if (registrationNo || delinkRequest) {
      return of(new TransactionFeedback());
    } else {
      return throwError('no inputs');
    }
  }

  getDocuments(
    transactionKey: string,
    transationType: string | string[],
    identifier: number,
    referenceNo?: number,
    status?: string
  ): Observable<DocumentItem[]> {
    if (transactionKey || transationType || identifier || referenceNo || status) {
      return of([new DocumentItem()]);
    } else {
      return throwError('no inputs');
    }
  }
}
