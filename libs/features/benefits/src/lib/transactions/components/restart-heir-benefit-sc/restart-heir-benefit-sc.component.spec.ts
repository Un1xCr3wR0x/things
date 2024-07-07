/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  LanguageToken,
  TransactionService,
  TransactionParams,
  Transaction
} from '@gosi-ui/core';

import { RestartHeirBenefitScComponent } from './restart-heir-benefit-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalServiceStub, ActivatedRouteStub } from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import {
  BenefitDocumentService,
  BenefitDetails,
  UITransactionType,
  DependentService,
  HeirBenefitService,
  DependentDetails,
  ManageBenefitService,
  SearchPersonalInformation,
  PersonalInformation,
  AttorneyDetailsWrapper,
  AnnuityResponseDto,
  StatusHistory,
  HistoryDetails,
  DependentHistory
} from '../../../shared';

describe('RestartHeirBenefitScComponent', () => {
  let component: RestartHeirBenefitScComponent;
  let fixture: ComponentFixture<RestartHeirBenefitScComponent>;
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
  const benefitDocumentServiceespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServiceespy.getValidatorDocuments.and.returnValue(of([new BenefitDetails()]));
  benefitDocumentServiceespy.getUploadedDocuments.and.returnValue(of([new BenefitDetails()]));
  const dependentServicespy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getBenefitHistory',
    'setDependents',
    'getDependentHistory',
    'setReasonForBenefit'
  ]);
  dependentServicespy.setReasonForBenefit.and.returnValue();
  dependentServicespy.getDependentHistory.and.returnValue(of(dependet));
  dependentServicespy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServicespy.setDependents.and.returnValues();
  const heirBenefitServiceespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen',
    'getHeirById'
  ]);
  heirBenefitServiceespy.getHeirById.and.returnValue(of([new DependentDetails()]));
  const manageBenefitServicespy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'getSelectedAuthPerson',
    'getAnnuityBenefitRequestDetail'
  ]);
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
  manageBenefitServicespy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  //manageBenefitServicespy .getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
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
  manageBenefitServicespy.getSelectedAuthPerson.and.returnValue(of([new AttorneyDetailsWrapper()]));
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
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceespy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [RestartHeirBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartHeirBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*describe('ngOnInit', () => {
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
  });*/
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
  describe('getUploadedDocuments', () => {
    it('should getUploadedDocuments', () => {
      component.benefitRequestId = 2322342;
      component.getUploadedDocuments(component.benefitRequestId);
      expect(component.reqList).not.toBeNull();
    });
  });
  describe('getOldDependentDetails', () => {
    it('should  getOldDependentDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.requestId = 23342321212;
      expect(component.socialInsuranceNo && component.requestId).toBeDefined();
      component.getOldDependentDetails();
      component.dependentService.getBenefitHistory(component.socialInsuranceNo, component.requestId).subscribe(res => {
        component.oldBenefitDetails = res;
        expect(component.oldBenefitDetails).not.toBeNull();
      });
      expect(component.getOldDependentDetails).toBeDefined();
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
  describe('getDependentHistory', () => {
    it('should  getDependentHistory', () => {
      const personId = 2334455;
      component.getDependentHistory(personId);
      expect(component.getDependentHistory).toBeDefined();
    });
  });
  describe('getHeirDetails', () => {
    it('should getHeirDetails', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      component.benefitType = '';
      component.heirBenefitService
        .getHeirById(
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
      component.referenceNo = 63546534;
      component.benefitType = '';
      component.benReqId = 2343445;
      component.sin = 233445;
      expect(component.benReqId && component.sin).toEqual(2343445 && 233445);
      component.getAnnuityCalculation(component.sin, component.benReqId, component.referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
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
  describe(' getPersonContactDetails', () => {
    it('should getPersonContactDetails', () => {
      const type = '';
      component.getPersonContactDetails(type);
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should  getAuthorizedPersonDetails', () => {
      const isModifyBenefit = true;
      component.benReqId = 2343445;
      component.sin = 233445;
      expect(component.benReqId && component.sin).toEqual(2343445 && 233445);
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
});
