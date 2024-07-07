import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { ContributorInfo } from '../../models/individual/contributor-info';

import { ContributorInfoService } from './contributor-info.service';

describe('ContributorInfoService', () => {
  let service: ContributorInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContributorInfoService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(ContributorInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Contributor information service', () => [
    it('should get ContributorInfoDetails', () => {
      const registrationNo = 34564566;
      let contributorInfo: ContributorInfo = new ContributorInfo();

      const response = {
        elements: [contributorInfo]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/fv_contributor_info?$filter=id+in+%27${registrationNo}%27`;
      service.getContributorInfoDetails(registrationNo).subscribe(res => {
        expect(res).toBe(contributorInfo);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
