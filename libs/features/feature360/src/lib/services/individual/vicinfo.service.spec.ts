import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { VICInfo } from '../../models/individual/vicinfo';

import { VICInfoService } from './vicinfo.service';

describe('VICInfoService', () => {
  let service: VICInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VICInfoService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(VICInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('VIC Info Details service', () => [
    it('should get VICInfoDetails', () => {
      const registrationNo = 34564566;
      let vicInfo: VICInfo = new VICInfo();

      const response = {
        elements: [vicInfo]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/bv_vic_info?$filter=id+in+%27${registrationNo}%27`;
      service.getVICInfoDetails(registrationNo).subscribe(res => {
        expect(res).toBe(vicInfo);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
