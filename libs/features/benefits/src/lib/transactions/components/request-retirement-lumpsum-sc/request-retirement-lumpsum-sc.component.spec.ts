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
  BilingualText,
  Alert,
  DocumentItem
} from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RequestRetirementLumpsumScComponent } from './request-retirement-lumpsum-sc.component';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { showErrorMessage } from '@gosi-ui/features/payment/lib/shared';
import {
  DependentService,
  BenefitDetails,
  ImprisonmentDetails,
  BenefitDocumentService,
  StatusHistory,
  HistoryDetails,
  DependentHistory
} from '../../../shared';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RequestRetirementLumpsumScComponent', () => {
  let component: RequestRetirementLumpsumScComponent;
  let fixture: ComponentFixture<RequestRetirementLumpsumScComponent>;
  let event: any;
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
    'getDependentHistoryDetails',
    'getImprisonmentDetails',
    'getBenefitHistory',
    'getDependentHistory'
  ]);
  dependentServiceSpy.getDependentHistory.and.returnValue(of(dependet));
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getImprisonmentDetails.and.returnValue(of(new ImprisonmentDetails()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments'
  ]);
  benefitDocumentServicespy.getValidatorDocuments.and.returnValue(of([new DocumentItem()]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: RouterDataToken, useValue: new RouterData() },

        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        DatePipe,
        FormBuilder
      ],
      declarations: [RequestRetirementLumpsumScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRetirementLumpsumScComponent);
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
        channel: null,
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
      component.benefitrequestId = 23232442;
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      component.fetchImprisonmentDetails();
      component.isNonOcc = true;
      expect(component.isNonOcc).toEqual(true);
    });
  });
  describe(' setBenefitVariables', () => {
    it('should  setBenefitVariables hazardousLumpsum', () => {
      component.benefitType = 'Retirement Lumpsum Benefit';
      component.isHazardous = false;
      expect(component.isHazardous).toBeFalse();
      component.ngOnInit();
      component.benefitrequestId = 23232442;
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      component.fetchImprisonmentDetails();
      expect(component.benefitType).toEqual('Retirement Lumpsum Benefit');
    });
  });
  describe('getUploadedDocuments', () => {
    it('should fetch documents', () => {
      spyOn(component, 'getDocuments').and.callThrough();
      component.getDocuments('REQUEST_RETIREMENT_LUMPSUM', 'REQUEST_BENEFIT_FO', 302013, 1042005);
      expect(component.reqList).not.toBeNull();
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('fetchImprisonmentDetails', () => {
    it('should fetch Imprisonment Details', () => {
      component.socialInsuranceNo = 2554;
      component.benefitrequestId = 232323;
      expect(component.socialInsuranceNo && component.benefitrequestId).toBeDefined();
      expect(component.imprisonmentDetails).not.toEqual(null);
    });
  });
  describe('fetchOldDependentDetails', () => {
    it('should  fetchOldDependentDetails', () => {
      component.socialInsuranceNo = 2554;
      component.benefitrequestId = 232323;
      expect(component.socialInsuranceNo && component.benefitrequestId).toBeDefined();
      component.fetchOldDependentDetails();
      expect(component.fetchOldDependentDetails).toBeDefined();
    });
  });
  describe('fetchDependentHistory', () => {
    it('should  fetchDependentHistory', () => {
      const personId = 2334455;
      component.fetchDependentHistory(personId);
      expect(component.fetchDependentHistory).toBeDefined();
    });
  });
  describe('getLumpsumBenefitAdjustment', () => {
    it('should  getLumpsumBenefitAdjustment', () => {
      component.getLumpsumBenefitAdjustment();
      expect(component.getLumpsumBenefitAdjustment).toBeDefined();
    });
  });
});
