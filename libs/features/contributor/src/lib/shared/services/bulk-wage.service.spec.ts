/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { BulkWageUpdateResponse, ContributorFilter, DownloadCsvParams } from '../models';
import { BulkWageService } from './bulk-wage.service';

describe('BulkWageService', () => {
  let service: BulkWageService;
  let httpMock: HttpTestingController;
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
    service = TestBed.inject(BulkWageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download csv file if workflow is in progress', () => {
    const filter = new ContributorFilter();
    filter.minDate = '01-01-2020';
    filter.maxDate = '01-12-2020';
    filter.minWage = '100';
    filter.maxWage = '500';
    filter.nationalityList = ['india'];
    const url = `/api/v1/establishment/200085744/wage?filterCriteria.minDate=${filter.minDate}&filterCriteria.maxDate=${filter.maxDate}&filterCriteria.minWage=${filter.minWage}&filterCriteria.maxWage=${filter.maxWage}&filterCriteria.nationalityList=${filter.nationalityList[0]}&identifier=123123123&sortBy=nationality&sortOrder=ASC&identifierList=123546879&wageSummaryType=PENDING`;
    const params = new DownloadCsvParams(123123123, filter, 'nationality', 'ASC', [123546879]);
    service.downloadActiveContributorsCSV(200085744, params, true).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('Transaction is initiated');
  });

  it('should download csv file', () => {
    let blob: any = new Blob(['name'], { type: 'text/csv;charset=utf-8;' });
    let formData = new FormData();
    formData.append('name', blob, 'name.csv');
    formData.append('lastModified', blob, new Date().toDateString());
    const url = `/api/v1/establishment/200085744/bulk-wage-request?isEditFlow=true`;
    service.processBulkWageUpdate(200085744, blob, 'test', true).subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(new BulkWageUpdateResponse());
  });

  it('should download csv file', () => {
    const url = `/api/v1/establishment/200085744/bulk-wage-request?pageNo=0&pageSize=10&sortOrder=DESC&transactionStatus=History`;
    service.getUploadedFileHistory(200085744, 1, 10, 'DESC', 'History').subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ bulkWageRequestCount: 0, bulkWageRequests: null });
  });

  it('should fetch report', () => {
    const url = `/api/v1/establishment/200085744/bulk-wage-request/145548/report`;
    service.getReport(200085744, 145548).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('success');
  });

  it('should workflow details', () => {
    const url = `/api/v1/establishment/200085744/bulk-wage-request/145548`;
    service.getBulkWageWorkflowDetails(200085744, 145548).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('success');
  });
});
