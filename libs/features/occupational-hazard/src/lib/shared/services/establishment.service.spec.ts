/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { bindToObject, EnvironmentToken } from '@gosi-ui/core';
import { establishmentDetailsTestData, contributorsTestData } from 'testing';
import { Establishment } from '../models';
import { EstablishmentService } from './establishment.service';

describe('EstablishmentService', () => {
  let httpMock: HttpTestingController;
  let service: EstablishmentService;
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
    service = TestBed.inject(EstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('establishment services', () => [
    it('should get establishment', () => {
      const estIdentifier = 34564566;
      const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      const url = `/api/v1/establishment/${estIdentifier}`;
      service.getEstablishmentDetails(estIdentifier).subscribe(res => {
        expect(estIdentifier).toBe(estModelTestData.registrationNo);
        expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentDetailsTestData);
    })
  ]);

  describe('set RegistrationNumber', () => {
    it('Should set RegistrationNumber', () => {
      service.setSelectedRegNo(contributorsTestData.registrationNo);
      expect(service['selectedRegNo']).not.toBe(null);
    });
  });
  describe('get RegistrationNumber', () => {
    it('Should get RegistrationNumber', () => {
      service.getSelectedRegNo();
      service.setSelectedRegNo(contributorsTestData.registrationNo);
      expect(service['selectedRegNo']).not.toBe(null);
    });
  });
});
