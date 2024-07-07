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
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ViolationRouteConstants } from '../../constants';
import { ViolationBPMRequest } from '../../models';
import { ViolationsValidatorService } from '../../services';
import { ChangeViolationsBaseScComponent } from './change-violations-base-sc.component';

/** Dummy component to test ValidatorMemberBaseScComponent. */
@Component({
  selector: 'vol-validator-member-base-derived'
})
export class ValidatorBaseDerived extends ChangeViolationsBaseScComponent {
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
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      alertService,
      workflowService,
      modalService,
      validatorService,
      router,
      lookupService,
      documentService,
      routerDataToken,
      appToken
    );
  }
}
describe('ChangeViolationsBaseScComponent', () => {
  let component: ChangeViolationsBaseScComponent;
  let fixture: ComponentFixture<ChangeViolationsBaseScComponent>;
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

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showTemplate(modalRef);
    expect(component.modalRef).not.toEqual(null);
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

  it('should reject', () => {
    component.getSuccessMessage(WorkFlowActions.APPROVE);
    let message = 'CONTRIBUTOR.TRANSACTION-APPROVAL-MESSAGE';
    expect(message).not.toBeNull();
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

  it('should set workflow', () => {
    const data = new ViolationBPMRequest();
    component.setWorkflowData(new RouterData(), '');
    expect(data).not.toBe(null);
  });
  it('should save workflow', () => {
    spyOn(component, 'routeToInbox');
    component.saveWorkflow(new ViolationBPMRequest());
    expect(component.routeToInbox).toHaveBeenCalled();
  });
  it('should call  navigateToEstProfile', () => {
    spyOn(window, 'open');
    component.navigateToEstablishmentProfile(10000602);
    expect(window.open).toHaveBeenCalled();
  });

  it('should get data from token', inject([RouterDataToken], token => {
    token.payload =
      '{"referenceNo": 1002780, "channel": "field-office", "violationId" : 1000000084, "assignedRole": "string"}';
    component.getDataFromToken(token);
    expect(component.referenceNo).toBe(1002780);
    expect(component.channel).toBe('field-office');
    expect(component.violationId).toBe(1000000084);
    expect(component.validatorType).toBe('string');
  }));
  it('should call  navigateToViolationProfile', () => {
    component.estRegNo = 1234;
    component.navigateToViolationProfile(10000602);
    expect(component.router.navigate).toHaveBeenCalledWith(['home/violations/1234/violation-profile/10000602']);
  });
  it('should call  navigateToEstProfile', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'routeToInbox');
    component.confirmCancel();
    expect(component.routeToInbox).toHaveBeenCalled();
  });
});
