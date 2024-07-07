/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BillDashboardService, DetailedBillService } from '../../../../shared/services';
import { BillDashboardServiceStub, ExchangeRateServiceStub, DetailedBillServiceStub } from 'testing/mock-services';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken, LanguageToken, CurrencyToken, RegistrationNoToken } from '@gosi-ui/core/lib/tokens';
import { RegistrationNumber, RouterData } from '@gosi-ui/core/lib/models';

import { BehaviorSubject } from 'rxjs';
import { ExchangeRateService } from '@gosi-ui/core';
import { ContributorAllocationCreditScComponent } from './contributor-allocation-credit-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock } from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContributorAllocationCreditScComponent', () => {
  let component: ContributorAllocationCreditScComponent;
  let fixture: ComponentFixture<ContributorAllocationCreditScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ContributorAllocationCreditScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        FormBuilder,
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ExchangeRateService,
          useClass: ExchangeRateServiceStub
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
    fixture = TestBed.createComponent(ContributorAllocationCreditScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for getPreviousMonthSummary', () => {
    it('It should get the previous month bill summary details', () => {
      component.idNumber = 504096157;
      component.getBillingHeaderDetail(504096157);
      expect(component.allocationDetails).not.toEqual(null);
    });
  });

  it('should  form for the date picker', () => {
    component.ngOnInit();
    expect(component.allocationDetails).toBeTruthy();
    expect(component.allocationForm).toBeTruthy();
  });
  describe('test suite for getselectPageNo', () => {
    it('It should get the getContributorAllocationDetails', () => {
      spyOn(component, 'getcontributorAllocationCredit').and.callThrough();
      component.getselectPageNo(1);
      expect(component.getcontributorAllocationCredit).toHaveBeenCalled();
    });
  });
  describe('test suite for getCreditDetails', () => {
    it('It should get the getCreditDetails', () => {
      spyOn(component, 'getcontributorAllocationCredit').and.callThrough();
      component.getCreditDetails(104285);
      expect(component.getcontributorAllocationCredit).toHaveBeenCalled();
    });
  });
});
