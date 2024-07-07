/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BilingualText, Role, StorageService, WorkflowService } from '@gosi-ui/core';
import {
  commonImports,
  commonProviders
} from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  genericError,
  genericEstablishmentResponse,
  StorageServiceStub,
  transactionReferenceData,
  WorkflowServiceStub
} from 'testing';
import {
  DocumentTransactionTypeEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  TerminateEstablishmentService,
  TerminateResponse
} from '../../../../shared';
import { ValidateTerminateEstablishmentScComponent } from './validate-terminate-establishment-sc.component';

describe('ValidateTerminateEstablishmentScComponent', () => {
  let component: ValidateTerminateEstablishmentScComponent;
  let fixture: ComponentFixture<ValidateTerminateEstablishmentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateTerminateEstablishmentScComponent],
      providers: [
        FormBuilder,
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: TerminateEstablishmentService,
          useClass: EstablishmentStubService
        },
        { provide: StorageService, useClass: StorageServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTerminateEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('initialise component', () => {
      component.estRouterData.referenceNo = 123456;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
    it('initialise component', () => {
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      const referenceNumber = 19424916;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getComments');
      spyOn(component, 'getCloseEstDocuments');
      component.estRouterData.assignedRole = Role.VALIDATOR_2;
      component.estRouterData.previousOwnerRole = Role.VALIDATOR_2;
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getCloseEstDocuments).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('get closure  Details', () => {
    it('should get establishment closure details', () => {
      const referenceNumber = 19424916;
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(new TerminateResponse()));
      spyOn(component, 'getClosureDetails');
      component.getClosureDetails(referenceNumber);
      expect(component.getClosureDetails).toHaveBeenCalled();
    });
    it('should get establishment closure details throws error', () => {
      const referenceNumber = 19424916;
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getClosureDetails(referenceNumber);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('navigate to terminate establishment', () => {
    it('should navigateto terminate establishment', () => {
      component.navigateToTerminateEst();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_TERMINATE_MODIFY]);
    });
  });

  describe('navigate to terminate establishment', () => {
    it('should get documents', () => {
      const transactionKey = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
      const transationType = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
      const identifier = genericEstablishmentResponse.registrationNo;
      const referenceNo = transactionReferenceData.referenceNo;
      spyOn(component.changeGroupEstablishmentService, 'getDocuments').and.callThrough();
      component.getCloseEstDocuments(transactionKey, transationType, identifier, referenceNo);
      expect(component.changeGroupEstablishmentService.getDocuments).toHaveBeenCalled();
    });
  });

  describe('reject Or Return Terminate Transaction', () => {
    it('should reject Or Return TerminateTransaction', () => {
      const form = component.createForm();
      form.patchValue({ action: 'reject' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(new BilingualText()));
      spyOn(component, 'hideModal');
      component.confirmReject(form);
      expect(component.hideModal).toHaveBeenCalled();
    });
  });

  describe('reject Terminate Transaction', () => {
    it('should reject TerminateTransaction', () => {
      const form = component.createForm();
      form.patchValue({ action: 'reject' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(new BilingualText()));
      spyOn(component, 'hideModal');
      component.confirmReject(form);
      expect(component.hideModal).toHaveBeenCalled();
    });
    it('should throw error', () => {
      const form = component.createForm();
      form.patchValue({ action: 'reject' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      spyOn(component, 'hideModal');
      component.confirmReject(form);
      expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('Return Terminate Transaction', () => {
    it('should Return TerminateTransaction', () => {
      const form = component.createForm();
      form.patchValue({ action: 'return' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(new BilingualText()));
      spyOn(component, 'hideModal');
      component.confirmReturn(form);
      expect(component.hideModal).toHaveBeenCalled();
    });
    it('should throw error', () => {
      const form = component.createForm();
      form.patchValue({ action: 'reject' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      spyOn(component, 'hideModal');
      component.confirmReturn(form);
      expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('Approve Terminate Transaction', () => {
    it('should approve TerminateTransaction', () => {
      const form = component.createForm();
      form.patchValue({ action: 'approve' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(new BilingualText()));
      spyOn(component, 'hideModal');
      component.confirmApprove(form);
      expect(component.hideModal).toHaveBeenCalled();
    });
    it('should throw error', () => {
      const form = component.createForm();
      form.patchValue({ action: 'reject' });
      component.estRouterData.assignedRole = 'EstAdmin';
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      spyOn(component, 'hideModal');
      component.confirmApprove(form);
      expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
});
