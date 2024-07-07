import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdjustmentService,
  AdjustmentDetails,
  PaymentService,
  BeneficiaryList,
  BenefitDetails,
  Adjustment,
  PersonalInformation,
  AdjustmentRepaySetValues,
  AdjustmentRepayValidatorSetValues,
  RepaymentDetails,
  RepayItems,
  AdjustmentOtherPaymentResponse,
  RevertAdjustmentResponse,
  AnnuityResponseDto,
  AdjustmentDocumentService
} from '../../../shared';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { activeAdjustments, benefits, adjustmentModificationById } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  BilingualText,
  Alert,
  ApplicationTypeToken,
  LanguageToken,
  Lov,
  DocumentItem,
  GosiCalendar,
  UuidGeneratorService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock
} from 'testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';

import { AdjustmentPaymentMethodScComponent } from './adjustment-payment-method-sc.component';

describe('AdjustmentPaymentMethodScComponent', () => {
  let component: AdjustmentPaymentMethodScComponent;
  let fixture: ComponentFixture<AdjustmentPaymentMethodScComponent>;

  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getBeneficiaryList',
    'adjustmentDetails',
    'getAdjustmentByeligible',
    'setPageName',
    'getPerson',
    'getAdjustByDetail',
    'getAdjustmentRepayDetails',
    'getAdjustmentRepaymentValidatorDetails',
    'proceedToPay',
    'submitSadadPayment',
    'getReceiptMode',
    'getBankLovList',
    'getReqDocsForOtherPayment',
    'submitOtherPayment',
    'validatorModifysubmitOtherPayment',
    'updateAnnuityWorkflow',
    'revertAdjustmentRepayment'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.adjustmentDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  adjustmentServiceSpy.getAdjustmentByeligible.and.returnValue(of({ eligible: true }));
  adjustmentServiceSpy.getPerson.and.returnValue(
    of({
      ...new PersonalInformation(),
      fromJsonToObject: json => json,
      identity: [],
      nationality: { english: '', arabic: '' }
    })
  );
  adjustmentServiceSpy.getAdjustByDetail.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  adjustmentServiceSpy.getAdjustmentRepayDetails.and.returnValue({
    ...new AdjustmentRepaySetValues(1234, 1234, 1234, 1234),
    personId: 1234,
    adjustmentRepayId: 1234,
    referenceNo: 1234,
    totalAmountToBePaid: 1234
  });
  adjustmentServiceSpy.getAdjustmentRepaymentValidatorDetails.and.returnValue(
    new AdjustmentRepayValidatorSetValues(1234, [new RepayItems()], new RepaymentDetails(), 1234, 1234)
  );
  adjustmentServiceSpy.proceedToPay.and.returnValue(
    of({ adjustmentRepayId: 1234, message: { english: '', arabic: '' }, referenceNo: 1234 })
  );
  adjustmentServiceSpy.submitSadadPayment.and.returnValue(
    of({ adjustmentRepayId: 1234, message: { english: '', arabic: '' }, referenceNo: 1234 })
  );
  adjustmentServiceSpy.getReceiptMode.and.returnValue(of([new Lov()]));
  adjustmentServiceSpy.getBankLovList.and.returnValue(of([new Lov()]));
  adjustmentServiceSpy.getReqDocsForOtherPayment.and.returnValue(of([new DocumentItem()]));
  adjustmentServiceSpy.submitOtherPayment.and.returnValue(
    of({ ...new AdjustmentOtherPaymentResponse(), message: { english: '', arabic: '' } })
  );
  adjustmentServiceSpy.validatorModifysubmitOtherPayment.and.returnValue(of(new AdjustmentOtherPaymentResponse()));
  adjustmentServiceSpy.updateAnnuityWorkflow.and.returnValue(of({}));
  adjustmentServiceSpy.revertAdjustmentRepayment.and.returnValue(
    of({ ...new RevertAdjustmentResponse(), message: { english: '', arabic: '' } })
  );
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', [
    'getAdjustByDetail',
    'getActiveBenefitDetails',
    'setIsUserSubmitted',
    'navigateToInbox'
  ]);
  paymentServiceSpy.getAdjustByDetail.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  paymentServiceSpy.getActiveBenefitDetails.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      nin: 1234,
      benefitType: { english: 'Pension', arabic: 'Pension' },
      enabledRestoration: true
    })
  );
  const adjustmentDocumentServiceSpy = jasmine.createSpyObj<AdjustmentDocumentService>('AdjustmentDocumentService', [
    'getUploadedDocuments'
  ]);
  adjustmentDocumentServiceSpy.getUploadedDocuments.and.returnValue(of({}));
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ id: 1600765 });
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
  const uuidGeneratorServiceSpy = jasmine.createSpyObj<UuidGeneratorService>('UuidGeneratorService', ['getUuid']);
  uuidGeneratorServiceSpy.getUuid.and.returnValue('');
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
        { provide: AdjustmentDocumentService, useValue: adjustmentDocumentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), payload: JSON.stringify(payload), taskId: '', assigneeId: '', comments: '' }
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        { provide: Router, useValue: routerSpy },
        { provide: UuidGeneratorService, useValue: uuidGeneratorServiceSpy }
      ],
      declarations: [AdjustmentPaymentMethodScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentPaymentMethodScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('paymentTypeChange', () => {
    it('should sadad', () => {
      const paymentType = 'sadad';
      component.paymentTypeChange(paymentType);
      expect(component.paymentType).toEqual('sadad');
    });
    it('should other', () => {
      const paymentType = 'other';
      component.paymentTypeChange(paymentType);
      expect(component.paymentType).toEqual('other');
    });
  });
  it('should getBenefitDetails', () => {
    component.totalAmountToBePaid = 1234;
    component.getBenefitDetails(1234, 1234, 1234);
    expect(component.appledBenefitDetails).not.toEqual(null);
  });
  it('should sadadProceedTopay', () => {
    component.sadadProceedTopay({
      paymentMethod: { english: '', arabic: '' },
      transactionDate: new GosiCalendar(),
      referenceNo: 1234
    });
    expect(component.referenceNumber).toEqual(1234);
  });
  it('should sadadPaymentSubmit', () => {
    component.referenceNumber = 1234;
    component.sadadPaymentForm = new FormGroup({ transactionDate: new FormControl({ value: new GosiCalendar() }) });
    component.sadadPaymentSubmit();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getLookupValues', () => {
    component.getLookupValues();
    expect(component.receiptModesFiltered$).not.toEqual(null);
    expect(component.saudiBankListSorted).not.toEqual(null);
  });
  it('should getDocumentRelatedValues', () => {
    component.getDocumentRelatedValues();
    expect(component.otherPaymentReqDocument).not.toEqual(null);
  });
  it('should getUploadedDocuments', () => {
    component.channel = 'field-office';
    component.adjustmentRepayId = 1234;
    component.getUploadedDocuments();
    expect(component.otherPaymentReqDocument).not.toEqual(null);
  });
  it('should submitOtherPaymentDetails', () => {
    component.inEditMode = false;
    component.totalAmountToBePaid = 1234;
    component.referenceNumber = 1234;
    component.personId = 1234;
    component.adjustmentRepayId = 1234;
    component.receiveContributionMainForm = new FormGroup({
      repaymentDetails: new FormGroup({
        amountTransferred: new FormGroup({ amount: new FormControl({ value: 1234 }) }),
        comments: new FormControl({ value: '' }),
        additionalPaymentDetails: new FormControl({ value: '' }),
        bankName: new FormControl({ value: '' }),
        paymentReferenceNo: new FormControl({ value: '1234' }),
        transactionDate: new FormControl({ value: new GosiCalendar() })
      }),
      receiptMode: new FormGroup({ receiptMode: new FormControl({ value: '' }) })
    });
    component.submitOtherPaymentDetails();
    expect(component.returnPaymentResponse).not.toEqual(null);
  });
  it('should saveWorkflowInEdit', () => {
    component.role = 'Validator1';
    component.receiveContributionMainForm = new FormGroup({
      repaymentDetails: new FormGroup({
        comments: new FormControl({ value: '' })
      })
    });
    component.saveWorkflowInEdit();
    expect(component.paymentService.navigateToInbox).toBeDefined();
  });
  it('should refreshDocument', () => {
    component.adjustmentRepayId = 1234;
    component.referenceNumber = 1234;
    component.documentuuid = '';
    component.refreshDocument({
      ...new DocumentItem(),
      fromJsonToObject: json => json,
      name: { english: '', arabic: '' }
    });
  });
  it('should getActiveBenefitDetails', () => {
    component.getActiveBenefitDetails(1234, 1234, 1234);
    expect(component.paymentType).toEqual('sadad');
  });
  it('should initialiseViewForEdit', () => {
    component.initialiseViewForEdit(payload);
    expect(component.adjustmentRepayId).toEqual(1234);
  });
  it('should cancelForm in Edit Mode', () => {
    component.inEditMode = true;
    component.cancelForm();
    expect(component.paymentService.navigateToInbox).toBeDefined();
  });
  it('should cancelForm', () => {
    spyOn(component, 'callRevertAdjustmentAPI');
    component.inEditMode = false;
    component.cancelForm();
    expect(component.callRevertAdjustmentAPI).toHaveBeenCalled();
  });
  it('should callRevertAdjustmentAPI', () => {
    component.personId = component.adjustmentRepayId = 1234;
    component.referenceNumber = 1234;
    component.callRevertAdjustmentAPI();
    expect(component.revertAdjustmentResponse).not.toEqual(null);
  });
  it('should routeBack', () => {
    component.routeBack();
    expect(component.routeBack).toBeDefined();
  });
  it('should show error message', () => {
    spyOn(component.alertService, 'showError');
    component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  it('should hide  popups', () => {
    spyOn(component, 'callRevertAdjustmentAPI');
    component.commonModalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.commonModalRef).not.toEqual(null);
    expect(component.callRevertAdjustmentAPI).toHaveBeenCalled();
  });
  it('should show popUp', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.popUp(modalRef);
    expect(component.popUp).toBeDefined();
  });
  it('should goToPrevAction', () => {
    component.goToPrevAction();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
