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
import { ApplicationTypeEnum, RouterData, DocumentItem } from '@gosi-ui/core';
import { ApplicationTypeToken, EnvironmentToken, LanguageToken, RouterDataToken } from '@gosi-ui/core/lib/tokens';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, genericError } from 'testing';
import { RequestRetirementPensionScComponent } from './request-retirement-pension-sc.component';
import {
  DependentService,
  BenefitDetails,
  ImprisonmentDetails,
  FuneralBenefitService,
  FuneralGrantBeneficiaryResponse,
  BenefitDocumentService,
  StatusHistory,
  HistoryDetails,
  DependentHistory,
  BenefitConstants
} from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RequestRetirementPensionScComponent', () => {
  let component: RequestRetirementPensionScComponent;
  let fixture: ComponentFixture<RequestRetirementPensionScComponent>;
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
  const funeralBenefitServiceSpy = jasmine.createSpyObj<FuneralBenefitService>('FuneralBenefitService', [
    'getBeneficiaryRequestDetails'
  ]);
  funeralBenefitServiceSpy.getBeneficiaryRequestDetails.and.returnValue(
    of({ ...new FuneralGrantBeneficiaryResponse(), referenceNumber: 232323 })
  );
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistory',
    'getImprisonmentDetails',
    'getBenefitHistory'
  ]);
  dependentServiceSpy.getDependentHistory.and.returnValue(of(dependet));
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.getImprisonmentDetails.and.returnValue(of(new ImprisonmentDetails()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments'
  ]);
  benefitDocumentServicespy.getValidatorDocuments.and.returnValue(of([new DocumentItem()]));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: FuneralBenefitService, useValue: funeralBenefitServiceSpy },

        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        DatePipe,
        FormBuilder
      ],
      declarations: [RequestRetirementPensionScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRetirementPensionScComponent);
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
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
    });
    it('should fetch Imprisonment Details', () => {
      expect(component.imprisonmentDetails).not.toEqual(null);
    });
    it('should fetch Dependent History Details', () => {
      expect(component.dependentHistory).not.toEqual(null);
    });
    it('should   fetchDependentHistory', () => {
      const personId = 2334545;
      component.fetchDependentHistory(personId);
      expect(component.fetchDependentHistory).toBeDefined();
    });
    it('should getDocs', () => {
      component.transactionId = 302007;
      expect(component.transactionId).toEqual(302007);
      component.getDocs();
    });
    it('should  navigateToBenefitsHistory', () => {
      component.navigateToBenefitsHistory();
    });
    it('should getBeneficiaryDetails', () => {
      component.socialInsuranceNo = 2545667;
      component.benefitrequestId = 4545343;
      component.referenceNo = 34455667;
      expect(component.socialInsuranceNo && component.benefitrequestId && component.referenceNo).toBeDefined();
      component.getBeneficiaryDetails();
      expect(component.getBeneficiaryDetails).toBeDefined();
    });
  });
});
