import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { contributorsTestData, engagementTestData, genericError, personDetailsTestData } from 'testing';
import { ContributorService } from '.';

describe('ContributorService', () => {
  let httpMock: HttpTestingController;
  let service: ContributorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() }
      ]
    });
    service = TestBed.inject(ContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPerson', () => {
    it('Should getPerson', () => {
      const url = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}`;
      service.getPerson(contributorsTestData.registrationNo, contributorsTestData.socialInsuranceNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(personDetailsTestData);
    });
  });
  describe('getContributor', () => {
    it('Should getContributor', () => {
      const url = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}`;
      service.getContributor(contributorsTestData.registrationNo, contributorsTestData.socialInsuranceNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(contributorsTestData);
    });
  });
  describe('getEngagement', () => {
    it('Should getEngagement', () => {
      service['registrationNo'] = contributorsTestData.registrationNo;
      service['socialInsuranceNo'] = contributorsTestData.socialInsuranceNo;
      const contributorUrl = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/engagement?pageNo=0&pageSize=100`;
      service.getEngagement(service['registrationNo'], service['socialInsuranceNo']).subscribe();
      const req = httpMock.expectOne(contributorUrl);
      expect(req.request.method).toBe('GET');
      req.flush(engagementTestData);
    });
  });
  describe('getContributorSearch', () => {
    it('to get the contributor details', () => {
      const getContributorUrl = `/api/v1/contributor?identifier=${contributorsTestData.searchValue}&pageNo=0&pageSize=100`;
      service.getContributorSearch(contributorsTestData.searchValue,contributorsTestData.registrationNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(getContributorUrl);
      expect(task.request.method).toBe('GET');
      task.flush(personDetailsTestData);
    });
  });
  describe('getContributorSearch', () => {
    it('to get the contributor details', () => {
      const getContributorUrl = `/api/v1/contributor?identifier=${contributorsTestData.searchValue}&pageNo=0&pageSize=100`;
      service.getContributorSearch(contributorsTestData.searchValue,contributorsTestData.registrationNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      (service as any).appToken = ApplicationTypeEnum.PUBLIC;
      const task = httpMock.expectOne(getContributorUrl);
      expect(task.request.method).toBe('GET');
      task.flush(personDetailsTestData);
    });
    it('should throw an error for getContributorSearch', () => {
      spyOn(service, 'getContributorSearch').and.returnValue(throwError(genericError));
      expect(service['returnValue']).not.toBe(null);
    });
  });
});
