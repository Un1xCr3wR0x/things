/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { bindToObject } from '@gosi-ui/core';
import { branchDetailsMockData, establishmentDetailsMockData, establishmentHeaderMockData } from 'testing';
import { BranchDetails, BranchDetailsWrapper, EstablishmentDetails } from '../models';
import { EstablishmentService } from './establishment-service';

describe('EstablishmentService', () => {
  let establishmentService: EstablishmentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    establishmentService = TestBed.inject(EstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const service: EstablishmentService = TestBed.inject(EstablishmentService);
    expect(service).toBeTruthy();
  });

  describe('establishment services', () => [
    it('should get establishment', () => {
      const registartionNo = 502351249;
      const estModelTestData: EstablishmentDetails = bindToObject(
        new EstablishmentDetails(),
        establishmentDetailsMockData
      );
      const url = `/api/v1/establishment/${registartionNo}`;
      establishmentService.getEstablishment(registartionNo).subscribe(res => {
        expect(registartionNo).toBe(estModelTestData.mainEstablishmentRegNo);
        expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentDetailsMockData);
    })
  ]);

  describe('get branch details', () => {
    it('should get the branch details', () => {
      const branchViewUrl = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/branches`;
      const branchResponse = new BranchDetailsWrapper();
      branchDetailsMockData.forEach(branch => {
        branchResponse.branchList.push(new BranchDetails().fromJsonToObject(branch));
      });
      establishmentService.getBranchDetails(establishmentHeaderMockData.registrationNo).subscribe(response => {
        expect(response.length).toEqual(2);
      });
      const req = httpMock.expectOne(branchViewUrl);
      expect(req.request.method).toBe('POST');
      req.flush(branchResponse);
    });
  });
});
