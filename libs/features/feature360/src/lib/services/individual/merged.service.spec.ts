import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { Merged } from '../../models/individual/merged';

import { MergedService } from './merged.service';

describe('MergedService', () => {
  let service: MergedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MergedService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(MergedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Merged service', () => [
    it('should get MergedDetails', () => {
      const registrationNo = 34564566;
      let merged: Merged = new Merged();

      const response = {
        elements: [merged]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/fv_merged?$filter=id+in+%27${registrationNo}%27`;
      service.getMergedDetails(registrationNo).subscribe(res => {
        expect(res).toEqual([merged]);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
