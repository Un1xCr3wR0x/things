import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  genericInspectionResponse,
  genericOhRateResponse,
  transactionFeedbackMockData
} from 'testing/test-data/establishment';
import { EstablishmentQueryKeysEnum } from '../enums';
import { OHQueryParam, OhUpdateRequest, ReinspectionRequest } from '../models';
import { SafetyInspectionService } from './safety-inspection.service';

describe('SafetyInspectionService', () => {
  let service: SafetyInspectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SafetyInspectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('get establishment  oh rate', () => {
    it('should get establishment oh rate', () => {
      const regNo = 12214235;
      const params = new OHQueryParam();
      params.excludeHistory = false;
      const url = `/api/v1/establishment/${regNo}/oh-rates?inspectionDataRequired=true&excludeHistory=${params.excludeHistory}`;
      service.getEstablishmentOHRate(regNo, params).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(genericOhRateResponse);
    });
  });
  describe('get  Establishment Inspection Details', () => {
    it('should get  Establishment Inspection Details', () => {
      const inspectionId = 12334;
      const regNo = 12214235;
      const url = `/api/v1/establishment/${12214235}/inspection-details?id=${inspectionId}`;
      service
        .getEstablishmentInspectionDetails(regNo, [
          {
            queryKey: EstablishmentQueryKeysEnum.INSPECTION_ID,
            queryValue: inspectionId
          }
        ])
        .subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(genericInspectionResponse);
    });
  });
  describe('update oh', () => {
    it('should update oh', () => {
      const regNo = 100011182;
      const OHUpdateRequest = new OhUpdateRequest();
      OHUpdateRequest.previousVisitDate = { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' };
      OHUpdateRequest.inspectionReferenceNo = 'wewer';
      (OHUpdateRequest.comments = 'werewr'), (OHUpdateRequest.ohRate = 2);
      const url = `/api/v1/establishment/${regNo}/oh-rate`;
      service.updateOHRate(regNo, OHUpdateRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('create reinspection', () => {
    it('should create reinspection', () => {
      const reinspectionRequest = new ReinspectionRequest();
      reinspectionRequest.type = 'sddf';
      reinspectionRequest.registrationNumber = '12312323';
      reinspectionRequest.reason = 'sddf';
      reinspectionRequest.inspRefNumber = '123';
      reinspectionRequest.currentOHRate = 3;
      const url = `/api/v1/establishment/${reinspectionRequest.registrationNumber}/reinspection`;
      service.createReinspection(reinspectionRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('get contributor', () => {
    it('should get  contributor', () => {
      const sin = 2323444;
      const url = `/api/v1/contributor/${sin}`;
      service.getContributorBySin(sin).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get contributor with regno', () => {
    it('should get  contributor', () => {
      const sin = 2323444;
      const regNo = 123456;
      const url = `/api/v1/establishment/${regNo}/contributor/${sin}`;
      service.getContributorWithRegNo(regNo, sin).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get required upload document', () => {
    it('should get required upload  document', () => {
      const registrationNo = 34564566;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: registrationNo
        }
      ];
      const url = `/api/v1/establishment/${registrationNo}/rased-documents?referenceNo=${registrationNo}`;
      service.getRequiredUploadDocuments(registrationNo, queryParams).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get rased doc', () => {
    it('should get rased doc', () => {
      const registrationNo = 34564566;
      const url = `/api/v1/rased-document/SC?referenceNo=${registrationNo}`;
      service.getRasedDoc(registrationNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get doc byte array', () => {
    it('should get doc byte array', () => {
      const urlReq = 'sff';
      const url = `/api/v1/rased-document/SC/doc-byte?url=${urlReq}`;
      service.getDocumentByteArray(urlReq).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
});
