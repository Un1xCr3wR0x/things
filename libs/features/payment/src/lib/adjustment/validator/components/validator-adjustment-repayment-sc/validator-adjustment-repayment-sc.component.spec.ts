import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  RouterDataToken,
  RouterData,
  AlertService,
  LanguageToken,
  DocumentService,
  bindToObject,
  Role,
  Lov,
  LovList,
  DocumentItem
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock
} from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AdjustmentService,
  AdjustmentDetails,
  PersonalInformation,
  Adjustment,
  BeneficiaryList,
  PaymentService,
  AdjustmentRepaymentValidator,
  RepaymentDetails,
  AdjustmentContributorDetails
} from '../../../../shared';
import { activeAdjustments, adjustmentModificationById, benefits } from '../../../../shared/test-data/adjustment';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ValidatorAdjustmentRepaymentScComponent } from './validator-adjustment-repayment-sc.component';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Router } from '@angular/router';

describe('ValidatorAdjustmentRepaymentScComponent', () => {
  let component: ValidatorAdjustmentRepaymentScComponent;
  let fixture: ComponentFixture<ValidatorAdjustmentRepaymentScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getBeneficiaryList',
    'getadjustmentBYId',
    'getAdjustmentByeligible',
    'getRejectReasonList',
    'getReturnReasonList',
    'getAdjustmentRepaymentValidator',
    'setAdjustmentRepaymentValidatorDetails'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.getadjustmentBYId.and.returnValue(
    of({ ...new Adjustment(), adjustments: activeAdjustments.adjustments[0] })
  );
  adjustmentServiceSpy.getAdjustmentByeligible.and.returnValue(of({ eligible: true }));
  adjustmentServiceSpy.getRejectReasonList.and.returnValue(of(new LovList([new Lov()])));
  adjustmentServiceSpy.getReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  adjustmentServiceSpy.getAdjustmentRepaymentValidator.and.returnValue(
    of({
      ...new AdjustmentRepaymentValidator(),
      repaymentDetails: {
        ...new RepaymentDetails(),
        paymentMethod: { english: 'SADAD', arabic: '' },
        receiptMode: { english: 'Account Transfer', arabic: '' }
      },
      contributor: { ...new AdjustmentContributorDetails(), identity: [{ idType: 'IQAMA', iqamaNo: 1234 }] }
    })
  );
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', ['getAdjustByDetail']);
  paymentServiceSpy.getAdjustByDetail.and.returnValue(of(bindToObject(new AdjustmentDetails(), activeAdjustments)));
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ adjustmentId: 1600765 });
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder,
        DatePipe,
        { provide: Router, useValue: routerSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), payload: JSON.stringify(payload), taskId: '', assigneeId: '', comments: '' }
        }
      ],
      declarations: [ValidatorAdjustmentRepaymentScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorAdjustmentRepaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should canValidatorCanEditPayment', () => {
    component.adjustmentRepayDetails = {
      ...new AdjustmentRepaymentValidator(),
      repaymentDetails: { ...new RepaymentDetails(), receiptMode: { english: 'Account Transfer', arabic: '' } }
    };
    component.canValidatorCanEditPayment();
    expect(component.isValidatorCanEditPayment).toEqual(true);
  });
  it('should navigateToEdit', () => {
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getRequiredDocuments', () => {
    component.adjustmentId = '1234';
    component.adjustmentType = '';
    component.getRequiredDocuments();
  });
  it('should refreshDocument', () => {
    component.adjustmentRepayId = 1234;
    component.referenceNo = 1234;
    component.adjustmentId = '1234';
    component.adjustmentType = '';
    component.refreshDocument({
      ...new DocumentItem(),
      fromJsonToObject: json => json,
      name: { english: 'Benefit Application Form', arabic: '' },
      documentContent: '',
      contentId: ''
    });
    expect(component.isDocuments).toEqual(true);
  });
  it('should ConfirmApproveAdjustmentRepayment', () => {
    spyOn(component, 'confirmApprovePayment');
    component.ConfirmApproveAdjustmentRepayment();
    expect(component.confirmApprovePayment).toHaveBeenCalled();
  });
  it('should ConfirmRejectAdjustmentRepayment', () => {
    spyOn(component, 'confirmRejectPayment');
    component.ConfirmRejectAdjustmentRepayment();
    expect(component.confirmRejectPayment).toHaveBeenCalled();
  });
  it('should ConfirmReturnAdjustmentRepayment', () => {
    spyOn(component, 'returnPayment');
    component.ConfirmReturnAdjustmentRepayment();
    expect(component.returnPayment).toHaveBeenCalled();
  });
});
