/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Name,
  TransactionService,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';

import { RequestFuneralScComponent } from './request-funeral-sc.component';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  BenefitDocumentService,
  BenefitDetails,
  UITransactionType,
  HeirBenefitService,
  DependentDetails,
  ManageBenefitService,
  SearchPersonalInformation,
  PersonalInformation,
  AttorneyDetailsWrapper,
  FuneralBenefitService,
  FuneralGrantBeneficiaryResponse,
  AnnuityResponseDto,
  BeneficiaryBenefitDetails,
  DependentService,
  DependentHistory,
  HistoryDetails,
  StatusHistory
} from '../../../shared';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RequestFuneralScComponent', () => {
  let component: RequestFuneralScComponent;
  let fixture: ComponentFixture<RequestFuneralScComponent>;
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
    'getSelectedAuthPerson',
    'getSelectedAuthPerson',
    'getAnnuityBenefitBeneficiaryRequestDetail'
  ]);
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
  manageBenefitServicespy.getAnnuityBenefitRequestDetail.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      personId: 2345323,
      benefitType: { english: 'SADAD', arabic: '' },
      contributorName: { english: '', arabic: '' },
      paymentMethod: { english: '', arabic: '' },
      payeeType: { english: '', arabic: '' },
      heirBenefitReason: { english: '', arabic: '' }
    })
  );
  manageBenefitServicespy.getAnnuityBenefitBeneficiaryRequestDetail.and.returnValue(
    of(new BeneficiaryBenefitDetails())
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceespy },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: FuneralBenefitService, useValue: funeralBenefitServicespy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        FormBuilder,
        DatePipe
      ],
      declarations: [RequestFuneralScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFuneralScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getDocuments', () => {
    it('should getDocuments', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.referenceNo = 1004341279;
      const benReqId = 2334342;
      component.getDocuments(transactionKey, transactionType, component.referenceNo, benReqId);
      expect(component.documents).not.toBeNull();
    });
  });
  describe('getDependentHistory', () => {
    it('should getDependentHistory', () => {
      const personId = 23342323;
      component.getDependentHistory(personId);
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.getDependentHistory).not.toBeNull();
    });
  });
  describe('getPersonContactDetails', () => {
    it('should getPersonContactDetails', () => {
      const type = '23342323';
      component.getPersonContactDetails(type);
      expect(component.getPersonContactDetails).not.toBeNull();
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
  describe('fetchDocuments', () => {
    it('should fetchDocuments', () => {
      component.requestId = 1004341279;
      component.fetchDocuments();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.fetchDocuments).not.toBeNull();
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
  describe('getBeneficiaryDetails', () => {
    it('should getBeneficiaryDetails', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      expect(component.sin && component.benefitRequestId && component.referenceNo).toBeUndefined();
      component.getBeneficiaryDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getBeneficiaryDetails).toBeDefined();
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
      const isModifyBenefit = true;
      component.benefitRequestId = 234343;
      component.sin = 2567;
      expect(component.benefitRequestId && component.sin).toBeDefined();
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('getArabicFullName', () => {
    it('should  getArabicFullName', () => {
      const name = new Name();
      component.getArabicFullName(name);
      expect(component.getArabicFullName).toBeDefined();
    });
  });
});
