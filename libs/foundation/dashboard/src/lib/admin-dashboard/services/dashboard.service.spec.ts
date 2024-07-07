/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { SearchRequest, RequestLimit, SearchParam, RequestFilter, RequestSort } from '../../shared';
import { establishmentMockData, branchListMockData } from 'testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  let request: SearchRequest = new SearchRequest();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('get dashboard establishment', () => {
    const establishmentlistUrl =
      '/api/v1/admin/1234567890/dashboard?page.pageNo=0&page.size=10&searchParam=abd&fetchBranches=false&mainEstRegNo=10000602&branchFilter.listOfStatuses=Registered&branchFilter.location=Riyadh&sort.column=name&sort.direction=ASC';
    request.limit = new RequestLimit();
    request.limit.pageNo = 0;
    request.limit.pageSize = 10;
    request.searchKey = 'abd';
    request.searchParam = new SearchParam();
    request.searchParam.registrationNo = 10000602;
    request.searchParam.personIdentifier = 1234567890;
    request.filter = new RequestFilter();
    request.filter.status = [{ english: 'Registered', arabic: '' }];
    request.filter.filedOffice = [{ english: 'Riyadh', arabic: '' }];
    request.sort = new RequestSort();
    request.sort.column = 'name';
    request.sort.direction = 'ASC';
    service.getDashboardEstablishmentList(request).subscribe(() => {
      expect(establishmentMockData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(establishmentlistUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(establishmentMockData);
    httpMock.verify();
  });
  it('should get est details', () => {
    const registrationNo = 100006902;
    const establishmentUrl = `/api/v1/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    service.getEstablishmentDetails(registrationNo).subscribe(() => {
      expect(establishmentMockData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(establishmentUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(establishmentMockData);
    httpMock.verify();
  });
  it('should throw error', () => {
    const registrationNo = 100006902;
    const establishmentUrl = `/api/v1/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    const errMsg = 'expect 404 error';
    service.getEstablishmentDetails(registrationNo).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(establishmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('should get branch list', () => {
    const url = '/api/v1/admin/1234567890/establishment?branchFilter.includeBranches=false&fetchForDashboard=true';
    request.searchParam = new SearchParam();
    request.searchParam.personIdentifier = 1234567890;
    service.getBranchList(request).subscribe(() => {
      expect(branchListMockData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(url);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(branchListMockData);
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
