import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateInstallmentScComponent } from './validate-installment-sc.component';
import {
  DocumentService,
  RouterDataToken,
  RouterData,
  AlertService,
  bindToObject,
  TransactionReferenceData,
  BPMUpdateRequest,
  RouterConstants
} from '@gosi-ui/core';
import {
  DocumentServiceStub,
  InstallmentStub,
  ModalServiceStub,
  BillingRoutingServiceStub,
  AlertServiceStub,
  BillEstablishmentServiceStub,
  routerTestdata,
  genericError
} from 'testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InstallmentService, BillingRoutingService, EstablishmentService } from '../../../../shared/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InstallmentGuaranteeDetails } from '../../../../shared/models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { throwError } from 'rxjs';

describe('ValidateInstallmentScComponent', () => {
  let component: ValidateInstallmentScComponent;
  let fixture: ComponentFixture<ValidateInstallmentScComponent>;
  const payloadData = { installmentId: 1001, referenceNo: 100, registrationNo: 200085744, assignedRole: 'Validator 1' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ValidateInstallmentScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        {
          provide: InstallmentService,
          useClass: InstallmentStub
        },
        {
          provide: RouterDataToken,
          useValue: {
            ...bindToObject(new RouterData(), { comments: [new TransactionReferenceData()] }),
            payload: JSON.stringify(payloadData)
          }
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateInstallmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handleErrors', () => {
    component.showErrors({ error: { message: { english: '', arabic: '' } } });
  });
  it('should getDocParameter if not out of market', () => {
    component.outOfMarket = false;
    component.installmentSubmittedDetails.guaranteeDetail = [
      bindToObject(new InstallmentGuaranteeDetails(), { category: { english: 'Bank Guarantee', arabic: '' } }),
      bindToObject(new InstallmentGuaranteeDetails(), { category: { english: 'Promissory Note', arabic: '' } }),
      bindToObject(new InstallmentGuaranteeDetails(), { category: { english: 'Pension', arabic: '' } }),
      bindToObject(new InstallmentGuaranteeDetails(), {
        category: { english: 'Other', arabic: '' },
        type: { english: 'No Guarantee', arabic: '' }
      }),
      bindToObject(new InstallmentGuaranteeDetails(), {
        category: { english: 'Other', arabic: '' },
        type: { english: 'Establishment owner is on a job', arabic: '' }
      }),
      bindToObject(new InstallmentGuaranteeDetails(), {
        category: { english: 'Other', arabic: '' },
        type: { english: 'Deceased / no source of income', arabic: '' }
      })
    ];
    component.getDocParameter();
  });
  it('should getDocParameter if out of market', () => {
    component.outOfMarket = true;
    component.installmentSubmittedDetails.guaranteeDetail = [
      bindToObject(new InstallmentGuaranteeDetails(), { category: { english: 'Pension', arabic: '' } }),
      bindToObject(new InstallmentGuaranteeDetails(), {
        category: { english: 'Other', arabic: '' },
        type: { english: 'Establishment owner is on a job', arabic: '' }
      }),
      bindToObject(new InstallmentGuaranteeDetails(), {
        category: { english: 'Other', arabic: '' },
        type: { english: 'Deceased / no source of income', arabic: '' }
      })
    ];
    component.getDocParameter();
  });
  it('should navigateToEdit', () => {
    component.navigateToEdit();
  });
  it('should getKeysFromTokens', () => {
    component.getKeysFromTokens();
  });
  it('should getScannedDocuments', () => {
    component.getScannedDocuments();
    expect(component.documents).not.toEqual(null);
  });
  xit('should confirmInstallmentDetails', () => {
    component.modalRef = new BsModalRef();
    component.confirmInstallmentDetails();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should hideModal', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should getInstallmentSuccessMessage', () => {
    expect(component.getInstallmentSuccessMessage(TransactionOutcome.REJECT)).toEqual(
      BillingConstants.TRANSACTION_REJECTED
    );
  });
  it('should getInstallmentSuccessMessage', () => {
    expect(component.getInstallmentSuccessMessage(TransactionOutcome.APPROVE)).toEqual(
      BillingConstants.TRANSACTION_APPROVED
    );
  });
  it('should getInstallmentSuccessMessage', () => {
    expect(component.getInstallmentSuccessMessage(TransactionOutcome.RETURN)).toEqual(
      BillingConstants.TRANSACTION_RETURNED
    );
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowDataForCreditTransfer('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    component.saveWorkflowForCreditTransfer(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowDataForCreditTransfer('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  it('should save the workflow details', () => {
    component.installmentDetailsForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    component.approveInstallmentDetails();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  it('should return the workflow details', () => {
    component.installmentDetailsForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    component.returnInstallmentDetails();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.installmentDetailsForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    spyOn(component, 'hideModal');
    component.rejectInstallmentDetails();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showCancelModal(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'hideModal');
      component.confirmInstallmentDetails();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigateToInbox', () => {
    it('Should navigate to Inbox', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateToInbox();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
});
