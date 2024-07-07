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
  ContributorToken,
  ContributorTokenDto
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, BilingualTextPipeMock, initializeTheViewValidator1 } from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionsReturnLumpsumScComponent } from './transactions-return-lumpsum-sc.component';
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

describe('TransactionsReturnLumpsumScComponent', () => {
  let component: TransactionsReturnLumpsumScComponent;
  let fixture: ComponentFixture<TransactionsReturnLumpsumScComponent>;
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
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServicespy },
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
      declarations: [TransactionsReturnLumpsumScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsReturnLumpsumScComponent);
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
  describe(' navigateToEdit', () => {
    it('should  navigateToEdit', () => {
      component.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT]);
      component.navigateToEdit();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe(' navigateToRestore', () => {
    it('should   navigateToRestore', () => {
      component.router.navigate([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT]);
      component.navigateToRestore();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      spyOn(component.alertService, 'clearAllSuccessAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
  describe('showTransaction', () => {
    it('should show approve modal', () => {
      const templateRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(templateRef);
      component.showTransaction(templateRef);
      expect(component.showModal).toBeDefined();
    });
  });
  describe('getLumpsumRepaymentDetails', () => {
    it('should show  getLumpsumRepaymentDetails', () => {
      component.getLumpsumRepaymentDetails(323, 4334, 32343);
      expect(component.getLumpsumRepaymentDetails).toBeDefined();
    });
  });
  describe('confirmApproveLumpsum', () => {
    it('should show confirmApproveLumpsum', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveLumpsum();
      expect(component.confirmApproveLumpsum).toBeDefined();
    });
  });
  describe('confirmRejectLumpsum', () => {
    it('should show confirmRejectLumpsum', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectLumpsum();
      expect(component.confirmRejectLumpsum).toBeDefined();
    });
  });
  describe(' returnLumpsum', () => {
    it('should show  returnLumpsum', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnLumpsum();
      expect(component.returnLumpsum).toBeDefined();
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
  describe('canValidatorCanEditPayment', () => {
    it('should canValidatorCanEditPayment', () => {
      component.canValidatorCanEditPayment();
      expect(component.canValidatorCanEditPayment).toBeDefined();
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
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      //component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('setErrorMsgAndBtnStatus', () => {
    it('should setErrorMsgAndBtnStatus', () => {
      const deathNotification = { ...new DeathNotification() };
      component.setErrorMsgAndBtnStatus(deathNotification);
      //component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });

  // describe('navigateToPrevAdjustmentHeir', () => {
  //   it('should navigateToPrevAdjustmentHeir', () => {
  //     const heir = {
  //       benefitAmount: 1212,
  //   identifier:2323,
  //   name: {english:'',arabic:''},
  //   payeeType: {english:'',arabic:''},
  //   paymentMode: {english:'',arabic:''},
  //   relationship: {english:'',arabic:''},
  //   lastPaidDate: null,
  //   status: {english:'',arabic:''},
  //   amountBeforeUpdate: 12,
  //   marriageGrant:232,
  //   personId: 3232,
  //   //for UI
  //   hasCreditAdjustment:  true
  //     }
  //     component.navigateToPrevAdjustmentHeir(heir);
  //   expect(component.navigateToPrevAdjustmentHeir).toBeDefined();
  // });
  // })
  describe('navigateToAdjustmentDetailsHeir', () => {
    it('should navigateToAdjustmentDetailsHeir', () => {
      const heir = {
        benefitAmount: 1212,
        identifier: 2323,
        name: { english: '', arabic: '' },
        payeeType: { english: '', arabic: '' },
        paymentMode: { english: '', arabic: '' },
        relationship: { english: '', arabic: '' },
        lastPaidDate: null,
        status: { english: '', arabic: '' },
        amountBeforeUpdate: 12,
        marriageGrant: 232,
        personId: 3232,
        heirIdentifier: { idType: 'PASSPORT', id: 1213210 },
        //for UI
        hasCreditAdjustment: true
      };
      component.navigateToAdjustmentDetailsHeir(heir);
      //component.navigateToScan();
      expect(component.navigateToAdjustmentDetailsHeir).toBeDefined();
    });
  });
  describe(' getAnnuityBenefitDetails', () => {
    it('should  getAnnuityBenefitDetails', () => {
      component.sin = 2334254453;
      component.benefitRequestId = 23342321212;
      component.referenceNo = 2334534;
      component.getAnnuityBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getAnnuityBenefitDetails).toBeDefined();
    });
  });
  describe('saveWorkflow', () => {
    it('should saveWorkflow', () => {
      const data = new BPMUpdateRequest();
      component.saveWorkflow(data);
      expect(component.saveWorkflow).toBeDefined();
    });
  });
  describe('getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      const nin = '12233232';
      component.getPersonContactDetails(nin);
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should  getAuthorizedPersonDetails', () => {
      component.requestId = 23434;
      component.socialInsuranceNo = 2323232;
      expect(component.requestId && component.socialInsuranceNo).toBeDefined();
      const isModifyBenefit = true;
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('getPersonAdjustmentDetails', () => {
    it('should  getPersonAdjustmentDetails', () => {
      const personid = 233434322;
      const sin = 26534646464;
      component.getPersonAdjustmentDetails(personid, sin);
      expect(component.getPersonAdjustmentDetails).toBeDefined();
    });
    it('should getBankDetails', () => {
      component.getBankDetails('1234', true, true);
      expect(component.getBankDetails).toBeDefined();
    });
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should rejectTransaction', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should returnTransaction', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.returnTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should  requestInspection', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.requestInspection(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should show cancel template', () => {
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('getContDetailWithPerid', () => {
    it('should getContDetailWithPerid', () => {
      const id = 34534;
      const type = '';
      component.getContDetailWithPerid(id, type);
      expect(component.getContDetailWithPerid).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should  getDependentHistory', () => {
      const personId = 23344342;
      component.getDependentHistory(personId);
      expect(component.getDependentHistory).toBeDefined();
    });
  });
  describe('getHeirDetails', () => {
    it('should getHeirDetails', () => {
      component.getHeirDetails(122, 2334, 23232);
      expect(component.getHeirDetails).toBeDefined();
    });
  });
  describe('getAnnuityEligibilityDetails', () => {
    it('should  getAnnuityEligibilityDetails', () => {
      component.getAnnuityEligibilityDetails(122, '');
      expect(component.getAnnuityEligibilityDetails).toBeDefined();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should getAnnuityCalculation', () => {
      component.getAnnuityCalculation(122, 12, 232);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  describe('getDependentDetails', () => {
    it('should getDependentDetails', () => {
      component.getDependentDetails(122, 12, 232);
      expect(component.getDependentDetails).toBeDefined();
    });
  });
  describe('setHeading', () => {
    it('should setHeading', () => {
      component.setHeading('', '', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Non-Occupational Disability Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Non-Occupational Disability Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Jailed Contributor Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Jailed Contributor Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit (Hazardous Occupation)';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit (Hazardous Occupation)', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Early Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Early Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Heirs';
      component.benefitType = 'Heir Pension Missing Contributor Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Heir Pension Missing Contributor Benefit', 'Add/Modify Heirs', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Heirs';
      component.benefitType = 'Heir Pension Dead Contributor Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Heir Pension Dead Contributor Benefit', 'Add/Modify Heirs', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Stop Benefit Waive';
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Stop Benefit Waive', 'Stop Benefit Waive', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Start Benefit Waive';
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Start Benefit Waive', 'Start Benefit Waive', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'Validator1';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'Validator2';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'GeneralDirectorofOperationsandInsuranceServices';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'FinanceController';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'FCApprover';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });

    it('should setButtonConditions', () => {
      const assignedRole = 'Doctor';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
  });
  describe('getDocuments', () => {
    it('should getDocuments', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.referenceNo = 32323;
      component.referenceNo = 1004341279;
      component.getDocuments(transactionKey, transactionType, component.referenceNo, component.referenceNo);
      expect(component.getDocuments).not.toBeNull();
    });
  });
});
