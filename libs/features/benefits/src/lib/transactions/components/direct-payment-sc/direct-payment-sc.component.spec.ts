/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  TransactionService,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DirectPaymentScComponent } from './direct-payment-sc.component';
import {
  LanguageToken,
  LookupService,
  LovList,
  bindToObject,
  Role,
  BPMUpdateRequest,
  WorkFlowActions
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock,
  LookupServiceStub,
  SanedBenefitMockService,
  genericError,
  TransactionServiceStub,
  ManageBenefitMockService
} from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  ManageBenefitService,
  UiBenefitsService,
  BenefitPropertyService,
  MiscellaneousPaymentRequest
} from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('DirectPaymentScComponent', () => {
  let component: DirectPaymentScComponent;
  let fixture: ComponentFixture<DirectPaymentScComponent>;
  const benefitPropertyServiceSpy = jasmine.createSpyObj<BenefitPropertyService>('BenefitPropertyService', [
    'validatorDetails'
  ]);
  benefitPropertyServiceSpy.validatorDetails.and.returnValue(of(new MiscellaneousPaymentRequest()));
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails'
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BenefitPropertyService, useValue: benefitPropertyServiceSpy },

        { provide: Router, useValue: routerSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ManageBenefitService, useClass: ManageBenefitMockService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: UiBenefitsService, useClass: ManageBenefitMockService },
        DatePipe,
        FormBuilder
      ],
      declarations: [DirectPaymentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getContributorDetailService', () => {
    component.requestId = 1234;
    component.miscPaymentId = 1234;
    component.getContributorDetailService();
    expect(component.getContributorDetailService).toBeDefined();
  });
});
