/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { BilingualTextPipeMock, holdBenefitData } from 'testing';
import { ActivatedRouteStub, ModalServiceStub } from 'testing/mock-services';
import { ValidatorsModifyCommitmentScComponent } from './validators-modify-commitment-sc.component';
//import { ModifyBenefitService, HoldBenefitDetails, BenefitDocumentService, UITransactionType, BenefitConstants } from '../../..';
import {
  HoldBenefitDetails,
  ModifyBenefitService,
  UITransactionType,
  BenefitDocumentService,
  BenefitConstants,
  Contributor
} from '../../../shared';

describe('ValidatorsModifyCommitmentScComponent', () => {
  let component: ValidatorsModifyCommitmentScComponent;
  let fixture: ComponentFixture<ValidatorsModifyCommitmentScComponent>;
  const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getRestartCalculation',
    'getRestartDetails',
    'getModifyCommitment'
  ]);
  modifyBenefitServiceSpy.getModifyCommitment.and.returnValue(
    of({ ...new HoldBenefitDetails(), contributor: { ...new Contributor(), identity: [] } })
  );
  const documentService = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getStopBenefitDocuments',
    'getUploadedDocuments'
  ]);
  documentService.getStopBenefitDocuments.and.returnValue(of(new DocumentItem()));
  documentService.getUploadedDocuments.and.returnValue(of(new DocumentItem()));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BenefitDocumentService, useValue: documentService },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [ValidatorsModifyCommitmentScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorsModifyCommitmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' getModifyCommitmentDetails', () => {
    it('should  getModifyCommitmentDetails', () => {
      const sin = 23452323;
      const benefitRequestId = 234335231;
      const referenceNo = 32211223;
      component.getModifyCommitmentDetails(sin, benefitRequestId, referenceNo);
      expect(component.getModifyCommitmentDetails).toBeDefined();
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should  confirmRejectBenefit', () => {
      spyOn(component, 'confirmRejectBenefit');
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('fetchDocumentsForModify', () => {
    it('should fetchDocumentsForModify', () => {
      component.requestId = 1004341279;
      component.fetchDocumentsForModify();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.fetchDocumentsForModify).not.toBeNull();
    });
  });
  describe('getDocumentsForModify', () => {
    it('should getDocumentsForModify', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.requestId = 1004341279;
      // spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForModify(transactionKey, transactionType, component.requestId);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('showModal1', () => {
    it('should showModal1', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal1(modalRef);
      expect(component.showModal1).toBeDefined();
    });
  });
  describe('navigateToEdit', () => {
    it('should  navigateToEdit', () => {
      spyOn(component.router, 'navigate').and.callThrough();
      component.navigateToEdit();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_REMOVE_COMMITMENT],

        Object({
          queryParams: Object({
            edit: true
          })
        })
      );
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('confirmApproveBenefit', () => {
    it('should show approve modal', () => {
      component.modifyCommitmentForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(component.modifyCommitmentForm);
      component.confirmApproveBenefit();
      expect(component.confirmApproveBenefit).toBeDefined();
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should show Reject modal', () => {
      component.modifyCommitmentForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(component.modifyCommitmentForm);
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('returnBenefit', () => {
    it('should show returnBenefit modal', () => {
      component.modifyCommitmentForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnBenefit();
      expect(component.returnBenefit).toBeDefined();
    });
  });
});
