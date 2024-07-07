import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidatorPaymentScComponent } from './validator-payment-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentService, MiscellaneousPaymentRequest } from '../../../shared';
import { of, BehaviorSubject } from 'rxjs';
import { paymentDetail } from '../../../shared/test-data/payment';
import {
  LanguageToken,
  LookupService,
  LovList,
  Role,
  BPMUpdateRequest,
  WorkFlowActions,
  DocumentItem
} from '@gosi-ui/core';
import { AlertService, DocumentService, RouterDataToken, RouterData } from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  LookupServiceStub
} from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ValidatorPaymentScComponent', () => {
  let component: ValidatorPaymentScComponent;
  let fixture: ComponentFixture<ValidatorPaymentScComponent>;
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', [
    'validatorDetails',
    'getPaymentRejectReasonList',
    'getPaymentReturnReasonList'
  ]);
  paymentServiceSpy.validatorDetails.and.returnValue(of({ ...new MiscellaneousPaymentRequest(), ...paymentDetail }));
  paymentServiceSpy.getPaymentRejectReasonList.and.returnValue(of(<LovList>new LovList([])));
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(<LovList>new LovList([])));

  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'validator' });
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ValidatorPaymentScComponent],
      providers: [
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        FormBuilder,
        {
          provide: Router,
          useValue: routerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialiseView', () => {
    it('should initialiseView', () => {
      const payload = {
        registrationNo: 1234,
        socialInsuranceNo: 1234,
        identifier: 1034681524,
        id: 1234,
        transactionNumber: 1000045428,
        taskId: 123456,
        miscPaymentId: 502351234,
        resource: '',
        referenceNo: 1234,
        channel: 'FIELD-OFFICE',
        user: 'avijit',
        assignedRole: 'Validator 1'
      };
      component.initialiseView({
        ...new RouterData(),
        payload: JSON.stringify(payload),
        taskId: '',
        assigneeId: '',
        comments: ''
      });
      expect(component.registrationNo).toEqual(1234);
    });
  });
  describe('Show Modal', () => {
    it('should modal reference', () => {
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
  });
  describe('getValidatorDetailService', () => {
    it('should get getValidatorDetailService', () => {
      component.getValidatorDetailService();
      expect(component.validDetails).not.toEqual(null);
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
  });
  describe('confirmRejectPayment', () => {
    it('should confirmRejectPayment', () => {
      component.form = new FormGroup({});
      spyOn(component, 'saveWorkflow');
      spyOn(component, 'hideModal');
      spyOn(component, 'setWorkFlowMergeData');
      component.confirmRejectPayment();
      expect(component.saveWorkflow).toHaveBeenCalled();
    });
  });
  describe('returnPayment', () => {
    it('should returnPayment', () => {
      component.form = new FormGroup({});
      component.taskId = '';
      component.registrationNo = 1234;
      component.user = '';
      component.transactionNumber = 1234;
      spyOn(component, 'saveWorkflow');
      spyOn(component, 'hideModal');
      spyOn(component, 'setWorkFlowData').and.returnValue({ ...new BPMUpdateRequest(), outcome: '' });
      component.returnPayment();
      expect(component.saveWorkflow).toHaveBeenCalled();
    });
  });
  describe('confirmApprovePayment', () => {
    it('should confirmApprovePayment', () => {
      component.form = new FormGroup({});
      component.taskId = '';
      component.registrationNo = 1234;
      component.user = '';
      component.transactionNumber = 1234;
      spyOn(component, 'saveWorkflow');
      spyOn(component, 'hideModal');
      spyOn(component, 'setWorkFlowData').and.returnValue({ ...new BPMUpdateRequest(), outcome: '' });
      component.confirmApprovePayment();
      expect(component.saveWorkflow).toHaveBeenCalled();
    });
  });
  describe('getRequiredDocuments', () => {
    it('should getRequiredDocuments', () => {
      component.transactionId = '1234556';
      component.transactionType = '';
      component.getRequiredDocuments();
      expect(component.documents).not.toEqual(null);
    });
  });
  describe('should refreshDocument', () => {
    it('should refreshDocument', () => {
      component.miscPaymentId = 1234;
      component.transactionNumber = 1234;
      component.refreshDocument({
        ...new DocumentItem(),
        fromJsonToObject: json => json,
        name: { english: '', arabic: '' }
      });
    });
  });
  describe('navigateToEdit', () => {
    it('navigate to navigateToEdit', () => {
      component.navigateToEdit();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToContributorDetails', () => {
    it('navigate to navigateToContributorDetails', () => {
      component.navigateToContributorDetails();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
