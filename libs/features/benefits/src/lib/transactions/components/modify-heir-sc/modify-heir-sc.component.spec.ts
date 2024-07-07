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
import { ApplicationTypeToken, EnvironmentToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { ActivatedRouteStub, genericError, ModalServiceStub } from 'testing';
import { ModifyHeirScComponent } from './modify-heir-sc.component';
import { UITransactionType, BenefitDocumentService, BenefitDetails, DependentService } from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyHeirScComponent', () => {
  let component: ModifyHeirScComponent;
  let fixture: ComponentFixture<ModifyHeirScComponent>;
  const benefitDocumentServiceespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getValidatorDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServiceespy.getValidatorDocuments.and.returnValue(of([new BenefitDetails()]));
  const dependentServicespy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getBenefitHistory',
    'setDependents',
    'getDependentHistory',
    'setReasonForBenefit'
  ]);
  dependentServicespy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  beforeEach(() => {
    TestBed.configureTestingModule({
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
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceespy },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        DatePipe,
        FormBuilder
      ],
      declarations: [ModifyHeirScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyHeirScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise  details', () => {
      expect(component.referenceNumber).not.toEqual(null);
      expect(component.transactionId).not.toEqual(null);
      expect(component.requestId).not.toEqual(null);
      expect(component.socialInsuranceNo).not.toEqual(null);
    });
    it('should get Beneficiary Details', () => {
      component.socialInsuranceNo = 88888;
      component.referenceNumber = 4444;
      component.requestId = 888;
      spyOn(component, 'getBeneficiaryDetails');
      expect(component.funeralBeneficiaryDetails).not.toEqual(null);
    });
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
          BUSINESS_ID: 3527632,
          ADJUSTMENT_REPAY_ID: 1234445456,
          IDENTIFIER: 1234
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.requestId).not.toBe(null);
    });
    it('should throw error on getting Beneficiary details', () => {
      spyOn(component.funeralBenefitService, 'getBeneficiaryRequestDetails').and.returnValue(throwError(genericError));
      component.getBeneficiaryDetails();
      expect(component.funeralBeneficiaryDetails).not.toEqual(null);
    });
    it('should getDocuments', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.referenceNo = 1004341279;
      component.getDocuments(transactionKey, transactionType, component.referenceNo, 566565, 76767);
      expect(component.documents).not.toBeNull();
    });
    it('should getBeneficiaryDetails', () => {
      component.socialInsuranceNo = 2345;
      component.requestId = 4334;
      component.referenceNo = 1233;
      expect(component.socialInsuranceNo && component.requestId && component.referenceNo).toBeDefined();
      component.referenceNo = 1004341279;
      component.getBeneficiaryDetails();
      expect(component.getBeneficiaryDetails).not.toBeNull();
    });
  });
});
