/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';

import { BranchOverviewService } from './branch-overview.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LanguageToken, EnvironmentToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { branchListData } from 'testing';

describe('BranchOverviewService', () => {
  let httpMock: HttpTestingController;
  let service: BranchOverviewService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        BranchOverviewService
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BranchOverviewService);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of branches under the establishment', () => {
    const registrationNo = 910000101;
    const pageNo = 0;
    const searchTerm = '';
    const branchViewUrl = '/api/v1/establishment/' + registrationNo + '/branches';
    service.establishmentBranches(registrationNo, pageNo, searchTerm).subscribe(response => {
      expect(response.branchList).toBe(branchListData.branchList);
    });
    const req = httpMock.expectOne(branchViewUrl);
    expect(req.request.method).toBe('POST');
    req.flush(branchListData);
  });
});
