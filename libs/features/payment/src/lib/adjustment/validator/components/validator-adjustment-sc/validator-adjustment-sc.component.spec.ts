import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ValidatorAdjustmentScComponent } from './validator-adjustment-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import {
  RouterDataToken,
  RouterData,
  AlertService,
  LanguageToken,
  DocumentService,
  bindToObject,
  Role,
  LovList,
  Lov,
  CoreAdjustmentService
} from '@gosi-ui/core';
import { AlertServiceStub, DocumentServiceStub, ModalServiceStub } from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AdjustmentService,
  AdjustmentDetails,
  PersonalInformation,
  Adjustment,
  PaymentService
} from '../../../../shared';
import { activeAdjustments, adjustmentModificationById } from '../../../../shared/test-data/adjustment';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

describe('ValidatorAdjustmentScComponent', () => {
  let component: ValidatorAdjustmentScComponent;
  let fixture: ComponentFixture<ValidatorAdjustmentScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'adjustmentValidator',
    'getAdjustmentsByStatus',
    'adjustmentValidatorPayment',
    'getPerson'
  ]);
  adjustmentServiceSpy.adjustmentValidator.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  adjustmentServiceSpy.adjustmentValidatorPayment.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getPerson.and.returnValue(
    of(bindToObject(new PersonalInformation(), adjustmentModificationById.person))
  );
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
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', [
    'getPaymentRejectReasonList',
    'getPaymentReturnReasonList'
  ]);
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidatorAdjustmentScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), payload: JSON.stringify(payload), taskId: '', assigneeId: '', comments: '' }
        },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
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
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();

      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/transactions/list/worklist']);
    });
    it('should setButtonPrivilege validator 1', () => {
      component.setButtonPrivilege(Role.VALIDATOR_1);
      expect(component.canReject).toBeTruthy();
    });

    it('should setButtonPrivilege for validator 2', () => {
      component.setButtonPrivilege(Role.VALIDATOR_2);
      expect(component.canReturn).toBeTruthy();
      expect(component.canReject).toBeTruthy();
    });

    it('should setButtonPrivilege for FC', () => {
      component.setButtonPrivilege('FC Approver');
      expect(component.canReturn).toBeTruthy();
    });
    it('should initialiseView', () => {
      component.initialiseView({
        ...new RouterData(),
        payload: JSON.stringify(payload),
        taskId: '',
        assigneeId: '',
        comments: ''
      });
      expect(component.registrationNo).toEqual(1234);
    });
    it('should navigateToBenefitDetails', () => {
      component.referenceNo = 1234;
      component.personId = 1234;
      component.navigateToBenefitDetails({
        benefitType: { english: '', arabic: '' },
        sin: 1234,
        benefitRequestId: 1234
      });
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should naviagteToAdjustmentView', () => {
      component.personId = 1234;
      component.naviagteToAdjustmentView({ adjustmentId: 1234, benefitType: { english: '', arabic: '' } });
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
