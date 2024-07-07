/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  CommonIdentity,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionParams,
  TransactionService,
  CoreBenefitService,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, DocumentServiceStub, ModalServiceStub } from 'testing';
import { SystemParameterWrapper } from '../../../../../contributor/src';
import {
  AdjustmentDetailsDto,
  AnnuityResponseDto,
  BenefitConstants,
  BenefitDetails,
  BenefitDocumentService,
  BenefitPropertyService,
  BenefitResponse,
  Benefits,
  BypassReassessmentService,
  DependentDetails,
  DependentHistoryFilter,
  DependentTransaction,
  DisabilityTimeline,
  EligibilityResponse,
  HeirBenefitFilter,
  HeirBenefitList,
  HeirBenefitService,
  ImprisonmentDetails,
  ManageBenefitService,
  PaymentDetail,
  PaymentHistoryDetails,
  PaymentHistoryFilter,
  RepaymentDetails,
  TransactionHistoryDetails,
  UiBenefitsService,
  AdjustmentModification,
  AdjustmentService,
  PersonAdjustmentDetails,
  SimisBenefit,
  MainframeBenefit
} from '../../shared';
import { TransactionHistoryFilter } from '../../shared/models/transaction-history-filter';
import { PensionActiveScComponent } from './pension-active-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('PensionActiveScComponent', () => {
  let component: PensionActiveScComponent;
  let fixture: ComponentFixture<PensionActiveScComponent>;
  const annuityBenefits = {
    lateRequest: true,
    benefitId: 1234,
    benefitType: { english: '', arabic: '' },
    benefitGroup: { english: '', arabic: '' },
    referenceNo: 1234,
    requestDate: new GosiCalendar(),
    startDate: new GosiCalendar(),
    endDate: new GosiCalendar(),
    status: '',
    eligibilityRules: [new EligibilityResponse()],
    failedEligibilityRules: 1234,
    totalEligibilityRules: 1234,
    eligible: true,
    appeal: true,
    jailedPeriods: [new ImprisonmentDetails()],
    deathDate: new GosiCalendar(),
    missingDate: new GosiCalendar(),
    heirBenefitRequestReason: new BilingualText(),
    warningMessages: [new BilingualText()],
    eligiblePeriods: [
      {
        endDate: new GosiCalendar(),
        startDate: new GosiCalendar()
      }
    ],
    eligibleForDependentAmount: true,
    eligibleForVicCancellation: true,
    refundVicContribution: true
  };

  const benefitDocumentServiceSpy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'downloadAddCommitment',
    'getAllDocuments'
  ]);
  benefitDocumentServiceSpy.downloadAddCommitment.and.returnValue(of());
  benefitDocumentServiceSpy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitPropertyServiceSpy = jasmine.createSpyObj<BenefitPropertyService>('BenefitPropertyService', [
    'filterTransactionHistory',
    'getTransactionHistoryDetails',
    'getAdjustmentDetails',
    'getTransactionStatus'
  ]);
  benefitPropertyServiceSpy.filterTransactionHistory.and.returnValue(of(new TransactionHistoryDetails()));
  benefitPropertyServiceSpy.getAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  benefitPropertyServiceSpy.getTransactionStatus.and.returnValue(of(new LovList([new Lov()])));
  benefitPropertyServiceSpy.getTransactionHistoryDetails.and.returnValue(of(new TransactionHistoryDetails()));
  const bypassReaassessmentServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReassessmentService', [
    'accceptMedicalAssessment',
    'appealMedicalAssessment',
    'getDisabilityDetails'
  ]);
  bypassReaassessmentServiceSpy.accceptMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReaassessmentServiceSpy.appealMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReaassessmentServiceSpy.getDisabilityDetails.and.returnValue(of(new DisabilityTimeline()));
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'adjustmentDetails',
    'getAdjustmentsByDualStatus'
  ]);
  adjustmentServiceSpy.adjustmentDetails.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  adjustmentServiceSpy.getAdjustmentsByDualStatus.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  /*const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'setAnnuityDetails',
    'setActiveBenefit',
    'getSavedActiveBenefit'
  ]);
  modifyPensionServiceSpy.getSavedActiveBenefit.and.returnValue(
    new ActiveBenefits(1234, 1234, new BilingualText(), 1234)
  );*/
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'getAnnuityBenefits',
    'getPaymentFilterEventType',
    'getPaymentFilterStatusType',
    'getPaymentDetails',
    'getBenefitCalculationDetailsByRequestId',
    'filterPaymentHistory',
    'getSystemParams',
    'getSystemRunDate',
    'getUiCalculationDetailsByRequestId',
    'getSimisPaymentHistory',
    'getMainframePaymentHistory'
  ]);
  manageBenefitServiceSpy.getMainframePaymentHistory.and.returnValue(of([new MainframeBenefit()]));
  manageBenefitServiceSpy.getSimisPaymentHistory.and.returnValue(of([new SimisBenefit()]));
  manageBenefitServiceSpy.getUiCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getAnnuityBenefits.and.returnValue(of([new Benefits()]));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getPaymentFilterEventType.and.returnValue(of(new LovList([new Lov()])));
  manageBenefitServiceSpy.getPaymentFilterStatusType.and.returnValue(of(new LovList([new Lov()])));
  //manageBenefitServiceSpy.getEligibleDependentAmount.and.returnValue(true);
  manageBenefitServiceSpy.getPaymentDetails.and.returnValue(
    of({
      ...new PaymentDetail(),
      history: [
        {
          ...new PaymentHistoryDetails(),
          repaymentDetails: {
            ...new RepaymentDetails(),
            documents: [
              {
                ...new DocumentItem(),
                fromJsonToObject: (json: DocumentItem) => {
                  return json;
                },
                transactionId: '1234'
              }
            ]
          }
        }
      ]
    })
  );
  manageBenefitServiceSpy.filterPaymentHistory.and.returnValue(
    of({
      ...new PaymentDetail(),
      history: [
        {
          ...new PaymentHistoryDetails(),
          repaymentDetails: {
            ...new RepaymentDetails(),
            documents: [
              {
                ...new DocumentItem(),
                fromJsonToObject: (json: DocumentItem) => {
                  return json;
                },
                transactionId: '1234'
              }
            ]
          }
        }
      ]
    })
  );
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  // manageBenefitServiceSpy.getTransactionStatus.and.returnValue(of(new LovList([new Lov()])));
  //manageBenefitServiceSpy.filterPaymentHistory.and.returnValue(of({...new PaymentDetail(),paymentHistory:[{...new PaymentHistoryDetails()}]}));
  // manageBenefitServiceSpy.filterTransactionHistory.and.returnValue(of(new TransactionHistoryDetails()));
  // manageBenefitServiceSpy.getAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  const heirServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirById',
    'getBenefitLists',
    'filterHeirBenefitByDetail'
  ]);
  heirServiceSpy.getHeirById.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getBenefitLists.and.returnValue(of([{ ...new HeirBenefitList(), name: { english: '', arabic: '' } }]));
  heirServiceSpy.filterHeirBenefitByDetail.and.returnValue(of([new HeirBenefitList()]));
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'getSavedActiveBenefit',
    'setActiveBenefit'
  ]);
  coreBenefitServiceSpy.getSavedActiveBenefit.and.returnValue(
    new CoreActiveBenefits(122343, 454565, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 2323)
  );
  coreBenefitServiceSpy.setActiveBenefit.and.returnValue();
  const uiBenefitsServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', [
    'filterTransactionHistory',
    'getUiBenefitRequestDetail',
    'getUiPaymentDetails',
    'getUiAdjustmentDetails',
    'getUiTransactionHistoryDetails',
    'filterPaymentHistory',
    'getAdjustmentEligiblity'
  ]);
  uiBenefitsServiceSpy.filterPaymentHistory.and.returnValue(
    of({
      ...new PaymentDetail(),
      history: [
        {
          ...new PaymentHistoryDetails(),
          repaymentDetails: {
            ...new RepaymentDetails(),
            documents: [
              {
                ...new DocumentItem(),
                fromJsonToObject: (json: DocumentItem) => {
                  return json;
                },
                transactionId: '1234'
              }
            ]
          }
        }
      ]
    })
  );
  uiBenefitsServiceSpy.filterTransactionHistory.and.returnValue(of(new TransactionHistoryDetails()));
  uiBenefitsServiceSpy.getUiPaymentDetails.and.returnValue(
    of({ ...new PaymentDetail(), history: [{ ...new PaymentHistoryDetails() }] })
  );
  uiBenefitsServiceSpy.getUiAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  uiBenefitsServiceSpy.getUiTransactionHistoryDetails.and.returnValue(of(new TransactionHistoryDetails()));
  //uiBenefitsServiceSpy.filterPaymentHistory.and.returnValue(of({...new PaymentDetail(),paymentHistory:[{...new PaymentHistoryDetails()}]}));
  uiBenefitsServiceSpy.getAdjustmentEligiblity.and.returnValue(of(new AdjustmentModification()));
  uiBenefitsServiceSpy.getUiBenefitRequestDetail.and.returnValue(
    of({ ...new AnnuityResponseDto(), benefitStartDate: null })
  );
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
  /*const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory',
    'getDependentDetailsById',
    'filterDependentHistory'
  ]);
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getDependentDetailsById.and.returnValue(of([new DependentDetails()]));
  dependentServiceSpy.filterDependentHistory.and.returnValue(of([new DependentTransaction()]));
  dependentServiceSpy.getDependentHistoryDetails.and.returnValue(of([new DependentTransaction()]));
  dependentServiceSpy.getDependentDetails.and.returnValue(of([new DependentDetails()]));*/
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument',
    'getAllDocuments'
  ]);
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getAllDocuments.and.returnValue(of(new DocumentItem()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [PensionActiveScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
        //{ provide: DependentService, useValue: dependentServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        //{ provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: HeirBenefitService, useValue: heirServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceSpy },
        { provide: BypassReassessmentService, useValue: bypassReaassessmentServiceSpy },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: BenefitPropertyService, useValue: benefitPropertyServiceSpy },
        { provide: UiBenefitsService, useValue: uiBenefitsServiceSpy },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionActiveScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xdescribe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  //Dependenservice
  describe('getDependentDetails', () => {
    it('should fetch dependent details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      spyOn(component.dependentService, 'getDependentDetailsById').and.returnValue(of([new DependentDetails()]));
      component.getDependentDetails(component.sin, component.benefitRequestId, component.referenceNo, component.status);
      expect(component.dependentDetails).not.toBeNull();
    });
  });
  describe('getBenefitHistoryDetails', () => {
    it('should benefit history details', () => {
      const sin = 230066639;
      const benefitRequestId = 1005229;
      spyOn(component.dependentService, 'getBenefitHistory').and.returnValue(of([{ ...new BenefitDetails() }]));
      component.getBenefitHistoryDetails(sin, benefitRequestId);
      expect(component.getBenefitHistoryDetails).toBeDefined();
    });
  });
  describe(' getDependentHistoryDetails', () => {
    it('should getDependentHistoryDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.isHeir = false;
      spyOn(component.dependentService, 'getDependentHistoryDetails').and.returnValue(of([new DependentTransaction()]));
      component.dependentService
        .getDependentHistoryDetails(component.sin, component.benefitRequestId)
        .subscribe(response => {
          component.dependentHistory = response;
        });
      component.getDependentHistoryDetails(component.sin, component.benefitRequestId);
      expect(component.getDependentHistoryDetails).not.toBeNull();
    });
  });
  //manage benefit service
  describe('getBenefitCalculationDetails', () => {
    it('should getBenefitCalculationDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      component.getBenefitCalculationDetails(component.sin, component.benefitRequestId);
      expect(component.getBenefitCalculationDetails).not.toBeNull();
    });
  });
  describe('getUiBenefitcalculation', () => {
    it('should getUiBenefitcalculation', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getUiBenefitcalculation(component.sin, component.benefitRequestId);
      expect(component.getUiBenefitcalculation).toBeDefined();
    });
  });
  xdescribe('getActiveBenefitDetails', () => {
    it('shouldgetActiveBenefitDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      component.getActiveBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getActiveBenefitDetails).not.toBeNull();
    });
  });
  describe('getPaymentDetails', () => {
    it('should fetch payment details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getPaymentDetails(component.sin, component.benefitRequestId);
      expect(component.benefitPaymentDetails).not.toBeNull();
    });
  });
  describe('getImprisonment', () => {
    it('should fetch imprisonment details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getImprisonment(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.imprisonmentDetails).not.toBeNull();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should benefit history details', () => {
      const sin = 230066639;
      const benefitRequestId = 1005229;
      const referenceNo = 10015003;
      component.getAnnuityCalculation(sin, benefitRequestId, referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  //uibenefit service
  describe('getUiBenefitDetails', () => {
    it('should getUiBenefitDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      component.getUiBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getUiBenefitDetails).not.toBeNull();
    });
  });
  describe(' getUiPaymentDetails', () => {
    it('should getUiPaymentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getUiPaymentDetails(component.sin, component.benefitRequestId);
      expect(component.getUiPaymentDetails).toBeDefined();
    });
  });
  describe('populateHeirDetailsTableData', () => {
    it('should  populateHeirDetailsTableData', () => {
      component.populateHeirDetailsTableData(component.heirDetails, component.benefitHistoryDetails);
      expect(component.populateHeirDetailsTableData).toBeDefined();
    });
  });

  //heir service
  describe('getHeirDetails', () => {
    it('should heir details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      component.getHeirDetails(component.sin, component.benefitRequestId, component.referenceNo, component.status);
      expect(component.heirDetails).not.toBeNull();
    });
  });
  describe('getHeirBenefitHistoryDetails', () => {
    it('should heir details', () => {
      const sin = 230066639;
      const benefitRequestId = 1005229;
      component.getHeirBenefitHistoryDetails(sin, benefitRequestId);
      expect(component.getHeirBenefitHistoryDetails).toBeDefined();
    });
  });
  describe('filterHeirBenefitHistoryDetails', () => {
    it('should filterHeirBenefitHistoryDetails', () => {
      spyOn(component, 'filterHeirBenefitHistoryDetails').and.callThrough();
      component.filterHeirBenefitHistoryDetails();
      expect(component.filterHeirBenefitHistoryDetails).toBeDefined();
    });
  });
  describe(' filterPaymentHistory', () => {
    it('should  filterPaymentHistory', () => {
      const paymentHistoryFilter = { ...new PaymentHistoryFilter() };
      component.filterPaymentHistory(paymentHistoryFilter);
      expect(component.filterPaymentHistory).toBeDefined();
    });
    it('should filterPaymentHistory', () => {
      const paymentHistoryFilter = new PaymentHistoryFilter();
      component.benefitType = 'Unemployment Insurance';
      component.filterPaymentHistory(paymentHistoryFilter);
      expect(component.benefitType).toBeDefined('Unemployment Insurance');
      expect(component.filterPaymentHistory).toBeDefined();
    });
  });
  //paymentAdjustmentService
  describe('getBeneficiaryAdjustments', () => {
    it('should  getBeneficiaryAdjustments', () => {
      component.getBeneficiaryAdjustments();
      expect(component.getBeneficiaryAdjustments).toBeDefined();
    });
  });
  //naviagte
  describe(' navigateToAdjustmentDetails', () => {
    it('should  navigateToAdjustmentDetails', () => {
      component.navigateToAdjustmentDetails();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('navigateToAddDocuments', () => {
    it('should  navigateToAddDocuments', () => {
      component.navigateToAddDocuments();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('navigateToModifyImprisonment', () => {
    it('should navigate to imprisonment', () => {
      component.navigateToModifyImprisonment();
      expect(component.router.navigate).toBeDefined();
    });
  });
  //tabs
  describe('onDocumentTabSelected', () => {
    it('should onDocumentTabSelected', () => {
      component.onDocumentTabSelected();
      expect(component.onDocumentTabSelected).toBeDefined();
    });
  });
  xdescribe('navigateToBenefitDetails', () => {
    it('should  navigateToBenefitDetails', () => {
      const eachHistory = { ...new DependentHistoryFilter() };
      component.navigateToBenefitDetails(eachHistory);
      expect(component.navigateToBenefitDetails).toBeDefined();
    });
  });

  describe('onDependentTabSelected', () => {
    it('should onDependentTabSelected', () => {
      component.onDependentTabSelected();
      expect(component.onDependentTabSelected).toBeDefined();
      spyOn(component.dependentService, 'getDependentHistoryLOV').and.returnValue(of(new LovList([new Lov()])));
    });
  });
  describe('onPaymentHistoryTabSelected', () => {
    it('should onPaymentHistoryTabSelected', () => {
      component.onPaymentHistoryTabSelected();
      expect(component.onPaymentHistoryTabSelected).toBeDefined();
    });
  });
  describe('onTransactionTabSelected', () => {
    it('should onTransactionTabSelected', () => {
      component.onTransactionTabSelected();
      expect(component.onTransactionTabSelected).toBeDefined();
    });
  });
  //documerservice
  describe(' getScannedDocument', () => {
    it('should  getScannedDocument', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      // spyOn (component.documentService,'getAllDocuments').and.returnValue(of([new DocumentItem()]));
      component.benefitDocumentService.getAllDocuments(component.benefitRequestId).subscribe(res => {
        component.scannedDocuments = res;
      });
      expect(component.getScannedDocument).toBeDefined();
      component.getScannedDocument(component.benefitRequestId);
    });
  });
  xdescribe('getAdjustmentDetails', () => {
    it('should getAdjustmentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      expect(component.getAdjustmentDetails).toBeDefined();
      expect(component.adjustmentDetailsData).not.toBeNull();
    });
  });
  describe('getScreenSize', () => {
    it('should get Screen Size', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      fixture.detectChanges();
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('ShowModal1', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal1(modalRef);
      expect(component.showModal).toBeDefined();
    });
  });
  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('showCommitment', () => {
    it('should showCommitment', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showCommitment(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('filterTransactions', () => {
    it('should filterTransactions', () => {
      const heirFilter = new HeirBenefitFilter();
      component.heirFilter = heirFilter;
      spyOn(component, 'filterHeirBenefitHistoryDetails');
      component.filterTransactions();
      expect(component.filterTransactions).toBeDefined();
      expect(component.filterHeirBenefitHistoryDetails).toHaveBeenCalled();
    });
  });
  describe('filterTransactions', () => {
    it('should filterTransactions', () => {
      const heirFilter = new HeirBenefitFilter();
      component.heirFilter = heirFilter;
      spyOn(component, 'filterHeirBenefitHistoryDetails');
      component.filterTransactions();
      expect(component.filterTransactions).toBeDefined();
      expect(component.filterHeirBenefitHistoryDetails).toHaveBeenCalled();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  describe('navigateToModify', () => {
    it('should navigate to modify', () => {
      component.navigateToModify();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  xdescribe('populateHeirDetailsTableData', () => {
    it('should Populate heir details table', () => {
      spyOn(component, 'populateHeirDetailsTableData').and.callThrough();
      fixture.detectChanges();
      expect(component.populateHeirDetailsTableData).toBeDefined();
    });
  });
  describe('populateHeirDropDownValues', () => {
    it('should Populate heir dropdown list', () => {
      spyOn(component, 'populateHeirDropDownValues');
      fixture.detectChanges();
      expect(component.populateHeirDropDownValues).toBeDefined();
    });
  });
  describe('holdBenefit', () => {
    it('should navigate to holdBenefit', () => {
      component.holdBenefit();
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      expect(component.router.navigate).toBeDefined();
    });
    it('should viewContributorDetails', () => {
      component.viewContributorDetails();
      component.router.navigate(['home/profile/contributor/${this.sin}/info']);
      expect(component.router.navigate).toBeDefined();
    });
  });

  /**pension-base */
  describe('getSystemParamAndRundate', () => {
    it('should getSystemParamAndRundate', () => {
      component.getSystemParamAndRundate();
      expect(component.getSystemParamAndRundate).toBeDefined();
    });
  });
  xdescribe('getUiAdjustmentDetails', () => {
    it('should  getUiAdjustmentDetails', () => {
      component.sin = 233423423;
      component.benefitRequestId = 3231232;
      component.getUiAdjustmentDetails(component.sin, component.benefitRequestId);
      expect(component.getUiAdjustmentDetails).toBeDefined();
    });
  });
  describe('filterDependentHistory', () => {
    it('should filterDependentHistory', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      const dependentHistoryFilter = new DependentHistoryFilter();
      // spyOn(component.dependentService, 'filterDependentHistory');
      component.dependentService.filterDependentHistory(
        component.sin,
        component.benefitRequestId,
        dependentHistoryFilter
      );
      expect(component.filterDependentHistory).toBeDefined();
      expect(component.dependentHistory).not.toBeNull();
    });
  });
  describe(' filterDependentHistory', () => {
    it('should  filterDependentHistory', () => {
      const dependentHistoryFilter = new DependentHistoryFilter();
      component.filterDependentHistory(dependentHistoryFilter);
      expect(component.filterDependentHistory).toBeDefined();
    });
  });
  describe('transactionHistoryFilter', () => {
    it('should  transactionHistoryFilter', () => {
      const transactionHistoryFilter = new TransactionHistoryFilter();
      component.transactionHistoryFilter(transactionHistoryFilter);
      expect(component.transactionHistoryFilter).toBeDefined();
    });
  });
  describe('getUiTransactionHistoryDetails', () => {
    it('should getUiTransactionHistoryDetails', () => {
      component.sin = 233423423;
      component.benefitRequestId = 3231232;
      component.getUiTransactionHistoryDetails(component.sin, component.benefitRequestId);
      expect(component.getUiTransactionHistoryDetails).toBeDefined();
    });
  });
  describe(' modifyBenefit', () => {
    it('should  modifyBenefit', () => {
      component.router.navigate([RouterConstants.ROUTE_MODIFY_BENEFIT_PAYMENT]);
      component.modifyBenefit();
      expect(component.modifyBenefit).toBeDefined();
    });
  });
  describe('stopBenefit', () => {
    it('should navigate to stopBenefit', () => {
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      component.stopBenefit();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('stopBenefitWaive', () => {
    it('should stopBenefitWaive', () => {
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      component.stopBenefitWaive();
      expect(component.stopBenefitWaive).toBeDefined();
    });
  });
  describe('startBenefitWaive', () => {
    it('should startBenefitWaive', () => {
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      component.startBenefitWaive();
      expect(component.startBenefitWaive).toBeDefined();
    });
  });
  describe(' stopHeirDependent', () => {
    it('should  stopHeirDependent', () => {
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      component.stopHeirDependent();
      expect(component.stopHeirDependent).toBeDefined();
    });
  });
  describe('restartBenefit', () => {
    it('should navigate to restartBenefit', () => {
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
      component.restartBenefit();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('getAnnuityBenefits', () => {
    it('should getAnnuityBenefits', () => {
      component.sin = 233423423;
      component.benefitType = '3231232';
      component.getAnnuityBenefits(component.sin, component.benefitType);
      expect(component.getAnnuityBenefits).toBeDefined();
    });
  });
  describe(' getInjuryAssessment', () => {
    it('should  getInjuryAssessment', () => {
      component.sin = 233423423;
      component.benefitRequestId = 3231232;
      spyOn(component.injuryService, 'getDisabilityDetails').and.returnValue(of(new DisabilityTimeline()));
      component.getInjuryAssessment(component.sin, component.benefitRequestId);
      expect(component.getInjuryAssessment).toBeDefined();
    });
  });
  describe(' onAppeal', () => {
    it('should  onAppeal', () => {
      component.assessmentId = 23343434;
      component.onAppeal(component.assessmentId);
      component.bypassReaassessmentService
        .appealMedicalAssessment(component.assessmentId, component.sin, component.benefitRequestId)
        .subscribe(response => {
          component.benefitResponse = response;
        });
      expect(component.getAnnuityBenefits).toBeDefined();
    });
  });
  describe(' onAccept', () => {
    it('should  onAccept', () => {
      component.assessmentId = 23343434;
      component.onAccept(component.assessmentId);
      expect(component.onAccept).toBeDefined();
    });
  });
  describe(' getDisabilityAssessment', () => {
    it('should   getDisabilityAssessment', () => {
      component.sin = 23343434;
      component.benefitRequestId = 2323444;
      component.getDisabilityAssessment(component.sin, component.benefitRequestId);
      expect(component.getDisabilityAssessment).toBeDefined();
    });
  });
  describe('getTransactionHistoryDetails', () => {
    it('should getTransactionHistoryDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      expect(component.getTransactionHistoryDetails).toBeDefined();
      expect(component.transactionHistoryDetails).not.toBeNull();
    });
  });

  describe('getUiTransactionHistoryDetails', () => {
    it('should getUiTransactionHistoryDetails', () => {
      component.sin = 233423423;
      component.benefitRequestId = 3231232;
      component.getUiTransactionHistoryDetails(component.sin, component.benefitRequestId);
      expect(component.getUiTransactionHistoryDetails).toBeDefined();
    });
  });
  xdescribe(' getAdjustmentDetails', () => {
    it('should  getAdjustmentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.status = [];
      component.getAdjustmentDetails(component.sin, component.benefitRequestId);
      expect(component.getAdjustmentDetails).not.toBeNull();
    });
  });
  describe('onSearchTransactionId', () => {
    it('should onSearchTransactionId', () => {
      const transactionHistoryFilter = new TransactionHistoryFilter();
      component.onSearchTransactionId(transactionHistoryFilter);
      expect(component.onSearchTransactionId).toBeDefined();
    });
  });
  describe(' getIdentityLabel', () => {
    it('should  getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel).toBeDefined();
    });
  });
  describe('openImage', () => {
    it('should openImage', () => {
      component.openImage();
      expect(component.openImage).toBeDefined();
    });
  });
  describe('navigateToAddModify', () => {
    it('should navigateToAddModify', () => {
      component.navigateToAddModify();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToAddAdjustment', () => {
    it('should navigateToAddModify', () => {
      component.navigateToAddAdjustment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToRestoreLumpsum', () => {
    it('should navigateToRestoreLumpsum', () => {
      component.navigateToRestoreLumpsum();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToReturnLumpsum', () => {
    it('should navigateToReturnLumpsum', () => {
      component.navigateToReturnLumpsum();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToModifyCommitment', () => {
    it('should navigateToModifyCommitment', () => {
      component.navigateToModifyCommitment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' navigateToAdjustment', () => {
    it('should  navigateToAdjustment', () => {
      const adjustmentId = 233434;
      component.navigateToAdjustment(adjustmentId);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  xdescribe('confirmAddCommitemnt', () => {
    it('should confirmAddCommitemnt', () => {
      component.confirmAddCommitemnt();
      expect(component.router.navigate).toHaveBeenCalled();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
    });
  });
  describe(' removeCommitment', () => {
    it('should removeCommitment', () => {
      component.removeCommitment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('holdHeirDependent', () => {
    it('should holdHeirDependent', () => {
      component.holdHeirDependent();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' restartHeirDependent', () => {
    it('should  restartHeirDependent', () => {
      component.restartHeirDependent();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
