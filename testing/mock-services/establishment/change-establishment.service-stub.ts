import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Establishment, GosiCalendar, Person, TransactionFeedback, TransactionReferenceData } from '@gosi-ui/core';
import {
  ChangeEstablishmentService,
  EstablishmentWorkFlowStatus,
  LateFeeRequest,
  Owner,
  PatchAddressDetails,
  PatchBasicDetails,
  PatchContactDetails,
  PatchIdentifierDetails,
  PatchLegalEntity,
  PatchMofPaymentDetails,
  QueryParam,
  RestrictOwner
} from '@gosi-ui/features/establishment';
import { PatchBankDetails } from '@gosi-ui/features/establishment/lib/shared/models/patch-bank-details';
import { Observable, of, throwError } from 'rxjs';
import { genericError } from 'testing';
import { establishmentOwnersWrapperTestData, genericEstablishmentResponse } from 'testing/test-data';

@Injectable({
  providedIn: 'root'
})
export class ChangeEstablishmentServiceStub extends ChangeEstablishmentService {
  constructor(readonly httpClient: HttpClient, readonly router: Router) {
    super(httpClient, router);
  }

  getOwners(registrationNo: number, queryParams?: QueryParam[]) {
    if (registrationNo || queryParams) {
      return of([new Owner()]);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to update the establishment basic details
   * @param registrationNo
   * @param updatedBasicDetails
   */
  updateEstablishmentBasicDetails(registrationNo: number, updatedBasicDetails: PatchBasicDetails) {
    if (registrationNo || updatedBasicDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to update the establishment contact details
   * @param registrationNo
   * @param updatedContactDetails
   */
  changeAddressDetails(
    registrationNo: number,
    updatedAddressDetails: PatchAddressDetails
  ): Observable<TransactionFeedback> {
    if (registrationNo && updatedAddressDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to update the establishment contact details
   * @param registrationNo
   * @param updatedContactDetails
   */
  changeContactDetails(
    registrationNo: number,
    updatedContactDetails: PatchContactDetails
  ): Observable<TransactionFeedback> {
    if (registrationNo || updatedContactDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to update the identifier details
   *
   */
  changeIdentifierDetails(
    registrationNo: number,
    updatedIdentifierDetails: PatchIdentifierDetails
  ): Observable<TransactionFeedback> {
    if (registrationNo || updatedIdentifierDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to update the establishment bank details
   * @param registrationNo
   * @param updatedBasicDetails
   */
  changeBankDetails(registrationNo: number, updatedBankDetails: PatchBankDetails) {
    if (registrationNo && updatedBankDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to get work flow status of a establishment
   * @param registrationNo
   */
  getEstablishmentWorkflowStatus(registrationNo: number): Observable<EstablishmentWorkFlowStatus[]> {
    if (registrationNo) {
      return of([
        {
          type: 'Establishment Details',
          message: { english: '', arabic: '' },
          referenceNo: 728234
        },
        {
          type: 'Identifier Details',
          message: { english: '', arabic: '' },
          referenceNo: 728234
        }
      ]);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to search establishment details
   */
  getEstablishmentFromTransient(regNo: number, referenceNo: number) {
    if (regNo || referenceNo) {
      return of(genericEstablishmentResponse);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to search establishment owner details
   */
  searchOwner(registrationNo: number, queryParams?: QueryParam[]) {
    if (registrationNo || queryParams) {
      return of(establishmentOwnersWrapperTestData);
    } else {
      throwError('No Inputs');
    }
  }

  /**
   * This method is to fetch the Owners validating details
   * @param queryParams
   */
  searchOwnerWithQueryParams(registrationNo: number, queryParams?: QueryParam[]): Observable<Owner[]> {
    if (registrationNo || queryParams) {
      const owner: Owner = {
        startDate: new GosiCalendar(),
        endDate: new GosiCalendar(),
        person: new Person(),
        recordAction: 'ADD',
        ownerId: 12345,
        bindToNewInstance: new Owner().bindToNewInstance
      };
      return of([owner]);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * This method is to fetch the comments
   * @param queryParams
   */
  getComments(queryParams: QueryParam[]) {
    if (queryParams) {
      return of([new TransactionReferenceData()]);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * This method is to cancel a transaction
   * @param queryParams
   */
  cancelTransaction(registrationNo: number, referenceNo: number): Observable<null> {
    if (registrationNo || referenceNo) {
      return of(null);
    } else {
      return throwError('No Inputs');
    }
  }
  /**
   * This method is to cancel a transaction
   * @param queryParams
   */
  revertTransaction(registrationNo: number, referenceNo: number): Observable<null> {
    if (!registrationNo && !referenceNo) return throwError('No Inputs');
    return of(null);
  }
  getAddOwnersInWorkflow(registrationNo): Observable<EstablishmentWorkFlowStatus[]> {
    if (registrationNo) {
      return of([]);
    } else {
      return throwError('No Inputs');
    }
  }

  canAddOwner(establishment: Establishment): Observable<RestrictOwner> {
    if (establishment) {
      return of(new RestrictOwner());
    } else {
      return throwError('No Inputs');
    }
  }

  /**
   * Method to update legal entity
   * @param registrationNo
   * @param legalEntityData
   */
  changeLegalEntity(registrationNo: number, legalEntityData: PatchLegalEntity): Observable<TransactionFeedback> {
    if (registrationNo || legalEntityData) {
      return of(new TransactionFeedback());
    } else {
      return throwError('No Inputs');
    }
  }

  changeLateFeeIndicator(lateFeeDetails: LateFeeRequest, registrationNo: number): Observable<TransactionFeedback> {
    if (registrationNo || lateFeeDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError('No Inputs');
    }
  }
  changeMofPaymnetDetails(
    registrationNo: number,
    updatedBankDetails: PatchMofPaymentDetails
  ): Observable<TransactionFeedback> {
    if (registrationNo || updatedBankDetails) {
      return of(new TransactionFeedback());
    } else {
      return throwError('No Inputs');
    }
  }
}
