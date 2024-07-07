/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  DetailedBillServiceStub,
  LookupServiceStub,
  ReportStatementServiceStub,
  BillDashboardServiceStub
} from 'testing/mock-services';
import { DetailedBillService, ReportStatementService, BillDashboardService } from '../../../../shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { ThirdPartyDetailedBillScComponent } from './third-party-detailed-bill-sc.component';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BillingConstants } from '../../../../shared/constants';
import { LookupService, LanguageToken, ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { FilterParams } from '../../../../shared/models/filter-params';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ThirdPartyBillScComponent', () => {
  let component: ThirdPartyDetailedBillScComponent;

  let fixture: ComponentFixture<ThirdPartyDetailedBillScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ThirdPartyDetailedBillScComponent],
      providers: [
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub },
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for establishment admin', inject([ActivatedRoute], (route: ActivatedRoute) => {
      route.queryParams = of({ monthSelected: '19-06-2020' });

      component.ngOnInit();
      expect(component.selectedDate).not.toBeNull();
    }));
  });
  describe('test suite for getMofEstablishmentBill', () => {
    it('It should get the mof establishment details', () => {
      component.getMofEstablishmentBillService();
      expect(component.mofEstablishmentBill).not.toEqual(null);
    });
  });

  describe('test suite for getDetails', () => {
    it('It should get the mof breakup details', () => {
      component.getDate('2020-03-01');
      expect(component.mofEstablishmentBill).not.toEqual(null);
    });
  });

  describe('test suite for getPaymentReceiptList', () => {
    it('should getPaymentReceiptList', () => {
      let filterParams: FilterParams = new FilterParams();
      filterParams.parentReceiptNo = '245';
      component.getPaymentReceiptList(filterParams);
      expect(component.paymentReceiptFilterParams).not.toEqual(null);
    });
  });
  describe('test suite for getCreditAdjustmentSelectPageNo', () => {
    it('getCreditAdjustmentSelectPageNo', () => {
      spyOn(component, 'getCreditAdjustmentDetails').and.callThrough();
      component.getCreditAdjustmentSelectPageNo(1);
      component.pageNo = 1;
      expect(component.getCreditAdjustmentDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getMofContributionMonth', () => {
    it('It should get the mof establishment details', () => {
      component.getMofContributionMonthService();
      expect(component.itemizedContributionMonth).not.toEqual(null);
    });
  });
  describe('test suite for getMofDashboardBillDetails', () => {
    it('It should navigate to bill dashboard', () => {
      spyOn(component.router, 'navigate');
      component.getMofDashboardBillDetails();
      expect(component.router.navigate).toHaveBeenCalledWith([BillingConstants.ROUTE_DASHBOARD_MOF]);
    });
    it('getReceiptSelectPageNo', () => {
      spyOn(component, 'getReceiptCreditDetails').and.callThrough();
      component.getReceiptSelectPageNo(1);
      component.pageNo = 1;
      expect(component.getReceiptCreditDetails).toHaveBeenCalled();
    });
    it('getReceiptSortList', () => {
      spyOn(component, 'getReceiptCreditDetails').and.callThrough();
      component.getReceiptSortList(1);
      component.receiptSortBy = 'ASC';
      component.paymentReceiptSortOrder = 'DESC';
      expect(component.getReceiptCreditDetails).toHaveBeenCalled();
      expect(component.ReceiptDetails).not.toEqual(null);
    });
    it('getPaymentReceiptDetails', () => {
      spyOn(component.detailedBillService, 'getReceipts').and.callThrough();
      component.getPaymentReceiptDetails('fg', 'asc');
      expect(component.ReceiptDetails).not.toEqual(null);
    });
    it('goToNewTab', () => {
      spyOn(component, 'getReceiptCreditDetails').and.callThrough();
      component.goToNewTab('BILLING.RECEIPTS-AND-CREDITS');
      component.selectedTab = 'BILLING.RECEIPTS-AND-CREDITS';
      expect(component.getReceiptCreditDetails).toHaveBeenCalled();
    });
    it('applyFilterDetails', () => {
      spyOn(component, 'getMofContributionMonthService').and.callThrough();
      component.applyFilterDetails('hghhhhh');
      component.pageNo = 0;
      expect(component.getMofContributionMonthService).toHaveBeenCalled();
    });
    it('getSerachValues', () => {
      spyOn(component, 'getMofContributionMonthService').and.callThrough();
      component.getSerachValues('hghhhhh');
      component.pageNo = 0;
      expect(component.getMofContributionMonthService).toHaveBeenCalled();
    });
    // it('getSortValuesForMofContribution', () => {
    //   spyOn(component, 'getMofContributionMonthService').and.callThrough();
    //   component.sortOrder ='ADC';
    //   component.sortBy ='desc';

    //   component.getSortValuesForMofContribution('hghhhhh');

    //   expect(component.getMofContributionMonthService).toHaveBeenCalled();
    // });
    it('getReceiptSortList', () => {
      spyOn(component, 'getReceiptCreditDetails').and.callThrough();
      component.getReceiptSortList('values');
      component.receiptSortBy = 'ASC';
      component.paymentReceiptSortOrder = 'DESC';
      expect(component.getReceiptCreditDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getselectPageNos', () => {
    it('It should get the getselectPageNos', () => {
      spyOn(component, 'getMofContributionMonthService').and.callThrough();
      component.getselectPageNo(1);
      expect(component.getMofContributionMonthService).toHaveBeenCalled();
    });
  });
  // describe('test suite for getRegistrationNo', () => {
  //   it('It should get the getContributorAllocationDetails', () => {
  //     spyOn(component.detailedBillService, 'getBillNumber').and.callThrough();
  //     component.getRegistrationNo(14567);
  //     spyOn(component.router, 'navigate');;
  //     expect(component.router.navigate).toHaveBeenCalledWith(
  //       [ 'home/billing/establishment/detailed-bill/contribution'],
  //       Object({ queryParams: Object({ monthSelected: '2019-04-01',billIssueDate:'2019-04-01',
  //       billNumber:undefined,   mofFlag: true,
  //       registerNo: 14567 }) })
  //     );
  //     expect(component.billNumber ).not.toEqual(null);
  //   });

  // });

  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printThirdPartyTransaction();
      expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadThirdPartyTransaction();
      expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadThirdPartyDetailedBill', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadThirdPartyDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for  printThirdPartyDetailedBill', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printThirdPartyDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
});
