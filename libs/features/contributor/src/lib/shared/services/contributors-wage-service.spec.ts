/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { bindToObject } from '@gosi-ui/core';
import { getActiveContributorResponse, updateWageResponse } from 'testing';
import { ContributorWageParams, UpdateWageRequest, UpdateWageResponse, ContributorFilter } from '../models';
import { ContributorsWageService } from './contributors-wage.service';

describe('ContributorsWageService', () => {
  let httpMock;
  let service: ContributorsWageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContributorsWageService]
    });
    service = TestBed.inject(ContributorsWageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get contributor wage details', () => {
    const registrationNo = 123123;
    const idenifiers = 13413;
    `includeWageInfo=true&status=ACTIVE&identifier=13413&pageNo=10`;
    const url = `/api/v1/establishment/${registrationNo}/contributor?includeWageInfo=true&status=ACTIVE&identifier=${idenifiers}&pageNo=0&pageSize=10`;
    new ContributorWageParams(true, null, 'ACTIVE', null, null, idenifiers);
    service
      .getContributorWageDetails(
        registrationNo,
        new ContributorWageParams(true, null, 'ACTIVE', null, null, idenifiers),
        true
      )
      .subscribe(response => {
        expect(response.numberOfContributors).toBe(2);
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getActiveContributorResponse);
  });
  it('should get contributor wage details', () => {
    const registrationNo = 123123;
    const pageNo = 2;
    const pageSize = 15;
    const filter = new ContributorFilter();
    filter.minDate = '01-01-2020';
    filter.maxDate = '01-12-2020';
    filter.minWage = '100';
    filter.maxWage = '500';
    filter.nationalityList = ['india'];
    const url = `/api/v1/establishment/${registrationNo}/contributor?includeWageInfo=true&queryForCount=true&filterCriteria.minDate=${
      filter.minDate
    }&filterCriteria.maxDate=${filter.maxDate}&filterCriteria.minWage=${filter.minWage}&filterCriteria.maxWage=${
      filter.maxWage
    }&filterCriteria.nationalityList=${
      filter.nationalityList[0]
    }&status=ACTIVE&identifier=123123123&sortBy=nationality&sortOrder=ASC&pageNo=${pageNo - 1}&pageSize=${pageSize}`;
    service
      .getContributorWageDetails(
        registrationNo,
        new ContributorWageParams(true, true, 'ACTIVE', pageNo, pageSize, 123123123, filter, 'nationality', 'ASC'),
        true
      )
      .subscribe(response => {
        expect(response.numberOfContributors).toBe(2);
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getActiveContributorResponse);
  });

  it('should update wage details', () => {
    const registrationNo = 123123;
    const url = `/api/v1/establishment/${registrationNo}/bulk-wage`;

    service.updateContributorWageDetailsList([new UpdateWageRequest()], registrationNo).subscribe(response => {
      expect(response).toEqual(bindToObject(new UpdateWageResponse(), updateWageResponse));
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(updateWageResponse);
  });
});
