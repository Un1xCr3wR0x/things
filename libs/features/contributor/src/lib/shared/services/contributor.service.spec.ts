/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken, EnvironmentToken, Person } from '@gosi-ui/core';
import {
  contributorResponseTestData,
  getContributorData,
  PersonInformation,
  personResponse,
  systemParameterResponseData,
  vicContributorResponseData
} from 'testing';
import { ContributorDetailsWrapper } from '../models';
import { ContributorService } from './contributor.service';

describe('Contributor.ServiceService', () => {
  let service: ContributorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContributorService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ]
    });

    service = TestBed.inject(ContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get contrinutor', () => {
    it('Should retrieve the establishment', () => {
      const registerationNo = 200085744;
      const socialInsuranceNumber = 419734586;
      const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}?checkBeneficiaryStatus=true&fetchAddressFromWasel=true&absherVerificationRequired=true`;
      service
        .getContributor(
          registerationNo,
          socialInsuranceNumber,
          new Map()
            .set('fetchAddressFromWasel', true)
            .set('absherVerificationRequired', true)
            .set('checkBeneficiaryStatus', true)
        )
        .subscribe();
      const req = httpMock.expectOne(contributorUrl);
      expect(req.request.method).toBe('GET');
      req.flush(contributorResponseTestData);
    });
  });

  it('should set sin', () => {
    const personId = 1345612;
    const regNo = 1345612;
    service.setSin(personId, regNo).subscribe(result => {
      expect(result.socialInsuranceNo).toBe(getContributorData.socialInsuranceNo);
    });
    const url = `/api/v1/establishment/${regNo}/contributor?personId=${personId}`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getContributorData);
  });

  it('Should retrieve the person', () => {
    const queryParam = `NIN=1341341&birthDate=1996-07-17&role=sontributor`;
    const contributorUrl = `/api/v1/person?${queryParam}&fetchAddressFromWasel=true&absherVerificationRequired=true`;
    service
      .getPersonDetails(
        queryParam,
        new Map().set('fetchAddressFromWasel', true).set('absherVerificationRequired', true)
      )
      .subscribe(response => expect(response.lifeStatus).toEqual(personResponse.lifeStatus));
    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ listOfPersons: [personResponse] });
  });

  it('should retrieve person for person id', () => {
    const contributorUrl = `/api/v1/person/1036648685`;
    service.getPersonById(1036648685).subscribe(response => expect(response).toBeDefined());
    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('GET');
    req.flush(personResponse);
  });

  it('save contributor details', () => {
    const regNo = 123123;
    const personDeatils = new ContributorDetailsWrapper();
    personDeatils.contributorType = 'Saudi';
    const addContributorUrl = `/api/v1/establishment/${regNo}/contributor?contributorType=Saudi`;
    service.saveContributorDetails(personDeatils, regNo).subscribe(response => {
      expect(response.socialInsuranceNo).toBe(13456);
    });
    const req = httpMock.expectOne(addContributorUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ socialInsuranceNo: 13456 });
  });

  it('should update contributor', () => {
    const regNo = 123123;
    const sin = 123123;
    const personDetails = new ContributorDetailsWrapper();
    personDetails.contributorType = 'SAUDI';
    personDetails.person = new Person();
    service.updateContributor(personDetails, regNo, sin, 45698).subscribe(val => {
      expect(val).toBeNull();
    });
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}?contributorType=SAUDI`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should submit transaction', () => {
    const regNo = 123123;
    const sin = 123123;
    const engId = 4165798;
    service
      .submitUploadedDocuments(regNo, sin, engId, 'SUBMIT')
      .subscribe(val => expect(val.message.english).toBe('success'));
    const submitUploadedDocuments = `/api/v1/establishment/${regNo}/contributor/${sin}/engagement/${engId}?action=SUBMIT`;
    const req = httpMock.expectOne(submitUploadedDocuments);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'success', arabic: 'arabi' } });
  });

  it('should submit transaction validator 1 edit', () => {
    const regNo = 123123;
    const sin = 123123;
    const engId = 4165798;
    service
      .submitUploadedDocuments(regNo, sin, engId, 'V1EDIT')
      .subscribe(val => expect(val.message.english).toBe('success'));
    const submitUploadedDocuments = `/api/v1/establishment/${regNo}/contributor/${sin}/engagement/${engId}?action=V1EDIT`;
    const req = httpMock.expectOne(submitUploadedDocuments);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'success', arabic: 'arabi' } });
  });

  it('get person', () => {
    service['person'] = PersonInformation;
    expect(service.getPerson.govtEmp).toBeFalsy();
  });

  it('set person', () => {
    service.setPerson = PersonInformation;
    expect(service['person'].govtEmp).toBeFalsy();
  });

  it('set person', () => {
    service.setPersonalInformation(PersonInformation);
    expect(service['person'].govtEmp).toBeFalsy();
  });

  it('get contributor type', () => {
    service['contributorType'] = 'SAUDI';
    expect(service.getContributorType).toBe('SAUDI');
  });

  it('set contributor type', () => {
    service.setContributorType = 'SAUDI';
    expect(service['contributorType']).toBe('SAUDI');
  });

  it('Should get system parameters', () => {
    const url = `/api/v1/lov/system-parameters`;
    service.getSystemParams().subscribe(res => {
      expect(res).toEqual(systemParameterResponseData);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(systemParameterResponseData);
  });

  it('should revert transaction', () => {
    const regNo = 123123;
    const sin = 123123;
    const engagementId = 1233;
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/engagement/${engagementId}/revert`;
    service.revertTransaction(regNo, sin, engagementId).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should cancel transaction', () => {
    const regNo = 123123;
    const sin = 123123;
    const engagementId = 1233;
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/engagement/${engagementId}/transaction/24321/cancel`;
    service.cancelAddedContributor(regNo, sin, engagementId, 24321).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should get contributor details by  sin', () => {
    const url = `/api/v1/contributor/411885615?includeBankAccountInfo=true&checkBeneficiaryStatus=true&fetchAddressFromWasel=true`;
    service
      .getContributorBySin(
        411885615,
        new Map()
          .set('fetchAddressFromWasel', true)
          .set('includeBankAccountInfo', true)
          .set('checkBeneficiaryStatus', true)
      )
      .subscribe(res => {
        expect(res).not.toBeNull();
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(vicContributorResponseData);
  });

  it('should set person id', () => {
    service.personId = 12312321;
    expect(service['_personId']).toEqual(12312321);
  });

  it('should get person id', () => {
    service.personId = 12312321;
    expect(service.personId).toEqual(12312321);
  });

  it('should set penalty', () => {
    service.setPenaltyIndicator = 1;
    expect(service['penaltyIndicator']).toEqual(1);
  });

  it('should get penalty ', () => {
    service.setPenaltyIndicator = 1;
    expect(service.getPenaltyIndicator).toEqual(1);
  });

  it('should get sin ', () => {
    service['socialInsuranceNo'] = 1231235461;
    expect(service.getSocialInsuranceNumber).toEqual(1231235461);
  });
});
