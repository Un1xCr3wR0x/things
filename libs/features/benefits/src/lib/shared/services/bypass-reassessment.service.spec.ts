/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BypassReassessmentService } from './bypass-reassessment.service';

describe('BypassReassessment.ServiceService', () => {
  let service: BypassReassessmentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(BypassReassessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('to set mobilenumber', () => {
    service.setMobileNo(service.mobileNo);
    expect(service.mobileNo).toBeUndefined();
  });
  it('to get mobilenumber', () => {
    service.getMobileNo();
    expect(service.mobileNo).toBeUndefined();
  });
  it('to set validity check', () => {
    service.setisValid(service.isValid);
    expect(service.isValid).toBeUndefined();
  });
  it('to get validity check', () => {
    service.getisValid();
    expect(service.isValid).toBeUndefined();
  });
  it('to set uuid', () => {
    service.setUuid(service.uuid);
    expect(service.uuid).toBeUndefined();
  });
  it('to get uuid', () => {
    service.getUuid();
    expect(service.uuid).toBeUndefined();
  });
  it('should verifyOTP', () => {
    const referenceNumber = 'c5e5180';
    const personId = 1031027616;
    const xOtp = '4544sfsefw54f';
    const url = `/api/v1/mbassessment/${referenceNumber}/verify?personIdentifier=${personId}`;
    service.verifyOTP(referenceNumber, personId, xOtp).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should resendOTP', () => {
    const referenceNumber = 'c5e5180';
    const personId = 1031027616;
    const url = `/api/v1/mbassessment/${referenceNumber}/verify?personIdentifier=${personId}`;
    service.resendOTP(referenceNumber, personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should validateCaptcha', () => {
    const referenceNumber = 'c5e5180';
    const identifier = 1031027616;
    const xCaptcha = 'g545dgf4gfd5f4gd54';
    const url = `/api/v1/mbassessment/${referenceNumber}/validate?personIdentifier=${identifier}`;
    service.validateCaptcha(referenceNumber, identifier, xCaptcha).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getMedicalAssessment', () => {
    const benefitRequestId = 1004325322;
    const assessmentId = 1031021215;
    const sin = 411123472;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment?assessmentId=${assessmentId}`;
    service.getMedicalAssessment(benefitRequestId, assessmentId, sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should validateAssessment', () => {
    const referenceNumber = 'c5e5180';
    const identifier = 1031027616;
    const url = `/api/v1/mbassessment/${referenceNumber}/validate?personIdentifier=${identifier}`;
    service.validateAssessment(referenceNumber, identifier).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getStandaloneAssessment', () => {
    const disabilityReferenceNo = 1121554859;
    const nin = 1031027616;
    const url = `/api/v1/mbassessment/${disabilityReferenceNo}?nin=${nin}`;
    service.getStandaloneAssessment(disabilityReferenceNo, nin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getDisabilityDetails', () => {
    const sin = 1121554859;
    const benefitRequestId = 1031027616;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/assessment-details`;
    service.getDisabilityDetails(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should acceptStandaloneAssessment', () => {
    const disabilityReferenceNo = 1121554859;
    const nin = 1031027616;
    const url = `/api/v1/mbassessment/${disabilityReferenceNo}/_accept?nin=${nin}`;
    service.acceptStandaloneAssessment(disabilityReferenceNo, nin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should accceptMedicalAssessment', () => {
    const sin = 1121554859;
    const benefitRequestId = 1031027616;
    const assessmentId = 1024542550;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment?assessmentId=${assessmentId}`;
    service.accceptMedicalAssessment(sin, benefitRequestId, assessmentId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should appealMedicalAssessment', () => {
    const sin = 1121554859;
    const benefitRequestId = 1031027616;
    const assessmentId = 1024542550;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment/${assessmentId}/appeal`;
    service.appealMedicalAssessment(sin, benefitRequestId, assessmentId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should appealStandaloneAssessment', () => {
    const disabilityReferenceNo = 1121554859;
    const nin = 1031027616;
    const url = `/api/v1/mbassessment/${disabilityReferenceNo}/_appeal?nin=${nin}`;
    service.appealStandaloneAssessment(disabilityReferenceNo, nin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  xit('should submitMedicalAssesment', () => {
    const sin = 1121554859;
    const benefitRequestId = 1031027616;
    const assessmentId = 1024542550;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment/submit?assessmentId=${assessmentId}`;
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });
});
