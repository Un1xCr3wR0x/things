/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  ExchangeRateService,
  LookupService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  bindToObject,
  TransactionReferenceData
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { AlertServiceStub, DocumentServiceStub, genericError, LookupServiceStub, ModalServiceStub } from 'testing';
import { EventDateServiceStub, ExchangeRateServiceStub, WorkflowServiceStub } from 'testing/mock-services';
import { EventDateService } from '../../../../shared/services';
import { ValidateMaintainEventDateScComponent } from './validate-maintain-event-date-sc.component';

describe('ValidateMaintainEventDateScComponent', () => {
  let component: ValidateMaintainEventDateScComponent;
  let fixture: ComponentFixture<ValidateMaintainEventDateScComponent>;
  const payloadData = { referenceNo: 100, registrationNo: 200085744, assignedRole: 'Validator 1' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidateMaintainEventDateScComponent],
      providers: [
        FormBuilder,
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: EventDateService,
          useClass: EventDateServiceStub
        },

        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: RouterDataToken,
          useValue: {
            ...bindToObject(new RouterData(), {
              comments: [new TransactionReferenceData()],
              taskId: 101,
              transactionId: 665896,
              assigneeId: 'Karthik',
              resourceType: 'maintain-event-date'
            }),
            payload: JSON.stringify(payloadData)
          }
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateMaintainEventDateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('rejectTransaction', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.eventDateValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.eventDateValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.eventDateValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.returnTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm approve transaction', () => {
    it('should confirm the approval of transaction', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component, 'navigateToInbox').and.callThrough();
      component.confirmApprove();
      expect(component.modalRef).not.toEqual(null);
    });
    it('should throw error on approve', () => {
      spyOn(component.eventDateValidatorService, 'approveEventDate').and.returnValue(throwError(genericError));
      component.modalRef = new BsModalRef();
      spyOn(component, 'navigateToInbox');
      component.confirmApprove();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm return transaction', () => {
    it('should confirm the return of transaction', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component, 'navigateToInbox').and.callThrough();
      component.confirmReturn();
      expect(component.modalRef).not.toEqual(null);
    });
    it('should throw error on return', () => {
      spyOn(component.eventDateValidatorService, 'returnEventDate').and.returnValue(throwError(genericError));
      component.modalRef = new BsModalRef();
      spyOn(component, 'navigateToInbox');
      component.confirmReturn();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('gerDataForView', () => {
    it('should get data for view', () => {
      spyOn(component.eventDateValidatorService, 'getEventDetails').and.callThrough();
      component.getDataForView();
      expect(component.eventDateValidatorService.getEventDetails).toHaveBeenCalled();
    });
  });
  describe('gerDataForView', () => {
    it('should get data for view', () => {
      spyOn(component, 'handleError');
      spyOn(component.eventDateValidatorService, 'getEventDetails').and.returnValue(throwError(genericError));
      component.getDataForView();
      expect(component.handleError).toHaveBeenCalled();
    });
  });
  describe('handleErrors', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError').and.callThrough();
      component.handleError(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('confirmReject', () => {
    it('should reject event date', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component.router, 'navigate');
      spyOn(component.eventDateValidatorService, 'rejectEventDate').and.callThrough();
      component.confirmReject();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirmReject', () => {
    it('should reject event date error', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showError').and.callThrough();
      spyOn(component.eventDateValidatorService, 'rejectEventDate').and.returnValue(throwError(genericError));
      component.confirmReject();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('intialise The View', () => {
    it('should initialise the view ', () => {
      spyOn(component, 'bindDataToForm');
      component.initialiseTheView(new RouterData());
      expect(component.bindDataToForm).toHaveBeenCalled();
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateToInbox('Success');
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    it('should confirm cancel', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
});

function getForm() {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    taskId: [null],
    user: [null],
    type: [null]
  });
}
