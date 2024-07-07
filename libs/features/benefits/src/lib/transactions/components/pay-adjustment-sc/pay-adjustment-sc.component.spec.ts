/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAdjustmentScComponent } from './pay-adjustment-sc.component';
import {
  EnvironmentToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  LanguageToken,
  TransactionService,
  Transaction,
  TransactionParams,
  RouterConstants
} from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalServiceStub, ActivatedRouteStub, BilingualTextPipeMock } from 'testing';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';

describe('PayAdjustmentScComponent', () => {
  let component: PayAdjustmentScComponent;
  let fixture: ComponentFixture<PayAdjustmentScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails',
    'setTransactionDetails'
  ]);
  transactionServiceSpy.getTransactionDetails.and.returnValue({
    ...new Transaction(),
    fromJsonToObject: json => json,
    transactionRefNo: 1234,
    transactionId: 1234,
    businessId: 1234,
    params: {
      ...new TransactionParams(),
      IDENTIFIER: '1234',
      MISC_PAYMENT_ID: 1234
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [PayAdjustmentScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'abc',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BENEFIT_REQUEST_ID: 3527632,
          SIN: 1234445456
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('viewContributorDetails', () => {
    it('should viewContributorDetails', () => {
      component.viewContributorDetails();
      component.socialInsuranceNo = 625323;
      component.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_INFO(component.socialInsuranceNo)]);
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('navigateToAdjustment', () => {
    it('should navigateToAdjustment', () => {
      component.navigateToAdjustment(23323);
      component.router.navigate(['/home/adjustment/benefit-adjustment']);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['/home/adjustment/benefit-adjustment'],
        Object({
          queryParams: Object({
            adjustmentId: 23323
          })
        })
      );
    });
  });
});
