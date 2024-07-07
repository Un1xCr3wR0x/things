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
  UITransactionType,
  ManageBenefitService,
  AnnuityResponseDto,
  DependentService,
  ImprisonmentDetails,
  ActiveBenefits
} from '../../../shared';
import { ValidatorsImprisonmentModifyScComponent } from './validators-imprisonment-modify-sc.component';
//import { ManageBenefitService, DependentService, ImprisonmentDetails, AnnuityResponseDto, BenefitConstants, UITransactionType } from '../../..';

describe('ValidatorsImprisonmentModifyScComponent', () => {
  let component: ValidatorsImprisonmentModifyScComponent;
  let fixture: ComponentFixture<ValidatorsImprisonmentModifyScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'setValues'
  ]);
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', ['getImprisonmentDetails']);
  dependentServiceSpy.getImprisonmentDetails.and.returnValue(of(new ImprisonmentDetails()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ValidatorsImprisonmentModifyScComponent, DummyValidatorComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
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
    fixture = TestBed.createComponent(ValidatorsImprisonmentModifyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('navigateToImprisonmentEdit', () => {
    it('should navigateToImprisonmentEdit', () => {
      spyOn(component, 'navigateToImprisonmentEdit').and.callThrough();
      spyOn(component.router, 'navigate');
      fixture.detectChanges();
      component.navigateToImprisonmentEdit();
      expect(component.navigateToImprisonmentEdit).toBeDefined();
    });
    it('should  navigateToPrevAdjustment', () => {
      spyOn(component, 'navigateToPrevAdjustment').and.callThrough();
      spyOn(component.router, 'navigate');
      fixture.detectChanges();
      component.navigateToPrevAdjustment();
      expect(component.navigateToPrevAdjustment).toBeDefined();
    });
  });
  describe('confirmApproveLumpsum', () => {
    it('should show approve modal', () => {
      component.imprisonmentForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveLumpsum();
      expect(component.confirmApproveLumpsum).toBeDefined();
    });
  });
  describe('confirmRejectSaned', () => {
    it('should show Reject modal', () => {
      component.imprisonmentForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectLumpsum();
      expect(component.confirmRejectLumpsum).toBeDefined();
    });
  });
  describe('returnLumpsum', () => {
    it('should show returnLumpsum modal', () => {
      component.imprisonmentForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnLumpsum();
      expect(component.returnLumpsum).toBeDefined();
    });
  });
  describe('getImprisonmentModifyDetails', () => {
    it('should getImprisonmentModifyDetails', () => {
      const referenceNo = 12345;
      const sin = 367189827;
      const benefitRequestId = 1001246;
      component.getImprisonmentModifyDetails(sin, benefitRequestId, referenceNo);
      // expect(component.manageBenefitService.getAnnuityBenefitRequestDetail).toHaveBeenCalled();
      expect(component.annuityBenefitDetails).not.toBeNull();
      expect(component.getImprisonmentModifyDetails).toBeDefined();
    });
  });
  describe('getImprisonmentAdjustments', () => {
    it('should getImprisonmentAdjustments', () => {
      const sin = 367189827;
      const benefitRequestId = 1001246;
      component.getImprisonmentAdjustments(sin, benefitRequestId);
      // expect(component.manageBenefitService.getAnnuityBenefitRequestDetail).toHaveBeenCalled();
      expect(component.imprisonmentAdjustments).not.toBeNull();
      expect(component.getImprisonmentAdjustments).toBeDefined();
    });
  });
  describe('getDocumentsForImprisonmentModify', () => {
    it('should fetch documents', () => {
      const transactionKey = BenefitConstants.TRANSACTION_APPROVE_SANED;
      const transactionType = UITransactionType.GOL_REQUEST_SANED;
      const benefitRequestId = 1001246;
      const referenceNo = 12345;
      spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForImprisonmentModify(transactionKey, transactionType, benefitRequestId, 123456);
      expect(component.benefitDocumentService.getUploadedDocuments).toHaveBeenCalled();
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
  describe(' onViewBenefitDetails', () => {
    it('should  onViewBenefitDetails', () => {
      const data = new ActiveBenefits(1212, 233, { english: '', arabic: '' }, 223);
      spyOn(component.coreBenefitService, 'setActiveBenefit').and.returnValue();
      component.coreBenefitService.setActiveBenefit(data);
      component.onViewBenefitDetails();
      expect(component.onViewBenefitDetails).toBeDefined();
    });
  });
});
