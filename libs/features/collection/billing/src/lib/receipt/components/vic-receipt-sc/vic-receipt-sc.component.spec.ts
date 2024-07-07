/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StorageService,
  DocumentService,
  ExchangeRateService,
  LookupService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterData,
  RouterDataToken,
  CurrencyToken,
  LanguageToken
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  BilingualTextPipeMock,
  StorageServiceStub,
  BillDashboardServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  BillEstablishmentServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { FilterParams } from '../../../shared/models';
import {
  BillDashboardService,
  ContributionPaymentService,
  EstablishmentService,
  DetailedBillService,
  ReportStatementService
} from '../../../shared/services';
import { VicReceiptScComponent } from './vic-receipt-sc.component';

describe('VicReceiptScComponent', () => {
  let component: VicReceiptScComponent;
  let fixture: ComponentFixture<VicReceiptScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicReceiptScComponent],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        { provide: DetailedBillService, useClass: DetailedBillServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VicReceiptScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  get lookup values', () => {
    component.ngOnInit();
    expect(component.receiptModes$).toBeTruthy();
    expect(component.receiptStatus$).toBeTruthy();
    expect(component.getLookupValues).not.toEqual(null);
  });

  describe('test suite for getVicReceiptList', () => {
    it('It should get the vic receipt details', () => {
      let filterParams: FilterParams = new FilterParams();
      component.pageNo = 0;
      component.pageSize = 10;
      component.sinNo = 420985290;
      component.getVicReceiptList(filterParams);
      expect(component.receiptList).not.toEqual(null);
    });
  });

  describe('test suite for getselectPageNo', () => {
    it('It should get the vic receipt details', () => {
      let filterParams: FilterParams = new FilterParams();
      component.pageNo = 0;
      component.pageSize = 10;
      component.sinNo = 420985290;
      component.getVicReceiptList(filterParams);
      expect(component.receiptList).not.toEqual(null);
    });
  });

  describe('test suite for getVicReceiptListOnload', () => {
    it('It should get the vic receipt details on load', () => {
      let filterParams: FilterParams = new FilterParams();
      component.sinNo = 420985290;
      component.getVicReceiptList(filterParams);
      expect(component.receiptList).not.toEqual(null);
    });
  });

  describe('test suite for navigateBackToBillDashBoard', () => {
    it('It should navigate to navigate To BillDashBoard', () => {
      spyOn(component.billingRoutingService, 'navigateToDashboardBill');
      component.sinNo = 420985290;
      component.selectedDate = '05-10-2020';
      component.navigateBackToVicBillDashBoard();
      expect(component.billingRoutingService.navigateToDashboardBill).toHaveBeenCalled();
    });
    it('should get vic receipt list on load', () => {
      spyOn(component, 'getVicReceiptList');
      component.getVicReceiptListOnload();
      component.sinNo = 12578966;
      expect(component.getVicReceiptList).toHaveBeenCalled();
    });
  });
  describe('getVicReceiptDetails', () => {
    it('navigate to receipt details screen', () => {
      spyOn(component.router, 'navigate');
      component.getVicReceiptDetails(5555);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/receipt/vic/receiptDetails'],
        Object({ queryParams: Object({ receiptNo: 5555, pageNo: 0, sinNo: undefined }) })
      );
    });
  });
  describe('test suite for getVicReceiptList', () => {
    it('should get vic receipt details', () => {
      let filterParams: FilterParams = new FilterParams();
      filterParams.parentReceiptNo = '245';
      component.getVicReceiptList(filterParams);
      expect(component.receiptList).not.toEqual(null);
      expect(component.resultFlag).toBeTruthy();
    });
    it('should get vic receipt list based on soreted field', () => {
      spyOn(component, 'getVicReceiptList');
      component.getSortedFieldDetails(555);
      component.sortedField = '555';
      expect(component.getVicReceiptList).toHaveBeenCalled();
    });
    it('should get vic receipt list based on sorted direction', () => {
      spyOn(component, 'getVicReceiptList');
      component.getSortedDirection('DESC');
      component.sortedDirection = 'DESC';
      expect(component.getVicReceiptList).toHaveBeenCalled();
    });
    it('should get vic receipt list based on page number selected', () => {
      spyOn(component, 'getVicReceiptList');
      component.getselectPageNo(1);
      component.pageNo = 1;
      expect(component.getVicReceiptList).toHaveBeenCalled();
    });
  });

  describe('test suite for vic printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'generateVicReciept').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printVicTransaction(54321);
      expect(component.reportStatementService.generateVicReciept).toHaveBeenCalled();
    });
  });

  describe('test suite for vic downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'generateVicReciept').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadVicTransaction(54321);
      expect(component.reportStatementService.generateVicReciept).toHaveBeenCalled();
    });
  });
});
