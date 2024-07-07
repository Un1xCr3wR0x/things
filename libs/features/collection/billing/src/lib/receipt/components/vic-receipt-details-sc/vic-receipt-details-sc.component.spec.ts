/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VicReceiptDetailsScComponent } from './vic-receipt-details-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StorageServiceStub,
  BillDashboardServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  BillEstablishmentServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  BilingualTextPipeMock,
  DetailedBillServiceStub
} from 'testing';
import {
  StorageService,
  DocumentService,
  ExchangeRateService,
  LookupService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterDataToken,
  RouterData,
  LanguageToken
} from '@gosi-ui/core';
import {
  BillDashboardService,
  ContributionPaymentService,
  DetailedBillService,
  EstablishmentService
} from '../../../shared/services';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { BillingConstants } from '../../../shared/constants';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { PaymentDetails } from '../../../shared/models';
import { ReceiptApprovalStatus } from '../../../shared/enums';

describe('VicReceiptDetailsScComponent', () => {
  let component: VicReceiptDetailsScComponent;
  let fixture: ComponentFixture<VicReceiptDetailsScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicReceiptDetailsScComponent],
      providers: [
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: 'PUBLIC'
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(VicReceiptDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  get receipt details', () => {
    component.ngOnInit();
    expect(component.route.queryParams).not.toEqual(null);
    component.receiptNo = 1334;
    component.sinNo = 420985290;
    component.pageNo = 0;
    expect(component.getDetailedReceipt).not.toEqual(null);
  });

  describe('test suite for getDetailedReceipt', () => {
    it('It should get the vic receipt details', () => {
      component.receiptNo = 1334;
      component.sinNo = 420985290;
      component.getDetailedReceipt();
      expect(component.receiptDetList).not.toEqual(null);
    });
  });

  describe('test suite for setContributorName', () => {
    it('It should set contributor Name', () => {
      const receiptDetList: PaymentDetails = new PaymentDetails();
      component.setContributorName(receiptDetList);
      // expect(component.receiptDetList.name.arabic).not.toBeNull();
      expect(component.receiptDetList).not.toBeNull();
    });
  });
  describe('test suite for setContributorName', () => {
    it('It should set contributor Name', () => {
      let receiptDetList: PaymentDetails = new PaymentDetails();
      receiptDetList.name.english.name = 'test';
      receiptDetList.name.arabic.firstName = 'test';
      receiptDetList.name.arabic.secondName = 'test';
      receiptDetList.name.arabic.thirdName = 'test';
      receiptDetList.name.arabic.familyName = 'test';
      component.setContributorName(receiptDetList);
      // expect(component.receiptDetList.name.arabic).not.toBeNull();
      expect(component.receiptDetList).not.toBeNull();
    });
  });

  describe('test suite for checkReceiptStatus', () => {
    it('It should get receipt status processed', () => {
      component.statusStyle = '';
      component.checkReceiptStatus(ReceiptApprovalStatus.PROCESSED);
      expect(component.statusStyle).toEqual('');
    });
    it('It should get receipt status new', () => {
      component.checkReceiptStatus(ReceiptApprovalStatus.DISCARD);
      expect(component.statusStyle).toEqual('gray');
    });
    it('It should get receipt status cancelled', () => {
      component.checkReceiptStatus(ReceiptApprovalStatus.CANCELLED);
      expect(component.statusStyle).toEqual('Red');
    });
    it('It should get receipt status to be cancelled', () => {
      component.checkReceiptStatus(ReceiptApprovalStatus.TO_BE_CANCELLED);
      expect(component.statusStyle).toEqual('Orange');
    });
  });

  describe('test suite for routeTo', () => {
    it('It should navigate to vic receipt screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBack();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.RECEIPT_VIC_LIST_ROUTE],
        Object({
          queryParams: Object({
            pageNo: undefined,
            searchFlag: true,
            idNo: undefined
          })
        })
      );
    });
  });

  describe('getDetailedReceipt', () => {
    it('should get receipt details', () => {
      spyOn(component.detailedBillService, 'getVicReceiptDetList').and.callThrough();
      component.getDetailedReceipt();
      expect(component.detailedBillService.getVicReceiptDetList).toHaveBeenCalled();
    });
  });
});
