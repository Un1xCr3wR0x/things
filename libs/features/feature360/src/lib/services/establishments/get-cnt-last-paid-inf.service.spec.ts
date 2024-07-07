import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntLastPaidInf } from '../../models/establishments/get-cnt-last-paid-inf';

import { GetCntLastPaidInfService } from './get-cnt-last-paid-inf.service';

describe('GetCntLastPaidInfService', () => {
  let service: GetCntLastPaidInfService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntLastPaidInfService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntLastPaidInfService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt last paid information service', () => [
    it('should get cnt last paid info', () => {
      const establishmentId = 34564566;
      let cntLastPaidInf: GetCntLastPaidInf = new GetCntLastPaidInf();
      cntLastPaidInf.sumpsamountreceived_0 = 12345;

      const response = {
        elements: [cntLastPaidInf]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_get_last_paid_inf/views/bv_cnt_get_last_paid_inf?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntLastPaidInf(establishmentId).subscribe(res => {
        expect(res.sumpsamountreceived_0).toBe(cntLastPaidInf.sumpsamountreceived_0);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
