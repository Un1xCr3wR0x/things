/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  CommonIdentity,
  DocumentItem,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  Lov,
  LovList,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionParams,
  TransactionService
} from '@gosi-ui/core';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  ManagePersonServiceStub,
  ModalServiceStub,
  BilingualTextPipeMock,
  genericError,
  NameToStringPipeMock
} from 'testing';

import { BilingualTextPipe, NameToString } from '@gosi-ui/foundation-theme/src';
import { BenefitRecalculationDetailsScComponent } from '../..';

import {
  BenefitDocumentService,
  BenefitPropertyService,
  TransactionHistoryDetails,
  AdjustmentDetailsDto,
  HeirBenefitService,
  DependentDetails,
  HeirActiveService,
  ActiveHeirData,
  PaymentDetail,
  ActiveHeirDetails,
  DependentService,
  ManageBenefitService,
  BeneficiaryDetails,
  MainframeBenefit,
  SimisBenefit,
  AnnuityResponseDto,
  BenefitRecalculation,
  BenefitDetails
} from '../../..';

describe('BenefitRecalculationDetailsScComponent', () => {
  let component: BenefitRecalculationDetailsScComponent;
  let fixture: ComponentFixture<BenefitRecalculationDetailsScComponent>;
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails',
    'navigate'
  ]);
  transactionServiceSpy.navigate.and.returnValue();

  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments'
  ]);
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitPropertyServiceSpy = jasmine.createSpyObj<BenefitPropertyService>('BenefitPropertyService', [
    'getTransactionHistoryDetails',
    'getHeirAdjustmentDetails',
    'getTransactionStatus',
    'filterTransactionHistory'
  ]);
  benefitPropertyServiceSpy.filterTransactionHistory.and.returnValue(of(new TransactionHistoryDetails()));
  benefitPropertyServiceSpy.getHeirAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  benefitPropertyServiceSpy.getTransactionHistoryDetails.and.returnValue(of(new TransactionHistoryDetails()));

  const heirServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirBenefit',
    'getHeirById'
  ]);
  heirServiceSpy.getHeirBenefit.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getHeirById.and.returnValue(of([new DependentDetails()]));
  const heirActiveServiceSpy = jasmine.createSpyObj<HeirActiveService>('HeirActiveService', [
    'getActiveHeirDetails',
    'getHeirDetails',
    'getPaymentDetails',
    'setActiveHeirDetails'
  ]);
  heirActiveServiceSpy.setActiveHeirDetails.and.returnValue();
  heirActiveServiceSpy.getHeirDetails.and.returnValue(of(new ActiveHeirData()));
  heirActiveServiceSpy.getPaymentDetails.and.returnValue(of(new PaymentDetail()));
  //const heirValues = {...new DependentDetails(), identity:[], personId: 1234,guardianPersonId:77676, fromJsonToObject: json => json, setValidatedValues: () => {}, setSelectedStatus: () => {}};
  heirActiveServiceSpy.getActiveHeirDetails.and.returnValue({ ...new ActiveHeirDetails() });
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory'
  ]);
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getSystemRunDate',
    'getPaymentFilterEventType',
    'filterPaymentHistory',
    'getPaymentFilterStatusType',
    'getBenefitCalculationDetailsByRequestId',
    'getBeneficiaryDetails',
    'getSimisPaymentHistory',
    'getMainframePaymentHistory',
    'getBenefitDetails',
    'getBenefitRecalculation'
  ]);
  const beneficiary: BeneficiaryDetails = {
    isEditable: true,
    errorMessage: { english: '', arabic: '' }
  };
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getMainframePaymentHistory.and.returnValue(of([new MainframeBenefit()]));
  manageBenefitServiceSpy.getSimisPaymentHistory.and.returnValue(of([new SimisBenefit()]));
  manageBenefitServiceSpy.getBeneficiaryDetails.and.returnValue(of(beneficiary));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPaymentFilterEventType.and.returnValue(of(new LovList([new Lov()])));
  manageBenefitServiceSpy.filterPaymentHistory.and.returnValue(of(new PaymentDetail()));
  manageBenefitServiceSpy.getPaymentFilterStatusType.and.returnValue(of(new LovList([new Lov()])));

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [BenefitRecalculationDetailsScComponent, BilingualTextPipeMock, NameToStringPipeMock],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: HeirBenefitService, useValue: heirServiceSpy },
        { provide: HeirActiveService, useValue: heirActiveServiceSpy },
        { provide: BenefitPropertyService, useValue: benefitPropertyServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: NameToString, useClass: NameToStringPipeMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitRecalculationDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
