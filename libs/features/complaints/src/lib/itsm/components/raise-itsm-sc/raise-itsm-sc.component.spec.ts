/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseItsmScComponent } from './raise-itsm-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivatedRouteStub,
  ModalServiceStub,
  transactionTraceData,
  ContactForms,
  ComplaintRequestTest,
  genericError,
  initializeRouterData,
  TransactionServiceStub
} from 'testing';
import {
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  bindToObject,
  Transaction,
  ItTicketRequest,
  BPMUpdateRequest,
  ItTicketResponse,
  WorkFlowActions,
  TransactionService
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ComplaintRouterData } from '../../../shared/models';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RaiseItsmScComponent', () => {
  let component: RaiseItsmScComponent;
  let fixture: ComponentFixture<RaiseItsmScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [RaiseItsmScComponent],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: TransactionService,
          useClass: TransactionServiceStub
        },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseItsmScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      component.transactionSummary = new Transaction();
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component.validatorRoutingService, 'setRouterToken').and.callThrough();
      spyOn(component.transactionService, 'getTransaction').and.returnValue(
        of(bindToObject(new Transaction(), transactionTraceData))
      );
      component.ngOnInit();
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).not.toEqual(null);
      expect(component.validatorRoutingService.complaintRouterData.assigneeId).not.toEqual(null);
      expect(component.transactionSummary).toBeDefined();
      expect(component.transactionSummary).not.toEqual(null);
    });
  });
  describe('showError', () => {
    it('should show error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.showError();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('hideModal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirm event', () => {
    it('should confirm event', () => {
      component.modalRef = new BsModalRef();
      component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
      const forms = new ContactForms();
      component.raiseItForm = forms.ItTicketForm();
      component.raiseItForm.updateValueAndValidity();
      component.raiseItForm.get('itsmForm').get('note').setValue('note');
      component.raiseItForm.get('itsmForm').get('reason').setValue('summary');
      const request: ItTicketRequest = new ItTicketRequest();
      const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      bpmUpdateRequest.taskId = component.validatorRoutingService.complaintRouterData.taskId;
      bpmUpdateRequest.user = component.validatorRoutingService.complaintRouterData.assigneeId;
      bpmUpdateRequest.outcome = WorkFlowActions.REQUEST_ITSM;
      bpmUpdateRequest.referenceNo = component.validatorRoutingService.complaintRouterData.transactionTraceId?.toString();
      const itTicketResponse: ItTicketResponse = new ItTicketResponse().fromJsonToObject(ItTicketResponse);
      bpmUpdateRequest.itsmNumber = itTicketResponse.incidentNumber;
      spyOn(component.modalRef, 'hide');
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component.workflowService, 'raiseItTicket').and.returnValue(
        of(bindToObject(new ItTicketResponse(), ItTicketResponse))
      );
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(
        of(bindToObject(new BPMUpdateRequest(), ComplaintRequestTest))
      );
      component.confirmEvent();
      expect(component.raiseItForm).not.toEqual(null);
      expect(component.raiseItForm.valid).toBeTruthy();
      expect(component.raiseItForm.value).not.toEqual(null);
      expect(request.ticketNotes).not.toEqual(null);
      expect(request.ticketSummary).not.toEqual(null);
      expect(bpmUpdateRequest).toBeDefined();
      expect(bpmUpdateRequest.referenceNo).toBeDefined();
      expect(bpmUpdateRequest.taskId).toBeDefined();
      expect(bpmUpdateRequest.user).toBeDefined();
      expect(bpmUpdateRequest.outcome).not.toEqual(null);
      expect(component.validatorRoutingService).toBeDefined();
      expect(component.validatorRoutingService.complaintRouterData).toBeDefined();
      expect(itTicketResponse).not.toEqual(null);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  it('should throw error', () => {
    component.modalRef = new BsModalRef();
    component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
    const forms = new ContactForms();
    component.raiseItForm = forms.ItTicketForm();
    component.raiseItForm.updateValueAndValidity();
    component.raiseItForm.get('itsmForm').get('note').setValue('note');
    component.raiseItForm.get('itsmForm').get('reason').setValue('summary');
    const request: ItTicketRequest = new ItTicketRequest();
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = component.validatorRoutingService.complaintRouterData.taskId;
    bpmUpdateRequest.user = component.validatorRoutingService.complaintRouterData.assigneeId;
    bpmUpdateRequest.outcome = WorkFlowActions.REQUEST_ITSM;
    bpmUpdateRequest.referenceNo = component.validatorRoutingService.complaintRouterData.transactionTraceId?.toString();
    const itTicketResponse: ItTicketResponse = new ItTicketResponse().fromJsonToObject(ItTicketResponse);
    bpmUpdateRequest.itsmNumber = itTicketResponse.incidentNumber;
    spyOn(component.alertService, 'clearAlerts').and.callThrough();
    spyOn(component.workflowService, 'raiseItTicket').and.returnValue(
      of(bindToObject(new ItTicketResponse(), ItTicketResponse))
    );

    spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(throwError(genericError));
    spyOn(component.modalRef, 'hide');
    spyOn(component.alertService, 'showError').and.callThrough();
    component.confirmEvent();
    expect(component.modalRef).not.toEqual(null);
    expect(component.raiseItForm).not.toEqual(null);
    expect(component.raiseItForm.valid).toBeTruthy();
    expect(component.raiseItForm.value).not.toEqual(null);
    expect(request.ticketNotes).not.toEqual(null);
    expect(request.ticketSummary).not.toEqual(null);
  });
  it('should confirm event', () => {
    component.modalRef = new BsModalRef();
    component.validatorRoutingService.complaintRouterData = new ComplaintRouterData(initializeRouterData);
    const forms = new ContactForms();
    component.raiseItForm = forms.ItTicketForm();
    component.raiseItForm.updateValueAndValidity();
    component.raiseItForm.get('itsmForm').get('note').setValue('note');
    component.raiseItForm.get('itsmForm').get('reason').setValue('summary');
    spyOn(component.modalRef, 'hide');
    spyOn(component.alertService, 'clearAlerts').and.callThrough();
    spyOn(component.workflowService, 'raiseItTicket').and.returnValue(throwError(genericError));
    component.confirmEvent();
    expect(component.raiseItForm).not.toEqual(null);
    expect(component.raiseItForm.valid).toBeTruthy();
    expect(component.raiseItForm.value).not.toEqual(null);
    expect(component.validatorRoutingService).toBeDefined();
    expect(component.modalRef).not.toEqual(null);
  });
});
