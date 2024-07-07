/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AddressDetails,
  AlertService,
  BankAccount,
  bindToObject,
  ContactDetails,
  Establishment,
  EstablishmentPaymentDetails,
  EstablishmentStatusEnum,
  IdentityTypeEnum,
  Person,
  TransactionFeedback,
  WizardItem
} from '@gosi-ui/core';
import {
  Admin,
  EnrollEstablishmentResponse,
  EstablishmentConstants,
  EstablishmentErrorKeyEnum,
  EstablishmentTypeEnum,
  isGccEstablishment,
  LegalEntityEnum
} from '@gosi-ui/features/establishment';
import { AdminRequest } from '@gosi-ui/features/establishment/lib/shared/models/admin-request';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  branches,
  crnData,
  documentResponse1,
  enrollEstablishmentResponseData,
  establishmentDetailsTestData,
  establishmentTestData,
  genericError,
  genericPersonResponse,
  mainEstablishment,
  ownerDetailsData,
  ownerResponse,
  saveAdminData,
  saveAdminResponse,
  transactionFeedbackMockData,
  verifyAdminResponse,
  verifyOwnerResponse
} from 'testing';

/**
 * Stub class for EstablishmentAdminService
 *
 * @export
 * @class EstablishmentAdminServiceStub
 */
export class EstablishmentAdminServiceStub {
  establishment: BehaviorSubject<any> = new BehaviorSubject<any>(establishmentTestData[0]);

  /**
   * Mock method for updating owner details
   * @param establishmentOwner
   * @param ownerData
   */
  updateOwnerDetails(establishmentOwner: Person, ownerData) {
    Object.keys(ownerData).forEach(name => {
      if (name in establishmentOwner && ownerData[name]) {
        if (name !== 'id') {
          establishmentOwner[name] = ownerData[name];
        }
      }
    });

    return { ...establishmentOwner };
  }

  /**
   * Mock method for verify person details
   * @param personDetails
   * @param adminData
   */
  verifyPersonDetails(personDetails: Person, adminData) {
    if (adminData && personDetails) {
      if (adminData.role === 'Admin') {
        return of(verifyAdminResponse);
      }
      if (adminData.iqamaNo === '2000000006') {
        return of(verifyOwnerResponse);
      }
      if (adminData.idType === IdentityTypeEnum.NATIONALID) {
        return of(null);
      } else if (personDetails) {
        return of(new Error());
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }

  /**
   * Mock method for get identity details
   */
  getIdentityDetails() {
    return new Person();
  }

  /**
   * Mockmethod for updateAdminDetails
   * @param establishmentAdmin
   * @param adminData
   */
  updateAdminDetails(person: Person, adminData) {
    if (adminData && person) {
      Object.keys(adminData).forEach(name => {
        if (name in person && adminData[name]) {
          if (name !== 'id') {
            person[name] = adminData[name];
          }
        }
      });
    }
    return { ...person };
  }

  /**
   * Mock method for save admin
   * @param establishmentAdmin
   * @param registrationNo
   */
  saveAdminDetails(establishmentAdmin: Admin, registrationNo: number, update = false) {
    if (establishmentAdmin || registrationNo || !update) {
      return of(saveAdminResponse);
    }
  }

  /**
   * Replace  admin Details
   * @param adminId
   * @param mainRegNo
   * @param roleId
   * @param requestBody
   */
  replaceAdminDetails(
    adminId: number,
    mainRegNo: number,
    roleId: number,
    requestBody: AdminRequest
  ): Observable<TransactionFeedback> {
    if (adminId || mainRegNo || roleId || requestBody) {
      return of(transactionFeedbackMockData);
    }
  }
  /**
   * Mock method to save admin
   * @param admin
   */
  saveAsNewAdmin(admin: Admin): Observable<number> {
    if (admin) {
      return of(genericPersonResponse.personId);
    }
  }

  /**
   *
   * @param establishment
   * @param adminContact
   */
  updateAdminContactDetails(establishmentAdmin: Admin, adminContact) {
    establishmentAdmin.person.contactDetail = new ContactDetails();
    Object.keys(adminContact).forEach(name => {
      if (name in establishmentAdmin.person.contactDetail && adminContact[name]) {
        establishmentAdmin.person.contactDetail[name] = adminContact[name];
      }
    });
    return { ...establishmentAdmin };
  }

  /**
   * Mock method to delete admin
   * @param adminId
   * @param mainRegNo
   * @param roleId
   * @param adminToDelete
   */
  deleteAdmin(adminId: number, mainRegNo: number, roleId: number, adminToDelete: Admin): Observable<Admin> {
    if (adminId || mainRegNo || roleId || adminToDelete) {
      return of(new Admin());
    } else {
      return throwError(genericError);
    }
  }
}

/**
 * Stub class for EstablishmentService.
 *
 * @export
 * @class EstablishmentServiceStub
 */
export class EstablishmentServiceStub {
  establishment: BehaviorSubject<any> = new BehaviorSubject<any>(establishmentTestData[0]);
  enrollEstablishmentResponse: BehaviorSubject<EnrollEstablishmentResponse> = new BehaviorSubject<EnrollEstablishmentResponse>(
    enrollEstablishmentResponseData
  );

  private _verifiedEstablishment: Establishment;
  private _hasAdminForMain = false;
  private registrationNo = 134569869;

  /**
   * Setter method for establishment
   */
  public set verifiedEstablishment(est) {
    this._verifiedEstablishment = est;
  }

  /**
   * Getter method for establishment
   */
  public get verifiedEstablishment() {
    return this._verifiedEstablishment;
  }

  /**
   * Setter method for boolean admin for main
   */
  public set hasAdminForMain(admin) {
    this._hasAdminForMain = admin;
  }

  /**
   * Getter method for boolean admin for main
   */
  public get hasAdminForMain() {
    return this._hasAdminForMain;
  }

  public getRegistrationFromStorage(): number {
    return 134567891;
  }

  /**
   * Mock method for saveEstablishmentDetails.
   *
   * @param {Establishment} establishment
   * @returns
   * @memberof EstablishmentServiceStub
   */
  saveEstablishmentDetails(establishment: Establishment, data) {
    Object.keys(data).forEach(name => {
      if (data[name] && name in establishment) {
        establishment[name] = data[name];
      }
    });
    return establishment;
  }
  getProActiveDocumentList() {
    return of(documentResponse1);
  }
  getBranches() {
    return of(branches);
  }
  /**
   * Mock method to getOwnerDetails
   * @param registrationNumber
   */
  getOwnerDetails(registrationNumber) {
    if (registrationNumber) {
      return of(ownerDetailsData);
    }
    return of(ownerDetailsData);
  }

  /**
   * Mock method for getAdminDetails
   * @param registrationNo
   */
  getAdminDetails(registrationNo) {
    if (registrationNo === mainEstablishment.registrationNo) {
      return of(saveAdminData);
    }
    return of(null);
  }

  /**
   * Mock method to delete the owner
   * @param registrationNo
   * @param personId
   */
  deleteOwner(registrationNo, personId) {
    if (registrationNo && personId) {
      return of(null);
    }
    return of(null);
  }

  /**
   * Mock method to update task workflow
   */
  updateTaskWorkflow() {
    return of(null);
  }
  /**
   * Mock method to get captured document
   */
  getCapturedDocument() {
    return of(null);
  }

  restrictProgress() {
    return of(null);
  }
  /**
   * This method is to update the owner details
   * @param person
   * @param personData
   */
  updateOwner(person: Person, personData) {
    Object.keys(personData).forEach(name => {
      if (person && name in person && personData[name]) {
        person[name] = personData[name];
      }
    });
    return { ...person };
  }

  /**
   * This method is to update the Establishment
   * @param Establishment
   * @memberof EstablishmentService
   */
  savePaymentDetails(paymentDetails: EstablishmentPaymentDetails, isPut: boolean) {
    if (paymentDetails && isPut) {
      return of(null);
    }
    return of(null);
  }

  /**
   * This method is used to set the establishment details from the http response
   * @param establishment
   * @param establishmentResponse
   */
  setResponse(establishment: Establishment, establishmentResponse: any) {
    if (establishment && establishmentResponse) {
      Object.keys(establishmentResponse).forEach(name => {
        if (name in establishment) {
          establishment[name] = establishmentResponse[name];
        }
      });
    }
    return { ...establishment };
  }

  /**
   * Mock method for setPaymentDetails
   * @param PaymentDetails
   * @memberof EstablishmentService
   */
  setPaymentDetails(
    establishmentpaymentDetails: EstablishmentPaymentDetails,
    paymentDetails: EstablishmentPaymentDetails,
    bankAccount: BankAccount
  ) {
    if (paymentDetails) {
      establishmentpaymentDetails = new EstablishmentPaymentDetails();
      Object.keys(paymentDetails).forEach(key => {
        if (key in establishmentpaymentDetails && paymentDetails[key]) {
          establishmentpaymentDetails[key] = paymentDetails[key];
        }
      });
    }
    if (bankAccount) {
      return establishmentpaymentDetails;
    } else {
      return establishmentpaymentDetails;
    }
  }

  /**
   * Mock Method for getEstablishment
   *
   * @param registrationNumber
   */
  getEstablishment(registrationNumber) {
    if (registrationNumber === establishmentDetailsTestData.registrationNo) {
      return of(establishmentDetailsTestData);
    } else {
      return of(establishmentDetailsTestData);
    }
  }

  /**
   * Mock Method for getEstablishment
   *
   * @param registrationNumber
   */
  getEstablishmentDetails(registrationNumber) {
    if (registrationNumber === establishmentDetailsTestData.registrationNo) {
      return of(establishmentDetailsTestData);
    } else {
      return of(bindToObject(new Establishment(), establishmentDetailsTestData));
    }
  }

  public set setRegistrationNo(regNo) {
    this.registrationNo = regNo;
  }

  public get getRegistrationNo() {
    return this.registrationNo;
  }

  getLegalEntity() {
    return establishmentDetailsTestData.legalEntity;
  }

  /**
   * Mock Method for verifying Crn
   * @param crnNumber
   */
  verifyCRNNumber(crnNumber) {
    if (crnNumber) {
      return of([crnData]);
    }
  }

  cancelTransaction() {
    return of(establishmentTestData[0]);
  }
  /**
   * Mock method for verify license number.
   *
   * @param {Establishment} establishment
   * @returns
   * @memberof EstablishmentServiceStub
   */
  verifyEstablishment(licenseNumber: any, licenseIssuingAuthority: any) {
    if (licenseNumber || licenseIssuingAuthority) {
      return of([establishmentDetailsTestData]);
    }
    return of([establishmentDetailsTestData]);
  }

  /**
   * Create wizard items for establishment add
   */
  getAddEstablishmentWizard(): WizardItem[] {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_DETAILS, 'building'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PAYMENT_DETAILS, 'money-bill-alt'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_ADMIN_DETAILS, 'user-cog'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt'));
    return wizardItems;
  }
  /**
   * Create wizard items for establishment add
   */
  getProEstablishmentWizard(): WizardItem[] {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_DETAILS, 'building-pro'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PAYMENT_DETAILS, 'money-bill-alt-pro'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_ADMIN_DETAILS, 'user-cog-pro'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt-pro'));
    return wizardItems;
  }

  /**
   * Mock method for verify legal entity of main an branch by passing main establishment registration number
   *
   * @param {Establishment} establishment
   * @returns
   * @memberof EstablishmentServiceStub
   */
  verifyBranchEstablishment(mainRegistrationNumber: any) {
    if (mainRegistrationNumber === 924201479) {
      return of(mainEstablishment);
    }
    return of(establishmentDetailsTestData);
  }

  /**
   * This method is used to mock the verify gcc establishment details
   * @param nation
   * @param registrationNo
   */
  verifyGCCEstablishmentDetails(nation: string, registrationNo: number) {
    if (nation && registrationNo) {
      return of([establishmentTestData[3]]);
    }
    return of([establishmentTestData[3]]);
  }
  /**
   * This method is to cancel a transaction
   * @param queryParams
   */
  revertTransaction(mainRegNo: number, referenceNo: number): Observable<null> {
    if (mainRegNo || referenceNo) {
      return of(null);
    } else {
      throwError('No Inputs');
    }
  }

  /**
   * Mock method for saveEstablishment.
   *
   * @param {Establishment} establishment
   * @returns
   * @memberof EstablishmentServiceStub
   */
  saveEstablishment(establishment: Establishment) {
    if (establishment) {
      return this.enrollEstablishmentResponse;
    }
    return this.enrollEstablishmentResponse;
  }

  /**
   * Mock method for saveEstablishment.
   *
   * @param {Establishment} establishment
   * @returns
   * @memberof EstablishmentServiceStub
   */
  setContactDetails(establishment: Establishment, addressData: AddressDetails[], contactData: ContactDetails) {
    if (contactData) {
      Object.keys(contactData).forEach(name => {
        if (name in establishment.contactDetails && contactData[name]) {
          establishment.contactDetails[name] = contactData[name];
        }
      });
    }
    if (addressData) {
      establishment.contactDetails = new ContactDetails();
      establishment.contactDetails.addresses = [new AddressDetails()];
      Object.keys(addressData[0]).forEach(name => {
        if (name in establishment.contactDetails.addresses && addressData[0][name]) {
          establishment.contactDetails.addresses[name] = addressData[0][name];
        }
      });
    }

    return { ...establishment };
  }

  /**
   * This method is to assemble the basic establishment details
   * @param establishment
   * @param data
   * @memberof EstablishmentService
   */
  setEstablishmentDetails(establishment: Establishment, data) {
    Object.keys(data).forEach(name => {
      if (name in establishment && data[name]) {
        establishment[name] = data[name];
      }
    });
    return { ...establishment };
  }

  /**
   * Mock Method for save Owner
   * @param owners
   * @param registrationNo
   */
  saveOwners(owners, index, registrationNo) {
    if (owners[index]) {
      return of(ownerResponse);
    }
    if (!registrationNo) {
      return of(null);
    }
  }

  validateEstablishment(establishmentList: Establishment[]): boolean {
    let isCancelled = false;

    if (establishmentList == null || establishmentList.length <= 0) {
      return true;
    }

    for (const establishment of establishmentList) {
      if (establishment.status.english === EstablishmentStatusEnum.CANCELLED) {
        isCancelled = true;
      }
    }
    return isCancelled;
  }

  validateBranchEstablishment(
    mainEst: Establishment,
    branchEstablishments: Establishment[],
    alertService: AlertService
  ): boolean {
    if (mainEst.registrationNo === 924201479) {
      return false;
    }
    let isValidLegalEntity = true;
    const isValidLicenceDate = true;
    for (const branchEstablishment of branchEstablishments) {
      if (
        mainEst.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
        mainEst.legalEntity.english === LegalEntityEnum.SEMI_GOV
      ) {
        if (
          branchEstablishment.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
          branchEstablishment.legalEntity.english === LegalEntityEnum.SEMI_GOV
        ) {
          isValidLegalEntity = true;
        }
      } else if (
        mainEst.legalEntity.english === LegalEntityEnum.ORG_REGIONAL &&
        mainEst.legalEntity === branchEstablishment.legalEntity
      ) {
        isValidLegalEntity = true;
      }
    }
    return isValidLegalEntity || isValidLicenceDate;
  }

  isMainEstablishmentEligible(mainEstablishment: Establishment, alertService: AlertService): boolean {
    if (isGccEstablishment(mainEstablishment)) {
      alertService.showErrorByKey(EstablishmentErrorKeyEnum.MAIN_IS_GCC);
      return false;
    }
    if (mainEstablishment.establishmentType.english === EstablishmentTypeEnum.BRANCH) {
      alertService.showErrorByKey(EstablishmentErrorKeyEnum.NOT_MAIN);
      return false;
    }
    if (
      mainEstablishment.status.english === EstablishmentStatusEnum.CANCELLED ||
      mainEstablishment.status.english !== EstablishmentStatusEnum.REGISTERED
    ) {
      alertService.showErrorByKey(EstablishmentErrorKeyEnum.MAIN_NOT_ACTIVE);
      return false;
    }
    return true;
  }

  checkEstablishmentAlreadyPresent(establishmentList: Establishment[]): boolean {
    let isPresent = false;
    if (establishmentList === null || establishmentList.length <= 0) {
      return false;
    }
    for (const establishment of establishmentList) {
      //If any one of the establishment is not in cancelled or closed status return false
      if (
        !(
          establishment.status?.english === EstablishmentStatusEnum.CANCELLED ||
          establishment.status?.english === EstablishmentStatusEnum.CLOSED
        )
      ) {
        isPresent = true;
      }
    }
    return isPresent;
  }
}
