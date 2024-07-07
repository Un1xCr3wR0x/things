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
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing/mock-services';
import {
  BenefitConstants,
  ReturnLumpsumService,
  AnnuityResponseDto,
  BenefitActionsService,
  BenefitResponse,
  ModifyPaymentDetails,
  BenefitDocumentService
} from '../../../shared';
import { AddBankCommitmentScComponent } from './add-bank-commitment-sc.component';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('AddBankCommitmentScComponent', () => {
  let component: AddBankCommitmentScComponent;
  let fixture: ComponentFixture<AddBankCommitmentScComponent>;
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getActiveBenefitDetails'
  ]);
  returnLumpsumServicespy.getActiveBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments',
    'downloadAddCommitment'
  ]);
  benefitDocumentServicespy.downloadAddCommitment.and.returnValue(of(new Blob()));
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitActionsServiceSpy = jasmine.createSpyObj<BenefitActionsService>('BenefitActionsService', [
    'removeCommitment',
    'revertRemoveBank',
    'submitModifybankDetails',
    'getModifyCommitmentDetails',
    'activateBankCommitment',
    'addBankCommitment'
  ]);
  benefitActionsServiceSpy.removeCommitment.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.revertRemoveBank.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.submitModifybankDetails.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.getModifyCommitmentDetails.and.returnValue(of(new ModifyPaymentDetails()));
  benefitActionsServiceSpy.activateBankCommitment.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.addBankCommitment.and.returnValue(of(new BenefitResponse()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },

        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BenefitActionsService, useValue: benefitActionsServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [AddBankCommitmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankCommitmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      spyOn(component, 'initialiseView');
      spyOn(component, 'getNin');
      component.addTransactionConstant = BenefitConstants.ADD_TRANSACTION_CONSTANT;
      component.transactionId = BenefitConstants.ADD_BANK_COMMITMENT;
      component.isEditMode = false;
      component.transactionId;
      component.doctransactionType;
      spyOn(component, 'getModifyRequiredDocs');
      component.isEditMode = true;
      component.benefitRequestId;
      component.transactionId;
      component.doctransactionType;
      spyOn(component, 'getUploadedDocuments');
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getNin', () => {
    it('should getNin', () => {
      component.getNin();
      component.returnLumpsumService, 'getActiveBenefitDetails';
      component.sin;
      component.benefitRequestId;
      component.referenceNo;
      spyOn(component, 'getUploadedDocuments');
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('confirmAddeddDetails', () => {
    it('should confirmAddedDetails', () => {
      component.confirmAddedDetails(comments);
      expect(component.confirmAddedDetails).toBeDefined();
    });
  });
  describe('confirm', () => {
    it('should confirm', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('openImage', () => {
    it('should openImage', () => {
      component.nin;
      component.openImage();
      expect(component.openImage).toBeDefined();
    });
  });
});
