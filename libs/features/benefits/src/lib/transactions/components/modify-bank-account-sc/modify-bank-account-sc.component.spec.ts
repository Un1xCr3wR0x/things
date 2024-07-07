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
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';

import { ModifyBankAccountScComponent } from './modify-bank-account-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, TranslateLoaderStub, uiBenefits, ModalServiceStub, BilingualTextPipeMock } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  ModifyPayeeDetails,
  ModifyBenefitService,
  HeirsDetails,
  AdjustmentDetails,
  Contributor,
  ActiveBenefits
} from '../../../shared';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';

describe('ModifyBankAccountScComponent', () => {
  let component: ModifyBankAccountScComponent;
  let fixture: ComponentFixture<ModifyBankAccountScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getRestartCalculation',
    'getRestartDetails',
    'getModifyCommitment',
    'getModifyPaymentDetails',
    'getReqDocsForModifyPayee'
  ]);
  modifyBenefitServiceSpy.getModifyPaymentDetails.and.returnValue(
    of({ ...new ModifyPayeeDetails(), contributor: { ...new Contributor(), identity: [] } })
  );
  modifyBenefitServiceSpy.getReqDocsForModifyPayee.and.returnValue(of([new DocumentItem()]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        })
      ],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        FormBuilder
      ],
      declarations: [ModifyBankAccountScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyBankAccountScComponent);
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
      spyOn(component, 'getPayeeDetails');
      spyOn(component, 'getDocumentsForModifyPayee').and.callThrough();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getPayeeDetails', () => {
    it('should fetch payeeDetails', () => {
      // spyOn(component.modifyBenefitService, 'getModifyPaymentDetails').and.returnValue(
      //   of(bindToObject(new ModifyPayeeDetails(), uiBenefits))
      // );
      const sin = 367189827;
      const benefitRequestId = 1002210558;
      const referenceNumber = 19424916;
      spyOn(component, 'getPayeeDetails');
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234 }];
      component.modifyBenefitService
        .getModifyPaymentDetails(sin, benefitRequestId, referenceNumber)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      component.getPayeeDetails();
      expect(component.getPayeeDetails).toBeDefined();
    });
  });
  describe('setGuardianIdentity', () => {
    it('should setGuardianIdentity', () => {
      component.setGuardianIdentity();
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234, guardianPersonIdentity: [] }];
      fixture.detectChanges();
      expect(component.setGuardianIdentity).toBeDefined();
    });
  });
  describe('setAuthorizedIdentity', () => {
    it('should setAuthorizedIdentity', () => {
      component.requestId = 1004341279;
      component.setAuthorizedIdentity();
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234, authorizedPersonIdentity: [] }];
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.setAuthorizedIdentity).not.toBeNull();
    });
  });
  describe('getDocumentsForModifyPayee', () => {
    it('should fetch DocumentsForModifyPayee', () => {
      const sin = 100077668;
      const benefitRequestId = 244566;
      const referenceNo = 233444;
      const transactionKey = 'MODIFY_PAYEE';
      const modifyPayeeType = 'EQUEST_BENEFIT_FO';
      spyOn(component.benefitDocumentService, 'getModifyPayeeDocuments').and.returnValue(
        of(bindToObject(new ModifyPayeeDetails(), uiBenefits))
      );
      spyOn(component.alertService, 'showWarning');
      component.getDocumentsForModifyPayee(sin, benefitRequestId, referenceNo, transactionKey, modifyPayeeType);
      expect(component.alertService.showError);
      expect(component.benefitDocumentService.getModifyPayeeDocuments).toHaveBeenCalled();
    });
  });
  describe('onViewBenefitDetails', () => {
    it('should  onViewBenefitDetails', () => {
      const modify = { ...new ModifyPayeeDetails(), personId: 234234, benefitType: { english: '', arabic: '' } };
      component.socialInsuranceNo = 3434;
      component.requestId = 3434;
      const data = {
        personId: modify.personId,
        sin: component.socialInsuranceNo,
        benefitRequestId: modify.benefitType
      };
      component.heirActiveService.setActiveHeirDetails(data);
      component.onViewBenefitDetails();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.onViewBenefitDetails).not.toBeNull();
    });
    it('should  navigateToInjuryDetails', () => {
      component.navigateToInjuryDetails();
    });
  });
});
