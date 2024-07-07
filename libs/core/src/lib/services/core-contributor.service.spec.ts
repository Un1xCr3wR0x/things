import { TestBed } from '@angular/core/testing';

import { CoreContributorService } from './core-contributor.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentToken } from '../tokens';
import { contributorResponseTestData, genericError } from 'testing';
import { throwError } from 'rxjs';
import { Contributor } from '../models';
import { bindToObject } from '../utils/objects';

describe('ContributorService', () => {
  let httpMock: HttpTestingController;
  let service: CoreContributorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    });
    service = TestBed.inject(CoreContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should get Contributor', () => {
    it('fetch contributor', () => {
      const registerationNo = 200085744;
      const socialInsuranceNumber = 419734586;
      const isValidateStatus = true;
      const contributorTestData = bindToObject(new Contributor(), contributorResponseTestData);
      const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}`;
      service.getContributor(registerationNo, socialInsuranceNumber).subscribe(res => {
        expect(res).toBe(contributorTestData);
      });
      const req = httpMock.expectOne(contributorUrl);
      expect(req.request.method).toBe('GET');
      req.flush(contributorTestData);
    }),
      it('should throw error for get contributor', () => {
        const registerationNo = 200085744;
        const socialInsuranceNumber = 419734586;
        const isValidateStatus = true;
        const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}`;
        service.getContributor(registerationNo, socialInsuranceNumber).subscribe(
          res => {},
          err => {
            expect(service.selectedSIN).toBe(null);
          }
        );
        const req = httpMock.expectOne(contributorUrl);
        expect(req.request.method).toBe('GET');
        req.flush(throwError(genericError));
      });
  });
});
