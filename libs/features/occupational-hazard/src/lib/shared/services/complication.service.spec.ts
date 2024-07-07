import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  ApplicationTypeEnum,
  MobileDetails
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { complicationDetailsTestData, contributorsTestData, transactionReferenceData, mobileNoTestData } from 'testing';
import { ComplicationService } from '.';
import { Complication } from '../models';

describe('ComplicationService', () => {
  let httpMock: HttpTestingController;
  let service: ComplicationService;
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
    service = TestBed.inject(ComplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getComplication', () => {
    it('Should get Complication', () => {
      const socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      const registrationNo = contributorsTestData.registrationNo;
      const injuryNo = contributorsTestData.injuryNo;
      const getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryNo}/complication/${contributorsTestData.complicationId}?isChangeRequired=false`;
      service
        .getComplication(registrationNo, socialInsuranceNo, injuryNo, contributorsTestData.complicationId, false)
        .subscribe();
      const req = httpMock.expectOne(getComplicationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });
  });

  describe('getComplicationHistory', () => {
    it('Should get getComplicationHistory', () => {
      const socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      const registrationNo = contributorsTestData.registrationNo;
      service.ohService.setRegistrationNo(10000602);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${contributorsTestData.injuryNo}/complication?isOtherEngInjuryReq=true`;
      service.getComplicationHistory(socialInsuranceNo, contributorsTestData.injuryNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });
  });
  describe('getComplicationHistory', () => {
    it('Should get getComplicationHistory for public', () => {
      service['appToken'] = ApplicationTypeEnum.PUBLIC;
      const socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      const registrationNo = contributorsTestData.registrationNo;
      service.ohService.setRegistrationNo(10000602);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${contributorsTestData.injuryNo}/complication?isOtherEngInjuryReq=false`;
      service.getComplicationHistory(socialInsuranceNo, contributorsTestData.injuryNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });
  });
  describe('submitComplication', () => {
    it('to submitComplication', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setComplicationId(123214424);
      const submitComplicationUrl = `/api/v1/establishment/10000602/contributor/601336235/injury/${contributorsTestData.injuryId}/complication/${contributorsTestData.complicationId}/submit?isEdited=false`;
      service
        .submitComplication(
          contributorsTestData.complicationId,
          contributorsTestData.injuryId,
          false,
          transactionReferenceData.comments
        )
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      const task = httpMock.expectOne(submitComplicationUrl);
      expect(task.request.method).toBe('PATCH');
    });
  });
  describe('saveEmergencyContact', () => {
    it('to save emergency contact number', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setComplicationId(123214424);
      const mobileNum = bindToObject(new MobileDetails(), mobileNoTestData);
      const addInjuryUrl = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/complication/123214424/emergency-contact`;
      service.saveEmergencyContact(mobileNum).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(addInjuryUrl);
      expect(task.request.method).toBe('PATCH');
      task.flush(contributorsTestData.injuryId);
    });
  });
  describe('updateComplication', () => {
    it('to update Complication Details', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setComplicationId(123214424);
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/complication/123214424`;
      service.updateComplication(complicationDetailsTestData).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('PUT');
      task.flush(contributorsTestData.injuryId);
    });
  });
  describe('saveComplication', () => {
    it('to report complication ', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setInjuryNumber(1001923482);
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/complication`;

      service
        .saveComplication(bindToObject(new Complication(), complicationDetailsTestData), false)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(contributorsTestData.complicationId);
    });
  });
  describe('getComplicationDetails', () => {
    it('Should getComplicationDetails', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setInjuryNumber(1001923482);
      service.ohService.setComplicationId(123214424);
      const getComplicationUrl = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/injury/${contributorsTestData.injuryId}/complication/${contributorsTestData.complicationId}?isChangeRequired=false`;
      service
        .getComplication(
          contributorsTestData.registrationNo,
          contributorsTestData.socialInsuranceNo,
          contributorsTestData.injuryId,
          contributorsTestData.complicationId,
          false
        )
        .subscribe();
      const req = httpMock.expectOne(getComplicationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });
  });
  describe('setComplicationId', () => {
    it('Should setComplicationId', () => {
      service.setComplicationId(contributorsTestData.complicationId);
      expect(service['complicationId']).not.toBe(null);
    });
  });
  describe('getComplicationId', () => {
    it('Should get ComplicationId', () => {
      service.getComplicationId();
      service.setComplicationId(contributorsTestData.complicationId);
      expect(service['complicationId']).not.toBe(null);
    });
    it('to update complication ', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setComplicationId(123214424);
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/complication/123214424`;
      service
        .saveComplication(bindToObject(new Complication(), complicationDetailsTestData), true)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(contributorsTestData.complicationId);
    });
    it('Should get Complication for modify', () => {
      const socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      const registrationNo = contributorsTestData.registrationNo;
      const injuryNo = contributorsTestData.injuryNo;
      const getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryNo}/complication/${contributorsTestData.complicationId}?isChangeRequired=true`;
      service
        .getComplication(registrationNo, socialInsuranceNo, injuryNo, contributorsTestData.complicationId, true)
        .subscribe();
      const req = httpMock.expectOne(getComplicationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });

    it('Should get Complication for reopen', () => {
      const socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      const registrationNo = contributorsTestData.registrationNo;
      const injuryNo = contributorsTestData.injuryNo;
      const getComplicationUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryNo}/complication/${contributorsTestData.complicationId}?isChangeRequired=true`;
      service
        .getComplication(registrationNo, socialInsuranceNo, injuryNo, contributorsTestData.complicationId, true)
        .subscribe();
      const req = httpMock.expectOne(getComplicationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData);
    });
  });
  describe('getModifiedComplicationDetails', () => {
    it('Should getModifiedComplicationDetails', () => {
      service.ohService.setRegistrationNo(10000602);
      service.ohService.setSocialInsuranceNo(601336235);
      service.ohService.setInjuryId(1001923482);
      service.ohService.setInjuryNumber(1001923482);
      service.ohService.setComplicationId(123214424);
      const getComplicationUrl = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/injury/${contributorsTestData.injuryId}/complication/${contributorsTestData.complicationId}/change-request/132434`;
      service
        .getModifiedComplicationDetails(
          contributorsTestData.registrationNo,
          contributorsTestData.socialInsuranceNo,
          contributorsTestData.injuryId,
          contributorsTestData.complicationId,
          132434
        )
        .subscribe();
      const req = httpMock.expectOne(getComplicationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(complicationDetailsTestData.complicationDetailsDto);
    });
  });
});
