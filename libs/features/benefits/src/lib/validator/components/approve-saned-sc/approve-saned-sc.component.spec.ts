import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  RouterDataToken,
  RouterData,
  LanguageToken,
  ApplicationTypeToken,
  GosiCalendar,
  bindToObject,
  EnvironmentToken,
  DocumentItem,
  LovList,
  Lov,
  Transaction,
  DocumentService,
  BPMUpdateRequest,
  PersonWrapperDto
} from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ManagePersonServiceStub, ModalServiceStub, uiBenefits, uiHistory, initializeTheViewValidator1 } from 'testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApproveSanedScComponent } from './approve-saned-sc.component';
//import { BenefitType } from '../../../shared/enum/benefit-type';
//import { BenefitConstants, UITransactionType, Benefits, BenefitDetails } from '../../../shared';
//import { HasThisRolePipe } from '../../../shared';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import {
  HasThisRolePipe,
  BenefitDetails,
  BenefitType,
  Benefits,
  BenefitConstants,
  UITransactionType,
  BenefitDocumentService,
  UiBenefitsService,
  SanedBenefitService,
  UnemploymentResponseDto,
  MonthsDetails,
  EligibilityMonths,
  ManageBenefitService,
  AnnuityResponseDto,
  CreditBalanceDetails,
  AttorneyDetailsWrapper,
  SearchPersonalInformation,
  PersonalInformation,
  StatusHistory,
  HistoryDetails,
  DependentHistory,
  DependentService,
  DependentDetails,
  DeathNotification,
  HeirBenefitDetails,
  HeirBenefitService,
  PersonAdjustmentDetails,
  AdjustmentService,
  PersonBankDetails
} from '../../../shared';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('ApproveSanedScComponent', () => {
  let component: ApproveSanedScComponent;
  let fixture: ComponentFixture<ApproveSanedScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'updateAnnuityWorkflow',
    'getSystemRunDate',
    'setValues',
    'getAnnuityBenefitRequestDetail',
    'getBenefitDetails',
    'getContirbutorRefundDetails',
    'getBenefitCalculationDetailsByRequestId',
    'getSelectedAuthPerson',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'setRequestDate',
    'getContributorPersonDetails'
  ]);
  manageBenefitServiceSpy.getContributorPersonDetails.and.returnValue(of(new PersonWrapperDto()));
  manageBenefitServiceSpy.updateAnnuityWorkflow.and.returnValue(of(new BPMUpdateRequest()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(
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

  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      benefitType: { english: '', arabic: '' },
      dateOfBirth: { ...new GosiCalendar(), entryFormat: 'GREGORIAN' },
      nin: 123456
    })
  );
  manageBenefitServiceSpy.getContirbutorRefundDetails.and.returnValue(of(new CreditBalanceDetails()));
  manageBenefitServiceSpy.getSelectedAuthPerson.and.returnValue(
    of([
      { ...new AttorneyDetailsWrapper(), preSelectedAuthperson: [{ ...new AttorneyDetailsWrapper(), personId: 123 }] }
    ])
  );
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(
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
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(
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
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(
    of({
      ...new BenefitDetails(),
      transaction: { ...new Transaction(), status: { english: ''.toUpperCase(), arabic: '' } }
    })
  );
  const status: StatusHistory = {
    heirStatus: { english: '', arabic: '' },
    status: { english: '', arabic: '' },
    statusDate: null
  };
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'adjustmentDetails',
    'getAdjustmentsByDualStatus'
  ]);
  adjustmentServiceSpy.adjustmentDetails.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  adjustmentServiceSpy.getAdjustmentsByDualStatus.and.returnValue(of({ ...new PersonAdjustmentDetails() }));
  const history: HistoryDetails = {
    identifier: [],
    statusHistory: status[''],
    name
  };
  const dependet: DependentHistory = {
    requestDate: null,
    dependentHistoryDetails: history['']
  };
  const dependentServicespy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentDetailsById',
    'getDependentHistory',
    'setDependents',
    'setReasonForBenefit'
  ]);
  dependentServicespy.getDependentDetailsById.and.returnValue(of([new DependentDetails()]));
  dependentServicespy.getDependentHistory.and.returnValue(of(dependet));
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'refreshDocument',
    'getRequiredDocuments',
    'getDocuments'
  ]);
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.getDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getValidatorDocuments'
  ]);
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getValidatorDocuments.and.returnValue(of([new DocumentItem()]));
  const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen',
    'getEligibleBenefitByType'
  ]);
  heirBenefitServicespy.getHeirForValidatorScreen.and.returnValue(of([new DependentDetails()]));
  heirBenefitServicespy.getEligibleBenefitByType.and.returnValue(of([new Benefits()]));
  benefitDocumentServicespy.getValidatorDocuments.and.returnValue(of([new DocumentItem()]));
  const uiBenefitServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', [
    'setBenefitStatus',
    'getEligibleUiBenefitByType',
    'setBenefitStatus',
    'setActiveSanedAppeal',
    'setRouterData',
    'setSocialInsuranceNo',
    'setRegistrationNo'
  ]);
  uiBenefitServiceSpy.getEligibleUiBenefitByType.and.returnValue(of(bindToObject(new Benefits(), uiBenefits)));
  uiBenefitServiceSpy.setBenefitStatus.and.returnValue();
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getBenefitCalculationsForSaned',
    'getBenefitRequestDetails',
    'getSanedRejectReasonList',
    'getSanedReturnReasonList',
    'getRejectReasonValidator',
    'getSanedRejectReasonValidator',
    'getSanedInspectionType'
  ]);

  sanedBenefitServiceSpy.getBenefitCalculationsForSaned.and.returnValue(
    of({
      ...new BenefitDetails(),
      initialMonths: { ...new MonthsDetails() },
      remainingMonths: { ...new MonthsDetails() },
      availedMonths: 2,
      eligibleMonths: [
        {
          ...new EligibilityMonths(),
          month: { gregorian: new Date('2021-12-01T00:00:00.000Z'), hijiri: '1443-04-26', entryFormat: 'GREGORIAN' }
        }
      ]
    })
  );
  sanedBenefitServiceSpy.getBenefitRequestDetails.and.returnValue(
    of({ ...new UnemploymentResponseDto(), contributorName: { english: '', arabic: '' }, personId: 1234 })
  );
  sanedBenefitServiceSpy.getSanedRejectReasonList.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getSanedInspectionType.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getSanedReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getRejectReasonValidator.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getSanedRejectReasonValidator.and.returnValue(of(new LovList([new Lov()])));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ApproveSanedScComponent, HasThisRolePipe],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServicespy },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: UiBenefitsService, useValue: uiBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },

        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
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
    fixture = TestBed.createComponent(ApproveSanedScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOninit', () => {
    it('should be ngOninit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getBenefitCalculationDetails', () => {
    it('should fetch benefit calculation details', () => {
      component.socialInsuranceNo = 230066639;
      const date = new GosiCalendar();
      component.requestDate = date;
      /*spyOn(component.sanedBenefitService, 'getBenefitCalculationsForSaned').and.returnValue(
        of(bindToObject(new BenefitDetails(), uiHistory))
      );*/
      component.getBenefitCalculationDetails();
      //expect(component.sanedBenefitService.getBenefitCalculationsForSaned).toHaveBeenCalled();
      expect(component.benefitDetailsSaned).not.toBeNull();
    });
  });
  describe('getBenefitRequestDetails', () => {
    it('should fetch benefit request details', () => {
      component.socialInsuranceNo = 230066639;
      component.requestId = 1001246;
      spyOn(component, 'getBenefitCalculationDetails');
      component.getBenefitRequestDetails();
      // expect(component.sanedBenefitService.getBenefitRequestDetails).toHaveBeenCalled();
      expect(component.benefitRequest).not.toBeNull();
    });
  });
  describe('navigateToScan', () => {
    it('should Navigate to document scan page', () => {
      spyOn(component.router, 'navigate');
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith([BenefitConstants.ROUTE_APPLY_BENEFIT]);
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
  describe('confirmRejectSaned', () => {
    it('should show approve modal', () => {
      component.requestSanedForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectSaned();
      expect(component.confirmRejectSaned).toBeDefined();
    });
  });
  describe('confirmApproveSaned', () => {
    it('should confirmApproveSaned', () => {
      component.requestSanedForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveSaned();
      expect(component.confirmApproveSaned).toBeDefined();
    });
  });
  describe('returnSaned', () => {
    it('should returnSaned', () => {
      component.requestSanedForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnSaned();
      expect(component.returnSaned).toBeDefined();
    });
  });
  describe('reDirectUsersToApplyScreens', () => {
    it('should reDirectUsersToApplyScreens', () => {
      component.reDirectUsersToApplyScreens();
      expect(component.reDirectUsersToApplyScreens).toBeDefined();
    });
  });
  describe('getUIEligibilityDetails', () => {
    it('should fetch UI eligibility details', () => {
      const sin = 230066639;
      const benefitType = BenefitType.ui;
      spyOn(component.alertService, 'showWarning');
      component.getUIEligibilityDetails(sin, benefitType);
      expect(component.alertService.showError);
    });
  });
  describe('getDocuments', () => {
    it('should fetch documents', () => {
      const transactionKey = BenefitConstants.TRANSACTION_APPROVE_SANED;
      const transactionType = UITransactionType.GOL_REQUEST_SANED;
      const benefitRequestId = 1001246;
      //spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocuments(transactionKey, transactionType, benefitRequestId);
      // expect(component.benefitDocumentService.getUploadedDocuments).toHaveBeenCalled();
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
  //ValidatorBaseScComponent
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      //component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe(' getAnnuityBenefitDetails', () => {
    it('should  getAnnuityBenefitDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.benefitRequestId = 23342321212;
      component.referenceNo = 2334534;
      component.getAnnuityBenefitDetails(
        component.socialInsuranceNo,
        component.benefitRequestId,
        component.referenceNo
      );
      expect(component.getAnnuityBenefitDetails).toBeDefined();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popups', () => {
      component.commonModalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.commonModalRef).not.toEqual(null);
    });
  });
  describe('saveWorkflow', () => {
    it('should saveWorkflow', () => {
      const data = new BPMUpdateRequest();
      component.saveWorkflow(data);
      //component.navigateToScan();
      expect(component.saveWorkflow).toBeDefined();
    });
  });
  describe('getDependentDetails', () => {
    it('should getDependentDetails', () => {
      component.getDependentDetails(1212, 453454, 5565);
      // spyOn(component.dependentService,'getDependentDetailsById').and.returnValue(of([new DependentDetails()]));
      expect(component.getDependentDetails).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should getAuthorizedPersonDetails', () => {
      component.requestId = 232323;
      component.socialInsuranceNo = 34343;
      expect(component.requestId && component.socialInsuranceNo).toBeDefined();
      component.getAuthorizedPersonDetails(true);
      //spyOn(component.manageBenefitService,'getSelectedAuthPerson').and.returnValue(of([{...new AttorneyDetailsWrapper(),preSelectedAuthperson:[{...new AttorneyDetailsWrapper(),personId:123}]}]));
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      component.getPersonContactDetails('');
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe('getContDetailWithPerid', () => {
    it('should  getContDetailWithPerid', () => {
      component.getContDetailWithPerid(2323, '');
      expect(component.getContDetailWithPerid).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should  getDependentHistory', () => {
      component.getDependentHistory(65656);
      expect(component.getDependentHistory).toBeDefined();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should getAnnuityCalculation', () => {
      component.getAnnuityCalculation(65656, 8787, 7676);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  describe('setErrorMsgAndBtnStatus', () => {
    it('should  setErrorMsgAndBtnStatus', () => {
      const deathNotification = new DeathNotification();
      component.setErrorMsgAndBtnStatus(deathNotification);
      expect(component.setErrorMsgAndBtnStatus).toBeDefined();
    });
  });
  describe('viewContributorDetails', () => {
    it('should viewContributorDetails', () => {
      component.viewContributorDetails();
      expect(component.viewContributorDetails).toBeDefined();
    });
  });
  describe('navigateToBenefitsHistory', () => {
    it('should  navigateToBenefitsHistory', () => {
      component.navigateToBenefitsHistory();
      expect(component.navigateToBenefitsHistory).toBeDefined();
    });
  });
  describe('getHeirDetails', () => {
    it('should getHeirDetails', () => {
      component.getHeirDetails(12123, 4545, 232323);
      expect(component.getHeirDetails).toBeDefined();
    });
  });
  describe('getPersonAdjustmentDetails', () => {
    it('should  getPersonAdjustmentDetails', () => {
      const personid = 233434322;
      const sin = 24567567646;
      component.getPersonAdjustmentDetails(personid, sin);
      expect(component.getPersonAdjustmentDetails).toBeDefined();
    });
  });
  // describe('setBankDetails', () => {
  //   it('should setBankDetails', () => {
  //     const bankRes = {... new PersonBankDetails(), ibanBankAccountNo:"SA595504ASG66086110DS591".slice(4,6),fromJsonToObject: json => json};
  //     component.setBankDetails(bankRes);
  //     expect(component.setBankDetails).toBeDefined();
  //   });
  // });
  describe('navigateToAdjustmentDetailsHeir', () => {
    it('should navigateToAdjustmentDetailsHeir', () => {
      const event: HeirBenefitDetails = {
        benefitAmount: 12232,
        identifier: 1234,
        name: { english: '', arabic: '' },
        payeeType: { english: '', arabic: '' },
        paymentMode: { english: '', arabic: '' },
        relationship: { english: '', arabic: '' },
        lastPaidDate: null,
        status: { english: '', arabic: '' },
        amountBeforeUpdate: 12232,
        adjustmentAmount: 12232,
        marriageGrant: 12232,
        deathGrant: 12232,
        personId: 1234,
        benefitAmountAfterDeduction: 1234,
        heirIdentifier: { idType: 'PASSPORT', id: 1213210 },
        //for UI
        hasCreditAdjustment: true
      };
      component.annuityBenefitDetails = {
        ...new AnnuityResponseDto(),
        personId: 23344,
        benefitType: { english: '', arabic: '' },
        requestDate: null
      };
      //expect(component.adjustmentPaymentService.identifier).toEqual(23344);
      component.navigateToAdjustmentDetailsHeir(event);
      expect(component.navigateToAdjustmentDetailsHeir).toBeDefined();
    });
  });
  // describe('navigateToPrevAdjustmentHeir', () => {
  //   it('should navigateToPrevAdjustmentHeir', () => {
  //     const event:  HeirBenefitDetails = {
  //        benefitAmount: 12232,
  //       identifier: 1234,
  //       name: {english:'',arabic:''},
  //       payeeType:{english:'',arabic:''},
  //       paymentMode: {english:'',arabic:''},
  //       relationship:{english:'',arabic:''},
  //       lastPaidDate:null,
  //       status:{english:'',arabic:''},
  //       amountBeforeUpdate:12232,
  //       adjustmentAmount:12232,
  //       marriageGrant: 12232,
  //       deathGrant:12232,
  //       personId:1234,
  //       benefitAmountAfterDeduction: 1234,
  //       heirIdentifier: { idType: 'PASSPORT', id: 1213210 },
  //       //for UI
  //       hasCreditAdjustment: true

  //     }
  //     component.annuityBenefitDetails = {... new AnnuityResponseDto,personId:23344,benefitType:{english:'',arabic:''},requestDate:null};
  //     //expect(component.adjustmentPaymentService.identifier).toEqual(23344);
  //     component.navigateToPrevAdjustmentHeir(event);
  //     expect(component.navigateToPrevAdjustmentHeir).toBeDefined();
  //   });
  // });
});
