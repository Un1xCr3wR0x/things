import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { bindToObject } from '@gosi-ui/core';
import { InstallemntSubmitRequestMockData } from 'testing';
import {
  installmentDeatilsMockData,
  installmentSummaryMockData
} from 'testing/test-data/features/billing/installment-details-mock-data';
import { InstallmentRequest, InstallmentSummary } from '../models';
import { InstallmentDetails } from '../models/installemt-details';

import { InstallmentService } from './installment.service';

describe('InstallmentService', () => {
  let service: InstallmentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(InstallmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('installmentdetails services', () => [
    it('should get installemntdetails', () => {
      const registartionNo = 502351249;
      const guarantee = 'Banking';
      const guaranteeType = { english: 'Provided a bank guarantee of at least 50% of the dues', arabic: '' };
      const installmentModelTestData: InstallmentDetails = bindToObject(
        new InstallmentDetails(),
        installmentDeatilsMockData
      );
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment-quote?guaranteeCategory=${guarantee}&guaranteeType=${guaranteeType.english}`;
      service.getInstallmentDetails(registartionNo, guaranteeType, guarantee).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('GET');
      req.flush(installmentModelTestData);
    })
  ]);
  describe('getInstallmentDetailsById', () => [
    it('should getInstallmentDetailsById', () => {
      const registartionNo = 502351249;
      const installmentId = 4562;
      const installmentModelTestData: InstallmentSummary = bindToObject(
        new InstallmentSummary(),
        installmentSummaryMockData
      );
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment/${installmentId}`;
      service.getInstallmentDetailsById(registartionNo, installmentId).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('GET');
      req.flush(installmentModelTestData);
    })
  ]);
  describe('submitInstallmentDetails', () => [
    it('should submitInstallmentDetails', () => {
      const registartionNo = 502351249;
      const InstallemntSubmitTestData: InstallmentRequest = bindToObject(
        new InstallmentRequest(),
        InstallemntSubmitRequestMockData
      );
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment`;
      service.submitInstallmentDetails(registartionNo, InstallemntSubmitTestData).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('POST');
      req.flush('');
    })
  ]);
  describe('getValidatorInstallmentDetails', () => [
    it('should getValidatorInstallmentDetails', () => {
      const registartionNo = 502351249;
      const installmentNo = 12346;
      const InstallemntSubmitTestData: InstallmentRequest = bindToObject(
        new InstallmentRequest(),
        InstallemntSubmitRequestMockData
      );
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment/${installmentNo}`;
      service.getValidatorInstallmentDetails(registartionNo, installmentNo).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('GET');
      req.flush(InstallemntSubmitTestData);
    })
  ]);
  describe('revertInstallmentDetails', () => [
    it('should revertInstallmentDetails', () => {
      const registartionNo = 502351249;
      const installmentNo = 12346;
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment/${installmentNo}/revert`;
      service.revertInstallmentDetails(registartionNo, installmentNo).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    })
  ]);
  describe('updateInstallmentDetails', () => [
    it('should updateInstallmentDetails', () => {
      const registartionNo = 502351249;
      const installmentNo = 12346;
      const InstallemntSubmitTestData: InstallmentRequest = bindToObject(
        new InstallmentRequest(),
        InstallemntSubmitRequestMockData
      );
      const getInstallmentUrl = `/api/v1/establishment/${registartionNo}/installment/${installmentNo}`;
      service.updateInstallmentDetails(registartionNo, InstallemntSubmitTestData, installmentNo).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getInstallmentUrl);
      expect(req.request.method).toBe('PUT');
      req.flush(InstallemntSubmitTestData);
    })
  ]);
});
