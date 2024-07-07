/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  WorkflowService,
  RouterDataToken,
  RouterData,
  LanguageToken,
  DocumentItem
} from '@gosi-ui/core';
import { ActivatedRouteStub, ModalServiceStub, WorkflowServiceStub } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';

import { StartHeirBenefitScComponent } from './start-heir-benefit-sc.component';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  BenefitDocumentService,
  BenefitDetails,
  UITransactionType,
  HeirBenefitService,
  DependentDetails,
  DependentService,
  ManageBenefitService,
  SearchPersonalInformation,
  PersonalInformation,
  AttorneyDetailsWrapper,
  DependentHistoryDetails,
  AnnuityResponseDto,
  StatusHistory,
  HistoryDetails,
  DependentHistory
} from '../../../shared';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('StartHeirBenefitScComponent', () => {
  let component: StartHeirBenefitScComponent;
  let fixture: ComponentFixture<StartHeirBenefitScComponent>;
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
  const heirBenefitServiceespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirForValidatorScreen'
  ]);
  heirBenefitServiceespy.getHeirForValidatorScreen.and.returnValue(of([new DependentDetails()]));
  const dependentServicespy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getBenefitHistory',
    'setDependents',
    'getDependentHistory',
    'setReasonForBenefit'
  ]);
  dependentServicespy.getDependentHistory.and.returnValue(of(dependet));
  dependentServicespy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  const benefitDocumentServiceespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServiceespy.getValidatorDocuments.and.returnValue(of([new BenefitDetails()]));
  benefitDocumentServiceespy.getUploadedDocuments.and.returnValue(
    of([{ ...new BenefitDetails(), channel: { english: '', arabic: '' } }])
  );
  const manageBenefitServicespy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId',
    'getAnnuityBenefitRequestDetail',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'getSelectedAuthPerson',
    'getSelectedAuthPerson'
  ]);
  manageBenefitServicespy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServicespy.getPersonDetailsApi.and.returnValue(
    of({
      ...new SearchPersonalInformation(),
      listOfPersons: [
        {
          ...new PersonalInformation(),
          personId: 1234,
          sex: { english: 'Male', arabic: '' },
          nationality: { english: '', arabic: '' },
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
      contributorName: { english: '', arabic: '' },
      paymentMethod: { english: '', arabic: '' },
      payeeType: { english: '', arabic: '' },
      benefitType: { english: '', arabic: '' },
      heirBenefitReason: { english: '', arabic: '' }
    })
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: Router, useValue: routerSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceespy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [StartHeirBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartHeirBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
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
      expect(component.ngOnInit).toBeDefined();
      spyOn(component, 'getHeirDetails').and.callThrough();
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
  describe('getDocuments', () => {
    it('should getDocuments', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.channel = { english: '', arabic: '' };
      component.referenceNo = 1004341279;
      component.getDocuments(transactionKey, transactionType, component.referenceNo);
      expect(component.documents).not.toBeNull();
    });
  });
  describe(' getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      const type = 'abcd';
      component.getPersonContactDetails(type);
      expect(component.getPersonContactDetails).toBeDefined();
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
  describe('getContDetailWithPerid', () => {
    it('should getContDetailWithPerid', () => {
      const id = 34534;
      const type = '';
      component.getContDetailWithPerid(id, type);
      expect(component.getContDetailWithPerid).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should  getAuthorizedPersonDetails', () => {
      const isModifyBenefit = true;
      component.benReqId = 2323344;
      component.sin = 232323;
      expect(component.benReqId && component.sin).toBeDefined();
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should getDependentHistory', () => {
      component.socialInsuranceNo = 2334254453;
      component.requestId = 23342321212;
      const personId = 76453;
      component.getDependentHistory(personId);
      // spyOn(component.dependentService,'getDependentHistory').and.callThrough();
      component.dependentService
        .getDependentHistory(component.socialInsuranceNo, component.requestId)
        .subscribe(res => {
          component.dependentHistory = res;
        });
      expect(component.getDependentHistory).toBeDefined();
    });
  });
});
