/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { MbProfile, MemberData, UpdateDoctorResponse, UnAvailabilityPeriod, ContractData } from '../models';
import { map, filter, catchError, tap } from 'rxjs/operators';
import { BilingualText, ContactDetails, bindToObject } from '@gosi-ui/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { DoctorService } from './doctor.service';
import { MemberRequest } from '../models';
import {
  boardMembersListMock,
  genericError,
  personDetailsMock,
  memberDetailsMock,
  updateDoctorMock,
  updateDoctorMockArray,
  mbProfileMock,
  unavailablePeriodMock,
  memberDataMock,
  contractHistoryMock,
  contractsDetails,
  memberDetailsResponseMock,
  updateDoctorResponseMock,
  respContractMock
} from 'testing';

describe(' DoctorService ', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;
  let memberRequest: MemberRequest = <MemberRequest>{};
  let member: MemberData = new MemberData();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        }
      ]
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch Person Details', () => {
    let identificationNo = 1234;
    const url = `/api/v1/medical-professional/${identificationNo}`;
    service.getPersonDetails(identificationNo).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(personDetailsMock);
  });

  it('should fetch contract Details', () => {
    let identificationNo = 1234;
    let contractId = 1234;
    const url = `/api/v1/medical-professional/${identificationNo}/contract/${contractId}/details`;
    service.getContractDetails(identificationNo, contractId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(contractsDetails);
  });
  it('should fetch Member Details', () => {
    let identificationNo = 1234;
    let calendarId = 1234;
    const url = `/api/v1/medical-professional/${identificationNo}/unavailability-period/${calendarId}`;
    service.getMemberDetails(identificationNo, calendarId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(memberDetailsResponseMock);
  });
  it('should save doctor Details', () => {
    let UpdateDoctor = {
      contractId: 1
    };
    const url = `/api/v1/medical-professional/${UpdateDoctor.contractId}/doctor`;
    service.saveDoctorDetail(UpdateDoctor).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(updateDoctorMock);
  });
  it('should get unavailable data', () => {
    let professionalId = 1234;
    const url = `/api/v1/medical-professional/${professionalId}/unavailability-period`;
    service.getUnavailablePeriod(professionalId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(updateDoctorMockArray);
  });
  it('should get unavailable data', () => {
    let periodData = {
      professionalId: 1,
      calendarId: 1,
      reason: null,
      startDate: null,
      endDate: null,
      comments: null,
      confirmMessage: null
    };
    const url = `/api/v1/medical-professional/${periodData.professionalId}/unavailability-period/${periodData.calendarId}`;
    service.removeUnavailablePeriod(periodData).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(updateDoctorMockArray);
  });
  it('should save contact details', () => {
    const person: MbProfile = bindToObject(new MbProfile(), mbProfileMock);
    const id = 1;
    const url = `/api/v1/medical-professional/${id}/contact/${person.personId}`;
    service.saveContactDetails(new ContractData(), id).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(person);
  });
  it('should save submitModifyContractDetail', () => {
    const updateDoctorResponse: UpdateDoctorResponse = bindToObject(
      new UpdateDoctorResponse(),
      updateDoctorResponseMock
    );
    const url = `/api/v1/medical-professional/${updateDoctorResponse.contractId}/contract?transactionTraceId=123123123`;
    service.submitModifyContractDetail(updateDoctorResponse).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(updateDoctorResponse);
  });
  it('should save bank details', () => {
    const person: MbProfile = bindToObject(new MbProfile(), mbProfileMock);
    const mbId = 123;
    const url = `/api/v1/medical-professional/${mbId}/bank-account/${person.personId}`;
    service.saveBankDetails(person, 1234).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(person);
  });
  it('should save address details', () => {
    const person: MbProfile = bindToObject(new MbProfile(), mbProfileMock);
    const id = 1;
    const url = `/api/v1/medical-professional/${id}/address/${person.personId}`;
    service.saveAddressDetails(person, id).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(person);
  });
  it('should add unavailable period', () => {
    let professionalId = 1234;
    let periodData = 'data';
    const url = `/api/v1/medical-professional/${professionalId}/unavailability-period`;
    service.addUnavailablePeriod(professionalId, periodData).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(unavailablePeriodMock);
  });
  it('should modify unavailable period', () => {
    let professionalId = 1234;
    let periodData = 'data';
    let calenderId = 1234;
    const url = `/api/v1/medical-professional/${professionalId}/unavailability-period/${calenderId}`;
    service.modifyUnavailablePeriod(professionalId, periodData, calenderId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(unavailablePeriodMock);
  });
  it('should get fees', () => {
    const url = `/api/v1/medical-professional/fees?contractType=ghe&medicalBoardType=ghe`;
    let data = memberDataMock.medicalBoardType.english;
    service.getFees(new MemberData()).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(memberDataMock);
  });
  it('should getInvitationDetails', () => {
    const url = `/api/v1/mb-session/123/invitation-list`;
    service.getInvitationDetails(123).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should getSessionDetails', () => {
    const url = `/api/v1/mb-session/123/mb-sessions`;
    service.getSessionDetails(123).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should put acceptInvitation', () => {
    const url = `/api/v1/mb-session/12/accept-invite?inviteId=12`;
    service.acceptInvitation(12, 12).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });
  it('should put revertTransactionDetails', () => {
    const url = `/api/v1/medical-professional/12/contract/12/revert?referenceNo=12`;
    service.revertTransactionDetails(12, 12, 12).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });
  it('Should getmbProfessionalId', () => {
    service.getmbProfessionalId();
    expect(service.professionalId).not.toBe(null);
  });
  it('should get unavailable data', () => {
    let updateDoctor = {
      calendarId: undefined
    };
    const url = `/api/v1/medical-professional/${updateDoctor.calendarId}/contract`;
    service.modifyDoctorDetail(updateDoctor).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(updateDoctor);
  });
  it('should modify unavailable period', () => {
    const terminationMock = {
      contractId: 12,
      transactionTraceId: null,
      dateOfTermination: null,
      reasonForTermination: { arabic: 'تم حذف الفترة بنجاح ', english: 'Unavailable  successfully' },
      comments: 'string'
    };
    const url = `/api/v1/medical-professional/${terminationMock.contractId}/terminate`;
    service.terminateContract(terminationMock).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(terminationMock);
  });
  it('should fetch contract history', () => {
    let identificationNo = 2015767656;
    let contractId = 123456;
    const url = `/api/v1/medical-professional/${identificationNo}/contract-history/${contractId}`;
    service.getContractHistory(identificationNo, contractId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(contractHistoryMock);
  });
  it('should submit terminate contract Details', () => {
    let contractId: 1000000201;
    let data = {
      comments: '',
      transactionTraceId: 7934056
    };
    const url = `/api/v1/medical-professional/${contractId}/terminate`;
    service.submitTerminateContract(data).subscribe(response => {
      expect(response).not.toBeNull;
    });
    const req = httpMock.expectOne(`${url}?transactionTraceId=${data.transactionTraceId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(respContractMock);
  });
});
