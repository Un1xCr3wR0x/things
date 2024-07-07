import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { SanedInfo } from '../../models/individual/saned-info';

import { SanedInfoService } from './saned-info.service';

describe('SanedInfoService', () => {
  let service: SanedInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SanedInfoService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(SanedInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Saned Info Details service', () => [
    it('should get SanedInfoDetails', () => {
      const registrationNo = 34564566;
      let snedInfo: SanedInfo = new SanedInfo();

      const response = {
        elements: [snedInfo]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/fv_saned_info?$filter=id+in+%27${registrationNo}%27`;
      service.getSanedInfoDetails(registrationNo).subscribe(res => {
        expect(res).toBe(snedInfo);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
