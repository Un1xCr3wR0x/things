import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  CurrencyToken,
  Environment,
  EnvironmentToken,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  debitCreditDetailsMock,
  establishmentHeaderMock,
  receiptDetailsMock,
  ReportStatementServiceStub
} from 'testing';
import { RouteConstants } from '../../../../shared/constants';
import { DebitCreditDetails, EstablishmentHeader, MonthReceipt } from '../../../../shared/models';
import { ReportStatementService } from '../../../../shared/services';
import { BillRecordsScComponent } from './bill-records-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('BillRecordsScComponent', () => {
  let component: BillRecordsScComponent;
  let fixture: ComponentFixture<BillRecordsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [BillRecordsScComponent, BilingualTextPipeMock],
      providers: [
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: RegistrationNoToken, useValue: new RegistrationNumber(null) },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: EnvironmentToken,
          useValue: new Environment()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRecordsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for establishment admin', () => {
      component.activatedRoute.queryParams = of({
        escalationId: '31123989279'
      });
      spyOn(component.billRecordService, 'getAccountRecords').and.returnValue(
        of(bindToObject(new DebitCreditDetails(), debitCreditDetailsMock))
      );
      component.ngOnInit();
      expect(component.billRecordService.getAccountRecords).toHaveBeenCalled();
      expect(component.accountRecords).toBeDefined();
    });
  });
  describe('test suite for getRecordsDetails', () => {
    it('It should get the getRecordsDetails', () => {
      spyOn(component.detailedBillService, 'getBillingHeader').and.returnValue(
        of(bindToObject(new EstablishmentHeader(), establishmentHeaderMock))
      );
      component.getRecordsDetails(504096157);
      expect(component.billingHeaderValue).toBeDefined();
      expect(component.detailedBillService.getBillingHeader).toHaveBeenCalledWith(504096157, true);
    });
  });
  describe('on account to new tab', () => {
    it('onAccountToNewTab', () => {
      spyOn(component.billRecordService, 'getAccountRecords').and.returnValue(
        of(bindToObject(new DebitCreditDetails(), debitCreditDetailsMock))
      );
      component.onAccountToNewTab('BILLING.ACCOUNT-DETAILS');
      component.selectedTab = 'BILLING.ACCOUNT-DETAILS';
      expect(component.accountRecords).toBeDefined();
      expect(component.billRecordService.getAccountRecords).toHaveBeenCalled();
    });
    it('on Wage ToNewTab', () => {
      spyOn(component.billRecordService, 'getWageRecords').and.returnValue(
        of(bindToObject(new DebitCreditDetails(), debitCreditDetailsMock))
      );
      component.onAccountToNewTab('BILLING.WAGE-DETAILS');
      component.selectedTab = 'BILLING.WAGE-DETAILS';
      expect(component.billRecordService.getWageRecords).toHaveBeenCalled();
    });
    it('on receipt ToNewTab', () => {
      spyOn(component.billRecordService, 'getReceiptsRecords').and.returnValue(
        of(bindToObject(new Array<MonthReceipt>(), receiptDetailsMock))
      );
      component.onAccountToNewTab('BILLING.RECEIPTS-DETAILS');
      component.selectedTab = 'BILLING.RECEIPTS-DETAILS';
      expect(component.receiptRecords).toBeDefined();
      expect(component.billRecordService.getReceiptsRecords).toHaveBeenCalled();
    });
    it('on allocation ToNewTab', () => {
      spyOn(component.billRecordService, 'getAllocationRecords').and.returnValue(
        of(bindToObject(new DebitCreditDetails(), debitCreditDetailsMock))
      );
      component.onAccountToNewTab('BILLING.ALLOCATION-DETAILS');
      component.selectedTab = 'BILLING.ALLOCATION-DETAILS';
      expect(component.allocationRecords).toBeDefined();
      expect(component.billRecordService.getAllocationRecords).toHaveBeenCalled();
    });
    it('on adjustment ToNewTab', () => {
      // spyOn(component.billRecordService, 'getAdjustmentTotal').and.returnValue(
      //   of(bindToObject(new Array<AdjustmentTotal>(), adjustmentTotalMock))
      // );
      // spyOn(component.billRecordService, 'getAdjustmentDetails_s2').and.returnValue(
      //   of(bindToObject(new Array<AdjustmentTypeDetails>(), adjustmentDetails_s2Mock))
      // );
      // spyOn(component.billRecordService, 'getAdjustmentDetails_s1').and.returnValue(
      //   of(bindToObject(new Array<AdjustmentWageDetails>(), adjustmentDetails_s1Mock))
      // );
      const mappingId = 12345;
      component.billRecordService.getAdjustmentTotal(mappingId).subscribe(res => {
        expect(res).not.toEqual(null);
        expect(component.adjustmentTotal).not.toEqual(null);
        // spyOn(component.billRecordService, 'getAdjustmentDetails_s2').and.returnValue(
        //     of(bindToObject(new Array<AdjustmentTypeDetails>(), adjustmentDetails_s2Mock))
        //   );
        //   expect(component.billRecordService.getAdjustmentDetails_s2).toHaveBeenCalled();
      });
      component.onAccountToNewTab('BILLING.ADJUSTMENT-BREAKUP-DETAILS');
      component.selectedTab = 'BILLING.ADJUSTMENT-BREAKUP-DETAILS';
      // expect(component.billRecordService.getAdjustmentTotal).toHaveBeenCalled();
      expect(component.adjustmentTotal).not.toEqual(null);
    });
  });
  describe('hideAccountModal', () => {
    it('should hideAccountModal', () => {
      component.hideAccountModal();
      expect(component.router.navigate).toHaveBeenCalledWith([RouteConstants.ROUTE_VIEW_RECORD]);
    });
  });
});
