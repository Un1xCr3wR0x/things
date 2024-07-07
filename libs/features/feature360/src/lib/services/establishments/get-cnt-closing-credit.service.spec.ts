import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntClosingCredit } from '../../models/establishments/get-cnt-closing-credit';

import { GetCntClosingCreditService } from './get-cnt-closing-credit.service';

describe('GetCntClosingCreditService', () => {
  let service: GetCntClosingCreditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntClosingCreditService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntClosingCreditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt closing credit service', () => [
    it('should get cnt closing credit', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntClosingCredit: GetCntClosingCredit = new GetCntClosingCredit();
      cntClosingCredit.closingcredit = 1234;

      const response = {
        elements: [cntClosingCredit]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_closing_credit/views/bv_cnt_get_closing_credit?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getClosingCredit(fromDate, establishmentId).subscribe(res => {
        expect(res.closingcredit).toBe(cntClosingCredit.closingcredit);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
