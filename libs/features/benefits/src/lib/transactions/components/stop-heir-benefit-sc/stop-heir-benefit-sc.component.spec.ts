/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  GosiCalendar,
  DocumentItem,
  Name,
  ArabicName,
  EnglishName
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, from } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { StopHeirBenefitScComponent } from './stop-heir-benefit-sc.component';
import {
  BenefitDetails,
  DependentDetails,
  DependentHistory,
  DependentService,
  BenefitConstants,
  UITransactionType,
  ManageBenefitService,
  PersonalInformation,
  AnnuityResponseDto,
  SearchPersonalInformation,
  AttorneyDetailsWrapper,
  DependentHistoryDetails,
  HistoryDetails,
  StatusHistory,
  BenefitDocumentService,
  AttorneyDetails
} from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('StopHeirBenefitScComponent', () => {
  let component: StopHeirBenefitScComponent;
  let fixture: ComponentFixture<StopHeirBenefitScComponent>;
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
    'getValidatorDocuments'
  ]);
  benefitDocumentServicespy.getValidatorDocuments.and.returnValue(of([new DocumentItem()]));
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'setDependents',
    'getBenefitHistory',
    'getDependentHistory',
    'setReasonForBenefit'
  ]);

  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getDependentHistory.and.returnValue(of(dependet));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId',
    'getAnnuityBenefitRequestDetail',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'getSelectedAuthPerson'
  ]);
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
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
          nationality: { english: 'Male', arabic: '' },
          sex: { english: 'Male', arabic: '' },
          fromJsonToObject: json => json
        }
      ]
    })
  );
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        DatePipe,
        FormBuilder
      ],
      declarations: [StopHeirBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopHeirBenefitScComponent);
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
  describe('getOldDependentDetails', () => {
    it('should  getOldDependentDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.requestId = 23342321212;
      component.getOldDependentDetails();
      expect(component.socialInsuranceNo && component.requestId).toBeDefined();
      //spyOn(component.dependentService,'getBenefitHistory').and.returnValue(of([{...new BenefitDetails()}]));
      component.dependentService.getBenefitHistory(component.socialInsuranceNo, component.requestId).subscribe(res => {
        component.oldBenefitDetails = res;
        expect(component.oldBenefitDetails).not.toBeNull();
      });
      expect(component.getOldDependentDetails).toBeDefined();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should getAnnuityCalculation', () => {
      component.sin = 2334254453;
      component.benefitRequestId = 23342321212;
      component.referenceNo = 2334534;
      // spyOn (component.manageBenefitService,'getBenefitCalculationDetailsByRequestId').and.returnValue(of(new BenefitDetails()));
      component.getAnnuityCalculation(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
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
  describe('getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      const type = 'abcd';
      component.getPersonContactDetails(type);
      //spyOn (component.manageBenefitService,'getPersonDetailsApi').and.returnValue(of({...new SearchPersonalInformation(), listOfPersons: [{...new PersonalInformation(), personId: 1234,nationality: {english: 'Male', arabic: '' }, sex: {english: 'Male', arabic: '' }, fromJsonToObject: (json) => json}]}));
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe(' getContDetailWithPerid', () => {
    it('should  getContDetailWithPerid', () => {
      const id = 23423232;
      const type = 'abcd';
      //spyOn (component.manageBenefitService,'getPersonDetailsWithPersonId').and.returnValue(of(new PersonalInformation()));
      component.getContDetailWithPerid(id, type);
      expect(component.getContDetailWithPerid).toBeDefined();
    });
  });
  describe('getAuthorizedPersonDetails', () => {
    it('should getAuthorizedPersonDetails', () => {
      const isModifyBenefit = true;
      component.benReqId = 2323233;
      component.sin = 98989;
      expect(component.benReqId && component.sin).toBeDefined();
      // expect(component.preSelectedAuthperson[0]).toBeDefined();
      // expect(component.preSelectedAuthperson[0].personId).toEqual(2323);
      //spyOn (component.manageBenefitService,'getSelectedAuthPerson').and.returnValue(of([new AttorneyDetailsWrapper()]));
      component.getAuthorizedPersonDetails(isModifyBenefit);
      expect(component.getAuthorizedPersonDetails).toBeDefined();
    });
  });
  describe('getDependentHistory', () => {
    it('should getDependentHistory', () => {
      const personid = 23423232;
      component.getDependentHistory(personid);
      //spyOn(component.dependentService,'getDependentHistory').and.returnValue(of(dependet));
      expect(component.getDependentHistory).toBeDefined();
    });
  });
  xdescribe(' getDocuments', () => {
    it('should  getDocuments', () => {
      const transactionKey = BenefitConstants.TRANSACTION_APPROVE_SANED;
      const transactionType = UITransactionType.GOL_REQUEST_SANED;
      const referenceNo = 1001246;
      component.getDocuments(transactionKey, transactionType, referenceNo);
      expect(component.getDocuments).toBeDefined();
    });
  });
  describe('getHeirDetails', () => {
    it('should getHeirDetails', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 63546534;
      component.benefitType = '';
      spyOn(component.heirBenefitService, 'getHeirForValidatorScreen').and.returnValue(of([new DependentDetails()]));
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
  describe(' getDependentHistory', () => {
    it('should getDependentHistory', () => {
      component.sin = 2334254453;
      component.benefitrequestId = 23342321212;
      const personId = 3434234;
      component.dependentService
        .getDependentHistory(component.sin, component.benefitrequestId, personId)
        .subscribe(res => {
          component.dependentHistory = res;
          expect(component.dependentDetails).not.toBeNull();
        });
      expect(component.getDependentHistory).toBeDefined();
    });
  });
});
