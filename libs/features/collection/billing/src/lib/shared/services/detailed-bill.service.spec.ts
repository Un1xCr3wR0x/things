import { TestBed } from '@angular/core/testing';

import { DetailedBillService } from './detailed-bill.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationTypeToken, AuthTokenService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  mofBillMockData,
  requestListMockData,
  contributionDetailedBillMockDate,
  establishmentHeaderMockData,
  billDetails,
  billHistoryMockData,
  itemizedAdjustmentDetailsMockData,
  receiptFilterDetailsMockData,
  receiptListMockData,
  paymentDetailsMockData,
  allocationDetailsMockData,
  MofItemizedContributionFilter,
  changeEngagementDetails,
  AuthTokenServiceStub
} from 'testing';
import { FilterParams } from '../models';

describe('DetailedBillService', () => {
  let service: DetailedBillService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PUBLIC'
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(DetailedBillService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getBillBreakup', () => {
    it('to get bill break up details for establishment', () => {
      const getBillBreakupEstURL = `/api/v1/establishment/504096157/bill/77/bill-summary?startDate=2019-09-01&entityType=ESTABLISHMENT`;
      service.getBillBreakup(504096157, 77, '2019-09-01', 'ESTABLISHMENT').subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillBreakupEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billDetails);
    });
  });
  describe('getBillingHeader', () => {
    it('to get billing header for establishment', () => {
      const estHeaderURL = `/api/v1/establishment/507121934`;
      service.getBillingHeader(507121934, true).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(estHeaderURL);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentHeaderMockData);
    });
  });
  describe('getItemizedContribution', () => {
    it('should get itemized contribution details', () => {
      const url = `/api/v1/establishment/502351249/bill/28/bill-item/contribution?pageNo=0&pageSize=10&responsiblePayee=ESTABLISHMENT&sortBy=CONTRIBUTOR_NAME_ENG&sortOrder=ASC&searchKey=111&maxContributionUnit=31&minContributionUnit=31&maxContributoryWage=1000&minContributoryWage=50&maxTotal=100&minTotal=50&saudiPerson=true`;
      service
        .getItemizedContribution(
          502351249,
          28,
          0,
          10,
          'ESTABLISHMENT',
          'CONTRIBUTOR_NAME_ENG',
          'ASC',
          requestListMockData
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(contributionDetailedBillMockDate);
    });
  });
  describe('getItemizedAdjustments', () => {
    it('should get itemized Adjustment details', () => {
      const url = `/api/v1/establishment/502351249/bill/28/bill-item/adjustment?pageNo=0&pageSize=10&type=BACKDATED_REGISTRATION&responsiblePayee=ESTABLISHMENT&sortBy=CONTRIBUTOR_NAME_ENG&sortOrder=ASC&searchKey=111&maxContributoryWage=1000&minContributoryWage=50&maxTotal=100&minTotal=50&minPeriodFrom=10-03-2020&maxPeriodFrom=10-05-2020&saudiPerson=true`;
      service
        .getItemizedDebitAdjustment(
          502351249,
          28,
          0,
          10,
          'BACKDATED_REGISTRATION',
          'ESTABLISHMENT',
          '111',
          requestListMockData
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(itemizedAdjustmentDetailsMockData);
    });
  });
  describe('getVicReceiptList', () => {
    it('should get vic receipt detail', () => {
      const url = `/api/v1/contributor/502351249/payment?pageNo=0&pageSize=10&sortBy=TRANSACTION_DATE&sortOrder=ASC`;
      service
        .getVicReceiptList(
          502351249,
          new FilterParams().fromJsonToObject(receiptFilterDetailsMockData),
          0,
          10,
          'TRANSACTION_DATE',
          'ASC'
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(receiptListMockData);
    });
  });
  describe('getMofEstablishmentBill', () => {
    it('should get bill for mof establishments', () => {
      const url = `/api/v1/paying-establishment/1/bill?startDate=2020-03-01&pageLoad=false`;
      service.getMofEstablishmentBill('2020-03-01', false).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mofBillMockData);
    });
    it('should get bill for mof establishments on page load', () => {
      const url = `/api/v1/paying-establishment/1/bill?startDate=2020-03-01&pageLoad=true`;
      service.getMofEstablishmentBill('2020-03-01', true).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mofBillMockData);
    });
  });
  // describe('getMofContributionMonth', () => {
  //   it('should get bill for mof establishments', () => {
  //     const url = `/api/v1/paying-establishment/1/bill-itemized?pageNo=0&pageSize=100&startDate=2020-03-01`;
  //     service.getMofContributionMonth('2020-03-01', 0, 100).subscribe(res => {
  //       expect(res).not.toBe(null);
  //     });
  //     const req = httpMock.expectOne(url);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mofContributionMonthMockData);
  //   });
  // });

  describe('getVicReceiptDetList', () => {
    it('should get vic receipt details', () => {
      const url = `/api/v1/contributor/111730628/payment/850`;
      service.getVicReceiptDetList(111730628, 850).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(paymentDetailsMockData);
    });
  });

  describe('getReceipts', () => {
    it('should get receipts for establishment', () => {
      service
        .getReceipts(
          502351249,
          new FilterParams().fromJsonToObject(receiptFilterDetailsMockData),
          'ESTABLISHMENT',
          0,
          10,
          true,
          'TRANSACTION_DATE',
          'ASC'
        )
        .subscribe();
      const url = httpMock.expectOne(
        req =>
          req.urlWithParams ===
          service.getReceipt(
            502351249,
            new FilterParams().fromJsonToObject(receiptFilterDetailsMockData),
            'ESTABLISHMENT',
            0,
            10,
            true,
            'TRANSACTION_DATE',
            'ASC'
          )
      );
      expect(url.request.method).toBe('GET');
    });
  });
  describe('getReceipts', () => {
    it('should get  receipt details', () => {
      const url = `/api/v1/paying-establishment/502351249/payment?pageNo=0&pageSize=10&endDate=Invalid date&startDate=Invalid date&sortBy=19-09-2015&sortOrder=19-09-2015`;
      service
        .getReceipts(
          502351249,
          new FilterParams().fromJsonToObject(receiptFilterDetailsMockData),
          'THIRD_PARTY',
          0,
          10,
          true,
          '19-09-2015',
          '19-09-2015'
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(receiptListMockData);
    });
  });

  describe('getItemizedLatefeesDetails', () => {
    it('to get get ItemizedLatefee Details fro each bill', () => {
      const getItemizedLatefeeURL = `/api/v1/establishment/504096157/bill/1664/bill-item/change-engagement?isCreditAdjustment=true&pageNo=0&pageSize=10`;
      service.getItemizedLatefeesDetails(1664, 504096157, 0, 10, true).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getItemizedLatefeeURL);
      expect(req.request.method).toBe('GET');
      req.flush(changeEngagementDetails);
    });
  });
  describe('getBillNumber', () => {
    it('to get bill number for each bills', () => {
      const getBillNumberURL = `/api/v1/establishment/504096157/bill?includeBreakUp=false&startDate=2019-09-01&pageLoad=true`;
      service.getBillNumber(504096157, '2019-09-01', true).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillNumberURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillOnMonthChanges', () => {
    it('to get bill number for each bill', () => {
      const getBillNumber = `/api/v1/establishment/504096157/bill?includeBreakUp=false&startDate=2019-09-01`;
      service.getBillOnMonthChanges(504096157, '2019-09-01').subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillNumber);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
    it('to get bill number for each bill on pageLoad', () => {
      //const pageLoad = true;
      const getBillNumber = `/api/v1/establishment/504096157/bill?includeBreakUp=false&startDate=2019-09-01&pageLoad=true`;
      service.getBillOnMonthChanges(504096157, '2019-09-01', true).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillNumber);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });

  describe('getVicCreditDetails', () => {
    it('should get allocation details vic', () => {
      const url = `/api/v1/contributor/420985290/bill/2249/allocation-summary`;
      service.getVicCreditDetails(420985290, 2249).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(allocationDetailsMockData);
    });
  });
  describe('getMofContributionMonth', () => {
    it('should get mof contributor details', () => {
      const url = `/api/v1/paying-establishment/1/bill-itemized?pageNo=0&pageSize=10&startDate=2019-06-10&sortOrder=EST_NAME_ENG&sortBy=ASC&searchKey=4125633222&minAnnuity=0&maxAnnuity=10&minUi=1&maxUi=10&minOh=1&maxOh=10&minTotal=1&maxTotal=100&adjustmentIndicator=true`;
      service
        .getMofContributionMonth(
          '2019-06-10',
          0,
          10,
          'EST_NAME_ENG',
          'ASC',
          '4125633222',
          MofItemizedContributionFilter
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(allocationDetailsMockData);
    });
  });
});
