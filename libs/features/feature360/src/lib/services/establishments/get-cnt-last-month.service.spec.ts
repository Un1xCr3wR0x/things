import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntLastMonth } from '../../models/establishments/get-cnt-last-month';

import { GetCntLastMonthService } from './get-cnt-last-month.service';

describe('GetCntLastMonthService', () => {
  let service: GetCntLastMonthService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntLastMonthService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntLastMonthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt last month service', () => [
    it('should get cnt last month', () => {
      const establishmentId = 34564566;
      let cntLastMonth: GetCntLastMonth = new GetCntLastMonth();
      cntLastMonth.lastmonth = new Date();

      const response = {
        elements: [cntLastMonth]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_get_last_month/views/bv_cnt_get_last_month?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntLastMonth(establishmentId).subscribe(res => {
        expect(res.lastmonth).toBe(cntLastMonth.lastmonth);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
