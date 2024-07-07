/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { bindToObject } from '@gosi-ui/core';
import { establishmentDetailsTestData, transferAllBranches } from 'testing';
import { Establishment } from '../models';
import { EstablishmentService } from './establishment.service';

describe('EstablishmentService', () => {
  let service: EstablishmentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstablishmentService]
    });
    service = TestBed.inject(EstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get establishment', () => {
    const estIdentifier = 34564566;
    const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
    const url = `/api/v1/establishment/${estIdentifier}`;
    service.getEstablishmentDetails(estIdentifier).subscribe(res => {
      expect(service['registrationNo']).toBe(estModelTestData.registrationNo);
      expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(establishmentDetailsTestData);
  });

  it('should throw error response', () => {
    const estIdentifier = 34564566;
    const errMsg = 'expect 404 error';
    const url = `/api/v1/establishment/${estIdentifier}`;
    service.getRegistrationFromStorage();
    service.getEstablishmentDetails(estIdentifier).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });

  it('should get branches', () => {
    const url = `/api/v1/establishment/200074351/branches`;
    service.getBranches(200074351).subscribe(res => expect(res.length).toBe(2));
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(transferAllBranches);
  });

  it('should get number branches', () => {
    const url = `/api/v1/establishment/200074351/branches`;
    service.getNumberOfBranches(200074351).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(transferAllBranches);
  });

  it('should get number of active branches', () => {
    const url = `/api/v1/establishment/200074351/branches`;
    service.getActiveBranchesCount(200074351).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(transferAllBranches);
  });
});
