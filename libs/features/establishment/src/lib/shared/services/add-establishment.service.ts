/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddressDetails,
  AlertService,
  bindToObject,
  ContactDetails,
  DocumentItem,
  Establishment,
  EstablishmentPaymentDetails,
  EstablishmentStatusEnum,
  Person,
  WizardItem
} from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { EstablishmentErrorKeyEnum, EstablishmentTypeEnum, LegalEntityEnum } from '../enums';
import { BankAccount, EnrollEstablishmentResponse, Owner, OwnerRequest, OwnerResponse } from '../models';
import { isGccEstablishment, isInArray } from '../utils';

/**
 * The service class to manage establishment operations.
 *
 * @export
 * @class ValidatorService
 */
@Injectable({
  providedIn: 'root'
})
export class AddEstablishmentService {
  verifiedEstablishment: Establishment;
  hasAdminForMain = false;
  inProgress = false;
  draftRegNo: number = undefined;

  /**
   * Creates an instance of addEstablishmentService.
   *
   * @param {HttpClient} http
   * @memberof addEstablishmentService
   */
  constructor(readonly http: HttpClient) {}

  /**
   * This method is to assemble the basic establishment details
   * @param establishment
   * @param data
   * @memberof addEstablishmentService
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
   * This method is to assemble the basic establishment details
   * @param establishment
   * @param data
   * @memberof addEstablishmentService
   */
  setContactDetails(establishment: Establishment, addressData: AddressDetails[], contactData: ContactDetails) {
    if (addressData && addressData.length > 0) {
      establishment.contactDetails = new ContactDetails();
      establishment.contactDetails.addresses = [];
      let newAddress: AddressDetails;
      Object.values(addressData).forEach(address => {
        newAddress = new AddressDetails();
        Object.keys(address).forEach(name => {
          if (name in newAddress && address[name]) {
            newAddress[name] = address[name];
          }
        });
        establishment.contactDetails.addresses.push(newAddress);
      });
    }
    if (contactData) {
      Object.keys(contactData).forEach(name => {
        if (name in establishment.contactDetails && contactData[name]) {
          establishment.contactDetails[name] = contactData[name];
        }
      });
    }
    return { ...establishment };
  }

  /**
   * This method is to update the payment details
   * @param PaymentDetails
   * @memberof addEstablishmentService
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
    if (bankAccount && bankAccount.ibanAccountNo && bankAccount.ibanAccountNo !== null) {
      establishmentpaymentDetails.bankAccount = new BankAccount();
      Object.keys(bankAccount).forEach(key => {
        if (key in establishmentpaymentDetails.bankAccount && bankAccount[key]) {
          establishmentpaymentDetails.bankAccount[key] = bankAccount[key];
        }
      });
    }
    return establishmentpaymentDetails;
  }

  /**
   * TODO Remove
   * This method is to verify the Establishment with crNumber number
   * @param Establishment
   * @memberof addEstablishmentService
   */
  verifyCRNNumber(crnNumber): Observable<Establishment> {
    const params = new HttpParams().set('crNumber', crnNumber);
    const verifyCRNUrl = `/api/v1/establishment`;
    return this.http.get<Establishment>(verifyCRNUrl, { params }).pipe(catchError(err => this.handleError(err)));
  }
  /**
   * This method is used to fetch document list for Proactive
   * @param registrationNumber
   */
  getProActiveDocumentList(registrationNumber): Observable<DocumentItem[]> {
    const proActiveDocUrl = `/api/v1/establishment/${registrationNumber}/document`;
    return this.http.get<DocumentItem[]>(proActiveDocUrl).pipe(catchError(err => this.handleError(err)));
  }

  /**
   * This method is to verify the Establishment with license number
   * @param Establishment
   * @memberof addEstablishmentService
   */
  verifyEstablishment(
    licenseNumber: string,
    licenseIssuingAuthorty: string,
    includeDraft: boolean = false,
    departmentNumber?: number
  ): Observable<Establishment[]> {
    let params = new HttpParams()
      .set('licenseNumber', licenseNumber)
      .set('licenseIssuingAuthority', licenseIssuingAuthorty)
      .set('includeDraft', includeDraft.toString());
    if (departmentNumber) {
      params = params.set('departmentNumber', departmentNumber.toString());
    }
    const verifyEstablishmentUrl = `/api/v1/establishment`;
    return this.http.get<{ establishments: Establishment[] }>(verifyEstablishmentUrl, { params }).pipe(
      map(res => res.establishments),
      catchError(err => this.handleError(err))
    );
  }
  /**
   * This method is to verify GCC establishment with GCC Nation Name and GCC Registration number,.
   * @param GCCEstablishmentNationNameGCCEstablishmentNationRegistrationNumber
   * @member addEstablishmentService
   */
  verifyGCCEstablishmentDetails(
    nation: string,
    registrationNo: string,
    includeDraft: boolean = false,
    departmentNumber?: number
  ): Observable<Establishment[]> {
    let params = new HttpParams()
      .set('gccCountryName', nation)
      .set('gccRegistrationNumber', registrationNo)
      .set('includeDraft', includeDraft.toString());
    if (departmentNumber) {
      params = params.set('departmentNumber', departmentNumber.toString());
    }

    const verifyEstablishmentUrl = `/api/v1/establishment`;
    return this.http.get<{ establishments: Establishment[] }>(verifyEstablishmentUrl, { params }).pipe(
      map(res => res.establishments),
      catchError(err => this.handleError(err))
    );
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
    return new Person().fromJsonToObject(person);
  }

  /**
   * This method is to save the owner
   * @param owners
   * @param registrationNo
   */
  saveOwners(
    owners: Person[],
    index: number,
    registrationNo: number,
    isSaved?: boolean,
    navInd?: number,
    referenceNo?: number
  ) {
    const saveOwnerUrl = `/api/v1/establishment/${registrationNo}/owner`;
    const ownerRequest = new OwnerRequest();
    ownerRequest.navigationIndicator = navInd;
    ownerRequest.referenceNo = referenceNo;
    ownerRequest.owners.push(new Owner());
    ownerRequest.owners[0].person = owners[index];
    if (owners[index]) {
      if (isSaved) {
        return this.http.put<OwnerResponse>(saveOwnerUrl, ownerRequest).pipe(catchError(err => this.handleError(err)));
      } else {
        return this.http.post<OwnerResponse>(saveOwnerUrl, ownerRequest).pipe(catchError(err => this.handleError(err)));
      }
    }
  }

  /**
   * This method is to register the Establishment
   * @param Establishment
   * @memberof addEstablishmentService
   */
  saveEstablishment(establishment: Establishment): Observable<Establishment> {
    if (this.inProgress === false) {
      let req;
      const addEstablishmentUrl = `/api/v1/establishment`;
      if (
        establishment.status?.english === EstablishmentStatusEnum.OPENING_IN_PROGRESS ||
        establishment.status?.english === EstablishmentStatusEnum.DRAFT ||
        establishment.status?.english === EstablishmentStatusEnum.REGISTERED ||
        establishment.status?.english === EstablishmentStatusEnum.OPENING_IN_PROGRESS_GOL_UPDATE
      ) {
        req = new HttpRequest('PUT', addEstablishmentUrl + `/${establishment.registrationNo}`, establishment, {
          reportProgress: true
        });
      } else {
        req = new HttpRequest('POST', addEstablishmentUrl, establishment, {
          reportProgress: true
        });
      }
      return this.http.request<Establishment>(req).pipe(
        map(event => {
          if (event && event.type === HttpEventType.Response) {
            this.inProgress = false;
            return event.body;
          } else {
            this.inProgress = true;
            return null;
          }
        }),
        filter(res => res !== null),
        catchError(err => this.handleError(err))
      );
    }
  }

  /**
   * This method is used to delete and owner
   * @param registrationNo
   * @param personId
   */
  deleteOwner(registrationNo, personId): Observable<null> {
    const deleteOwnerUrl = `/api/v1/establishment/${registrationNo}/owner/${personId}`;
    return this.http.delete<null>(deleteOwnerUrl);
  }

  /**
   * TODO Remove if unused
   * This method is to update the Establishment
   * @param Establishment
   * @memberof addEstablishmentService
   */
  updateEstablishment(establishment: Establishment) {
    const addEstablishmentUrl = `/api/v1/establishment`;
    return this.http
      .put<EnrollEstablishmentResponse>(addEstablishmentUrl, establishment)
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * This is a generic method to map the response to the intended Object
   * @param object
   * @param response
   */
  setResponses(object: object, response: object) {
    if (response && object) {
      Object.keys(response).forEach(name => {
        if (name in object && response[name]) {
          object[name] = response[name];
        }
      });
    }
    return { ...object };
  }

  /**
   * This method is to update the Establishment
   * @param Establishment
   * @memberof addEstablishmentService
   */
  savePaymentDetails(paymentDetails: EstablishmentPaymentDetails, isPut: boolean) {
    const addEstablishmentUrl = `/api/v1/establishment/${paymentDetails.registrationNo}/bank-account`;
    if (isPut) {
      return this.http
        .put<EnrollEstablishmentResponse>(addEstablishmentUrl, paymentDetails)
        .pipe(catchError(err => this.handleError(err)));
    } else {
      return this.http
        .post<EnrollEstablishmentResponse>(addEstablishmentUrl, paymentDetails)
        .pipe(catchError(err => this.handleError(err)));
    }
  }

  restrictProgress(index: number, addEstWizardItems: WizardItem[]) {
    for (let i = index; i < addEstWizardItems.length; i++) {
      if (addEstWizardItems[i + 1]) {
        addEstWizardItems[i + 1].isDisabled = true;
        addEstWizardItems[i + 1].isActive = false;
        addEstWizardItems[i + 1].isDone = false;
      }
    }
  }

  /**
   * This method is used to cacel transaction
   */
  cancelTransaction(regNo: number): Observable<null> {
    const cancelUrl = `/api/v1/establishment/${regNo}/revert`;
    return this.http.post<null>(cancelUrl, []);
  }

  /**
   * This method is used to handle the error
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    this.inProgress = false;
    return throwError(error);
  }

  /*
  VALIDATOR SERVICES
  */
  /**
   * This method is used to set the establishment details from the http response
   * @param establishment
   * @param establishmentResponse
   */
  setResponse(establishment: Establishment, establishmentResponse) {
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
   * This is a generic method to map the persons details for owner details
   * @param object
   * @param response
   */
  setPersonsResponse(persons: Person[], response: Person[], person: Person) {
    persons = [];
    person = new Person();
    person.identity = [];
    if (response && persons) {
      response.forEach((res: Person) => {
        if (res) {
          Object.keys(res).forEach(name => {
            if (name in person && res[name]) {
              person[name] = res[name];
            }
          });
          persons.push(person);
          person = new Person();
          person.identity = [];
        }
      });
    }
    return persons;
  }

  /**
   * This method is to set the admin details of the establishment
   * @param registrationNo
   */
  setAdminDetails(person: Person, personResponse: Person) {
    if (personResponse) {
      Object.keys(personResponse).forEach(name => {
        if (name in person) {
          person[name] = personResponse[name];
        }
      });
    }
    return bindToObject(new Person(), person);
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
        if (establishment.status?.english === EstablishmentStatusEnum.DRAFT) {
          this.draftRegNo = establishment.registrationNo;
        } else {
          isPresent = true;
        }
      }
    }
    return isPresent;
  }

  checkDepartmentIdAlreadyPresent(establishmentList: Establishment[] = [], departmentNumber: number): boolean {
    if (establishmentList === null || establishmentList.length <= 0) {
      return false;
    }
    return (
      establishmentList.filter(establishment => {
        return (
          !(
            establishment.status?.english === EstablishmentStatusEnum.CANCELLED ||
            establishment.status?.english === EstablishmentStatusEnum.CLOSED
          ) && establishment.departmentNumber === departmentNumber
        );
      }).length > 0
    );
  }

  validateBranchEstablishment(
    mainEstablishment: Establishment,
    branchEstablishment: Establishment,
    alertService: AlertService
  ): boolean {
    let isValid = true;
    //legal entity--- main(gov,semi) --branch(gov,semi)
    //legen entity--- main(org) --branch(org)
    //1009 = gov, 1008= semi gov, 1010=org and region

    if (branchEstablishment.legalEntity.english !== mainEstablishment.legalEntity.english) {
      if (
        !(
          isInArray([LegalEntityEnum.GOVERNMENT, LegalEntityEnum.SEMI_GOV], branchEstablishment.legalEntity.english) &&
          isInArray([LegalEntityEnum.GOVERNMENT, LegalEntityEnum.SEMI_GOV], mainEstablishment.legalEntity.english)
        )
      ) {
        alertService.showErrorByKey(EstablishmentErrorKeyEnum.LEGAL_ENTITY_DIFF);
        isValid = false;
      }
    }
    return isValid;
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
}
