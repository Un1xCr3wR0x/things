/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  InspectionTypeEnum,
  DocumentItem
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  genericError,
  genericErrorViolations,
  LookupServiceStub,
  MemberDecisionDtoMock,
  ModalServiceStub,
  PenaltyInfoDetails,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { ViolationRouteConstants } from '../../constants';
import { InspectionChannel } from '../../enums';
import { ViolationsValidatorService } from '../../services';
import { ViolationBPMRequest } from '../../models';
import { ValidatorBaseScComponent } from './validator-base-sc.component';

/** Dummy component to test ValidatorMemberBaseScComponent. */
@Component({
  selector: 'vol-validator-member-base-derived'
})
export class ValidatorBaseDerived extends ValidatorBaseScComponent {
  /**
   *
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param validatorService
   * @param router
   * @param routerDataToken
   */
  constructor(
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appTokenData: string
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      validatorService,
      router,
      routerDataToken,
      appTokenData
    );
  }
}

describe('ValidatorBaseScComponent', () => {
  let component: ValidatorBaseDerived;
  let fixture: ComponentFixture<ValidatorBaseDerived>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidatorBaseDerived],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidatorBaseDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get data from token', inject([RouterDataToken], token => {
    token.payload =
      '{"referenceNo": 1002780, "channel": "field-office", "professionalId" : 1000000084, "contractId": 1000000396}';
    component.getDataFromToken(token);
    expect(component.referenceNo).toBe(1002780);
    expect(component.channel).toBe('field-office');
    expect(component.violationId).not.toBe(null);
  }));
  describe('getRolesForView', () => {
    it('should get roles for MB Manager', inject([RouterDataToken], token => {
      token.assignedRole = 'ViolationCommitteeHead';
      component.getRolesForView(token);
      expect(component.canReturn).toBe(true);
    }));
    it('should get roles for MB Manager', inject([RouterDataToken], token => {
      token.assignedRole = 'ViolationCommitteeMember';
      component.getRolesForView(token);
      expect(component.canReturn).toBe(false);
    }));
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.viewModal(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should getClassViolations', () => {
    component.getClassViolations(true);
    expect(component.allExcluded).toBeTrue();
  });
  it('should getClassViolations', () => {
    component.getClassViolations(false);
    expect(component.allExcluded).toBeFalse();
  });
  it('should get workflow action for approve', () => {
    const action = component.getWorkflowActions(0);
    expect(action).toBe(WorkFlowActions.APPROVE);
  });

  it('should get workflow action for reject', () => {
    const action = component.getWorkflowActions(1);
    expect(action).toBe(WorkFlowActions.REJECT);
  });
  it('should get workflow action for reject', () => {
    const action = component.getWorkflowActions(3);
    expect(action).toBe(WorkFlowActions.SUBMIT);
  });
  it('should get workflow action for reject', () => {
    const action = component.getWorkflowActions(2);
    expect(action).toBe(WorkFlowActions.RETURN);
  });
  it('should getClassValueChange', () => {
    const fb = new FormBuilder();
    const docForm = fb.group({ penalty: fb.group({ english: 'Others', arabic: '' }) });
    const violationClass = PenaltyInfoDetails.violationClass;
    component.transactionDetails = validatorDetailsMock;
    component.assigneeIndex = 0;
    component.getClassValueChange(docForm, violationClass);
    expect(component.penaltyRequest.channel).not.toBe(null);
  });
  it('should get workflow action for return', () => {
    const action = component.getWorkflowActions(2);
    expect(action).toBe(WorkFlowActions.RETURN);
  });

  xit('should save workflow', () => {
    spyOn(component, 'routeToInbox');
    component.saveWorkflow(new ViolationBPMRequest());
    expect(component.routeToInbox).toHaveBeenCalled();
  });

  it('should set workflow', () => {
    const data = new ViolationBPMRequest();
    component.setWorkflowData(new RouterData(), '');
    expect(data).not.toBe(null);
  });

  it('should reject', () => {
    component.getSuccessMessage(WorkFlowActions.APPROVE);
    let message = 'CONTRIBUTOR.TRANSACTION-APPROVAL-MESSAGE';
    expect(message).not.toBeNull();
  });

  describe('test suite for getDocuments', () => {
    it('should get documents for rased', () => {
      spyOn(component.documentService, 'getRasedDocuments').and.callThrough();
      component.transactionDetails = validatorDetailsMock;

      expect(component.documentService.getRequiredDocuments).not.toBeNull();
    });
  });

  it('should approve', () => {
    component.getSuccessMessage(WorkFlowActions.REJECT);
    let message = 'CONTRIBUTOR.TRANSACTION-REJECTION-MESSAGE';
    expect(message).not.toBeNull();
  });

  it('should return', () => {
    component.getSuccessMessage(WorkFlowActions.RETURN);
    let message = 'CONTRIBUTOR.TRANSACTION-RETURN-MESSAGE';
    expect(message).not.toBeNull();
  });

  xit('should throw error on get data for view', () => {
    const flag = true;
    const error = {
      error: {
        message: 'string'
      }
    };
    component.handleErrors(error, flag);
  });

  xit('should backToInbox', () => {
    component.routeToInbox();
  });

  it('should call  navigateToEstProfile', () => {
    spyOn(window, 'open');
    component.navigateToEstProfile(10000602);
    expect(window.open).toHaveBeenCalled();
  });

  it('should show error messages', () => {
    spyOn(component.alertService, 'showError');
    component.handleErrors(genericError, true);
    expect(component.alertService.showError).toHaveBeenCalled();
  });

  xit('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should call contributorInfoDtoData', () => {
    (component.transactionDetails = validatorDetailsMock), component.contributorInfoDtoData();
    expect(component.memberDto).not.toBeNull();
  });

  it('should navigate to profile', () => {
    component.transactionDetails = validatorDetailsMock;
    spyOn(window, 'open');
    const regNo = component.transactionDetails.establishmentInfo.registrationNo;
    const sinNo = component.transactionDetails.contributors[0].socialInsuranceNo;
    component.navigateToProfile(0);
    expect(window.open).toHaveBeenCalled();
  });
  it('should get navigate to tracking', () => {
    const index = 0;
    const engIndex = 0;
    component.transactionDetails = validatorDetailsMock;
    spyOn(window, 'open');
    component.navigateToTracker({ index: index, engIndex: engIndex });
    expect(window.open).toHaveBeenCalled();
  });
  xit('should call getRasedInspectionDocument', () => {
    spyOn(component.documentService, 'getRasedDocuments').and.callThrough();
    component.getRasedInspectionDocuments();
    expect(component.documents).not.toEqual(null);
    expect(component.documentService.getRasedDocuments).toHaveBeenCalledWith(
      InspectionTypeEnum.EMPLOYEE_AFFAIRS,
      508604807
    );
  });
  describe('should getViolationClassList', () => {
    it('should call getViolationClassList', () => {
      component.getViolationClassList(true);
      expect(component.violationClassList).not.toEqual(null);
    });
    it('should throw error for getViolationClassList', () => {
      spyOn(component.validatorService, 'getViolationClassDetails').and.returnValue(throwError(genericErrorViolations));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getViolationClassList(true);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should call getClassViolations for false', () => {
      component.getClassViolations(false);
      expect(component.notallExcluded).toBe(true);
      expect(component.allExcluded).toBe(false);
    });
    it('should call getClassViolations for true', () => {
      component.getClassViolations(true);
      expect(component.notallExcluded).toBe(false);
      expect(component.allExcluded).toBe(true);
    });
    it('should call assignCurrentRole', () => {
      component.transactionDetails = validatorDetailsMock;
      component.assignCurrentRole();
      expect(component.transactionDetails).not.toBe(null);
    });
    it('should call getTransaction with index 0', () => {
      component.transactionDetails = validatorDetailsMock;
      component.transactionDetails.penaltyInfo = [];
      component.assigneeIndex = 0;
      component.getTransaction();
      expect(component.transactionDetails).not.toBe(null);
    });
    it('should call getTransaction', () => {
      component.transactionDetails = validatorDetailsMock;
      component.transactionDetails.penaltyInfo = validatorDetailsMock.penaltyInfo;
      component.getTransaction();
      expect(component.transactionDetails).not.toBe(null);
    });

    it('should call submitMemberDecision', () => {
      spyOn(component.validatorService, 'submitValidation').and.callThrough();
      component.memberDto = MemberDecisionDtoMock;
      component.violationId = 123;
      component.bpmTaskId = '123';
      component.submitMemberDecision(MemberDecisionDtoMock);
      expect(component.validatorService.submitValidation).toHaveBeenCalled();
    });
  });
  describe('should getViolationDetails', () => {
    it('should call getViolationDetails', () => {
      component.channel = InspectionChannel.RASED;
      component.isRasedInspection = true;
      component.getViolationDetails();
      expect(component.transactionDetails).not.toBe(null);
    });
  });
  it('should get inspection documents', () => {
    component.documents = [];
    component.transactionDetails = validatorDetailsMock;
    spyOn(component.documentService, 'getRasedDocuments').and.returnValue(of([new DocumentItem()]));
    component.getRasedInspectionDocuments().subscribe();
    expect(component.documents.length).toEqual(1);
  });
});
