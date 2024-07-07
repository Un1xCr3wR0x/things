/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { Contributor, ContributorBPMRequest } from '../../../shared/models';
import { ContributorService, EstablishmentService } from '../../../shared/services';
import { ValidatorBaseScComponent } from './validator-base-sc.component';

/** Dummy component to test ValidatorBaseScComponent. */
@Component({
  selector: 'cnt-validator-base-derived'
})
export class ValidatorBaseDerived extends ValidatorBaseScComponent {
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }
}

describe('ValidatorBaseScComponent', () => {
  let component: ValidatorBaseDerived;
  let fixture: ComponentFixture<ValidatorBaseDerived>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ValidatorBaseDerived],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorBaseDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should read data from token', inject([RouterDataToken], token => {
    token.payload =
      '{"registrationNo": 200085744, "socialInsuranceNo": 423641258, "engagementId": 1569355076, "referenceNo": 269865, "id": 485}';
    component.readDataFromToken(token);

    expect(component.registrationNo).toBe(200085744);
    expect(component.socialInsuranceNo).toBe(423641258);
    expect(component.engagementId).toBe(1569355076);
  }));

  it('should set flag for FC Validator', inject([RouterDataToken], token => {
    token.assignedRole = 'FCApprover';
    component.setFlagsForView(token);

    expect(component.canReturn).toBeTruthy();
    expect(component.canReject).toBeFalsy();
    expect(component.canEdit).toBeFalsy();
  }));

  it('should set flag for Validator 2', inject([RouterDataToken], token => {
    token.assignedRole = 'Validator2';
    component.setFlagsForView(token);

    expect(component.canReturn).toBeTruthy();
    expect(component.canReject).toBeTruthy();
    expect(component.canEdit).toBeFalsy();
  }));

  it('should set flag for Validator 1', inject([RouterDataToken], token => {
    token.assignedRole = 'Validator1';
    component.setFlagsForView(token);

    expect(component.canReturn).toBeFalsy();
    expect(component.canReject).toBeTruthy();
    expect(component.canEdit).toBeTruthy();
  }));

  it('should set flag for Validator 1 initiated from GOL', inject([RouterDataToken], token => {
    token.assignedRole = 'Validator1';
    component.channel = 'gosi-online';
    component.setFlagsForView(token);

    expect(component.canReturn).toBeTruthy();
    expect(component.canReject).toBeTruthy();
    expect(component.canEdit).toBeFalsy();
  }));

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });

  it('should get workflow action for approve', () => {
    const action = component.getWorkflowAction(0);
    expect(action).toBe(WorkFlowActions.APPROVE);
  });

  it('should get workflow action for reject', () => {
    const action = component.getWorkflowAction(1);
    expect(action).toBe(WorkFlowActions.REJECT);
  });

  it('should get workflow action for return', () => {
    const action = component.getWorkflowAction(2);
    expect(action).toBe(WorkFlowActions.RETURN);
  });

  it('should set data for approving the transaction', inject([RouterDataToken], token => {
    token.assigneeId = 'sabin';
    const fb = new FormBuilder();
    component.validatorForm.addControl('penalty', fb.group({ english: null }));
    component.validatorForm.get('penalty.english').setValue('Yes');
    const data = component.setWorkflowData(token, WorkFlowActions.APPROVE);
    expect(data.outcome).toBe(WorkFlowActions.APPROVE);
  }));

  it('should set data for rejecting the transaction', inject([RouterDataToken], token => {
    token.assigneeId = 'sabin';
    const fb = new FormBuilder();
    component.validatorForm.addControl('penalty', fb.group({ english: null }));
    component.validatorForm.get('penalty.english').setValue('No');
    component.validatorForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    component.validatorForm.addControl('comments', new FormControl('Test'));
    const data = component.setWorkflowData(token, WorkFlowActions.REJECT);
    expect(data.outcome).toBe(WorkFlowActions.REJECT);
  }));

  it('should set data for returning the transaction', inject([RouterDataToken], token => {
    token.assigneeId = 'sabin';
    const fb = new FormBuilder();
    component.validatorForm.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
    component.validatorForm.addControl('comments', new FormControl('Test'));
    const data = component.setWorkflowData(token, WorkFlowActions.RETURN);
    expect(data.outcome).toBe(WorkFlowActions.RETURN);
  }));

  it('should save workflow', () => {
    spyOn(component, 'navigateToInbox');
    spyOn(component, 'getSuccessMessage');
    component.saveWorkflow(new ContributorBPMRequest());
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should throw error on save workflow', () => {
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.saveWorkflow(new ContributorBPMRequest());
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should initiate inspection', () => {
    component.contributor = new Contributor();
    spyOn(component, 'navigateToInbox');
    component.initiateInspection(new RouterData(), '');
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should throw error while initiating inspection', () => {
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.initiateInspection(new RouterData(), '');
    expect(component.handleError).toHaveBeenCalled();
  });
});
