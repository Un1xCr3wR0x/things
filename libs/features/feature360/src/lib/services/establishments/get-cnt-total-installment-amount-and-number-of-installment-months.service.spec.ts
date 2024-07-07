import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths } from '../../models/establishments/get-cnt-total-installment-amount-and-number-of-installment-months';

import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService } from './get-cnt-total-installment-amount-and-number-of-installment-months.service';

describe('GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService', () => {
  let service: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt total installment amount and number of installment month service', () => [
    it('should get total installment amoun and number of installment months', () => {
      const establishmentId = 34564566;
      let cntNumberOfParshlyPaidOrUnPaidMonths: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths =
        new GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths();
      cntNumberOfParshlyPaidOrUnPaidMonths.totalinstallmentamount = 5;

      const response = {
        elements: [cntNumberOfParshlyPaidOrUnPaidMonths]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_total_installment_amount_and_number_of_installments_months/views/bv_cnt_total_installment_amount_and_number_of_installments_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntTotalInstallmentAmountAndNumberOfInstallmentMonths(establishmentId).subscribe(res => {
        expect(res.totalinstallmentamount).toBe(cntNumberOfParshlyPaidOrUnPaidMonths.totalinstallmentamount);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
