/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService, EnvironmentToken, QueryParams } from '@gosi-ui/core';
import { AlertServiceStub, terminateResponseMock } from 'testing';
import { EstablishmentQueryKeysEnum } from '..';
import { QueryParam, TerminateResponse } from '../models';
import { TerminateEstablishmentService } from './terminate-establishment.service';

describe('TerminateEstablishmentService', () => {
  let terminateEstablishmentService: TerminateEstablishmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerminateEstablishmentService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        }
      ]
    });

    terminateEstablishmentService = TestBed.inject(TerminateEstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(terminateEstablishmentService).toBeTruthy();
  });
  describe('establishment services', () => [
    it('should  terminate a Establishment', () => {
      const registrationNo = 34564566;
      const terminateResponseTestData: TerminateResponse = terminateResponseMock;
      const url = `/api/v1/establishment/34564566/terminate?referenceNo=${registrationNo}`;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: registrationNo
        }
      ];
      terminateEstablishmentService.terminateEstablishment(registrationNo, null, queryParams).subscribe(res => {
        expect(res).toEqual(terminateResponseTestData);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(terminateResponseTestData);
    })
  ]);
});
