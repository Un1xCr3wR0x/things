/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CurrencyToken,
  DocumentService,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  StorageService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  BilingualTextPipeMock,
  BillDashboardServiceStub,
  BillEstablishmentServiceStub,
  ContributionPaymentServiceStub,
  DetailedBillServiceStub,
  DocumentServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  receiptListMockData,
  ReportStatementServiceStub,
  StorageServiceStub
} from 'testing';
import { BillingConstants } from '../../../shared/constants';
import {
  BillDashboardService,
  ContributionPaymentService,
  DetailedBillService,
  EstablishmentService,
  ReportStatementService
} from '../../../shared/services';
import { ReceiptScComponent } from './receipt-sc.component';

describe('ReceiptScComponent', () => {
  let component: ReceiptScComponent;
  let fixture: ComponentFixture<ReceiptScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ReceiptScComponent],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        { provide: ReportStatementService },
        { provide: DetailedBillService, useClass: DetailedBillServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber()
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve receipts for establishment', inject([ActivatedRoute], (route: ActivatedRoute) => {
    route.queryParams = of({ pageNo: '1', idNo: 212012 });
    component.ngOnInit();
    expect(component.pageNo).toEqual(1);
  }));

  it('should get receiptlist on search', () => {
    let filterParams = {
      filterParams: {
        parentReceiptNo: '245'
      },
      isSearch: true,
      isfilter: false
    };
    spyOn(component.detailedBillService, 'getReceipts').and.returnValue(of(receiptListMockData));
    component.getReceiptList(filterParams);
    expect(component.receiptList.receiptDetailDto.length).toBe(2);
  });
  it('check isSearch true', () => {
    component.isSearch = true;
    spyOn(component, 'getReceiptList');
    component.getReceiptList();
    expect(component.getReceiptList).toHaveBeenCalled();
  });
  describe('test suite for getselectPageNo', () => {
    it('It should navigate to getselectPageNo', () => {
      spyOn(component.billingRoutingService, 'navigateToDashboardBill');
      component.getselectPageNo(1);
      expect(component.pageNo).toEqual(1);
    });
  });
  describe('getReceiptList', () => {
    it('should get  receipt list based on soreted field', () => {
      spyOn(component, 'getReceiptList');
      component.getEstSortFields(555);
      component.sortedField = '555';
      expect(component.getReceiptList).toHaveBeenCalled();
    });
    describe('getEstSortedDirection', () => {
      it('should get  receipt list based on sorted direction', () => {
        spyOn(component, 'getReceiptList');
        component.getEstSortedDirection('DESC');
        component.sortedDirection = 'DESC';
        expect(component.getReceiptList).toHaveBeenCalled();
      });
    });
    describe('getReceiptDetails', () => {
      it('getReceiptDetails', () => {
        spyOn(component.router, 'navigate');
        component.getReceiptDetails(5241);
        expect(component.router.navigate).toHaveBeenCalledWith(
          [BillingConstants.RECEIPT_DETAILS_ROUTE],
          Object({
            queryParams: Object({ receiptNo: 5241, pageNo: 0, idNo: undefined })
          })
        );
      });
    });
    describe('test suite for navigateBackToBillDashBoard', () => {
      it('It should navigate to navigate To BillDashBoard', () => {
        spyOn(component.billingRoutingService, 'navigateToDashboardBill');
        component.navigateBackToBillDashBoard();
        expect(component.billingRoutingService.navigateToDashboardBill).toHaveBeenCalled();
      });
    });

    describe('test suite for printTransaction', () => {
      it('It should print transaction', () => {
        spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
        spyOn(window, 'open');
        component.printTransaction(54321);
        expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
      });
    });

    describe('test suite for downloadTransaction', () => {
      it('It should download file', () => {
        spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
        spyOn(window, 'open');
        component.downloadTransaction(54321);
        expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
      });
    });
  });
});
