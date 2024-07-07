/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { changeMainRequestDate, delinkRequestData, DocumentServiceStub } from 'testing';
import { EstablishmentActionEnum, EstablishmentEligibilityEnum } from '../enums';
import { DelinkRequest } from '../models';
import { ChangeGroupEstablishmentService } from './change-group-establishment.service';
import { DocumentService } from '@gosi-ui/core';

describe('ChangeGroupEstablishmentService', () => {
  let service: ChangeGroupEstablishmentService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: DocumentService, useClass: DocumentServiceStub }]
    });
    service = TestBed.inject(ChangeGroupEstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save main establishment', () => {
    it('should save main establishment Details', () => {
      const registrationNo = 12345;
      const url = `/api/v1/establishment/12345/convert`;
      service.saveMainEstablishment(registrationNo, changeMainRequestDate).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
  });
  describe('save delinked establishment', () => {
    it('should save delinked establishment Details', () => {
      const registrationNo = 12345;
      const delinkRequest = delinkRequestData;
      const url = `/api/v1/establishment/${registrationNo}/delink`;
      service.saveDelinkedEstablishment(registrationNo, delinkRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });
  describe('update delinked establishment', () => {
    it('should update delinked establishment Details', () => {
      const registrationNo = 12345;
      const delinkRequest = delinkRequestData;
      const url = `/api/v1/establishment/${registrationNo}/delink`;
      service.updateDelinkedEstablishment(registrationNo, delinkRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getNavigationIndicator', () => {
    it('should getNavigationIndicator for delink new group', () => {
      const type = EstablishmentActionEnum.DELINK_NEW_GRP;
      const isFinalSubmit = true;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(44);
    });
    it('should getNavigationIndicator for delink new group', () => {
      const type = EstablishmentActionEnum.DELINK_NEW_GRP;
      const isFinalSubmit = true;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(45);
    });
    it('should getNavigationIndicator for delink to another group', () => {
      const type = EstablishmentActionEnum.DELINK_OTHER;
      const isFinalSubmit = true;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(42);
    });
    it('should getNavigationIndicator for delink to another group', () => {
      const type = EstablishmentActionEnum.DELINK_OTHER;
      const isFinalSubmit = true;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(43);
    });

    it('should getNavigationIndicator for delink new group save and next', () => {
      const type = EstablishmentActionEnum.DELINK_NEW_GRP;
      const isFinalSubmit = false;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(48);
    });
    it('should getNavigationIndicator for delink new group validator save n next', () => {
      const type = EstablishmentActionEnum.DELINK_NEW_GRP;
      const isFinalSubmit = false;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(49);
    });
    it('should getNavigationIndicator for delink to another group', () => {
      const type = EstablishmentActionEnum.DELINK_OTHER;
      const isFinalSubmit = false;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(46);
    });
    it('should getNavigationIndicator for delink to another group', () => {
      const type = EstablishmentActionEnum.DELINK_OTHER;
      const isFinalSubmit = false;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(47);
    });
    it('should getNavigationIndicator change branch to main', () => {
      const type = EstablishmentActionEnum.CHG_MAIN_EST;
      const isFinalSubmit = true;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(39);
    });
    it('should getNavigationIndicator forchange branch to main validator', () => {
      const type = EstablishmentActionEnum.CHG_MAIN_EST;
      const isFinalSubmit = true;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(41);
    });

    it('should getNavigationIndicator change branch to main save and next', () => {
      const type = EstablishmentActionEnum.CHG_MAIN_EST;
      const isFinalSubmit = false;
      const isValidator = false;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(36);
    });
    it('should getNavigationIndicator forchange branch to main validator save n next', () => {
      const type = EstablishmentActionEnum.CHG_MAIN_EST;
      const isFinalSubmit = false;
      const isValidator = true;
      const appToken = 'PRIVATE';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(38);
    });
    it('should getNavigationIndicator change branch to main save and next', () => {
      const type = EstablishmentActionEnum.CHG_MAIN_EST;
      const isFinalSubmit = true;
      const isValidator = false;
      const appToken = 'PUBLIC';
      service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken);
      expect(service.getNavigationIndicator(type, isFinalSubmit, isValidator, appToken)).toEqual(40);
    });
  });
  describe('mapActionToEligibility', () => {
    it('should mapActionToEligibility', () => {
      const action = EstablishmentActionEnum.CHG_MAIN_EST;

      service.mapActionToEligibility(action);
      expect(service.mapActionToEligibility(action)).toEqual(EstablishmentEligibilityEnum.CBM);
    });
  });
});
