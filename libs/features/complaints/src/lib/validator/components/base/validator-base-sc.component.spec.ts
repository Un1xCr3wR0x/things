/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  BPMUpdateRequest,
  DocumentService,
  EnvironmentToken,
  LookupService,
  MenuService,
  MenuToken,
  Role,
  RouterData,
  RouterDataToken,
  RouterService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  Environment,
  TransactionService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  ComplaintRequestTest,
  ContactForms,
  genericError,
  initializeRouterData,
  menuData,
  ModalServiceStub,
  PriorityLov,
  TxnSUmmary,
  MenuServiceStub,
  DocumentServiceStub
} from 'testing';
import { CategoryEnum } from '../../../shared/enums';
import { ComplaintRouterData, ComplaintTypeUpdateRequest } from '../../../shared/models';
import { ValidatorRoutingService, ValidatorService } from '../../../shared/services';
import { ValidatorBaseScComponent } from './validator-base-sc.component';

@Component({
  selector: 'validator-base-derived'
})
export class DerivedValidatorBaseScComponent extends ValidatorBaseScComponent {
  constructor(
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly validatorService: ValidatorService,
    readonly workflowService: WorkflowService,
    readonly uuidService: UuidGeneratorService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) public routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly pLocation: PlatformLocation,
    readonly routerService: RouterService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService
  ) {
    super(
      formBuilder,
      alertService,
      validatorService,
      workflowService,
      uuidService,
      fb,
      router,
      modalService,
      lookUpService,
      route,
      documentService,
      routerData,
      appToken,
      pLocation,
      routerService,
      validatorRoutingService,
      location,
      menuService,
      transactionService,
      environment
    );
  }
}
const routerSpy = { url: 'home/transactions/list/worklist', navigate: jasmine.createSpy('navigate') };

describe('ValidatorBaseScComponent', () => {
  let component: DerivedValidatorBaseScComponent;
  let fixture: ComponentFixture<DerivedValidatorBaseScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DerivedValidatorBaseScComponent],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: MenuToken, useValue: menuData.menuItems },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        { provide: MenuService, useClass: MenuServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedValidatorBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirmEvent', () => {
    it('should confirmEvent', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.category = CategoryEnum.SUGGESTION;
      component.currentAction = WorkFlowActions.ESCALATE;
      component.confirmEvent();
      expect(component.category).toEqual(CategoryEnum.SUGGESTION);
      expect(component.currentAction).not.toEqual(WorkFlowActions.RETURN_TO_CUSTOMER_CARE);
      expect(component.actionForm).toBeDefined();
    });
    it('should confirmEvent', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.currentAction = WorkFlowActions.RETURN_TO_CUSTOMER_CARE;
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      bpmUpdateRequest.outcome = WorkFlowActions.RETURN_TO_CUSTOMER;
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.confirmEvent();
      expect(component.actionForm).toBeTruthy();
      expect(bpmUpdateRequest.outcome).toEqual(WorkFlowActions.RETURN_TO_CUSTOMER);
      expect(component.currentAction).toEqual(WorkFlowActions.RETURN_TO_CUSTOMER_CARE);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
    it('should confirm event', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.actionForm.controls.comments.setValue('test');
      component.actionForm.controls.departmentId.setValue('jhdjgfhdg');
      component.actionForm.controls.clerkId.setValue('hjjfh');
      component.actionForm.controls.head.setValue('56tyu');
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.transactionTraceId = 112233;
      component.currentAction = WorkFlowActions.PROVIDE_INFORMATION;
      bpmUpdateRequest.organization = component.validatorRoutingService.complaintRouterData.departmentId;
      bpmUpdateRequest.organizationUser = component.validatorRoutingService.complaintRouterData.deptHead;
      bpmUpdateRequest.assignedRole = component.validatorRoutingService.complaintRouterData.assignedRole;
      bpmUpdateRequest.referenceNo = component.transactionTraceId?.toString();
      component.confirmEvent();
      expect(bpmUpdateRequest).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.currentAction).toEqual(WorkFlowActions.PROVIDE_INFORMATION);
      expect(component.actionForm).toBeTruthy();
      expect(bpmUpdateRequest.organization).toEqual(component.validatorRoutingService.complaintRouterData.departmentId);
      expect(bpmUpdateRequest.organizationUser).toEqual(component.validatorRoutingService.complaintRouterData.deptHead);
      expect(bpmUpdateRequest.assignedRole).toEqual(component.validatorRoutingService.complaintRouterData.assignedRole);
      expect(bpmUpdateRequest.referenceNo).toEqual(component.transactionTraceId?.toString());
      expect(component.currentAction).not.toEqual(null);
      expect(component.actionForm.valid).toBeTruthy();
    });
    it('should confirm event', () => {
      component.currentAction = WorkFlowActions.DELEGATE;
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide').and.callThrough();
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(
        of(bindToObject(new BPMUpdateRequest(), ComplaintRequestTest))
      );
      component.confirmEvent();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.modalRef).not.toEqual(null);
      expect(component.currentAction).not.toEqual(null);
    });
    it('should confirm event', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.reset();
      component.currentAction = WorkFlowActions.RESOLVE;
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide').and.callThrough();
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component, 'navigateToInbox').and.callThrough();
      spyOn(component.alertService, 'showSuccessByKey').and.callThrough();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(
        of(bindToObject(new BPMUpdateRequest(), ComplaintRequestTest))
      );
      component.confirmEvent();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.modalRef).not.toEqual(null);
      expect(component.currentAction).not.toEqual(null);
      expect(component.actionForm).toBeTruthy();
    });
    it('should confirm event', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.actionForm.controls.comments.setValue('test');
      component.actionForm.controls.departmentId.setValue('jhdjgfhdg');
      component.actionForm.controls.clerkId.setValue('hjjfh');
      component.actionForm.controls.head.setValue('56tyu');
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.transactionTraceId = 112233;
      component.currentAction = WorkFlowActions.RETURN_TO_CUSTOMER;
      bpmUpdateRequest.returnComment = component.actionForm.value.comments;
      component.confirmEvent();
      expect(bpmUpdateRequest).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.currentAction).toEqual(WorkFlowActions.RETURN_TO_CUSTOMER);
      expect(component.actionForm).toBeTruthy();
      expect(component.currentAction).not.toEqual(null);
      expect(component.actionForm.valid).toBeTruthy();
      expect(bpmUpdateRequest.returnComment).not.toEqual(null);
    });
    it('should confirm event', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.actionForm.controls.comments.setValue('test');
      component.actionForm.controls.departmentId.setValue('jhdjgfhdg');
      component.actionForm.controls.clerkId.setValue('hjjfh');
      component.actionForm.controls.head.setValue('56tyu');
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.transactionTraceId = 112233;
      component.currentAction = WorkFlowActions.RESOLVE;
      bpmUpdateRequest.resolveComment = component.actionForm.value.comments;
      component.confirmEvent();
      expect(bpmUpdateRequest).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.currentAction).toEqual(WorkFlowActions.RESOLVE);
      expect(component.actionForm).toBeTruthy();
      expect(component.currentAction).not.toEqual(null);
      expect(component.actionForm.valid).toBeTruthy();
      expect(bpmUpdateRequest.resolveComment).not.toEqual(null);
    });
    it('should confirm event', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.actionForm.controls.comments.setValue('test');
      component.actionForm.controls.departmentId.setValue('jhdjgfhdg');
      component.actionForm.controls.clerkId.setValue('hjjfh');
      component.actionForm.controls.head.setValue('56tyu');
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.transactionTraceId = 112233;
      component.currentAction = WorkFlowActions.ACKNOWLEDGE;
      bpmUpdateRequest.ackComment = component.actionForm.value.comments;
      component.confirmEvent();
      expect(bpmUpdateRequest).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.currentAction).toEqual(WorkFlowActions.ACKNOWLEDGE);
      expect(component.actionForm).toBeTruthy();
      expect(component.currentAction).not.toEqual(null);
      expect(component.actionForm.valid).toBeTruthy();
      expect(bpmUpdateRequest.ackComment).not.toEqual(null);
    });
  });
  describe('mergeAndUpdateTask', () => {
    it('should mergeAndUpdateTask', () => {
      const bpmUpdateRequest = new BPMUpdateRequest();
      component.currentAction = WorkFlowActions.REQUEST_INFORMATION;
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(
        of(bindToObject(new BPMUpdateRequest(), ComplaintRequestTest))
      );
      component.workflowUpdate(bpmUpdateRequest);
      expect(component.currentAction).toBe(WorkFlowActions.REQUEST_INFORMATION);
    });
    it('should mergeAndUpdateTask', () => {
      component.modalRef = new BsModalRef();
      const bpmUpdateRequest = new BPMUpdateRequest();
      spyOn(component.modalRef, 'hide').and.callThrough();
      component.currentAction = WorkFlowActions.REQUEST_INFORMATION;
      spyOn(component.alertService, 'showError').and.callThrough();
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(throwError(genericError));
      component.workflowUpdate(bpmUpdateRequest);
      expect(component.modalRef).toBeDefined;
      expect(component.currentAction).toBe(WorkFlowActions.REQUEST_INFORMATION);
    });
  });
  describe('getInfoDetails', () => {
    it('should getInfoDetails', () => {
      const category = 'complaints';
      spyOn(component, 'generateUuid').and.callThrough();
      spyOn(component, 'getRequiredDocuments').and.callThrough();
      component.getInfoDetails(category);
      expect(component.generateUuid).toHaveBeenCalled();
    });
    it('should getInfoDetails', () => {
      const action = WorkFlowActions.REQUEST_INFORMATION;
      component.assignedRole = Role.CUSTOMER_CARE_SENIOR_OFFICER;
      spyOn(component.lookUpService, 'getFieldOfficeList').and.callThrough();
      component.getInfoDetails(action);
      expect(component.locationList$).not.toEqual(null);
      expect(component.assignedRole).toEqual(Role.CUSTOMER_CARE_SENIOR_OFFICER);
    });
    it('should getInfoDetails', () => {
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const action = WorkFlowActions.REQUEST_INFORMATION;
      component.assignedRole = Role.DEPARTMENT_HEAD;
      spyOn(component.validatorService, 'getClerkDetails').and.callThrough();
      component.getInfoDetails(action);
      expect(component.clerkList$).not.toEqual(null);
      expect(component.assignedRole).toEqual(Role.DEPARTMENT_HEAD);
    });
    it('should getInfoDetails', () => {
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const action = WorkFlowActions.REQUEST_INFORMATION;
      component.category = CategoryEnum.SUGGESTION;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.getInfoDetails(action);
      expect(component.categoryList$).not.toEqual(null);
      expect(component.subCategoryList$).not.toEqual(null);
      expect(component.buttonLabel).not.toEqual(null);
      expect(component.message).not.toEqual(null);
    });
  });
  describe('modifyAction', () => {
    it('should modifyAction', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      component.transactionTypeForm.get('type').get('english').setValue('Medical Board');
      component.transactionTypeForm.get('subType').get('english').setValue('Appeal');
      component.transactionTypeForm.get('category').get('english').setValue('Enquiry');
      component.transactionTypeForm.get('priority').get('english').setValue('Low');
      component.transactionSummary = TxnSUmmary;
      spyOn(component, 'updateTaskPriority').and.returnValue(of());
      spyOn(component, 'updateSummaryDetails').and.returnValue(of());
      component.modifyAction();
      expect(component.transactionSummary.type.english).not.toEqual(component.transactionTypeForm.value.type.english);
      expect(component.transactionSummary.subtype.english).not.toEqual(
        component.transactionTypeForm.value.subType.english
      );
      expect(component.transactionSummary.priority.english).not.toEqual(
        component.transactionTypeForm.value.priority.english
      );
      expect(component.transactionSummary.priority.english).not.toEqual(null);
      expect(component.transactionSummary.type.english).not.toEqual(null);
      expect(component.transactionSummary.subtype.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.priority).not.toEqual(null);
      expect(component.transactionTypeForm.value.type).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType).not.toEqual(null);
      expect(component.transactionTypeForm.value.type.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType.english).not.toEqual(null);
      expect(component.transactionTypeForm).toBeTruthy();
      expect(component.transactionSummary).toBeDefined();
      expect(component.transactionTypeForm.valid).toBeTruthy();
      expect(component.routerData).toBeDefined();
      expect(component.routerData.taskId).not.toEqual(undefined);
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
    });
    it('should modifyAction', () => {
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      component.transactionTypeForm.get('type').get('english').setValue('Medical Board');
      component.transactionTypeForm.get('subType').get('english').setValue('Appeal');
      component.transactionTypeForm.get('category').get('english').setValue('Enquiry');
      component.transactionTypeForm.get('priority').get('english').setValue('Low');
      component.transactionSummary = TxnSUmmary;
      spyOn(component, 'completeUpdation').and.returnValue();
      spyOn(component, 'updateSummaryDetails').and.returnValue(of());
      component.modifyAction();
      expect(component.transactionSummary.type.english).not.toEqual(component.transactionTypeForm.value.type.english);
      expect(component.transactionSummary.subtype.english).not.toEqual(
        component.transactionTypeForm.value.subType.english
      );
      expect(component.transactionSummary.priority.english).not.toEqual(null);
      expect(component.transactionSummary.type.english).not.toEqual(null);
      expect(component.transactionSummary.subtype.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.priority).not.toEqual(null);
      expect(component.transactionTypeForm.value.type).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType).not.toEqual(null);
      expect(component.transactionTypeForm.value.type.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType.english).not.toEqual(null);
      expect(component.transactionTypeForm).toBeDefined();
      expect(component.transactionSummary).toBeDefined();
      expect(component.transactionTypeForm.valid).toBeTruthy();
      expect(component.routerData).toBeDefined();
      expect(component.routerData.taskId).not.toEqual(undefined);
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
    });
    it('should modifyAction', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      component.transactionTypeForm.get('type').get('english').setValue('Medical Board');
      component.transactionTypeForm.get('subType').get('english').setValue('Appeal');
      component.transactionTypeForm.get('category').get('english').setValue('Enquiry');
      component.transactionTypeForm.get('priority').get('english').setValue('Low');
      component.transactionSummary = TxnSUmmary;
      spyOn(component, 'updateTaskPriority').and.returnValue(of());
      spyOn(component, 'completeUpdation').and.returnValue();
      component.modifyAction();
      expect(component.transactionSummary.priority.english).not.toEqual(
        component.transactionTypeForm.value.priority.english
      );
      expect(component.transactionSummary.priority.english).not.toEqual(null);
      expect(component.transactionSummary.type.english).not.toEqual(null);
      expect(component.transactionSummary.subtype.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.priority).not.toEqual(null);
      expect(component.transactionTypeForm.value.type).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType).not.toEqual(null);
      expect(component.transactionTypeForm.value.type.english).not.toEqual(null);
      expect(component.transactionTypeForm.value.subType.english).not.toEqual(null);
      expect(component.transactionTypeForm).toBeDefined();
      expect(component.transactionSummary).toBeDefined();
      expect(component.transactionTypeForm.valid).toBeTruthy();
      expect(component.routerData).toBeDefined();
      expect(component.routerData.taskId).not.toEqual(undefined);
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
    });
  });
  describe('showPopUp', () => {
    it('should showPopUp', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.priorityList = PriorityLov;
      spyOn(component.modalService, 'show');
      component.showPopUp(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
      expect(component.isTypeSelected).toBe(false);
    });
    it('should showPopUp', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.category = CategoryEnum.ENQUIRY;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.canEditPriorityOnly = false;
      component.showPopUp(modalRef);
      expect(component.category).toEqual(CategoryEnum.ENQUIRY);
      expect(component.canEditPriorityOnly).toEqual(false);
      expect(component.typeList$).not.toEqual(null);
    });
    it('should showPopUp', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.category = CategoryEnum.SUGGESTION;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.showPopUp(modalRef);
      expect(component.category).toEqual(CategoryEnum.SUGGESTION);
      expect(component.typeList$).not.toEqual(null);
    });
  });
  describe('itsm navigation', () => {
    it('should get itsm navigation', () => {
      component.transactionTraceId = 1122;
      component.navigateTo();
      expect(component.transactionTraceId).not.toEqual(null);
    });
  });
  describe('update summary details', () => {
    it('should update summary details', () => {
      const updateRequest: ComplaintTypeUpdateRequest = new ComplaintTypeUpdateRequest();
      const forms = new ContactForms();
      const isSuggestion = true;
      component.actionForm = forms.SuggestionTypeForm();
      component.actionForm.get('category').get('english').setValue('Annuity');
      component.actionForm.get('subCategory').get('english').setValue('Appeal');
      updateRequest.type = component.actionForm.value.category.english;
      updateRequest.subType = component.actionForm.value.subCategory.english;
      spyOn(component.validatorService, 'updateComplaintType').and.callThrough();
      component.updateSummaryDetails(isSuggestion);
      expect(component.actionForm).toBeTruthy();
      expect(component.actionForm.valid).toBeTruthy();
      expect(component.actionForm.value).toBeTruthy();
      expect(component.actionForm.value.category).toBeTruthy();
      expect(component.actionForm.value.subCategory).toBeTruthy();
      expect(component.actionForm.value.category.english).toBeTruthy();
      expect(component.actionForm.value.subCategory.english).toBeTruthy();
      expect(isSuggestion).toEqual(true);
      expect(updateRequest.subType).toEqual(component.actionForm.value.subCategory.english);
      expect(updateRequest.type).toEqual(component.actionForm.value.category.english);
      expect(updateRequest).toBeDefined();
    });
  });
});
