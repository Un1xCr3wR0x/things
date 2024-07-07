import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ValidatorBaseScComponent } from './validator-sc.base-component';
import {
  AlertService,
  RouterData,
  TransactionReferenceData,
  WorkFlowActions,
  BPMUpdateRequest,
  RouterDataToken,
  LanguageToken,
  DocumentService,
  LovList,
  Lov,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import { AdjustmentService, PaymentService } from '../../../shared';
import { Router } from '@angular/router';
import { AlertServiceStub, ModalServiceStub, DocumentServiceStub } from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'pmt-validator-sub',
  template: `<form><input type="text" /></form>`
})
export class ValidatorScSubComponent extends ValidatorBaseScComponent implements OnInit {
  childCompForm = new FormGroup({
    rejectionReason: new FormGroup({ english: new FormControl({ value: '' }) }),
    comments: new FormControl({ value: '' }),
    returnReason: new FormControl({ value: '' })
  });
  taskId = '2feee2222eeww';
  registrationNo = 123456789;
  user = 'Avjit';
  routerData = {
    ...new RouterData(),
    payload: JSON.stringify(payload),
    taskId: '',
    assigneeId: '',
    comments: [{ ...new TransactionReferenceData(), comments: '' }],
    fromJsonToObject: json => json
  };
  transactionNumber = 1234;
  constructor(
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly paymentService: PaymentService,
    readonly router: Router
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }
  ngOnInit() {}
  setWorkFlowDataBase() {
    this.setWorkFlowData(
      this.childCompForm,
      this.taskId,
      this.registrationNo,
      this.user,
      this.routerData,
      this.transactionNumber
    );
  }
  setWorkFlowMergeDataBase() {
    this.setWorkFlowMergeData(this.childCompForm, this.routerData, WorkFlowActions.REJECT);
  }
  saveWorkflowBase() {
    this.saveWorkflow(
      { ...new BPMUpdateRequest(), outcome: WorkFlowActions.APPROVE, assignedRole: 'Validator1' },
      true,
      { personId: 1234, adjustmentModificationId: 1234, initiatePayment: true }
    );
  }
  setWorkFlowDataForMergeBase() {
    this.setWorkFlowDataForMerge(this.routerData, this.childCompForm, WorkFlowActions.REJECT);
  }
}
const payload = {
  registrationNo: 1234,
  socialInsuranceNo: 1234,
  identifier: 1034681524,
  id: 1234,
  repayId: 1234,
  transactionNumber: 1000045428,
  taskId: 123456,
  miscPaymentId: 502351234,
  resource: '',
  referenceNo: 1234,
  channel: 'field-office',
  user: 'avijit',
  assignedRole: 'Validator 1',
  beneficiaryId: 1234,
  adjustmentRepayId: 1234
};

describe('ValidatorScSubComponent', () => {
  let component: ValidatorScSubComponent;
  let fixture: ComponentFixture<ValidatorScSubComponent>;
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', [
    'getPaymentRejectReasonList',
    'getPaymentReturnReasonList',
    'handleAnnuityWorkflowActions'
  ]);
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  paymentServiceSpy.handleAnnuityWorkflowActions.and.returnValue(of({}));
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', ['editDirectPayment']);
  adjustmentServiceSpy.editDirectPayment.and.returnValue(of({}));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), payload: JSON.stringify(payload), taskId: '', assigneeId: '', comments: '' }
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [ValidatorScSubComponent, ValidatorBaseScComponent]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorScSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialise', () => {
    component.setWorkFlowDataBase();
    component.setWorkFlowMergeDataBase();
    component.saveWorkflowBase();
    component.setWorkFlowDataForMergeBase();
  });
});
