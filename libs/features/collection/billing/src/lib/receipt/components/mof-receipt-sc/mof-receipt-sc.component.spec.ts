/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MofReceiptScComponent } from './mof-receipt-sc.component';
import {
  LookupServiceStub,
  BillDashboardServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { of, BehaviorSubject } from 'rxjs';
import {
  LookupService,
  RouterDataToken,
  RouterData,
  DocumentService,
  CurrencyToken,
  LanguageToken
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  BillDashboardService,
  ContributionPaymentService,
  DetailedBillService,
  ReportStatementService
} from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterParams } from '../../../shared/models';

describe('MofReceiptScComponent', () => {
  let component: MofReceiptScComponent;
  let fixture: ComponentFixture<MofReceiptScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [MofReceiptScComponent],
      providers: [
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        { provide: DetailedBillService, useClass: DetailedBillServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MofReceiptScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve receipts for mof establishment', inject([ActivatedRoute], (route: ActivatedRoute) => {
    spyOn(component.router, 'navigate');
    component.ngOnInit();
    route.params = of({ pageNo: 10 });
    expect(component.getLookupValues).toBeTruthy;
    expect(component.isSearch).toBeTruthy;
    expect(component.getMofReceiptDetails).toBeTruthy;
  }));

  describe('test suite for getMofReceiptDetails', () => {
    it('should get mof receipt details', () => {
      let filterParams: FilterParams = new FilterParams();
      filterParams.parentReceiptNo = '245';
      component.getMofReceiptList(filterParams);
      expect(component.receiptList).not.toEqual(null);
    });
  });
  describe('test suite for routeTo', () => {
    it('It should navigate to Allocation', () => {
      spyOn(component.router, 'navigate');
      component.getMofReceiptDetails(5555);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/receipt/mof/receiptDetails'],
        Object({ queryParams: Object({ receiptNo: 5555, pageNo: 0, mof: true }) })
      );
    });
  });
  describe('test suite for navigateBackToMofBillDashBoard', () => {
    it('It should navigate to navigate To Mof BillDashBoard', () => {
      spyOn(component.billingRoutingService, 'navigateToMofDashboardBill');
      component.navigateBackToMofBillDashBoard();
      expect(component.billingRoutingService.navigateToMofDashboardBill).toHaveBeenCalled();
    });
  });
  describe('navigateToReceiptBreakup', () => {
    it('navigate to receipt details screen', () => {
      spyOn(component.router, 'navigate');

      component.navigateToReceiptBreakup(5555);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/receipt/mof/allocationDetails'],
        Object({ queryParams: Object({ receiptNo: 5555 }) })
      );
    });
    it('should get mof receipt list based on soreted field', () => {
      spyOn(component, 'getMofReceiptList');
      component.getSortedFieldDetailsForMof(555);
      component.sortedField = '555';
      expect(component.getMofReceiptList).toHaveBeenCalled();
    });
    it('should get mof receipt list based on sorted direction', () => {
      spyOn(component, 'getMofReceiptList');
      component.getMofSortedDirection('DESC');
      component.sortedDirection = 'DESC';
      expect(component.getMofReceiptList).toHaveBeenCalled();
    });
    it('should get mof receipt list based on page number selected', () => {
      spyOn(component, 'getMofReceiptList');
      component.getselectPageNoforMof(1);
      component.pageNo = 1;
      expect(component.getMofReceiptList).toHaveBeenCalled();
    });
  });

  describe('test suite for mof printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printMofTransaction(54321);
      expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
    });
  });

  describe('test suite for mof downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadMofTransaction(54321);
      expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
    });
  });
});
