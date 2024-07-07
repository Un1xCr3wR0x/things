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
  ApplicationTypeEnum,
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  TransactionService,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { HoldHeirBenefitScComponent } from './hold-heir-benefit-sc.component';
import {
  BenefitDocumentService,
  BenefitDetails,
  HeirBenefitService,
  DependentDetails,
  FuneralBenefitService,
  FuneralGrantBeneficiaryResponse,
  ManageBenefitService,
  SearchPersonalInformation,
  PersonalInformation,
  AttorneyDetailsWrapper,
  UITransactionType,
  AnnuityResponseDto,
  StatusHistory,
  HistoryDetails,
  DependentHistory,
  DependentService
} from '../../../shared';

describe('HoldHeirBenefitScComponent', () => {
  let component: HoldHeirBenefitScComponent;
  let fixture: ComponentFixture<HoldHeirBenefitScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
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
    'setReasonForBenefit'
  ]);

  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getDependentHistory.and.returnValue(of(dependet));

  const benefitDocumentServiceespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServiceespy.getValidatorDocuments.and.returnValue(of([new BenefitDetails()]));
  benefitDocumentServiceespy.getUploadedDocuments.and.returnValue(of([new BenefitDetails()]));
  const heirBenefitServiceespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen',
    'getHeirById'
  ]);
  heirBenefitServiceespy.getHeirForValidatorScreen.and.returnValue(of([new DependentDetails()]));
  const funeralBenefitServicespy = jasmine.createSpyObj<FuneralBenefitService>('FuneralBenefitService', [
    'getBeneficiaryRequestDetails'
  ]);
  funeralBenefitServicespy.getBeneficiaryRequestDetails.and.returnValue(of(new FuneralGrantBeneficiaryResponse()));
  const manageBenefitServicespy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId',
    'getAnnuityBenefitRequestDetail',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'getSelectedAuthPerson'
  ]);
  manageBenefitServicespy.getAnnuityBenefitRequestDetail.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      personId: 2345323,
      contributorName: { english: '', arabic: '' },
      paymentMethod: { english: '', arabic: '' },
      payeeType: { english: '', arabic: '' },
      benefitType: { english: '', arabic: '' },
      heirBenefitReason: { english: '', arabic: '' }
    })
  );
  manageBenefitServicespy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServicespy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
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
  manageBenefitServicespy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
  manageBenefitServicespy.getSelectedAuthPerson.and.returnValue(
    of([
      { ...new AttorneyDetailsWrapper(), preSelectedAuthperson: [{ ...new AttorneyDetailsWrapper(), personId: 123 }] }
    ])
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HoldHeirBenefitScComponent],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceespy },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: FuneralBenefitService, useValue: funeralBenefitServicespy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldHeirBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getAnnuityCalculation', () => {
    it('should  getAnnuityCalculation', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      component.benefitType = '';
      component.getAnnuityCalculation(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  describe('getDocuments', () => {
    it('should getDocuments', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.referenceNo = 1004341279;
      component.getDocuments(transactionKey, transactionType, component.referenceNo);
      expect(component.documents).not.toBeNull();
    });
  });
  describe(' getAnnuityBenefitDetails', () => {
    it('should  getAnnuityBenefitDetails', () => {
      component.sin = 2334254453;
      component.benefitRequestId = 23342321212;
      component.referenceNo = 2334534;
      //spyOn(component.dependentService,'setDependents').and.returnValues();
      component.getAnnuityBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getAnnuityBenefitDetails).toBeDefined();
    });
  });
  describe('getHeirDetails', () => {
    it('should getHeirDetails', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      component.benefitType = '';
      component.heirBenefitService
        .getHeirForValidatorScreen(
          component.sin,
          component.benefitrequestId.toString(),
          component.referenceNo,
          component.benefitType,
          null
        )
        .subscribe(res => {
          component.dependentDetails = res;
          expect(component.dependentDetails).not.toBeNull();
        });
      component.getHeirDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getHeirDetails).toBeDefined();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should  getAnnuityCalculation', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      component.benefitType = '';
      component.getAnnuityCalculation(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  describe('getOldDependentDetails', () => {
    it('should  getOldDependentDetails', () => {
      component.getOldDependentDetails();
      component.socialInsuranceNo = 232435445;
      component.requestId = 232321;
      expect(component.socialInsuranceNo && component.requestId).toEqual(232435445 && 232321);
      //spyOn(component.dependentService,'getBenefitHistory').and.returnValue(of([{ ...new BenefitDetails() }]));
      expect(component.getOldDependentDetails).toBeDefined();
    });
  });
  describe(' getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      const type = 'abcd';
      component.getPersonContactDetails(type);
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should  getDependentHistory', () => {
      const personId = 23344342;
      component.getDependentHistory(personId);
      expect(component.getDependentHistory).toBeDefined();
    });
  });
  describe('getContDetailWithPerid', () => {
    it('should getContDetailWithPerid', () => {
      const id = 34534;
      const type = '';
      component.getContDetailWithPerid(id, type);
      component.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(res => {
        component.personalDetails = res;
      });
      expect(component.getContDetailWithPerid).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should  getAuthorizedPersonDetails', () => {
      component.benReqId = 23434;
      component.sin = 2323232;
      expect(component.benReqId && component.sin).toBeDefined();
      const isModifyBenefit = true;
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
});
