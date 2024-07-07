/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  EnvironmentToken,
  LanguageToken,
  MobileDetails,
  RouterData,
  RouterDataToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  contributorsTestData,
  genericRouteData,
  injuryDetailsTestData,
  injuryHistory,
  injuryStatisticsTestData,
  lovListMockData,
  mobileNoTestData,
  rejectionDetailsData,
  validatorActionData
} from 'testing';
import { InjuryService } from '.';
import { Injury } from '../models';
import { Component } from '@angular/core';

describe('InjuryService', () => {
  let httpMock: HttpTestingController;
  let service: InjuryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() }
      ]
    });
    service = TestBed.inject(InjuryService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get the Injury Statistics', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const getInjuryUrl = `/api/v1/contributor/601336235/injury-statistics`;
    service.getInjuryStatistics().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(getInjuryUrl);
    expect(task.request.method).toBe('GET');
    task.flush(injuryStatisticsTestData);
  });
  it('to get the Injury Statistics', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    (service as any).appToken = ApplicationTypeEnum.PUBLIC;
    const getInjuryUrl = `/api/v1/establishment/10000602/contributor/601336235/injury-statistics`;
    service.getInjuryStatistics().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(getInjuryUrl);
    expect(task.request.method).toBe('GET');
    task.flush(injuryStatisticsTestData);
  });
  it('to get the Injury History', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const Pagination = {
      page: {
        pageNo: 0,
        size: 5
      },
      sort: {
        column: 'status',
        direction: 'ascending'
      }
    };
    const getInjuryUrl = `/api/v1/establishment/10000602/contributor/601336235/injury?isOtherEngInjuryReq=true&ohType=Injury&pageNo=0&pageSize=5`;
    service.getInjuryHistory(601336235, 'Injury', Pagination).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(getInjuryUrl);
    expect(task.request.method).toBe('GET');
    task.flush(injuryHistory);
  });

  it('Should getInjuryRejectReasonList', () => {
    const url = `/api/v1/lov?category=registration&domainName=TransactionRejectReason`;
    service.getInjuryRejectReasonList('INJURY').subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(lovListMockData);
  });
  it('Should getInjuryRejectReasonList', () => {
    const url = `/api/v1/lov?category=registration&domainName=ComplicationRejectionCode`;
    service.getInjuryRejectReasonList('Complication').subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(lovListMockData);
  });
  it('Should getInjuryRejectReasonList', () => {
    const url = `/api/v1/lov?category=registration&domainName=InjuryRejectionCode`;
    service.getInjuryRejectReasonList('OH Rejection Injury').subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(lovListMockData);
  });
  it('Should getInspectionList', () => {
    const inspectionListUrl = `/api/v1/lov?category=registration&domainName=InspectionType`;
    service.getInspectionList().subscribe();
    const req = httpMock.expectOne(inspectionListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovListMockData);
  });

  it('Should updateInjuryRejection', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/injuryRejection?action=V1EDITREJECTION`;
    service.updateInjuryRejection(rejectionDetailsData, 10000602, 601336235, 1001923482, true).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(injuryDetailsTestData);
  });
  it('Should updateInjuryRejection', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/injuryRejection?action=V1REJECTION`;
    service.updateInjuryRejection(rejectionDetailsData, 10000602, 601336235, 1001923482, false).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(injuryDetailsTestData);
  });

  it('Should getInjuryDetails', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/injury/${contributorsTestData.injuryNo}?isChangeRequired=false`;
    service
      .getInjuryDetails(
        contributorsTestData.registrationNo,
        contributorsTestData.socialInsuranceNo,
        contributorsTestData.injuryNo,
        false
      )
      .subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(injuryDetailsTestData);
  });
  it('Should getInjuryDetails', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/injury/${contributorsTestData.injuryNo}?isChangeRequired=true`;
    service
      .getInjuryDetails(
        contributorsTestData.registrationNo,
        contributorsTestData.socialInsuranceNo,
        contributorsTestData.injuryNo,
        true
      )
      .subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(injuryDetailsTestData);
  });

  it('to get Injury Reason', () => {
    const injuryType = 'Injury';
    const injuryReasonFinderUrl = `/api/v1/establishment/injuryReason?typeName=${injuryType}`;
    service.getInjuryReason(injuryType).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(injuryReasonFinderUrl);
    expect(task.request.method).toBe('GET');
  });

  it('to report reportInjuryService ', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const contributorUrl = `/api/v1/establishment/10000602/contributor/601336235/injury`;
    service
      .reportInjuryService(bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto))
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('POST');
  });

  it('to report updateInjuryService ', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/${injuryDetailsTestData.injuryDetailsDto.injuryId}`;
    service
      .updateInjuryService(bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto))
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });

  it('to report saveEmergencyContactInjury ', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const mobileNum = bindToObject(new MobileDetails(), mobileNoTestData);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/emergency-contact`;
    service.saveEmergencyContactInjury(mobileNum).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
  });

  it('to report submitInjury ', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const submitInjuryUrl = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/submit?isEdited=true`;
    service.submitInjury(1001923482, true, injuryDetailsTestData.injuryDetailsDto.comments).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(submitInjuryUrl);
    expect(req.request.method).toBe('PATCH');
  });

  it('to save AllowancePayee ', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/allowance-payee`;
    service.saveAllowancePayee(2, 6).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
  });

  it('Should setNavigationIndicator', () => {
    const indicator = Number(5);
    service.setNavigationIndicator(indicator);
    expect(service.navigationIndicator).not.toBe(null);
  });
  it('Should setStatus', () => {
    const statusFilter = [
      {
        arabic: 'إعتماد',
        english: 'Closed'
      }
    ];
    service.setStatus(statusFilter);
    expect(service.statusEng).not.toBe(null);
  });
  it('Should getRejectReasonValidator', () => {
    const rejectReasonUrl = `/api/v1/lov?category=registration&domainName=TransactionRejectReason`;
    service.getRejectReasonValidator().subscribe();
    const req = httpMock.expectOne(rejectReasonUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovListMockData);
  });
  it('Should getModifiedInjuryDetails', () => {
    service.ohService.setRegistrationNo(10000602);
    service.ohService.setSocialInsuranceNo(601336235);
    service.ohService.setInjuryId(1001923482);
    service.ohService.setComplicationId(123214424);
    const url = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/injury/${contributorsTestData.injuryNo}/change-request/13214`;
    service
      .getModifiedInjuryDetails(
        contributorsTestData.registrationNo,
        contributorsTestData.socialInsuranceNo,
        contributorsTestData.injuryNo,
        13214
      )
      .subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(injuryDetailsTestData);
  });
});
