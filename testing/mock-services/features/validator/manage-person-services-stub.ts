import { TransactionWorkflowItem } from '@gosi-ui/core';
import { WorkflowWrapper } from '@gosi-ui/features/customer-information/lib/shared';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { establishmentProfileResponse } from 'testing/test-data';
import {
  contributorSearchResponse,
  genericError,
  getTransactionWorkflowResponse,
  getWorkflowResponse,
  personResponse,
  transactionWorkflowList
} from 'testing/test-data/features/customer-information/components/test-data';

export class ManagePersonServiceStub {
  contributor$: BehaviorSubject<any> = new BehaviorSubject<any>({ person: {} });
  getPerson(personId) {
    if (personId) {
      return of(personResponse);
    }
  }

  /**
   * This method is used to get the person bank details
   * @param personId
   */
  getBankDetails(personId: number) {
    if (personId) {
      return throwError(genericError);
    }
  }

  fetchContributor(regNo: number, socialInsuranceNo: number) {
    if (regNo || socialInsuranceNo) {
      return of(contributorSearchResponse);
    } else {
      return throwError(genericError);
    }
  }

  approveContributorTransaction(estRegistrationNo, socialInsuranceNo, data) {
    if (estRegistrationNo || socialInsuranceNo || data) {
      return of({ bilingualMessage: null });
    } else {
      return throwError(genericError);
    }
  }
  rejectContributorTransaction(estRegistrationNo, socialInsuranceNo, personValidatorForm) {
    if (estRegistrationNo || socialInsuranceNo || personValidatorForm) {
      return of({ bilingualMessage: null });
    } else {
      return throwError(genericError);
    }
  }
  returnContributorTransaction(estRegistrationNo, socialInsuranceNo, personValidatorForm) {
    if (estRegistrationNo || socialInsuranceNo || personValidatorForm) {
      return of({ bilingualMessage: null });
    } else {
      return throwError(genericError);
    }
  }

  bindQueryParamsToForm(query) {
    if (query) {
      return of(getWorkflowResponse);
    } else {
      return throwError(genericError);
    }
  }

  getContributor(estRegistrationNo, socialInsuranceNo) {
    if (estRegistrationNo || socialInsuranceNo) {
      return of(contributorSearchResponse);
    } else {
      return throwError(genericError);
    }
  }

  getEstablishmentProfile(regNo: number) {
    if (regNo) {
      return of(establishmentProfileResponse);
    } else {
      return throwError(genericError);
    }
  }

  getWorkFlowDetails(traceId): Observable<TransactionWorkflowItem[]> {
    if (traceId) {
      return of(transactionWorkflowList);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * This method is used to get the engagement status of contributor
   * @param personId
   */
  getActiveStatus(personId): Observable<any> {
    if (personId) {
      return throwError(genericError);
    } else {
      return throwError(genericError);
    }
  }
  fetchContributorDetails() {
    return contributorSearchResponse;
  }
  getTaskDetails(role, isContributor, sin, personId) {
    if (role || isContributor || sin || personId) {
      return of(new WorkflowWrapper());
    }
  }
}
