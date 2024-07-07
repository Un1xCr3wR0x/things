import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { Contributors } from '../../models/establishments/contributors';

import { ContributorsService } from './contributors.service';

describe('ContributorsService', () => {
  let service: ContributorsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContributorsService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(ContributorsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('contributors service', () => [
    it('should get contributors', () => {
      const establishmentId = 34564566;
      let contributors: Contributors[] = [{ nationality: 'SAUDI', status: 3, count_0: 5 }];
      const response = {
        elements: contributors
      };
      const url = `${service.interceptUrl}/customer360/bv_contributors/views/bv_contributors?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getContributors(establishmentId).subscribe(res => {
        expect(res).toEqual(contributors);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
