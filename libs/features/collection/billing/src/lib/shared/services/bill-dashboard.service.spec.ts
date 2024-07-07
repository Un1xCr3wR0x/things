/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationTypeToken, AuthTokenService } from '@gosi-ui/core';
import {
  accountSummaryData,
  billHistoryMockData,
  allocationDetailsMockData,
  cotributorAllocationDetailsMockData,
  billhistoryFilterMockData,
  establishmentAllocationDetailsMockData,
  billDetails,
  MofAllocationBreakupFilterMockData,
  EstablishmentAllocationDetailsMockData,
  cotributorAllocationMockData
} from 'testing/test-data';

import { BillDashboardService } from './bill-dashboard.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MofAllocationBreakupFilter } from '../models/mof-allocation-breakup-filter';
import { AuthTokenServiceStub } from 'testing';

describe('BillDashboardService', () => {
  let billDashboardService: BillDashboardService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PUBLIC'
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    billDashboardService = TestBed.inject(BillDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const service: BillDashboardService = TestBed.inject(BillDashboardService);
    expect(service).toBeTruthy();
  });
  it('should get registration number', () => {
    billDashboardService.idNumber = 502351249; //invokes setter method
    expect(billDashboardService.idNumber).toBe(502351249);
  });
  it('should get paymentReceiptOrigin', () => {
    billDashboardService._paymentReceiptOrigin = false; //invokes setter method
    expect(billDashboardService._paymentReceiptOrigin).toBe(false);
  });
  describe('getBillHistory', () => {
    it('to get bill history details for establishment  with paging', () => {
      const getBillHistoryEstURL = `/api/v1/establishment/504096157/bill?endDate=2019-09-30&includeBreakUp=true&pageNo=0&pageSize=10&startDate=2019-03-01`;
      billDashboardService.getBillHistory(504096157, '2019-09-30', '2019-03-01', true, 0, 10).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistory', () => {
    it('to get bill history details for establishment', () => {
      const getBillHistoryEstURL = `/api/v1/establishment/504096157/bill?endDate=2019-09-30&includeBreakUp=true&startDate=2019-03-01`;
      billDashboardService.getBillHistory(504096157, '2019-09-30', '2019-03-01', true).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistory', () => {
    it('to get bill history details for establishment during search', () => {
      const getBillHistoryEstURL = `/api/v1/establishment/504096157/bill?includeBreakUp=true&pageNo=0&pageSize=10&startDate=2010-06-15&endDate=2010-06-30&adjustmentIndicator=yes&rejectedOhIndicator=NO&violationIndicator=yes&paymentStatus=paid&settlementEndDate=2010-06-30&settlementStartDate=2010-06-15&amount=1200&maxBillAmount=1000&minBillAmount=100`;
      billDashboardService
        .getBillHistorySearch(504096157, true, 0, 10, billhistoryFilterMockData)
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  // describe('getBillHistory', () => {
  //   it('to get bill history details for mofEstablishment', () => {
  //     const getBillHistoryEstURL = `/api/v1/paying-establishment/1/bill-history?endDate=2019-09-30&pageNo=0&pageSize=10&startDate=2010-06-15&endDate=2010-06-30`;
  //     billDashboardService.getBillHistoryMof('2019-09-30', '2019-03-01', 0, 10).subscribe(response => {
  //       expect(response).toBeDefined();
  //     });
  //     const req = httpMock.expectOne(getBillHistoryEstURL);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(billHistoryMockData);
  //   });
  // });

  //   // it('should get receipts for contributor', () => {
  //   //   const url = `/api/v1/contributor/502351249/payment`;
  //   //   billDashboardService
  //   //     .getReceipts(502351249, new FilterParams().fromJsonToObject(receiptFilterDetailsMockData), 0, 10,false)
  //   //     .subscribe(res => {
  //   //       expect(res.receiptDetailDto.length).toBe(2);
  //   //     });
  //   //   const req = httpMock.expectOne(url);
  //   //   expect(req.request.method).toBe('GET');
  //   //   req.flush(receiptListMockData);
  //   // });
  // });

  describe('getAccountSummary', () => {
    it('should get account summary for establishments', () => {
      const url = `/api/v1/establishment/bill/502351249/account-summary?startDate=2020-03-01`;
      billDashboardService.getAccountSummary('2020-03-01', true, 502351249).subscribe(res => {
        expect(res.length).toBe(4);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(accountSummaryData);
    });
    it('should get account summary for contributor', () => {
      const url = `/api/v1/contributor/bill/15103523/account-summary?startDate=2020-03-01`;
      billDashboardService.getAccountSummary('2020-03-01', false, 15103523).subscribe(res => {
        expect(res.length).toBe(4);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(accountSummaryData);
    });
    it('should get account summary for mof', () => {
      const url = `/api/v1/paying-establishment/1/account-summary?startDate=2020-03-01`;
      billDashboardService['appToken'] = 'PRIVATE';
      billDashboardService.getAccountSummary('2020-03-01', true, 1).subscribe(res => {
        expect(res.length).toBe(4);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(accountSummaryData);
    });
  });

  describe('getAllocationDetails', () => {
    it('should get allocation details establishment', () => {
      const url = `/api/v1/establishment/502351249/bill/28/allocation-summary`;
      billDashboardService.getAllocationDetails(502351249, 28).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(allocationDetailsMockData);
    });
  });

  describe('getAllocationCredit', () => {
    it('should get allocation details contributor', () => {
      const url = `/api/v1/establishment/502351249/bill/28/allocation?pageNo=0&pageSize=10&responsiblePayee=undefined`;
      billDashboardService.getAllocationCredit(502351249, 28, 0, 10).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(cotributorAllocationMockData);
    });
  });
  // describe('getMofAllocationDetails', () => {
  //   it('should get mof allocation details', () => {
  //     const url = `/api/v1/paying-establishment/1/bill/28/allocation-summary?startDate=15-10-2020&pageNo=0&pageSize=10&searchKey=4655555&minDebitAmount=155&maxDebitAmount=5555&minAllocatedAmount=465&maxAllocatedAmount=858&minBalanceAmount=899&maxBalanceAmount=7896`;
  //     billDashboardService.getMofAllocationDetails(1).subscribe(res => {
  //       expect(res).not.toBe(null);
  //     });
  //     const req = httpMock.expectOne(url);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(billAllocationMofMock);
  //   });
  // });

  describe('getIndividualcontributorAllocationDetails', () => {
    it('should get individual contributor allocation details', () => {
      const url = `/api/v1/establishment/502351249/contributor/200085744/bill/28/allocation-summary`;
      billDashboardService.getIndividualcontributorAllocationDetails(502351249, '200085744', 28).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(cotributorAllocationDetailsMockData);
    });
  });

  describe('getMofEstablishmentAllocationDetails', () => {
    it('should get mof establishment allocation details', () => {
      const url = `/api/v1/paying-establishment/1/payment/26302441/receipt-breakup?pageNo=0&pageSize=10`;
      billDashboardService.getMofEstablishmentAllocationDetails(1, 26302441, 0, 10).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentAllocationDetailsMockData);
    });
  });
  describe('getBillHistoryMof', () => {
    it('should get Mof bill history  details', () => {
      const getBillHistoryEstURL = `/api/v1/paying-establishment/1/bill-history?endDate=10-08-2020&pageNo=0&pageSize=10&startDate=14-05-2020`;
      billDashboardService.getBillHistoryMof('10-08-2020', '14-05-2020', 0, 10).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistoryMofSearchFilter', () => {
    it('sshould get Mof bill history  details', () => {
      const getBillHistoryEstURL = `/api/v1/paying-establishment/1/bill-history?&startDate=2010-06-15&endDate=2010-06-30&pageNo=0&pageSize=10&amount=1200&settlementStartDate=2010-06-15&settlementEndDate=2010-06-30&minBillAmount=100&maxBillAmount=1000&minCreditAmount=100&maxCreditAmount=1000&minNoOfEstablishment=1&maxNoOfEstablishment=10&minNoOfActiveContributor=1&maxNoOfActiveContributor=1&adjustmentIndicator=yes&paymentStatus=paid`;
      billDashboardService.getBillHistoryMofSearchFilter(billhistoryFilterMockData).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistory', () => {
    it('should get  bill history  details', () => {
      const getBillHistoryEstURL = `/api/v1/establishment/502351249/bill?endDate=10-08-2020&includeBreakUp=false&pageNo=0&pageSize=10&startDate=14-05-2020`;
      billDashboardService.getBillHistory(502351249, '10-08-2020', '14-05-2020', false, 0, 10).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistorySearchFilter', () => {
    it('sshould get bill history  details', () => {
      const getBillHistoryEstURL = `/api/v1/establishment/502351249/bill?includeBreakUp=false&pageNo=0&pageSize=10&startDate=2010-06-15&endDate=2010-06-30&adjustmentIndicator=yes&rejectedOhIndicator=NO&violationIndicator=yes&paymentStatus=paid&settlementEndDate=2010-06-30&settlementStartDate=2010-06-15&amount=1200&maxBillAmount=1000&minBillAmount=100`;
      billDashboardService.getBillHistorySearch(502351249, false, 0, 10, billhistoryFilterMockData).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getvicBillBreakup', () => {
    it('to get  vic bill break up details for establishment', () => {
      const getBillBreakupEstURL = `/api/v1/contributor/504096157/bill/77/bill-summary`;
      billDashboardService.getVicBillBreakup(504096157, 77).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillBreakupEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billDetails);
    });
  });
  describe('getBillNumber ', () => {
    it('to get bill number  for establishment', () => {
      const getBillBreakupEstURL = `/api/v1/contributor/504096157/bill?includeBreakUp=false&startDate=2010-06-15`;
      billDashboardService.getBillNumber(504096157, '2010-06-15').subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillBreakupEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });

  describe('getBillHistoryVic', () => {
    it('should get bill history details for vic', () => {
      const url = `/api/v1/contributor/502351249/bill?endDate=2019-06-15&includeBreakUp=false&pageNo=0&pageSize=10&startDate=2019-05-10`;
      billDashboardService.getBillHistoryVic(502351249, '2019-06-15', '2019-05-10', false, 0, 10).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getBillHistoryVicSearchFilter', () => {
    it('sshould get Mof bill history  details', () => {
      const getBillHistoryEstURL = `/api/v1/contributor/502351249/bill?&includeBreakUp=true&startDate=2010-06-15&endDate=2010-06-30&pageNo=0&pageSize=10&amount=1200&settlementStartDate=2010-06-15&settlementEndDate=2010-06-30&minBillAmount=100&maxBillAmount=1000&adjustmentIndicator=yes&paymentStatus=paid`;
      billDashboardService.getBillHistoryVicSearchFilter(billhistoryFilterMockData, 502351249).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getBillHistoryEstURL);
      expect(req.request.method).toBe('GET');
      req.flush(billHistoryMockData);
    });
  });
  describe('getContributorAllocationDetails', () => {
    it('should get allocation credit details', () => {
      const url = `/api/v1/establishment/502351249/bill/149/contributor/36987458/allocation-summary`;
      billDashboardService.getContributorAllocationDetails(502351249, 149, 36987458).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(cotributorAllocationDetailsMockData);
    });
  });
  describe('getMofEstablishmentAllocationDetails', () => {
    it('should get mof establishment allocation details', () => {
      const url = `/api/v1/paying-establishment/45128/payment/412/receipt-breakup?pageNo=0&pageSize=10&registrationNo=502351249&maxAllocationAmount=100&minAllocationAmount=200&minAllocationDate=2020-10-1&maxAllocationDate=2020-10-30`;
      billDashboardService
        .getMofEstablishmentAllocationDetails(
          45128,
          412,
          0,
          10,
          502351249,
          new MofAllocationBreakupFilter().fromJsonToObject(MofAllocationBreakupFilterMockData)
        )
        .subscribe(res => {
          expect(res).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(EstablishmentAllocationDetailsMockData);
    });
  });
});
