/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from '@gosi-ui/core';
import { AlertServiceStub, suggestionListData } from 'testing';
import { SuggestionService } from './suggestion.service';
import { DatePipe } from '@angular/common';
import { SearchRequest, RequestLimit, RequestSort, RequestFilter } from '../models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
describe('SuggestionService', () => {
  let service: SuggestionService;
  let httpMock: HttpTestingController;
  let searchrequest: SearchRequest = <SearchRequest>{};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatePipe, { provide: AlertService, useClass: AlertServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(SuggestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should search suggestions with txn number', () => {
    const suggestionUrl = `/api/v1/suggestions?page.pageNo=0&page.size=10&searchKey=491887&sort.column=description&sort.direction=ASC&filter.listOfStatus=In Progress`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'description';
    searchrequest.sort.direction = 'ASC';

    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'In Progress',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    searchrequest.searchKey = '491887';
    service.getSuggestionList(searchrequest).subscribe(() => {
      expect(suggestionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(suggestionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(suggestionListData);
    httpMock.verify();
  });
  it('should search suggestions with txn number', () => {
    const suggestionUrl = `/api/v1/suggestions?page.pageNo=0&page.size=10&searchKey=491887&sort.column=description&sort.direction=ASC&filter.listOfStatus=In Progress`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'description';
    searchrequest.sort.direction = 'ASC';

    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'In Progress',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    searchrequest.searchKey = '491887';
    service.getSuggestionList(searchrequest).subscribe(() => {
      expect(suggestionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(suggestionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(suggestionListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const suggestionUrl = `/api/v1/suggestions?page.pageNo=0&page.size=10&searchKey=491887&sort.column=description&sort.direction=ASC&filter.listOfStatus=In Progress`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'description';
    searchrequest.sort.direction = 'ASC';

    searchrequest.filter = new RequestFilter();
    searchrequest.filter.status = [
      {
        english: 'In Progress',
        arabic: 'بلاغ قيد المعالج'
      }
    ];
    searchrequest.searchKey = '491887';
    const errMsg = 'expect 404 error';
    service.getSuggestionList(searchrequest).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(suggestionUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should search suggestions with txn number and filter with date', () => {
    const suggestionUrl = `/api/v1/suggestions?page.pageNo=0&page.size=10&searchKey=10001&sort.column=description&sort.direction=ASC&filter.fromDate=01-01-2020&filter.toDate=12-01-2020`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'description';
    searchrequest.sort.direction = 'ASC';

    searchrequest.filter = new RequestFilter();
    searchrequest.filter.fromDate = new Date('2020-01-01T10:48:49.112Z');
    searchrequest.filter.toDate = new Date('2020-01-12T10:48:49.112Z');
    searchrequest.searchKey = '10001';
    service.getSuggestionList(searchrequest).subscribe(() => {
      expect(suggestionListData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(suggestionUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(suggestionListData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const suggestionUrl = `/api/v1/suggestions?page.pageNo=0&page.size=10&searchKey=10001&sort.column=description&sort.direction=ASC&filter.fromDate=01-01-2020&filter.toDate=12-01-2020`;
    searchrequest.limit = new RequestLimit();
    searchrequest.limit.pageNo = 0;
    searchrequest.limit.pageSize = 10;

    searchrequest.sort = new RequestSort();
    searchrequest.sort.column = 'description';
    searchrequest.sort.direction = 'ASC';

    searchrequest.filter = new RequestFilter();
    searchrequest.filter.fromDate = new Date('2020-01-01T10:48:49.112Z');
    searchrequest.filter.toDate = new Date('2020-01-12T10:48:49.112Z');
    searchrequest.searchKey = '10001';
    const errMsg = 'expect 404 error';
    service.getSuggestionList(searchrequest).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(suggestionUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
