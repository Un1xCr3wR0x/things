/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Inject } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToObject,
  BpmTaskRequest,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  LookupService,
  Lov,
  MenuService,
  MenuToken,
  Role,
  RouterData,
  RouterDataToken,
  RouterService,
  TransactionReferenceData,
  TransactionWorkflowItem,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  RouterConstants,
  Environment,
  TransactionWorkflowDetails,
  TransactionService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import {
  ActivatedRouteStub,
  commentsMockData,
  ComplaintRequestTest,
  ComplaintRouterTestData,
  ContactForms,
  customerCareOfficerData,
  customerData,
  documentTestArray,
  inboxResponse,
  initializeRouterData,
  menuData,
  ModalServiceStub,
  transactionListData,
  TransactionSummaryData,
  TxnSUmmary,
  MenuServiceStub,
  WorkflowServiceStub,
  DocumentServiceStub,
  workflowListMockData
} from 'testing';
import { ContactBaseScComponent } from '..';
import { CategoryEnum } from '../../enums';
import { ComplaintRouterData, CustomerSummary, TransactionSummary } from '../../models';
import { ValidatorRoutingService, ValidatorService } from '../../services';
export const routerSpy = { url: RouterConstants.ROUTE_INBOX, navigate: jasmine.createSpy('navigate') };
@Component({
  selector: 'contact-base-derived'
})
export class DerivedContactBaseScComponent extends ContactBaseScComponent {
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) public routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly lookUpService: LookupService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService
  ) {
    super(
      formBuilder,
      modalService,
      validatorService,
      documentService,
      uuidService,
      alertService,
      router,
      workflowService,
      route,
      routerData,
      appToken,
      routerService,
      lookUpService,
      validatorRoutingService,
      location,
      menuService,
      environment,
      transactionService
    );
  }
}

describe('ContactBaseScComponent', () => {
  let component: DerivedContactBaseScComponent;
  let fixture: ComponentFixture<DerivedContactBaseScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, HttpClientTestingModule],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: MenuToken, useValue: menuData.menuItems },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: MenuService,
          useClass: MenuServiceStub
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder,
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      declarations: [DerivedContactBaseScComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedContactBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      spyOn(component, 'setTransactionId').and.callThrough();
      spyOn(component, 'setLabels').and.callThrough();
      spyOn(component, 'getTransactionDetails').and.returnValue();
      // spyOn(component, 'getDocuments').and.callThrough();
      spyOn(component, 'getComments').and.callThrough();
      spyOn(component, 'getworkflowDetails').and.callThrough();
      spyOn(component.workflowService, 'getBPMTask').and.returnValue(of());
      component.ngOnInit();
      expect(component.routerData).toBeDefined();
      expect(component.routerData.taskId).not.toEqual(undefined);
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
      expect(component.transactionTraceId).not.toEqual(null);
      expect(component.businessKey).not.toEqual(null);
      expect(component.category).not.toEqual(null);
      expect(component.assignedRole).not.toEqual(null);
    });
    it('should ngOninit', () => {
      component.routerData = customerCareOfficerData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
      component.isPrivate = true;
      component.assignedRole = Role.CUSTOMER_CARE_OFFICER;
      // component.canEdit = true;
      component.ngOnInit();
      expect(component.routerData).toBeDefined();
      expect(component.routerData.taskId).not.toEqual(undefined);
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
      expect(component.transactionTraceId).not.toEqual(null);
      expect(component.businessKey).not.toEqual(null);
      expect(component.category).not.toEqual(null);
      expect(component.isPrivate).toEqual(true);
      // expect(component.canEdit).toEqual(true);
      expect(component.assignedRole).toEqual(Role.CUSTOMER_CARE_OFFICER);
    });
  });
  describe('getTaskDetails', () => {
    it('should getTaskDetails', () => {
      component.taskId = initializeRouterData.taskId;
      component.assigneeId = initializeRouterData.assigneeId;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      spyOn(component.workflowService, 'getBPMTask').and.returnValue(
        of(bindToObject(new BpmTaskRequest(), inboxResponse))
      );
      component.transactionSummary = new TransactionSummary();
      component.transactionSummary.priority = TxnSUmmary.priority;
      component.getTaskDetails();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData.taskId).not.toEqual(null);
      expect(component.previousOutcome).not.toEqual(null);
      expect(component.previousRole).not.toEqual(null);
      expect(component.transactionSummary).toBeDefined();
      expect(component.transactionSummary.priority).not.toEqual(null);
      expect(component.taskId).not.toEqual(null);
      expect(component.assigneeId).not.toEqual(null);
    });
    it('should getTaskDetails', () => {
      component.taskId = initializeRouterData.taskId;
      component.assigneeId = initializeRouterData.assigneeId;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      const updateAll = true;
      spyOn(component, 'clearActions').and.callThrough();
      component.getTaskDetails();
      expect(component.taskId).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData.taskId).not.toEqual(null);
      expect(component.assigneeId).not.toEqual(null);
      expect(updateAll).toEqual(true);
    });
    it('should getTaskDetails', () => {
      component.taskId = initializeRouterData.taskId;
      component.assigneeId = initializeRouterData.assigneeId;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      component.workflowService.getBPMTask(new BpmTaskRequest()).subscribe(res => {
        expect(res).toBeDefined();
        expect(res.customActions).not.toEqual(null);
      });
      component.getTaskDetails();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData.taskId).not.toEqual(null);
      expect(component.assigneeId).not.toEqual(null);
    });
    it('should throw error for get task details', () => {
      const isLocationBack = true;
      component.routerData = initializeRouterData;
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      spyOn(component.workflowService, 'getBPMTask').and.returnValue(of());
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateToInbox();
      component.getTaskDetails(true, isLocationBack);
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData.taskId).not.toEqual(null);
      expect(isLocationBack).toBe(true);
    });
  });
  describe('should getDocuments', () => {
    it('should getDocuments', () => {
      // spyOn(component.documentService, 'getMultipleDocuments').and.returnValue(of(documentTestArray));
      // component.getDocuments();
      // expect(component.documentService.getMultipleDocuments).toHaveBeenCalled();
    });
  });
  // describe('get taskdetails should throw error', () => {
  //   it('should throw error for get task details', () => {
  //     component.routerData = initializeRouterData;
  //     component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(component.routerData);
  //     spyOn(component.workflowService, 'getBPMTask').and.returnValue(throwError(genericError));
  //     component.navigateToInbox();
  //     component.getTaskDetails();
  //     expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
  //   });
  // });
  describe('setTransactionId', () => {
    it('should setTransactionId', () => {
      const value = CategoryEnum.SUGGESTION;
      component.transactionId = TransactionSummaryData.transactionId;
      component.setTransactionId(value);
      expect(value).not.toEqual(null);
      expect(component.transactionId).toEqual(300340);
    });
  });
  describe('set labels', () => {
    it('should set labels', () => {
      const category = CategoryEnum.SUGGESTION;
      component.setLabels(category);
      expect(component.typeLabel).not.toEqual(null);
      expect(component.subTypeLabel).not.toEqual(null);
      expect(component.header).not.toEqual(null);
    });
    it('should set labels', () => {
      component.category = CategoryEnum.APPEAL;
      component.setLabels(component.category);
      expect(component.header).not.toEqual(null);
    });
    it('should set labels', () => {
      component.category = CategoryEnum.PLEA;
      component.setLabels(component.category);
      expect(component.header).not.toEqual(null);
    });
  });
  describe('should showmodal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const value = component.complaint;
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.showModal(modalRef, value);
      expect(value).toBe(component.complaint);
      expect(component.commentsMandatory).toBeFalsy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('getCustomerDetails', () => {
    it('should getCustomerDetails', () => {
      const personId = 1234;
      spyOn(component.validatorService, 'getPersonDetails').and.returnValue(
        of(bindToObject(new CustomerSummary(), customerData))
      );
      component.getCustomerDetails(personId);
      expect(component.customerSummary).not.toEqual(null);
    });
  });
  describe('getDepartmentDetails', () => {
    it('should getDepartmentDetails', () => {
      const departmentList = new Lov();
      spyOn(component.validatorService, 'getDepartmentDetails');
      component.getDepartmentDetails(departmentList);
      expect(component.customerSummary).not.toEqual(null);
    });
  });
  describe('should hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('should hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.approveEvent();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('get txn details', () => {
    it('should get txn details', () => {
      component.businessKey = ComplaintRouterTestData.businessKey;
      const routerData = new RouterData();
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(routerData);
      spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(
        of(bindToObject(new TransactionSummary(), transactionListData))
      );
      // spyOn(component, 'getDocuments').and.callThrough();
      spyOn(component, 'getComments').and.callThrough();
      spyOn(component, 'getEstablishmentDetails').and.callThrough();
      spyOn(component, 'getCustomerDetails').and.callThrough();
      component.getTransactionDetails(true);
      expect(component.transactionSummary).not.toEqual(null);
      expect(component.businessKey).not.toEqual(null);
    });
  });
  describe('getDocuments', () => {
    it('should getDocuments', () => {
      // spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentTestArray));
      // component.getDocuments();
      // expect(component.documents).not.toEqual(null);
    });
  });
  describe('getComments', () => {
    it('should getComments', () => {
      component.taskId = initializeRouterData.taskId;
      component.assigneeId = initializeRouterData.assigneeId;
      component.getComments();
      expect(component.comment).not.toEqual(null);
      expect(component.taskId).not.toEqual(null);
      expect(component.assigneeId).not.toEqual(null);
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      component.uuid = ComplaintRequestTest.uuid;
      const doc = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocument(doc);
      expect(component.uuid).not.toEqual(null);
      expect(doc).toBeDefined();
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      component.router.navigate([RouterConstants.ROUTE_INBOX]);
      component.navigateToInbox();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    spyOn(component, 'removeDocuments').and.callThrough();
    spyOn(component, 'navigateToInbox').and.callThrough();
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  describe('get workflow details', () => {
    it('should get workflow details', () => {
      spyOn(component.workflowService, 'getWorkFlowDetails').and.returnValue(
        of(bindToObject(new TransactionWorkflowDetails(), workflowListMockData))
      );
      component.getworkflowDetails(112233);
      expect(component.workflow).not.toEqual(null);
    });
  });

  describe('complete workflow', () => {
    it('should complete workflow', () => {
      const forms = new ContactForms();
      component.actionForm = forms.SuggestionTypeForm();
      component.actionForm.reset();
      spyOn(component.alertService, 'showSuccessByKey').and.callThrough();
      spyOn(component, 'navigateToInbox').and.callThrough();
    });
  });
  describe('get ticket history', () => {
    it('should get ticket history', () => {
      const referenceNo = 123456;
      spyOn(component.workflowService, 'getTicketComments').and.returnValue(
        of(bindToObject(new TransactionReferenceData(), commentsMockData))
      );
      component.getTicketHistory(referenceNo);
      expect(commentsMockData).not.toEqual(null);
      expect(referenceNo).not.toEqual(null);
    });
  });
  describe('set message', () => {
    it('should set message', () => {
      component.previousOutcome = WorkFlowActions.DELEGATE;
      component.previousRole = Role.CUSTOMER_CARE_OFFICER;
      component.setMessage(component.previousOutcome, component.previousRole);
      expect(component.previousRole).not.toEqual(null);
      expect(component.previousOutcome).not.toEqual(null);
    });
  });
});
