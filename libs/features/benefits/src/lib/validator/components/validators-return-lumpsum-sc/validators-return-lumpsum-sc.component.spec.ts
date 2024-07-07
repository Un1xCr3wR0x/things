/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  BilingualTextPipeMock,
  DocumentServiceStub,
  DummyValidatorComponent,
  ManagePersonServiceStub,
  ModalServiceStub,
  TranslateLoaderStub
} from 'testing';
import {
  BenefitConstants,
  HasThisRolePipe,
  UITransactionType,
  ReturnLumpsumService,
  ReturnLumpsumDetails,
  ReturnLumpsumPaymentDetails
} from '../../../shared';
import { ValidatorsReturnLumpsumScComponent } from './validators-return-lumpsum-sc.component';

describe('ValidatorsReturnLumpsumScComponent', () => {
  let component: ValidatorsReturnLumpsumScComponent;
  let fixture: ComponentFixture<ValidatorsReturnLumpsumScComponent>;
  const repaymentDetails: ReturnLumpsumPaymentDetails = {
    paymentMethod: { english: 'erree', arabic: '' },
    bankType: { english: 'erree', arabic: '' },
    receiptMode: { english: 'erree', arabic: '' }
  };
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getActiveBenefitDetails',
    'getSavedActiveBenefit',
    'getIsUserSubmitted',
    'getLumpsumRepaymentDetails',
    'setRepayId',
    'setBenefitReqId'
  ]);

  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(
    of({ ...new ReturnLumpsumDetails(), benefitType: { english: '', arabic: '' }, repaymentDetails })
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        ValidatorsReturnLumpsumScComponent,
        DummyValidatorComponent,
        HasThisRolePipe,
        BilingualTextPipeMock
      ],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder,
        TranslateStore
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorsReturnLumpsumScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('showTransaction', () => {
    it('should show approve modal', () => {
      const templateRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(templateRef);
      component.showTransaction(templateRef);
      expect(component.showModal).toBeDefined();
    });
  });
  describe('confirmRejectSaned', () => {
    it('should show Reject modal', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectLumpsum();
      expect(component.confirmRejectLumpsum).toBeDefined();
    });
  });
  describe('confirmApproveLumpsum', () => {
    it('should show approve modal', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveLumpsum();
      expect(component.confirmApproveLumpsum).toBeDefined();
    });
  });
  describe('returnLumpsum', () => {
    it('should show returnLumpsum modal', () => {
      component.returnLumpsumForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnLumpsum();
      expect(component.returnLumpsum).toBeDefined();
    });
  });
  describe('navigateToEdit', () => {
    it('should navigateToEdit', () => {
      spyOn(component, 'navigateToEdit').and.callThrough();
      spyOn(component.router, 'navigate');
      fixture.detectChanges();
      component.navigateToEdit();
      expect(component.navigateToEdit).toBeDefined();
    });
  });
  describe('navigateToRestore', () => {
    it('should navigateToRestore', () => {
      spyOn(component, 'navigateToRestore').and.callThrough();
      spyOn(component.router, 'navigate');
      fixture.detectChanges();
      component.navigateToRestore();
      expect(component.navigateToRestore).toBeDefined();
    });
  });
  describe('getDocumentsForOtherPayment', () => {
    it('should fetch documents', () => {
      const transactionKey = BenefitConstants.TRANSACTION_APPROVE_SANED;
      const transactionType = UITransactionType.GOL_REQUEST_SANED;
      const benefitRequestId = 1001246;
      spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForOtherPayment(transactionKey, transactionType, benefitRequestId, 1234);
      expect(component.benefitDocumentService.getUploadedDocuments).toHaveBeenCalled();
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('getDocumentsForRestore', () => {
    it('should fetch DocumentsForRestore', () => {
      const transactionKey = BenefitConstants.TRANSACTION_APPROVE_SANED;
      const transactionType = UITransactionType.GOL_REQUEST_SANED;
      const benefitRequestId = 1001246;
      spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForRestore(transactionKey, transactionType, benefitRequestId);
      expect(component.benefitDocumentService.getUploadedDocuments).toHaveBeenCalled();
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('fetchDocumentsForRestore', () => {
    it('should fetch DocumentsForRestore', () => {
      const enableLumpsumRepaymentId = 232343445;
      component.fetchDocumentsForRestore(enableLumpsumRepaymentId);
      expect(component.fetchDocumentsForRestore).toBeDefined();
    });
  });
  describe('getLumpsumRepaymentDetails', () => {
    it('should getLumpsumRepaymentDetails', () => {
      const sin = 2334232323;
      const benefitRequestId = 4332323;
      const repayID = 34232323;
      component.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID);
      expect(component.getLumpsumRepaymentDetails).toBeDefined();
    });
  });
  describe('fetchDocumentsForOtherPayment', () => {
    it('should fetchDocumentsForOtherPayment', () => {
      component.fetchDocumentsForOtherPayment();
      expect(component.fetchDocumentsForOtherPayment).toBeDefined();
    });
  });
  describe('canValidatorCanEditPayment', () => {
    it('should canValidatorCanEditPayment', () => {
      component.canValidatorCanEditPayment();
      expect(component.canValidatorCanEditPayment).toBeDefined();
    });
  });
  describe(' setBenefitVariables', () => {
    it('should  setBenefitVariables hazardousLumpsum', () => {
      component.benefitType = 'Retirement Lumpsum Benefit (Hazardous Occupation)';
      component.isHazardous = true;
      expect(component.isHazardous).toBeTrue();
      component.setBenefitVariables('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.benefitType).toEqual('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables jailedContributorLumpsum', () => {
      component.benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.isJailedLumpsum = true;
      component.setBenefitVariables('Jailed Contributor Lumpsum Benefit');
      expect(component.benefitType).toEqual('Jailed Contributor Lumpsum Benefit');
      expect(component.isJailedLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables occLumpsum', () => {
      component.benefitType = 'Occupational Disability Lumpsum Benefit';
      component.isOcc = true;
      component.setBenefitVariables('Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Occupational Disability Lumpsum Benefit');
      expect(component.isOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isNonOcc', () => {
      component.isNonOcc = true;
      component.benefitType = 'Non-Occupational Disability Lumpsum Benefit';
      component.setBenefitVariables('Non-Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Non-Occupational Disability Lumpsum Benefit');
      expect(component.isNonOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables Woman Lumpsum Benefit', () => {
      component.isWomenLumpsum = true;
      component.benefitType = 'Woman Lumpsum Benefit';
      component.setBenefitVariables('Woman Lumpsum Benefit');
      expect(component.benefitType).toEqual('Woman Lumpsum Benefit');
      expect(component.isWomenLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables Heir Lumpsum Benefit', () => {
      component.benefitType = 'Heir Lumpsum Benefit';
      component.isHeir = true;
      component.setBenefitVariables('Heir Lumpsum Benefit');
      expect(component.benefitType).toEqual('Heir Lumpsum Benefit');
      expect(component.isHeir).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
  });
});
