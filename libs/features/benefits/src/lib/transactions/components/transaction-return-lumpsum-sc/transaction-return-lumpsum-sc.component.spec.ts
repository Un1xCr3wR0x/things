/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  DocumentItem,
  BPMUpdateRequest,
  ContributorTokenDto,
  ContributorToken
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, BilingualTextPipeMock, initializeTheViewValidator1 } from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionReturnLumpsumScComponent } from './transaction-return-lumpsum-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import {
  BenefitConstants,
  UITransactionType,
  BenefitDocumentService,
  ReturnLumpsumService,
  ReturnLumpsumDetails,
  AnnuityResponseDto,
  ManageBenefitService,
  CreditBalanceDetails,
  BenefitDetails,
  AttorneyDetailsWrapper,
  PersonalInformation,
  SearchPersonalInformation,
  DependentService,
  StatusHistory,
  HistoryDetails,
  DependentHistory,
  HeirBenefitService,
  DependentDetails,
  Benefits,
  AdjustmentService,
  PersonAdjustmentDetails,
  DeathNotification,
  ReturnLumpsumPaymentDetails
} from '../../../shared';
import { TemplateRef } from '@angular/core';

describe('TransactionReturnLumpsumScComponent', () => {
  let component: TransactionReturnLumpsumScComponent;
  let fixture: ComponentFixture<TransactionReturnLumpsumScComponent>;
  const status: StatusHistory = {
    heirStatus: { english: '', arabic: '' },
    status: { english: '', arabic: '' },
    statusDate: null
  };
  const history: HistoryDetails = {
    identifier: [],
    statusHistory: status[''],
    name
  };
  const dependet: DependentHistory = {
    requestDate: null,
    dependentHistoryDetails: history['']
  };

  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'setDependents',
    'getBenefitHistory',
    'getDependentHistory',
    'setReasonForBenefit',
    'getDependentDetailsById'
  ]);
  dependentServiceSpy.getDependentDetailsById.and.returnValue(of([new DependentDetails()]));
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getDependentHistory.and.returnValue(of(dependet));
  const manageBenefitServicespy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'getContirbutorRefundDetails',
    'getBenefitCalculationDetailsByRequestId',
    'getSelectedAuthPerson',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'setValues',
    'updateAnnuityWorkflow',
    'updateLateRequest'
  ]);
  manageBenefitServicespy.getAnnuityBenefitRequestDetail.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      personId: 2345323,
      contributorName: { english: '', arabic: '' },
      paymentMethod: { english: '', arabic: '' },
      requestType: { english: '', arabic: '' },
      actionType: '',
      isDoctor: false,
      payeeType: { english: '', arabic: '' },
      benefitType: { english: '', arabic: '' },
      heirBenefitReason: { english: '', arabic: '' }
    })
  );

  manageBenefitServicespy.getContirbutorRefundDetails.and.returnValue(of(new CreditBalanceDetails()));
  manageBenefitServicespy.updateAnnuityWorkflow.and.returnValue(of(new BPMUpdateRequest()));
  manageBenefitServicespy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServicespy.getSelectedAuthPerson.and.returnValue(
    of([
      { ...new AttorneyDetailsWrapper(), preSelectedAuthperson: [{ ...new AttorneyDetailsWrapper(), personId: 123 }] }
    ])
  );
  manageBenefitServicespy.getPersonDetailsApi.and.returnValue(
    of({
      ...new SearchPersonalInformation(),
      listOfPersons: [
        {
          ...new PersonalInformation(),
          personId: 1234,
          sex: { english: 'Male', arabic: '' },
          fromJsonToObject: json => json
        }
      ]
    })
  );
  manageBenefitServicespy.getPersonDetailsWithPersonId.and.returnValue(
    of({
      ...new PersonalInformation(),
      identity: [],
      fromJsonToObject: json => json,
      name: {
        english: { name: '' },
        guardianPersonId: 2323,
        arabic: { firstName: '', secondName: '', thirdName: '', familyName: '', fromJsonToObject: json => json },
        fromJsonToObject: json => json
      }
    })
  );
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments'
  ]);
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitDocumentServiceespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServiceespy.getValidatorDocuments.and.returnValue(of([new BenefitDetails()]));
  benefitDocumentServiceespy.getUploadedDocuments.and.returnValue(of([new BenefitDetails()]));
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'adjustmentDetails',
    'getAdjustmentsByDualStatus'
  ]);
  adjustmentServiceSpy.adjustmentDetails.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  adjustmentServiceSpy.getAdjustmentsByDualStatus.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen',
    'getEligibleBenefitByType'
  ]);
  heirBenefitServicespy.getHeirForValidatorScreen.and.returnValue(of([new DependentDetails()]));
  heirBenefitServicespy.getEligibleBenefitByType.and.returnValue(of([{ ...new Benefits() }]));
  const repaymentDetails: ReturnLumpsumPaymentDetails = {
    paymentMethod: { english: '23223', arabic: '' },
    receiptMode: { english: 'sdsdd', arabic: '' }
  };

  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getLumpsumRepaymentDetails',
    'setRepayId',
    'setBenefitReqId'
  ]);

  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(
    of({ ...new ReturnLumpsumDetails(), repaymentDetails, benefitType: { english: '23223', arabic: '' } })
  );
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServicespy },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        //{ provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      declarations: [TransactionReturnLumpsumScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReturnLumpsumScComponent);
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
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'field-office'
        },
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

  describe('getLumpsumRepaymentDetails', () => {
    it('should show  getLumpsumRepaymentDetails', () => {
      component.getLumpsumRepaymentDetails(323, 4334, 32343);
      expect(component.getLumpsumRepaymentDetails).toBeDefined();
    });
  });

  describe('fetchDocumentsForOtherPayment', () => {
    it('should fetchDocumentsForOtherPayment', () => {
      component.fetchDocumentsForOtherPayment();
      expect(component.fetchDocumentsForOtherPayment).toBeDefined();
    });
  });
  describe('fetchDocumentsForRestore', () => {
    it('should fetchDocumentsForRestore', () => {
      const enableLumpsumRepaymentId = 235445;
      component.fetchDocumentsForRestore(enableLumpsumRepaymentId);
      expect(component.fetchDocumentsForRestore).toBeDefined();
    });
  });
  describe(' setBenefitVariables', () => {
    it('should  setBenefitVariables hazardousLumpsum', () => {
      component.benefitType = 'Retirement Lumpsum Benefit (Hazardous Occupation)';
      component.isHazardous = true;
      expect(component.isHazardous).toBeTrue();
      component.setBenefitVariables('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.benefitType).toEqual('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables jailedContributorLumpsum', () => {
      component.benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.isJailedLumpsum = true;
      component.setBenefitVariables('Jailed Contributor Lumpsum Benefit');
      expect(component.benefitType).toEqual('Jailed Contributor Lumpsum Benefit');
      expect(component.isJailedLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables occLumpsum', () => {
      component.benefitType = 'Occupational Disability Lumpsum Benefit';
      component.isOcc = true;
      component.setBenefitVariables('Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Occupational Disability Lumpsum Benefit');
      expect(component.isOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isNonOcc', () => {
      component.isNonOcc = true;
      component.benefitType = 'Non-Occupational Disability Lumpsum Benefit';
      component.setBenefitVariables('Non-Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Non-Occupational Disability Lumpsum Benefit');
      expect(component.isNonOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isWomenLumpsum ', () => {
      component.isWomenLumpsum = true;
      component.benefitType = 'Woman Lumpsum Benefit';
      component.setBenefitVariables('Woman Lumpsum Benefit');
      expect(component.benefitType).toEqual('Woman Lumpsum Benefit');
      expect(component.isWomenLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isHeir', () => {
      component.isHeir = true;
      component.benefitType = 'Heir Lumpsum Benefit';
      component.setBenefitVariables('Heir Lumpsum Benefit');
      expect(component.benefitType).toEqual('Heir Lumpsum Benefit');
      expect(component.isHeir).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
  });
  describe(' getDocumentsForRestore', () => {
    it('should  getDocumentsForRestore', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      const enableLumpsumRepaymentId = 235445;
      component.getDocumentsForRestore(transactionKey, transactionType, enableLumpsumRepaymentId);
      expect(component.getDocumentsForRestore).toBeDefined();
    });
  });
  //validatorhelperbase
});
