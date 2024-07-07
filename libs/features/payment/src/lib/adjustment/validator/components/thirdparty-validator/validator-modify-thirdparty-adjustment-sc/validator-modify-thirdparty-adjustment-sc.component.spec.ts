import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ValidatorModifyThirdpartyAdjustmentScComponent } from './validator-modify-thirdparty-adjustment-sc.component';
import {
  AlertService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  bindToObject,
  CoreAdjustmentService
} from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LookupServiceStub, ModalServiceStub, AlertServiceStub, DocumentServiceStub } from 'testing';
import { DatePipe } from '@angular/common';
import {
  AdjustmentDetails,
  AdjustmentService,
  Adjustment,
  ThirdpartyAdjustmentService,
  PayeeDetails,
  BeneficiaryList
} from '../../../../../shared';
import { activeAdjustments, benefits } from '../../../../../shared/test-data/adjustment';
import { contributor } from '../../../../../shared/test-data/adjustment-repayment';
describe('ValidatorModifyThirdpartyAdjustmentScComponent', () => {
  let component: ValidatorModifyThirdpartyAdjustmentScComponent;
  let fixture: ComponentFixture<ValidatorModifyThirdpartyAdjustmentScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const payload = {
    registrationNo: 1234,
    socialInsuranceNo: 1234,
    identifier: 1034681524,
    id: 1234,
    PersonId: 1234,
    transactionNumber: 1000045428,
    taskId: 123456,
    miscPaymentId: 502351234,
    resource: '',
    referenceNo: 1234,
    channel: 'field-office',
    user: 'avijit',
    assignedRole: 'Validator 1',
    beneficiaryId: 1234,
    adjustmentModificationId: 1234
  };
  const routerDataValue = {
    ...new RouterData(),
    payload: JSON.stringify(payload),
    taskId: '',
    assigneeId: 'Avijit',
    assignedRole: 'Validator1',
    comments: [{ english: '', arabic: '' }]
  };
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  const referenceNumber = 1234;
  const adjustmentModificationId = 1234;
  const modifyTpaValidatorForm = new FormGroup({
    rejectionReason: new FormGroup({ english: new FormControl({ value: '' }), arabic: new FormControl({ value: '' }) }),
    comments: new FormControl({ value: '' })
  });
  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    [
      'getTpaAdjustmentsDetails',
      'getBeneficiaryDetails',
      'getThirdPartyAdjustmentValidatorDetails',
      'getValidatorPayeeDetails',
      'getPersonById'
    ]
  );
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments[0] }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(
    of({ ...new PayeeDetails(), iban: 'SA12345678' })
  );
  thirdPartyAdjustmentServiceSpy.getPersonById.and.returnValue(of(contributor));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ValidatorModifyThirdpartyAdjustmentScComponent],
      providers: [
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder,
        DatePipe,
        {
          provide: Router,
          useValue: routerSpy
        },
        { provide: RouterDataToken, useValue: routerDataValue },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorModifyThirdpartyAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should viewMaintainAdjustment', () => {
    component.viewMaintainAdjustment(new AdjustmentDetails());
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getPayLoadValues', () => {
    component.getPayLoadValues();
    expect(component.modificationId).not.toEqual(null);
  });
  it('should getLookupValue', () => {
    component.getLookupValue();
    expect(component.rejectReasonList).not.toEqual(null);
  });
  it('should getModifyTpaDocuments', () => {
    component.getModifyTpaDocuments(
      [
        { ...new Adjustment(), ...activeAdjustments.adjustments[0] },
        { ...new Adjustment(), ...activeAdjustments.adjustments[1] },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Stop',
            arabic: 'Stop'
          }
        },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Hold',
            arabic: 'Hold'
          }
        },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Reactivate',
            arabic: 'Reactivate'
          }
        }
      ],
      referenceNumber,
      adjustmentModificationId
    );
    expect(component.allDocuments).not.toEqual(null);
  });
  it('should getModifyTpaScreenHeaders', () => {
    component.getModifyTpaScreenHeaders();
    expect(component.validatorApproveHeading).not.toEqual(null);
  });
  it('should navigateToMaintainTpaEdit', () => {
    component.navigateToMaintainTpaEdit();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should showModals', () => {
    component.modalRef = new BsModalRef();
    const templateRef = { elementRef: null, createEmbeddedView: null };
    component.showModals(templateRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should hideModals', () => {
    component.modalRef = new BsModalRef();
    component.hideModals();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should modifyTpaApproval', () => {
    component.modifyTpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.modifyTpaApproval();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should modifyTpaApproval', () => {
    component.modifyTpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.modifyTpaApproval();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should modifyTpaReturn', () => {
    component.modifyTpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.modifyTpaReturn();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should modifyTpaReject', () => {
    component.modifyTpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.modifyTpaReject();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should confirmCancel', () => {
    component.modalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should createTpaValidatorForm', () => {
    expect(component.createTpaValidatorForm()).not.toEqual(null);
  });
  it('should navigateToAdjustmentDetail', () => {
    component.navigateToAdjustmentDetail(1234);
    component.personId = payload.PersonId;
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getAdjustmentValidator', () => {
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.referenceNumber = referenceNumber;
    component.getAdjustmentValidator();
    expect(component.benefitList).not.toEqual(null);
  });
  it('should navigateOnLinkClick', () => {
    component.sin = payload.socialInsuranceNo;
    component.navigateOnLinkClick();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getContributor', () => {
    component.personId = payload.PersonId;
    component.getContributor();
    expect(component.sin).not.toEqual(null);
  });
  it('should navigateToBenefitViewPage', () => {
    component.personId = payload.PersonId;
    component.navigateToBenefitViewPage({ english: '', arabic: '' });
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
