/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberRequest, MemberResponse, MemberData } from '../models';
import { BilingualText, bindToObject } from '@gosi-ui/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { MedicalBoardService } from './medical-board.service';
import { MemberService } from './member.service';
import { DoctorService } from './doctor.service';
import { boardMembersListMock, genericError, memberDataMock, updateRequestMock } from 'testing';
import { Admin } from '@gosi-ui/features/establishment';

describe('MemberService', () => {
  let service: MemberService;
  let httpMock: HttpTestingController;
  let memberRequest: MemberRequest = <MemberRequest>{};
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
    service = TestBed.inject(MemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
  it('should get person details', () => {
    let identificationNo = 1234;
    const url = `/api/v1/medical-professional/${identificationNo}`;
    service.getPersonDetails(identificationNo).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(identificationNo);
  });
  it('should verify saudi member', () => {
    let id = '1235';
    let birthDate = 'string';
    let nationality = 'string';
    let role = 'string';
    let personType = 'string';

    const url = `/api/v1/person?birthDate=string&nationality=string&role=MEDICALPROFESSIONAL&personType=string`;
    service.verifyMember(id, birthDate, nationality, role, personType).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(id);
  });
  it('should verify non saudi member', () => {
    let id = '1235';
    let birthDate = 'string';
    let nationality = 'string';
    let role = 'string';
    let personType = 'string';

    const url = `/api/v1/person?birthDate=string&nationality=string&role=MEDICALPROFESSIONAL&personType=string`;
    service.verifyMember(id, birthDate, nationality, role, personType).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(id);
  });
  it('should verify GCC member', () => {
    let id = '1235';
    let birthDate = 'string';
    let nationality = 'string';
    let role = 'string';
    let personType = 'string';

    const url = `/api/v1/person?birthDate=string&nationality=string&role=MEDICALPROFESSIONAL&personType=string`;
    service.verifyMember(id, birthDate, nationality, role, personType).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(id);
  });

  it('should save contract details', () => {
    let personDetails = { personId: 1234 };
    const url = `/api/v1/medical-professional/${personDetails.personId}/contract`;
    service.saveContractDetails(memberDataMock).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(memberDataMock);
  });
  it('should update Task Workflow', () => {
    const url = `/api/process-manager/v1/taskservice/update`;
    service.updateTaskWorkflow(updateRequestMock).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(updateRequestMock);
  });
  it('should save member details when status is 3', () => {
    let status = 3;
    const person: MemberData = bindToObject(new MemberData(), memberDataMock);
    const url = `/api/v1/medical-professional/${person.mbProfessionalId}/contract/${person.contractId}`;
    service.saveMemberDetails(memberDataMock, status).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(memberDataMock);
  });
  it('should save member details when status is 2', () => {
    let status = 2;
    const person: MemberData = bindToObject(new MemberData(), memberDataMock);
    const url = `/api/v1/medical-professional/${person.mbProfessionalId}/contract`;
    service.saveMemberDetails(memberDataMock, status).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(memberDataMock);
  });
  it('should save member details', () => {
    let status;
    const person: MemberData = bindToObject(new MemberData(), memberDataMock);
    const url = `/api/v1/medical-professional`;
    service.saveMemberDetails(memberDataMock, status).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(memberDataMock);
  });
  it('Should set establishment admin details', () => {
    const establishmentAdmin: Admin = new Admin();
    const person: MemberData = bindToObject(new MemberData(), memberDataMock);
    expect(service.updateAdminDetails(person, establishmentAdmin));
  });
  it('should fetch Member Details', () => {
    let identificationNo = 1234;
    let calendarId = 1234;
    const url = `/api/v1/medical-professional/${identificationNo}/contract/${calendarId}`;
    service.getMemberDetails(identificationNo, calendarId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(memberDataMock);
  });
});
