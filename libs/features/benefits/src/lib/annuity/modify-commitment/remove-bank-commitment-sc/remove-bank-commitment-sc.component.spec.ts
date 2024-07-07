/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeToken, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, DocumentServiceStub, ModalServiceStub } from 'testing/mock-services';
import { RemoveBankCommitmentScComponent } from './remove-bank-commitment-sc.component';
import { BenefitActionsService, BenefitResponse, StopSubmitRequest } from '../../../shared';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RemoveBankCommitmentScComponent', () => {
  let component: RemoveBankCommitmentScComponent;
  let fixture: ComponentFixture<RemoveBankCommitmentScComponent>;
  const benefitActionsServiceSpy = jasmine.createSpyObj<BenefitActionsService>('BenefitActionsService', [
    'removeCommitment',
    'revertRemoveBank'
  ]);
  benefitActionsServiceSpy.removeCommitment.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.revertRemoveBank.and.returnValue(of(new BenefitResponse()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: BenefitActionsService, useValue: benefitActionsServiceSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [RemoveBankCommitmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveBankCommitmentScComponent);
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
  describe('confirm', () => {
    it('should confirm', () => {
      component.sin = 3423;
      component.benefitRequestId = 2323;
      component.referenceNo = 3445;
      expect(component.sin && component.benefitRequestId && component.referenceNo).toBeDefined();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
    it('should confirm', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('submitRemoveCommitment', () => {
    it('should clear alert and submit request', () => {
      component.submitRemoveCommitment(comments);
      expect(component.submitRemoveCommitment).toBeDefined();
    });
  });
  describe('confirm', () => {
    it('confirm', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'confirm');
      component.confirm();
      expect(component.alertService.clearAlerts).toBeDefined();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.callThrough();
      component.saveWorkflowInEdit(comments);
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });
});
