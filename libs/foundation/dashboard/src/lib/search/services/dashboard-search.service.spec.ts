/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';

import { DashboardSearchService } from './dashboard-search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnvironmentToken, ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  transactionListData,
  establishmentListData,
  AlertServiceStub,
  billingListData,
  contributorResponseTestData
} from 'testing';
import { SearchRequest, RequestLimit, RequestFilter, RequestSort, SearchParam } from '../../shared';
import { AlertService } from '@gosi-ui/core';
import { HttpErrorResponse } from '@angular/common/http';
describe('DashboardSearchService', () => {
  let dashboardSearchService: DashboardSearchService;
  let httpMock: HttpTestingController;
  let searchrequest: SearchRequest = <SearchRequest>{};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardSearchService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080' }
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: AlertService, useClass: AlertServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    dashboardSearchService = TestBed.inject(DashboardSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(dashboardSearchService).toBeTruthy();
  });

  it('should get transactions', () => {
    const registrationNo = 10000602;
    const transactionUrl = `/api/v1/transaction?general=true&registrationNo=${registrationNo}&sort.column=createdDate&sort.direction=DESC&filter.listOfStatus=In Progress&page.pageNo=0&page.size=10`;
    dashboardSearchService.getTransactions(registrationNo).subscribe(() => {
      expect(transactionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(transactionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const registrationNo = 10000602;
    const errMsg = 'expect 404 error';
    const transactionUrl = `/api/v1/transaction?general=true&registrationNo=${registrationNo}&sort.column=createdDate&sort.direction=DESC&filter.listOfStatus=In Progress&page.pageNo=0&page.size=10`;
    dashboardSearchService.getTransactions(registrationNo).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(transactionUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should get establishments', () => {
    const registrationNo = 10000602;
    const establishmentUrl = `/api/v1/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    dashboardSearchService.getEstablishmentDetails(registrationNo).subscribe(() => {
      expect(establishmentListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(establishmentUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(establishmentListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const registrationNo = 10000602;
    const errMsg = 'expect 404 error';
    const establishmentUrl = `/api/v1/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    dashboardSearchService.getEstablishmentDetails(registrationNo).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(establishmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should search transactions with txn number', () => {
    const searchTransactionUrl = `/api/v1/transaction?general=true&page.pageNo=0&page.size=10&sort.column=transactionId&sort.direction=ASC&searchKey=491887&personIdentifier=10000000&registrationNo=10000602&filter.listOfStatus=Cancelled`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.personIdentifier = 10000000;
    searchrequest.searchParam.registrationNo = 10000602;
    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'transactionId';
    searchrequest.sort.direction = 'ASC';
    searchrequest.searchKey = '491887';
    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'Cancelled',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    dashboardSearchService.searchTransaction(searchrequest).subscribe(() => {
      expect(transactionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(searchTransactionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListData);
    httpMock.verify();
  });
  it('should search transactions with txn number', () => {
    const searchTransactionUrl = `/api/v1/transaction?general=true&page.pageNo=0&page.size=10&sort.column=transactionId&sort.direction=ASC&searchKey=491887&personIdentifier=10000000&registrationNo=10000602&filter.listOfChannels=tpa`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.personIdentifier = 10000000;
    searchrequest.searchParam.registrationNo = 10000602;
    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'transactionId';
    searchrequest.sort.direction = 'ASC';
    searchrequest.searchKey = '491887';
    searchrequest.filter = new RequestFilter();
    searchrequest.filter.channel = [
      {
        english: 'TPA',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    searchrequest.filter.status = [];
    dashboardSearchService.searchTransaction(searchrequest).subscribe(() => {
      expect(transactionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(searchTransactionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const searchTransactionUrl = `/api/v1/transaction?general=true&page.pageNo=0&page.size=10&sort.column=transactionId&sort.direction=ASC&searchKey=491887&personIdentifier=10000000&registrationNo=10000602&filter.listOfStatus=Cancelled`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'transactionId';
    searchrequest.sort.direction = 'ASC';
    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'Cancelled',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    searchrequest.filter.channel = [];
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.personIdentifier = 10000000;
    searchrequest.searchParam.registrationNo = 10000602;
    searchrequest.searchKey = '491887';
    const errMsg = 'expect 404 error';
    dashboardSearchService.searchTransaction(searchrequest).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(searchTransactionUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should search establishment with registration number', () => {
    const searchEstablishmentUrl = `/api/v1/establishment?globalSearch=true&page.pageNo=0&page.size=10&registrationNo=10000602&crNumber=5677&licenseNumber=23456&ownerOrAdminPhoneNumber=54356789&recruitmentNo=45676879&unifiedNationalNumber=3456789&sort.column=registrationNo&sort.direction=ASC&filter.legalEntity=Limited&filter.fieldOffice=Riyadh&filter.status=Cancelled`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'registrationNo';
    searchrequest.sort.direction = 'ASC';
    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'Cancelled',
        arabic: 'ملغى'
      }
    ];
    searchrequest.filter.legalEntity = [
      {
        english: 'Limited',
        arabic: 'ملغى'
      }
    ];
    searchrequest.filter.filedOffice = [
      {
        english: 'Riyadh',
        arabic: 'ملغى'
      }
    ];
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.registrationNo = 10000602;
    searchrequest.searchParam.commercialRegistrationNo = 5677;
    searchrequest.searchParam.licenceNo = 23456;
    searchrequest.searchParam.phoneNumber = 54356789;
    searchrequest.searchParam.recruitmentNo = 45676879;
    searchrequest.searchParam.unifiedIdentificationNo = 3456789;
    dashboardSearchService.establishmentSearch(searchrequest).subscribe(() => {
      expect(establishmentListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(searchEstablishmentUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(establishmentListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const searchEstablishmentUrl = `/api/v1/establishment?globalSearch=true&page.pageNo=0&page.size=10&registrationNo=10000602&crNumber=5677&licenseNumber=23456&ownerOrAdminPhoneNumber=54356789&recruitmentNo=45676879&unifiedNationalNumber=3456789&sort.column=registrationNo&sort.direction=ASC&filter.legalEntity=Limited&filter.fieldOffice=Riyadh&filter.status=Cancelled`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'registrationNo';
    searchrequest.sort.direction = 'ASC';
    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'Cancelled',
        arabic: 'ملغى'
      }
    ];
    searchrequest.filter.legalEntity = [
      {
        english: 'Limited',
        arabic: 'ملغى'
      }
    ];
    searchrequest.filter.filedOffice = [
      {
        english: 'Riyadh',
        arabic: 'ملغى'
      }
    ];
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.registrationNo = 10000602;
    searchrequest.searchParam.commercialRegistrationNo = 5677;
    searchrequest.searchParam.licenceNo = 23456;
    searchrequest.searchParam.phoneNumber = 54356789;
    searchrequest.searchParam.recruitmentNo = 45676879;
    searchrequest.searchParam.unifiedIdentificationNo = 3456789;
    const errMsg = 'expect 404 error';
    dashboardSearchService.searchEstablishment(searchrequest).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(searchEstablishmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should get billing details', () => {
    const registrationNo = 10000602;
    const billHistory = `/api/v1/establishment/${registrationNo}/account`;
    dashboardSearchService.getBillingDetails(registrationNo).subscribe(() => {
      expect(billingListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(billHistory);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(billingListData);
    httpMock.verify();
  });
  it('should get contributor details', () => {
    const identifier = '10000602';
    const contributorUrl = `/api/v1/contributor?${identifier}&pageNo=0&pageSize=10`;
    dashboardSearchService.getContributorDetails(identifier).subscribe(() => {
      expect(contributorResponseTestData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(contributorUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(contributorResponseTestData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const identifier = '10000602';
    const errMsg = 'expect 404 error';
    const contributorUrl = `/api/v1/contributor?${identifier}&pageNo=0&pageSize=10`;
    dashboardSearchService.getContributorDetails(identifier).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });

  it('should search contributor details', () => {
    const searchContributorUrl = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=10000602&birthDate=1997-10-12&personName.arabic.firstName=mohammed&personName.arabic.secondName=abc&personName.arabic.thirdName=efg&personName.arabic.familyName=xxx&personName.english.name=ahmed&oldNationalId=9987654321&mobileNumber=546654665&nationalityCode=1&passportNo=1234567890&borderNo=1234&gccId=5678`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;
    searchrequest.searchKey = '10000602';
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.birthDate = '1997-10-12';
    searchrequest.searchParam.borderNo = 1234;
    searchrequest.searchParam.englishName = 'ahmed';
    searchrequest.searchParam.familyName = 'xxx';
    searchrequest.searchParam.firstName = 'mohammed';
    searchrequest.searchParam.secondName = 'abc';
    searchrequest.searchParam.thirdName = 'efg';
    searchrequest.searchParam.gccId = 5678;
    searchrequest.searchParam.nationalityCode = 1;
    searchrequest.searchParam.oldNationalId = 9987654321;
    searchrequest.searchParam.passportNo = 1234567890;
    searchrequest.searchParam.phoneNumber = 546654665;

    dashboardSearchService.searchIndividual(searchrequest, false).subscribe(() => {
      expect(contributorResponseTestData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(searchContributorUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(contributorResponseTestData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const searchContributorUrl = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=10000602&birthDate=1997-10-12&personName.arabic.firstName=mohammed&personName.arabic.secondName=abc&personName.arabic.thirdName=efg&personName.arabic.familyName=xxx&personName.english.name=ahmed&oldNationalId=9987654321&mobileNumber=546654665&nationalityCode=1&passportNo=1234567890&borderNo=1234&gccId=5678`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;
    searchrequest.searchKey = '10000602';
    searchrequest.searchParam = new SearchParam();
    searchrequest.searchParam.birthDate = '1997-10-12';
    searchrequest.searchParam.borderNo = 1234;
    searchrequest.searchParam.englishName = 'ahmed';
    searchrequest.searchParam.familyName = 'xxx';
    searchrequest.searchParam.firstName = 'mohammed';
    searchrequest.searchParam.secondName = 'abc';
    searchrequest.searchParam.thirdName = 'efg';
    searchrequest.searchParam.gccId = 5678;
    searchrequest.searchParam.nationalityCode = 1;
    searchrequest.searchParam.oldNationalId = 9987654321;
    searchrequest.searchParam.passportNo = 1234567890;
    searchrequest.searchParam.phoneNumber = 546654665;
    const errMsg = 'expect 404 error';
    dashboardSearchService.searchIndividual(searchrequest, false).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(searchContributorUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
});
