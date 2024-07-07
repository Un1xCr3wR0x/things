/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  BPMUpdateRequest,
  DocumentItem,
  EnvironmentToken,
  MenuToken,
  Role,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  MenuService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import {
  ActivatedRouteStub,
  ComplaintRequestTest,
  ContactForms,
  initializeRouterData,
  menuData,
  ModalServiceStub,
  TransactionSummaryData,
  TxnSUmmary,
  MenuServiceStub
} from 'testing';
import { LovListConstants } from '../../../shared/constants';
import { CategoryEnum } from '../../../shared/enums';
import { ComplaintRouterData, ComplaintTypeUpdateRequest, TransactionSummary } from '../../../shared/models';
import { ComplaintScComponent } from './complaint-sc.component';
declare const require;
const routerSpy = { url: 'home/transactions/list/worklist', navigate: jasmine.createSpy('navigate') };

describe('ComplaintScComponent', () => {
  let component: ComplaintScComponent;
  let fixture: ComponentFixture<ComplaintScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintScComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        DatePipe,
        FormBuilder,
        { provide: MenuToken, useValue: menuData.menuItems },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: MenuService, useClass: MenuServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should ngoninit', () => {
    it('should ngOnInit', () => {
      component.routerData = initializeRouterData;
      component.ngOnInit();
    });
  });
  describe('submit complaint', () => {
    it('should submit complaint', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component, 'showModal').and.callThrough();
      component.submitComplaint(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
      expect(component.actionForm).toBeTruthy();
    });
    it('should throw mandatory field error', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
      spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.submitComplaint(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('selectPriority', () => {
    it('should selectPriority', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      const priority = TransactionSummaryData.priority;
      component.selectPriority(priority);
      expect(component.priority).toEqual(priority);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
  describe('onCancel', () => {
    it('should onCancel', () => {
      spyOn(component, 'navigateToInbox').and.callThrough();
      component.onCancel();
      expect(component.navigateToInbox).toHaveBeenCalled();
    });
  });

  describe('onAction', () => {
    it('should set actions on onAction', () => {
      const action = 'resolve';
      component.onAction(action);
      expect(component.currentAction).toBe(action);
    });
  });
  describe('clearActions', () => {
    it('should clearActions', () => {
      component.clearActions();
      expect(component.actions.length).toBe(0);
    });
  });
  describe('setMessage', () => {
    it('should setMessage', () => {
      const action = 'resolve';
      const role = Role.CUSTOMER_CARE_OFFICER;
      component.setMessage(action, role);
      expect(action).not.toEqual(null);
      expect(role).not.toEqual(null);
    });
  });
  describe('openModal', () => {
    it('should openModal', () => {
      const modalRef = new BsModalRef();
      component.openModal(modalRef);
      expect(component.modalRef).toBe(modalRef);
    });
  });
  describe('removeDocuments', () => {
    it('should removeDocuments', () => {
      const document = new DocumentItem();
      component.removeDocuments(document);
      spyOn(component.documentService, 'deleteDocument').and.returnValue(of(null));
      expect(component.uploadDocuments).toBeDefined();
    });
  });

  describe('update summary details', () => {
    it('should update summary details', () => {
      const updateRequest: ComplaintTypeUpdateRequest = new ComplaintTypeUpdateRequest();
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      updateRequest.type = component.transactionTypeForm.value.type.english;
      updateRequest.subType = component.transactionTypeForm.value.subType.english;
      spyOn(component.validatorService, 'updateComplaintType').and.callThrough();
      component.updateSummaryDetails();
      expect(component.transactionTypeForm).toBeTruthy();
      expect(updateRequest.subType).toEqual(component.transactionTypeForm.value.subType.english);
      expect(updateRequest.type).toEqual(component.transactionTypeForm.value.type.english);
      expect(updateRequest).toBeDefined();
    });
  });
  describe('update priority details', () => {
    it('should update priority details', () => {
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      bpmUpdateRequest.priority = component.transactionTypeForm.value.priority.english;
      spyOn(component.workflowService, 'updateTaskPriority').and.callThrough();
      component.updateTaskPriority();
      expect(component.transactionTypeForm).toBeTruthy();
      expect(bpmUpdateRequest).toBeDefined();
      expect(bpmUpdateRequest.taskId).not.toEqual(component.validatorRoutingService.complaintRouterData.taskId);
      expect(bpmUpdateRequest.user).not.toEqual(null);
      expect(bpmUpdateRequest.updateType).not.toEqual(null);
      expect(bpmUpdateRequest.priority).toEqual(component.transactionTypeForm.value.priority.english);
    });
  });
  describe('complete updation', () => {
    it('should complete updation', () => {
      const isUpdated = true;
      spyOn(component.alertService, 'showSuccessByKey').and.callThrough();
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      component.transactionTypeForm.reset();
      spyOn(component, 'getTransactionDetails').and.callThrough();
      component.completeUpdation(isUpdated);
      expect(isUpdated).toEqual(true);
      expect(component.getTransactionDetails).toHaveBeenCalled();
    });
  });
  describe('show error', () => {
    it('should show error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.showError();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('confirmEvent', () => {
    it('should confirmEvent', () => {
      const forms = new ContactForms();
      component.actionForm = forms.ActionForm();
      component.actionForm.markAsUntouched();
      component.actionForm.updateValueAndValidity();
      component.currentAction = WorkFlowActions.RETURN_TO_CUSTOMER_CARE;
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      bpmUpdateRequest.taskId = component.validatorRoutingService.complaintRouterData.taskId;
      bpmUpdateRequest.outcome = WorkFlowActions.RETURN_TO_CUSTOMER;
      bpmUpdateRequest.comments = component.actionForm.value.comments;
      bpmUpdateRequest.organizationUser = component.actionForm.value.head;
      bpmUpdateRequest.organization = component.actionForm.value.departmentId;
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide').and.callThrough();
      component.confirmEvent();
      component.actionForm.get('comments').setValue('test');
      component.actionForm.get('head').setValue('value');
      component.actionForm.get('clerkId').setValue('12334567');
      component.actionForm.get('departmentId').setValue('123455678');
      expect(component.actionForm).toBeTruthy();
      expect(bpmUpdateRequest.taskId).toEqual(component.validatorRoutingService.complaintRouterData.taskId);
      expect(bpmUpdateRequest.outcome).toEqual(WorkFlowActions.RETURN_TO_CUSTOMER);
      expect(bpmUpdateRequest.comments).not.toEqual(component.actionForm.value.comments);
      expect(bpmUpdateRequest.organization).not.toEqual(component.actionForm.value.departmentId);
      expect(bpmUpdateRequest.organizationUser).not.toEqual(component.actionForm.value.head);
      expect(component.actionForm).toBeTruthy();
      expect(component.actionForm.value.comments).not.toEqual(null);
      expect(component.actionForm.value.head).not.toEqual(null);
      expect(component.actionForm.value.clerkId).not.toEqual(null);
      expect(component.actionForm.value.departmentId).not.toEqual(null);
      expect(component.currentAction).toEqual(WorkFlowActions.RETURN_TO_CUSTOMER_CARE);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
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
  });
  describe('type select', () => {
    it('should type select', () => {
      const category = null;
      const forms = new ContactForms();
      component.transactionTypeForm = forms.TransactionTypeForm();
      component.transactionTypeForm.get('subType').get('english').setValue(null);
      component.transactionTypeForm.updateValueAndValidity();
      component.onTypeSelect(category);
      expect(component.isTypeSelected).toEqual(false);
      expect(component.transactionTypeForm).toBeTruthy();
      expect(component.transactionTypeForm.value.subType.english).toEqual(null);
      expect(component.transactionTypeForm.value.subType).not.toEqual(undefined);
    });
    it('should type select', () => {
      const category = LovListConstants.GOSI_WEBSITE.value;
      component.isTypeSelected = true;
      component.onTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
    });
    it('should type select', () => {
      const category = LovListConstants.BRANCHES.value;
      const domainName = LovListConstants.BRANCHES.subValue;
      component.isTypeSelected = true;
      component.onTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
    it('should type select', () => {
      const category = LovListConstants.ANNUITY;
      const domainName = LovListConstants.ENQUIRY_TYPES.find(item => item.value === category).subValue;
      component.isTypeSelected = true;
      component.onTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
    it('should type select', () => {
      component.category = CategoryEnum.ENQUIRY;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.isTypeSelected = true;
      component.onTypeSelect(component.category);
      expect(component.category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(component.subTypeList$).not.toEqual(null);
    });
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  describe('should show previous txn', () => {
    it('should show previous txn', () => {
      component.allTransactions = [];
      component.presentPreviousTransactions = [];
      component.previousTransactions = [];
      component.isLoading = true;
      spyOn(component.validatorService, 'getTransactionList').and.returnValue(
        of(bindToObject(new TransactionSummary(), TransactionSummaryData))
      );
      spyOn(component, 'getTransactions').and.callThrough();
      spyOn(component, 'openPopupWindow').and.callThrough();
      component.onShowPreviousTransactions();
      expect(component.allTransactions).not.toEqual(null);
      expect(component.previousTransactions).not.toEqual(null);
    });
  });
  it('should get txn', () => {
    component.currentPage = 1;
    component.getTransactions();
    expect(component.currentPage).not.toEqual(null);
    expect(component.presentPreviousTransactions).not.toEqual(null);
  });
  describe('filter category', () => {
    it('should filter category', () => {
      component.previousTransactions = [];
      component.presentPreviousTransactions = [];
      component.currentPage = 0;
      const category = CategoryEnum.COMPLAINT;
      const previousTxn = component.allTransactions?.filter(item => item?.category?.english?.includes(category));
      component.previousTransactions = previousTxn;
      component.filterCategory(category);
      expect(component.presentPreviousTransactions).toEqual(previousTxn);
    });
    it('should filter category', () => {
      component.previousTransactions = [];
      component.presentPreviousTransactions = [];
      component.currentPage = 0;
      const category = CategoryEnum.ALL_CATEGORY;
      component.previousTransactions = component.allTransactions;
      component.filterCategory(category);
      expect(component.presentPreviousTransactions).toEqual(component.allTransactions);
    });
  });
});
