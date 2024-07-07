import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { LanguageToken, LookupService } from '@gosi-ui/core';
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
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ValidatorThirdpartyAdjustmentScComponent } from './validator-thirdparty-adjustment-sc.component';
import {
  AdjustmentDetails,
  AdjustmentService,
  Adjustment,
  ThirdpartyAdjustmentService,
  PayeeDetails
} from '../../../../../shared';
import { activeAdjustments, benefits } from '../../../../../shared/test-data/adjustment';
import { contributor } from '../../../../../shared/test-data/adjustment-repayment';

describe('ValidatorThirdpartyAdjustmentScComponent', () => {
  let component: ValidatorThirdpartyAdjustmentScComponent;
  let fixture: ComponentFixture<ValidatorThirdpartyAdjustmentScComponent>;

  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'validator' });
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

  const beneficiaryId = 1234;
  const adjustmentModificationId = 1234;
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
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(of(benefits));
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments[0] }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(
    of({ ...new PayeeDetails(), iban: 'SA12345678' })
  );
  thirdPartyAdjustmentServiceSpy.getPersonById.and.returnValue(of(contributor));
  const modifyTpaValidatorForm = new FormGroup({
    rejectionReason: new FormGroup({ english: new FormControl({ value: '' }), arabic: new FormControl({ value: '' }) }),
    comments: new FormControl({ value: '' })
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ValidatorThirdpartyAdjustmentScComponent],
      providers: [
        { provide: RouterDataToken, useValue: routerDataValue },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: routerDataValue },
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
        },
        DatePipe,
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorThirdpartyAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('intialise the view', () => {
    it('should intialise the view for validator', () => {
      component.initialiseView();
      expect(component.modificationId).not.toEqual(null);
    });
  });
  it('should getContributor', () => {
    component.personId = payload.PersonId;
    component.getContributor();
    expect(component.sin).not.toEqual(null);
  });
  it('should fetchLookupVal', () => {
    component.fetchLookupVal();
    expect(component.rejectReasonList).not.toEqual(null);
  });
  it('should createForms', () => {
    expect(component.createForms()).not.toEqual(null);
  });
  it('should navigateToTpaEdit', () => {
    component.navigateToTpaEdit();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should confirmCancel', () => {
    component.modalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should confirmApproveTpAdjustment', () => {
    component.tpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.confirmApproveTpAdjustment();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should confirmReturnTpAdjustment', () => {
    component.tpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.confirmReturnTpAdjustment();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should confirmRejectTpAdjustment', () => {
    component.tpaValidatorForm = modifyTpaValidatorForm;
    component.taskId = `${payload.taskId}`;
    component.user = payload.user;
    component.personId = payload.PersonId;
    component.modificationId = payload.adjustmentModificationId;
    component.modalRef = new BsModalRef();
    component.confirmRejectTpAdjustment();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should showModal', () => {
    component.modalRef = new BsModalRef();
    const templateRef = { elementRef: null, createEmbeddedView: null };
    component.showModal(templateRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should hideModal', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should navigatetoBenefitDetailsView', () => {
    component.navigatetoBenefitDetailsView();
  });
  it('should getRequiredTpaDocuments', () => {
    component.modificationId = adjustmentModificationId;
    component.getRequiredTpaDocuments(1234);
    expect(component.documents).not.toEqual(null);
  });
  it('should getTpaScreenHeaders', () => {
    component.getTpaScreenHeaders();
    expect(component.approveHeading).not.toEqual(null);
  });
  it('should getValidatorView', () => {
    component.personId = payload.PersonId;
    component.modificationId = adjustmentModificationId;
    component.getValidatorView();
    expect(component.adjustmentValues).not.toEqual(null);
  });
  it('should getBenefitDetails', () => {
    component.beneficiaryId = beneficiaryId;
    component.getBenefitDetails(payload.PersonId);
    expect(component.benefitValues).not.toEqual(null);
  });
  it('should getValidatorPayeeDetails', () => {
    component.getValidatorPayeeDetails(1234);
    expect(component.payeeDetails).not.toEqual(null);
  });
  it('should navigateOnLinkClick', () => {
    component.sin = payload.socialInsuranceNo;
    component.navigateOnLinkClick();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should navigateToBenefitViewPage', () => {
    component.personId = payload.PersonId;
    component.navigateToBenefitViewPage({ english: '', arabic: '' });
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
