/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  bindToObject,
  BorderNumber,
  ContactDetails,
  getIdentityByType,
  IdentityTypeEnum,
  Iqama,
  NationalId,
  NationalityTypeEnum,
  NIN,
  Passport,
  Person,
  PersonWrapperDto,
  startOfDay,
  TransactionFeedback
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EstablishmentConstants } from '../constants';
import { Admin, ReplaceAdminRequest, SaveAdminResponse } from '../models';
import { AdminRequest } from '../models/admin-request';
import { assembleAdminDtoToSuperAdmin, assembleAdminToAdminDto } from '../utils';

const typeNIN = IdentityTypeEnum.NIN;
const typeNATIONALID = IdentityTypeEnum.NATIONALID;
const typeIqama = IdentityTypeEnum.IQAMA;

export enum PERSON_TYPE {
  SAUDI_PERSON = 'Saudi_Person',
  NON_SAUDI = 'Non_Saudi_Person',
  GCC_PERSON = 'GCC_Person'
}
//TODO: Add comments

@Injectable({
  providedIn: 'root'
})
export class EstablishmentAdminService {
  private personDetailsObj: Person = new Person();

  /**
   * Creates an instance of EstablishmentAdminService.
   *
   * @param {HttpClient} http
   * @memberof EstablishmentAdminService
   */
  constructor(readonly http: HttpClient) {}

  verifyPersonDetails(personDetails: Person, adminData): Observable<Person> {
    this.personDetailsObj = new Person();
    let birthDate;
    let personType: string;
    if (personDetails.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
      personType = PERSON_TYPE.SAUDI_PERSON;
    } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(personDetails.nationality.english) !== -1) {
      personType = PERSON_TYPE.GCC_PERSON;
    } else {
      personType = PERSON_TYPE.NON_SAUDI;
    }
    personDetails.personType = personType;
    birthDate = moment(adminData.birthDate.gregorian).format('YYYY-MM-DD');
    let verifyPersonUrl = `/api/v1/person?role=${personDetails.role}&birthDate=${birthDate}&personType=${personType}`;
    personDetails.identity = [];
    if (adminData.idType === typeNIN) {
      verifyPersonUrl = verifyPersonUrl + `&NIN=${Number(adminData.newNin)}`;
      const nin: NIN = new NIN();
      nin.newNin = Number(adminData.newNin);
      personDetails.identity.push(nin);
    } else if (adminData.idType === typeNATIONALID) {
      verifyPersonUrl = verifyPersonUrl + `&nationality=${adminData.nationality.english}`;
      if (adminData.id && adminData.id !== '') {
        const nationalId: NationalId = new NationalId();
        nationalId.id = Number(adminData.id);
        verifyPersonUrl = verifyPersonUrl + `&gccId=${Number(adminData.id)}`;
        personDetails.identity.push(nationalId);
      }
      if (adminData.passportNo && adminData.passportNo !== '') {
        const passport: Passport = new Passport();
        passport.passportNo = adminData.passportNo;
        if (adminData.issueDate && adminData.expiryDate) {
          passport.issueDate = adminData.issueDate;
          passport.expiryDate = adminData.expiryDate;
        }
        verifyPersonUrl = verifyPersonUrl + `&passportNo=${adminData.passportNo}`;
        personDetails.identity.push(passport);
      }
      if (adminData.iqamaNo && adminData.iqamaNo !== '') {
        const iqama: Iqama = new Iqama();
        iqama.iqamaNo = adminData.iqamaNo;
        if (adminData.expiryDate) {
          iqama.expiryDate = adminData.expiryDate;
          iqama.expiryDate.gregorian = startOfDay(adminData.expiryDate.gregorian);
        }
        personDetails.identity.push(iqama);
        verifyPersonUrl = verifyPersonUrl + `&iqamaNo=${Number(adminData.iqamaNo)}`;
      }
    } else {
      const iqama: Iqama = new Iqama();
      iqama.iqamaNo = adminData.iqamaNo;
      if (adminData.expiryDate) {
        iqama.expiryDate = adminData.expiryDate;
        iqama.expiryDate.gregorian = startOfDay(adminData.expiryDate.gregorian);
      }
      personDetails.identity.push(iqama);
      verifyPersonUrl = verifyPersonUrl + `&iqamaNo=${Number(adminData.iqamaNo)}`;
    }
    this.personDetailsObj = personDetails;
    return this.http.get<PersonWrapperDto>(verifyPersonUrl).pipe(map(result => result?.listOfPersons?.[0]));
  }

  /**
   * This method is to get the identity details
   */
  getIdentityDetails() {
    return bindToObject(new Person(), this.personDetailsObj);
  }

  /**
   * This method is to set the identityDetails
   * @param adminData
   */
  setIdentityDetails(adminData) {
    let identity: NIN | Iqama | NationalId | Passport | BorderNumber;
    if (adminData.idType === typeNIN) {
      identity = new NIN();
      identity.newNin = adminData.newNin;
    } else if (adminData.idType === typeIqama) {
      identity = new Iqama();
      identity.iqamaNo = adminData.iqamaNo;
    }
    return identity;
  }

  /**
   *
   * @param establishment
   * @param admin
   */
  updateAdminDetails(person: Person, adminData) {
    Object.keys(adminData).forEach(name => {
      if (name in person && adminData[name]) {
        if (name !== 'id') {
          person[name] = adminData[name];
        }
      }
    });

    return bindToObject(new Person(), person);
  }

  /**
   *This method is to update the owner details
   * @param establishmentOwner
   * @param ownerdata
   */
  updateOwnerDetails(establishmentOwner: Person, ownerData) {
    Object.keys(ownerData).forEach(name => {
      if (name in establishmentOwner && ownerData[name]) {
        if (name === 'contactDetail') {
          establishmentOwner.contactDetail = new ContactDetails().fromJsonToObject(ownerData[name]);
        } else if (name !== 'id') {
          establishmentOwner[name] = ownerData[name];
        }
      }
    });
    return new Person().fromJsonToObject(establishmentOwner);
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

  saveAdminDetails(establishmentAdmin: Admin, registrationNo: number, update = false): Observable<SaveAdminResponse> {
    /* Map to admin dto */
    const saveAdminUrl = `/api/v1/establishment/${registrationNo}/admin`;
    if (establishmentAdmin.person?.birthDate?.gregorian) {
      establishmentAdmin.person.birthDate.gregorian = startOfDay(establishmentAdmin.person.birthDate.gregorian);
    }
    if (update) {
      return this.http
        .put<SaveAdminResponse>(saveAdminUrl, assembleAdminToAdminDto(establishmentAdmin))
        .pipe(catchError(err => this.handleError(err)));
    } else {
      return this.http
        .post<SaveAdminResponse>(saveAdminUrl, assembleAdminToAdminDto(establishmentAdmin))
        .pipe(catchError(err => this.handleError(err)));
    }
  }

  /**
   * Save a person as admin so as to tag him to an establishment
   * @param admin
   */
  saveAsNewAdmin(admin: Admin): Observable<number> {
    admin.person.birthDate.gregorian = startOfDay(admin.person.birthDate.gregorian);
    const adminIdentifier = getIdentityByType(admin?.person?.identity, admin?.person?.nationality?.english).id;
    const url = `/api/v1/admin/${adminIdentifier}`;
    return this.http.post<number>(url, assembleAdminToAdminDto(admin));
  }
  /**
   * Replace admin details
   * @param adminId
   * @param mainRegNo
   * @param roleId
   * @param requestBody
   */
  replaceAdminDetails(adminId: number, mainRegNo: number, requestBody: AdminRequest): Observable<TransactionFeedback> {
    if (requestBody.currentAdmin?.person?.birthDate?.gregorian) {
      requestBody.currentAdmin.person.birthDate.gregorian = startOfDay(
        requestBody.currentAdmin?.person?.birthDate?.gregorian
      );
    }
    if (requestBody.newAdmin?.person?.birthDate?.gregorian) {
      requestBody.newAdmin.person.birthDate.gregorian = startOfDay(requestBody.newAdmin?.person?.birthDate?.gregorian);
    }
    const replaceAdminRequest = new ReplaceAdminRequest();
    replaceAdminRequest.comments = requestBody.comments;
    replaceAdminRequest.contentIds = requestBody.contentIds;
    replaceAdminRequest.navigationIndicator = requestBody.navigationIndicator;
    replaceAdminRequest.referenceNo = requestBody.referenceNo;
    replaceAdminRequest.currentAdmin = assembleAdminToAdminDto(requestBody.currentAdmin);
    replaceAdminRequest.newAdmin = assembleAdminToAdminDto(requestBody.newAdmin);

    const replaceadminurl = `/api/v1/admin/${adminId}/replace?registrationNo=${mainRegNo}`;
    return this.http.post<TransactionFeedback>(replaceadminurl, replaceAdminRequest);
  }

  /**
   * This method is used to handle the error
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * to delete an admin
   * @param admin
   * @param registrationNo
   * @param roleId
   * @param adminToDelete
   */
  deleteAdmin(adminId: number, mainRegNo: number, adminPersonId: number) {
    const url = `/api/v1/admin/${adminId}/terminate?registrationNo=${mainRegNo}&personId=${adminPersonId}`;
    return this.http.post<TransactionFeedback>(url, undefined);
  }
  saveSuperAdminDetails(
    registrationNo: number,
    update = false,
    admin: Admin,
    navigationIndicator: number,
    comments: string,
    contentIds = [],
    referenceNo: number
  ): Observable<SaveAdminResponse> {
    /* Map to admin dto */
    const saveAdminUrl = `/api/v1/establishment/${registrationNo}/admin`;
    if (admin.person?.birthDate?.gregorian) {
      admin.person.birthDate.gregorian = startOfDay(admin.person.birthDate.gregorian);
    }
    if (update) {
      return this.http
        .put<SaveAdminResponse>(
          saveAdminUrl,
          assembleAdminDtoToSuperAdmin(admin, navigationIndicator, comments, contentIds, referenceNo)
        )
        .pipe(catchError(err => this.handleError(err)));
    } else {
      return this.http
        .post<SaveAdminResponse>(
          saveAdminUrl,
          assembleAdminDtoToSuperAdmin(admin, navigationIndicator, comments, contentIds, referenceNo)
        )
        .pipe(catchError(err => this.handleError(err)));
    }
  }
}
