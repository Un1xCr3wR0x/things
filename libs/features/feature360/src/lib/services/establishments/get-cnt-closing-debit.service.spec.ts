import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntClosingDebit } from '../../models/establishments/get-cnt-closing-debit';

import { GetCntClosingDebitService } from './get-cnt-closing-debit.service';

describe('GetCntClosingDebitService', () => {
  let service: GetCntClosingDebitService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntClosingDebitService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntClosingDebitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt closing debit service', () => [
    it('should get cnt closing debit', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntClosingDebit: GetCntClosingDebit = new GetCntClosingDebit();
      cntClosingDebit.totaldebit = 1234;

      const response = {
        elements: [cntClosingDebit]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_closing_debit/views/bv_cnt_get_closing_debit?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getClosingDebit(fromDate, establishmentId).subscribe(res => {
        expect(res.totaldebit).toBe(cntClosingDebit.totaldebit);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
