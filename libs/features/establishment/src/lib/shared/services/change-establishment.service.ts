/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddressDetails,
  ApplicationTypeEnum,
  Establishment,
  EstablishmentProfile,
  RouterConstants,
  TransactionFeedback,
  startOfDay
} from '@gosi-ui/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../constants';
import {
  ActionTypeEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  LegalEntityEnum,
  WorkFlowStatusType
} from '../enums';
import {
  EstablishmentOwnersWrapper,
  EstablishmentWorkFlowStatus,
  LateFeeRequest,
  Owner,
  PatchAddressDetails,
  PatchBankDetails,
  PatchBasicDetails,
  PatchContactDetails,
  PatchIdentifierDetails,
  PatchLegalEntity,
  PatchMofPaymentDetails,
  QueryParam,
  RestrictOwner
} from '../models';
import { getParams, restrictOwner as shouldRestrict } from '../utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ChangeEstablishmentService {
  establishmentProfile: EstablishmentProfile;
  selectedRegistrationNo: number; // Selected establishment registration number from branches : Can be main or branch
  selectedEstablishment: Establishment; // Selected establishment to be changed
  ownerCountIncludingEstablishmentAsOwner:number;

  constructor(readonly http: HttpClient, readonly router: Router) {}

  /**
   * This method is to check the owner details of the establishment
   * @param registrationNo
   */
  getOwners(registrationNo: number, queryParams?: QueryParam[]): Observable<Owner[]> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    if (queryParams) {
      let params = new HttpParams();
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
      return this.http
        .get<EstablishmentOwnersWrapper>(getEstablishmentUrl, { params })
        .pipe(map(owner => owner.owners));
    } else {
      return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl).pipe(map(owner => owner.owners));
    }
  }

  /**
   * Method to update the establishment basic details
   * @param registrationNo
   * @param updatedBasicDetails
   */
  updateEstablishmentBasicDetails(
    registrationNo: number,
    updatedBasicDetails: PatchBasicDetails
  ): Observable<TransactionFeedback> {
    const patchBasicDetailsUrl = `/api/v1/establishment/${registrationNo}/basic-details`;
    if (updatedBasicDetails.startDate !== undefined) {
      updatedBasicDetails.startDate.gregorian = startOfDay(updatedBasicDetails.startDate.gregorian);
    }
    return this.http.patch<TransactionFeedback>(patchBasicDetailsUrl, updatedBasicDetails);
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
    const patchContactDetailsUrl = `/api/v1/establishment/${registrationNo}/address-details`;

    return this.http.patch<TransactionFeedback>(patchContactDetailsUrl, updatedAddressDetails);
  }
  /**
   *
   * @param queryParam
   */
  getEstablishmentWaselAddress(queryParam, registrationNo: number): Observable<AddressDetails> {
    let params = new HttpParams();
    const getWaselUrl = `/api/v1/establishment/${registrationNo}/wasel-address?unifiedNationalNumber=${queryParam}`;
    return this.http.get<AddressDetails>(getWaselUrl, { params });
  }
  /**
   *
   * @param queryParam
   */
  getEstablishmentWaselAddressCrn(queryParam, registrationNo: number): Observable<AddressDetails> {
    let params = new HttpParams();
    const getWaselUrl = `/api/v1/establishment/${registrationNo}/wasel-address?crNumber=${queryParam}`;
    return this.http.get<AddressDetails>(getWaselUrl, { params });
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
    const patchContactDetailsUrl = `/api/v1/establishment/${registrationNo}/contact-details`;

    return this.http.patch<TransactionFeedback>(patchContactDetailsUrl, updatedContactDetails);
  }

  /**
   * Method to update the identifier details
   *
   */
  changeIdentifierDetails(
    registrationNo: number,
    updatedIdentifierDetails: PatchIdentifierDetails
  ): Observable<TransactionFeedback> {
    const patchIdentifierDetailsUrl = `/api/v1/establishment/${registrationNo}/identifier`;
    updatedIdentifierDetails.license.issueDate.gregorian = startOfDay(
      updatedIdentifierDetails.license.issueDate.gregorian
    );
    updatedIdentifierDetails.license.expiryDate.gregorian = startOfDay(
      updatedIdentifierDetails.license.expiryDate.gregorian
    );
    if (updatedIdentifierDetails.crn?.issueDate?.gregorian) {
      updatedIdentifierDetails.crn.issueDate.gregorian = startOfDay(updatedIdentifierDetails.crn.issueDate.gregorian);
    }
    if (updatedIdentifierDetails.crn?.expiryDate?.gregorian) {
      updatedIdentifierDetails.crn.expiryDate.gregorian = startOfDay(updatedIdentifierDetails.crn.expiryDate.gregorian);
    }
    return this.http.patch<TransactionFeedback>(patchIdentifierDetailsUrl, updatedIdentifierDetails);
  }

  /**
   * Method to update the bank details
   *
   */
  changeBankDetails(registrationNo: number, updatedBankDetails: PatchBankDetails): Observable<TransactionFeedback> {
    const patchBankDetailsUrl = `/api/v1/establishment/${registrationNo}/bank-account`;
    return this.http.put<TransactionFeedback>(patchBankDetailsUrl, updatedBankDetails);
  }
  /**
   * Method to update the mof payment details
   *
   */
  changeMofPaymnetDetails(
    registrationNo: number,
    updatedBankDetails: PatchMofPaymentDetails
  ): Observable<TransactionFeedback> {
    const patchBankDetailsUrl = `/api/v1/establishment/${registrationNo}/payment-details`;
    return this.http.patch<TransactionFeedback>(patchBankDetailsUrl, updatedBankDetails);
  }

  /**
   * Method to get work flow status of a establishment
   * @param registrationNo
   */
  getEstablishmentWorkflowStatus(registrationNo: number): Observable<EstablishmentWorkFlowStatus[]> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/workflow-status`;
    return this.http.get<EstablishmentWorkFlowStatus[]>(getEstablishmentUrl);
  }

  /**
   * FIXME #registrationNo
   * This method is to fetch the Establishment validating details
   * @param queryParams
   */
  getEstablishmentFromTransient(
    registrationNo?: number,
    referenceNo?: number,
    isTerminate?: Boolean,
    getValueType?: string
  ): Observable<Establishment> {
    let params = getParams(EstablishmentQueryKeysEnum.REFERENCE_NUMBER, referenceNo, new HttpParams());
    if (isTerminate) {
      params = getParams(EstablishmentQueryKeysEnum.IS_TERMINATE, isTerminate, params);
    }
    if (getValueType) {
      params = getParams(EstablishmentQueryKeysEnum.GET_VALUE, getValueType, params);
    }
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/transient-details`;
    return this.http.get<Establishment>(getEstablishmentUrl, { params });
  }

  /**
   * This method is to fetch the Owners validating details
   * @param queryParams
   */
  searchOwner(registrationNo: number, queryParams?: QueryParam[]): Observable<EstablishmentOwnersWrapper> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
    }
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl, { params });
  }

  /**
   * This method is to fetch the Owners validating details
   * @param queryParams
   */
  searchOwnerWithQueryParams(registrationNo: number, queryParams?: QueryParam[]): Observable<Owner[]> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
    }
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    return this.http
      .get<EstablishmentOwnersWrapper>(getEstablishmentUrl, { params })
      .pipe(map(owner => (owner.owners ? owner.owners : [])));
  }

  /**
   * This method is to cancel a transaction
   * @param queryParams
   */
  cancelTransaction(registrationNo: number, referenceNo: number): Observable<null> {
    const cancelTransactionUrl = `/api/v1/establishment/${registrationNo}/cancel?referenceNo=${referenceNo}`;
    return this.http.delete<null>(cancelTransactionUrl);
  }

  /**
   * This method is to cancel a transaction
   * @param queryParams
   * TODO Use from establishment service
   */
  revertTransaction(registrationNo: number, referenceNo: number): Observable<null> {
    const revertTransactionUrl = `/api/v1/establishment/${registrationNo}/revert?referenceNo=${referenceNo}`;
    return this.http.put<null>(revertTransactionUrl, []);
  }

  /**
   * Method to get the no of owners
   */
  getAddOwnersInWorkflow(registrationNo): Observable<EstablishmentWorkFlowStatus[]> {
    return this.getEstablishmentWorkflowStatus(registrationNo).pipe(
      map(workflows =>
        workflows.filter(
          workflow => workflow.type === WorkFlowStatusType.OWNER && workflow.recordActionType === ActionTypeEnum.ADD
        )
      )
    );
  }

  /**
   * Method to check if owner can be added to the establishment
   * @param establishment
   */
  canAddOwner(establishment: Establishment): Observable<RestrictOwner> {
    const restrictOwner: RestrictOwner = new RestrictOwner();
    restrictOwner.noOfTotalOwners = 0;
    if (
      establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
      establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV ||
      establishment.legalEntity.english === LegalEntityEnum.SOCIETY ||
      establishment.legalEntity.english === LegalEntityEnum.ORG_REGIONAL
    ) {
      restrictOwner.canAdd = false;
      return of(restrictOwner);
    } else {
      return this.getOwners(establishment.registrationNo).pipe(
        catchError(err => of(err)),
        tap(estOwners => {
          restrictOwner.noOfTotalOwners = estOwners?.length;
        }),
        switchMap(() => this.getAddOwnersInWorkflow(establishment.registrationNo)),
        tap(ownersInWorkflow => {
          ownersInWorkflow.forEach(owner => (restrictOwner.noOfTotalOwners += owner.count));
        }),
        switchMap(() => shouldRestrict(restrictOwner, establishment))
      );
    }
  }

  /**
   * Method to update legal entity
   * @param registrationNo
   * @param legalEntityData
   */
  changeLegalEntity(registrationNo: number, legalEntityData: PatchLegalEntity): Observable<TransactionFeedback> {
    if (registrationNo) {
      const url = `/api/v1/establishment/${registrationNo}/legal-entity`;
      return this.http.patch<TransactionFeedback>(url, legalEntityData);
    } else {
      return throwError('No registration number');
    }
  }

  //Method to change late fee indicator
  changeLateFeeIndicator(lateFeeDetails: LateFeeRequest, registrationNo: number): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/latefee-indicator`;
    return this.http.patch<TransactionFeedback>(url, lateFeeDetails);
  }

  /**
   * Method to navigate to search establishment
   */
  navigateToSearch() {
    this.router.navigate([EstablishmentRoutesEnum.CHANGE_SEARCH_ESTABLISHMENT]);
  }

  /**
   * Method to navigate to login establishment
   */
  navigateToLogin() {
    this.router.navigate([EstablishmentRoutesEnum.LOGIN]);
  }

  /**
   * Method to navigate to inbox
   */
  navigateToInbox(appType: string) {
    if (appType === ApplicationTypeEnum.PRIVATE) {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    } else {
      this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    }
  }

  /**
   * Method to navigate to edit Identifier
   */
  navigateToEditIdentifierDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_IDENTIFIER_DETAILS]);
  }

  /**
   * Method to navigate to edit bank details
   */
  navigateToEditBankDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_BANK_DETAILS]);
  }

  /**
   * Method to navigate to edit owner details
   */
  navigateToEditOwnerDetails() {
    //this.router.navigate([EstablishmentConstants.ROUTE_EST_OWNERS]);
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_OWNER]);
  }

  /**
   * Method to navigate to edit contact details
   */
  navigateToEditContactDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_CONTACT_DETAILS]);
  }

  /**
   * Method to navigate to edit bank details
   */
  navigateToEditAddressDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_ADDRESS_DETAILS]);
  }

  /**
   * Method to navigate to establishment profile
   * Use only for field office
   */
  navigateToProfile(registrationNo: number) {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(registrationNo)]);
  }

  /**
   * Method to navigate to establishment group profile
   */
  navigateToGroupProfile(registrationNo: number) {
    this.router.navigate([EstablishmentConstants.GROUP_PROFILE_ROUTE(registrationNo)]);
  }
  /**
   * Method to navigate to edit establishment basic details
   */
  navigateToEditBasicDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_BASIC_DETAILS]);
  }

  /**
   * Method to navigate to basic detail validator
   */
  navigateToBasicDetailsValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_BASIC_DETAILS]);
  }

  /**
   * Method to navigate to identifier detail validator
   */
  navigateToIdentifierValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS]);
  }

  /**
   * Method to navigate to identifier detail validator
   */
  navigateToBankDetailsValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS]);
  }

  /**
   * Method to navigate to contact detail validator
   */
  navigateToContactDetailsValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CONTACT_DETAILS]);
  }
  /**
   * Method to navigate to address detail validator
   */
  navigateToAddressDetailsValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS]);
  }

  /**
   * Method to navigate to validate owner
   */
  navigateToValidateOwner() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_OWNER]);
  }

  /**
   * Method to navigate to validate owner
   */
  navigateToValidateLegalEntity() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LEGAL_ENTITY]);
  }

  /**
   * Method to navigate to owner details
   */
  navigateToOwnersScreen() {
    this.router.navigate([EstablishmentRoutesEnum.EST_OWNERS]);
  }

  /**
   * Method to navigate to change legal entity
   */
  navigateToEditLegalEntity() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_CHANGE_LEGAL_ENTITY]);
  }

  /**
   * Method to navigate to change main establishment
   */
  navigateToChangeMainValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST]);
  }

  /**
   * Method to navigate to validate mof payment details
   */
  navigateToChangeMofPaymentValidator() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MOF_PAYMENT]);
  }

  /**
   * Method to navigate to change payment details
   */
  navigateToChangeMofPaymentDetails() {
    this.router.navigate([EstablishmentRoutesEnum.MODIFY_MOF_PAYMENT]);
  }
}
