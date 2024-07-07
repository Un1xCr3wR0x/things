import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdjustmentService,
  AdjustmentDetails,
  SaveAdjustmentResponse,
  Adjustment,
  AdjustmentRepay,
  BenefitDetails
} from '../../../shared';
import { of, BehaviorSubject } from 'rxjs';
import { activeAdjustments } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  ApplicationTypeToken,
  CoreAdjustmentService,
  LanguageToken
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock,
  ActivatedRouteStub
} from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PayAdjustmentScComponent } from './pay-adjustment-sc.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AdjustmentRepaySetItems } from '../../../shared';

describe('PayAdjustmentScComponent', () => {
  let component: PayAdjustmentScComponent;
  let fixture: ComponentFixture<PayAdjustmentScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getActiveDebitAdjustments',
    'getPageName',
    'getAdjustmentRepayItems',
    'saveAndNextAdjustmentsRepay',
    'setAdjustmentRepayDetails',
    'setAdjustmentRepayItems',
    'getSourceId',
    'setPageName'
  ]);
  adjustmentServiceSpy.getActiveDebitAdjustments.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  adjustmentServiceSpy.getPageName.and.returnValue('');
  adjustmentServiceSpy.getAdjustmentRepayItems.and.returnValue({
    ...new AdjustmentRepaySetItems(),
    totalAmount: 1234,
    repayItems: [{ ...new AdjustmentRepay(), adjustmentAmount: 1234 }]
  });
  adjustmentServiceSpy.saveAndNextAdjustmentsRepay.and.returnValue(
    of({ ...new SaveAdjustmentResponse(), adjustmentRepayId: 1234, referenceNo: 1234 })
  );
  adjustmentServiceSpy.getSourceId.and.returnValue([{ ...new BenefitDetails(), sourceId: 1234 }]);

  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), FormsModule, ReactiveFormsModule],
      declarations: [PayAdjustmentScComponent, BilingualTextPipeMock, NumToPositiveTextPipeMock],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getActiveAdjustments ', () => {
    component.identifier = 200085744;
    spyOn(component, 'createAmtRefundedForm').and.callThrough();
    spyOn(component, 'setAmountToBePaid').and.callThrough();
    component.adjDtlsForm = new FormGroup({
      totalAmountToBePaid: new FormControl({ value: 1234 }),
      amountToBePaid: new FormArray([])
    });
    component.getActiveAdjustments();
    expect(component.adjustmentsDetails).not.toEqual(null);
  });
  it('should createAmtRefundedForm', () => {
    expect(component.createAmtRefundedForm()).not.toEqual(null);
  });
  it('should amountToBePaid', () => {
    component.adjDtlsForm = new FormGroup({
      totalAmountToBePaid: new FormControl({ value: 1234 }),
      amountToBePaid: new FormArray([])
    });
    expect(component.amountToBePaid).not.toEqual(null);
  });
  it('should setAmountToBePaid', () => {
    component.adjustmentsDetails = {
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), adjustmentBalance: 1234 }]
    };
    component.setAmountToBePaid();
    expect(component.amountToBePaid).not.toEqual(null);
  });
  it('should onTotalAmountEntered', () => {
    component.adjustmentsDetails = {
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), adjustmentBalance: 1234 }]
    };
    component.adjDtlsForm = new FormGroup({
      totalAmountToBePaid: new FormControl({ value: 12345 }),
      amountToBePaid: new FormArray([])
    });
    component.amountToBePaid.push(new FormGroup({ adjustmentAmount: new FormControl({ value: 1234 }) }));
    component.onTotalAmountEntered();
    expect(component.totalAmountToBePaid).not.toEqual(null);
  });
  it('should onAmountToBePaid', () => {
    component.amountToBePaid.push(new FormGroup({ adjustmentAmount: new FormControl({ value: 1234 }) }));
    component.adjDtlsForm = new FormGroup({
      totalAmountToBePaid: new FormControl({ value: 1234 }),
      amountToBePaid: new FormArray([])
    });
    component.onAmountToBePaid();
    expect(component.totalAmountToBePaid).not.toEqual(null);
  });
  it('should initializeWizard', () => {
    component.initializeWizard();
    expect(component.adjustmentWizards).not.toEqual(null);
  });
  describe('selectWizard ', () => {
    it('Should clear all alerts and set current tab ', () => {
      component.currentTab = 0;
      component.selectedWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('popUp', () => {
    it('should popUp modal', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('navigateToPaymentMethod', () => {
    it('should navigateToPaymentMethod', () => {
      component.identifier = 1234;
      component.amountToBePaid.push(new FormGroup({ adjustmentAmount: new FormControl({ value: '1234' }) }));
      console.log(component.amountToBePaid);
      component.adjDtlsForm = new FormGroup({
        totalAmountToBePaid: new FormControl({ value: 1234 }),
        amountToBePaid: new FormArray([new FormGroup({ adjustmentAmount: new FormControl({ value: '1234' }) })])
      });
      component.adjustmentsDetails = {
        ...new AdjustmentDetails(),
        adjustments: [
          { ...new Adjustment(), adjustmentBalance: 1234, adjustmentId: 123, benefitType: { english: '', arabic: '' } }
        ]
      };
      component.navigateToPaymentMethod();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    it('should confirmCancel', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('Hide Modals', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.modalRef).not.toEqual(null);
    });
  });
});
