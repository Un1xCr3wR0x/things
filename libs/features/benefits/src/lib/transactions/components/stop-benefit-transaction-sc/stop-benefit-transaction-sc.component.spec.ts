import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StopBenefitTransactionScComponent } from './stop-benefit-transaction-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  EnvironmentToken,
  ApplicationTypeToken,
  DocumentItem,
  LanguageToken,
  RouterDataToken,
  RouterData,
  Transaction,
  TransactionService,
  TransactionParams,
  DocumentService,
  GosiCalendar,
  TransactionStatus
} from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ModifyBenefitService,
  HoldBenefitDetails,
  HoldPensionDetails,
  Contributor,
  BenefitDocumentService,
  BenefitConstants,
  UITransactionType,
  HeirBenefitService,
  Benefits,
  DependentDetails,
  BenefitDetails,
  AttorneyDetailsWrapper,
  DependentService,
  StatusHistory,
  HistoryDetails,
  DependentHistory,
  ManageBenefitService,
  AnnuityResponseDto,
  CreditBalanceDetails,
  SearchPersonalInformation,
  PersonalInformation,
  BenefitType,
  ActiveBenefits
} from '../../../shared';
import { of, BehaviorSubject } from 'rxjs';
import { ModalServiceStub, BilingualTextPipeMock, initializeTheViewValidator1 } from 'testing';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Router } from '@angular/router';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('StopBenefitTransactionScComponent', () => {
  let component: StopBenefitTransactionScComponent;
  let fixture: ComponentFixture<StopBenefitTransactionScComponent>;
  /*const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen',
    'getEligibleBenefitByType'
   ]);
   heirBenefitServicespy.getEligibleBenefitByType.and.returnValue(of([{...new Benefits()}]));
   heirBenefitServicespy.getHeirForValidatorScreen.and.returnValue(of([new DependentDetails()]));
   heirBenefitServicespy.verifyHeir.and.returnValue(of([new DocumentItem()]));*/
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getSystemRunDate',
    'setValues',
    'getAnnuityBenefitRequestDetail',
    'getBenefitDetails',
    'getContirbutorRefundDetails',
    'getBenefitCalculationDetailsByRequestId',
    'getSelectedAuthPerson',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId'
  ]);
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
      transaction: { ...new Transaction(), status: { english: 'completed'.toUpperCase(), arabic: '' } }
    })
  );
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
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments',
    'getStopBenefitDocuments'
  ]);
  benefitDocumentServicespy.getStopBenefitDocuments.and.returnValue(of([new DocumentItem()]));
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [StopBenefitTransactionScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        // { provide: HeirBenefitService, useValue: heirBenefitServicespy },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopBenefitTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getStopBenefitDetails', () => {
    it('should getStopBenefitDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 2334232;
      spyOn(component.modifyBenefitService, 'getstopDetails').and.returnValue(
        of({
          ...new HoldBenefitDetails(),
          pension: { ...new HoldPensionDetails(), annuityBenefitType: { english: '', arabic: '' } },
          contributor: { ...new Contributor(), identity: [] }
        })
      );
      component.getStopBenefitDetails(component.socialInsuranceNo, component.benefitrequestId, component.referenceNo);
      expect(component.getStopBenefitDetails).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      const noteText = 'afdfdf';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
  });
  describe(' onViewBenefitDetails', () => {
    it('should  onViewBenefitDetails', () => {
      const data = new ActiveBenefits(1212, 233, { english: '', arabic: '' }, 223);
      spyOn(component.coreBenefitService, 'setActiveBenefit').and.returnValue();
      component.coreBenefitService.setActiveBenefit(data);
      component.onViewBenefitDetails();
      expect(component.onViewBenefitDetails).toBeDefined();
    });
    it('should  navigateToPrevAdjustment', () => {
      component.navigateToPrevAdjustment();
      spyOn(component.router, 'navigate').and.callThrough();
    });
    it('should  navigateToInjuryDetails', () => {
      component.navigateToInjuryDetails();
      spyOn(component.router, 'navigate').and.callThrough();
    });
  });
  //transactionbase
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      //component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('setBenefitTypeParams', () => {
    it('should setBenefitTypeParams Woman Lumpsum Benefit', () => {
      const benefitType = BenefitType.womanLumpsum;
      component.setBenefitTypeParams();
      expect(benefitType).toEqual('Woman Lumpsum Benefit');
      expect(component.setBenefitTypeParams).toBeDefined();
    });
  });
  describe('getDocumentDetails', () => {
    it('should  getDocumentDetails', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      component.getDocumentDetails(transactionKey, transactionType, 121212, 2323);
      expect(component.getDocumentDetails).toBeDefined();
    });
  });
  describe('getBenefits', () => {
    it('should getBenefits', () => {
      component.getBenefits();
      expect(component.getBenefits).toBeDefined();
    });
  });
  describe('fetchHeirDetails', () => {
    it('should  fetchHeirDetails', () => {
      component.fetchHeirDetails(1212, 453454, 5565);
      expect(component.fetchHeirDetails).toBeDefined();
    });
  });
  describe('fetchDependentDetails', () => {
    it('should fetchDependentDetails', () => {
      component.fetchDependentDetails(1212, 453454, 5565);
      // spyOn(component.dependentService,'getDependentDetailsById').and.returnValue(of([new DependentDetails()]));
      expect(component.fetchDependentDetails).toBeDefined();
    });
  });
  describe(' fetchAnnuityBenefitDetails', () => {
    it('should   fetchAnnuityBenefitDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.benefitRequestId = 23342321212;
      component.referenceNo = 2334534;
      component.transaction = {
        title: {
          arabic: 'الإبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 492707,
        assigneeName: '',
        initiatedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        lastActionedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        status: {
          arabic: 'مكتملة',
          english: 'Completed'.toUpperCase()
        },
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'field-office'
        },
        stepStatus: {
          arabic: 'مكتملة',
          english: 'Completed'.toUpperCase()
        },
        registrationNo: 10000602,
        sin: 601336235,
        businessId: 1001964003,
        transactionId: 101501,
        contributorId: null,
        establishmentId: null,
        taskId: null,
        assignedTo: null,
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        },
        pendingWith: null,
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.fetchAnnuityBenefitDetails(
        component.socialInsuranceNo,
        component.benefitRequestId,
        component.referenceNo
      );
      expect(component.fetchAnnuityBenefitDetails).toBeDefined();
    });
  });
  describe('fetchAnnuityCalculation', () => {
    it('should fetchAnnuityCalculation', () => {
      component.transaction = {
        title: {
          arabic: 'الإبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 492707,
        assigneeName: '',
        initiatedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        lastActionedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        status: {
          arabic: 'مكتملة',
          english: 'Completed'.toUpperCase()
        },
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'field-office'
        },
        stepStatus: {
          arabic: 'مكتملة',
          english: 'Completed'.toUpperCase()
        },
        registrationNo: 10000602,
        sin: 601336235,
        businessId: 1001964003,
        transactionId: 101501,
        contributorId: null,
        establishmentId: null,
        taskId: null,
        assignedTo: null,
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        },
        pendingWith: null,
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.fetchAnnuityCalculation(65656, 8787, 34343);
      expect(component.fetchAnnuityCalculation).toBeDefined();
    });
  });
  xdescribe('fetchAnnuityEligibilityDetails', () => {
    it('should fetchAnnuityEligibilityDetails', () => {
      component.fetchAnnuityEligibilityDetails(1212, '');
      expect(component.fetchAnnuityEligibilityDetails).toBeDefined();
    });
  });
  describe('fetchAuthorizedPersonDetails', () => {
    it('should fetchAuthorizedPersonDetails', () => {
      component.benefitrequestId = 232323;
      component.socialInsuranceNo = 34343;
      expect(component.benefitrequestId && component.socialInsuranceNo).toBeDefined();
      component.fetchAuthorizedPersonDetails(true);
      //spyOn(component.manageBenefitService,'getSelectedAuthPerson').and.returnValue(of([{...new AttorneyDetailsWrapper(),preSelectedAuthperson:[{...new AttorneyDetailsWrapper(),personId:123}]}]));
      expect(component.fetchAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('fetchPersonContactDetails', () => {
    it('should fetchPersonContactDetails', () => {
      component.fetchPersonContactDetails('');
      expect(component.fetchPersonContactDetails).toBeDefined();
    });
  });
  describe('viewPaymentHistory', () => {
    it('should viewPaymentHistory', () => {
      component.viewPaymentHistory('', '');
      expect(component.viewPaymentHistory).toBeDefined();
    });
    it('should viewMaintainAdjustment', () => {
      component.viewMaintainAdjustment('');
      expect(component.viewMaintainAdjustment).toBeDefined();
    });
    it('should setParams', () => {
      component.setParams(1212, 3443, 3434);
      expect(component.setParams).toBeDefined();
    });
  });
  describe('getBank', () => {
    it('should getBank', () => {
      component.getBank('');
      spyOn(component.lookUpService, 'getBank').and.callThrough();
      expect(component.getBank).toBeDefined();
    });
  });
  describe('fetchContDetailWithPeriods', () => {
    it('should  fetchContDetailWithPeriods', () => {
      component.fetchContDetailWithPeriods(23232, '');
      expect(component.fetchContDetailWithPeriods).toBeDefined();
    });
  });
  describe('getBankDetails', () => {
    it('should getBankDetails', () => {
      component.getBankDetails('', true, true);
      expect(component.getBankDetails).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should  getDependentHistory', () => {
      component.getDependentHistory(65656);
      expect(component.getDependentHistory).toBeDefined();
    });
  });
});
