import { Component, OnInit, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import {
  bindAddFormValuesToAdjustmentModel,
  bindManageFormValuesToAdjustmentModel,
  checkForModification,
  createModifyTpaRequest,
  getTpaRequiredDocument
} from './manage-third-party-adjustment-helper';
import {
  PayeeDetails,
  Adjustment,
  AdjustmentModificationList,
  AdjustmentService,
  ThirdpartyAdjustmentService,
  PaymentService,
  AdjustmentDetails,
  BeneficiaryList
} from '../../../../shared';
import { ManageThirdPartyAdjustmentScComponent } from './manage-third-party-adjustment-sc.component';
import {
  DocumentService,
  DocumentItem,
  AlertService,
  LookupService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  DocumentServiceStub,
  documentItemData,
  ModalServiceStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  ActivatedRouteStub
} from 'testing';
import { activeAdjustments, benefits } from '../../../../shared/test-data/adjustment';
import { of } from 'rxjs';

@Component({
  selector: 'pmt-third-party-helper',
  template: `<form><input type="text" /></form>`
})
export class ManageThirdPartyHelperComponent extends ManageThirdPartyAdjustmentScComponent implements OnInit {
  form = new FormGroup({});
  adjustmentComponent: ManageThirdPartyAdjustmentScComponent;
  allDocuments = [{ ...new DocumentItem(), ...documentItemData, businessKey: 123, fromJsonToObject: json => json }];
  modificationList = [
    { ...new AdjustmentModificationList(), ...activeAdjustments.adjustments[0] },
    { ...new AdjustmentModificationList(), ...activeAdjustments.adjustments[1] },
    {
      ...new AdjustmentModificationList(),
      ...activeAdjustments.adjustments[1],
      actionType: {
        english: 'Stop',
        arabic: 'Stop'
      }
    },
    {
      ...new AdjustmentModificationList(),
      ...activeAdjustments.adjustments[1],
      actionType: {
        english: 'Hold',
        arabic: 'Hold'
      }
    },
    {
      ...new AdjustmentModificationList(),
      ...activeAdjustments.adjustments[1],
      actionType: {
        english: 'Reactivate',
        arabic: 'Reactivate'
      }
    }
  ];
  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly paymentService: PaymentService
  ) {
    super(
      alertService,
      lookupService,
      coreAdjustmentService,
      tpaService,
      router,
      modalService,
      documentService,
      routerDataToken,
      paymentService
    );
  }
  ngOnInit() {
    bindAddFormValuesToAdjustmentModel(this.form, {
      ...new PayeeDetails(),
      payeeId: 1234,
      payeeName: { english: '', arabic: '' }
    });
    bindManageFormValuesToAdjustmentModel(this.form, { ...new Adjustment(), monthlyDeductionAmount: 1234 });
    checkForModification(new Adjustment(), {
      ...new Adjustment(),
      monthlyDeductionAmount: 1234,
      adjustmentPercentage: 12,
      notes: '',
      holdAdjustmentReason: { english: '', arabic: '' },
      stopAdjustmentReason: { english: '', arabic: '' },
      reactivateAdjustmentReason: { english: '', arabic: '' },
      otherReason: ''
    });
    createModifyTpaRequest(
      this.form,
      {
        ...new Adjustment(),
        adjustmentId: 1234,
        adjustmentReason: { english: '', arabic: '' },
        requestedBy: { english: '', arabic: '' },
        monthlyDeductionAmount: 1234
      },
      {
        ...new Adjustment(),
        monthlyDeductionAmount: 1234,
        actionType: { english: 'Add', arabic: '' },
        adjustmentPercentage: 12,
        notes: '',
        holdAdjustmentReason: { english: '', arabic: '' },
        stopAdjustmentReason: { english: '', arabic: '' },
        reactivateAdjustmentReason: { english: '', arabic: '' },
        otherReason: ''
      }
    );
    getTpaRequiredDocument('', '', this.modificationList, 1234, this);
  }
}
describe('ManageThirdPartyHelperComponent', () => {
  let component: ManageThirdPartyHelperComponent;
  let fixture: ComponentFixture<ManageThirdPartyHelperComponent>;
  const saveAdjustmentResponse = {
    adjustmentModificationId: 1234,
    referenceNo: 1234,
    adjustmentRepayId: 1234
  };
  const helperForm = new FormGroup({
    maintainTpaForm: new FormGroup({
      manageType: new FormGroup({ english: new FormControl({ value: '' }), arabic: new FormControl({ value: '' }) }),
      reasonForHolding: new FormGroup({
        english: new FormControl({ value: '' }),
        arabic: new FormControl({ value: '' })
      }),
      newMonthlyDeductionAmount: new FormControl({ value: 1234 }),
      newDebitPercentage: new FormControl({ value: 1234 }),
      reasonForStopping: new FormGroup({
        english: new FormControl({ value: '' }),
        arabic: new FormControl({ value: '' })
      }),
      reasonForReactivating: new FormGroup({
        english: new FormControl({ value: '' }),
        arabic: new FormControl({ value: '' })
      }),
      notes: new FormControl({ value: '' })
    }),
    addTpaForm: new FormGroup({
      benefitType: new FormGroup({ english: new FormControl({ value: '' }), arabic: new FormControl({ value: '' }) }),
      beneficiaryId: new FormControl({ value: 1234 })
    }),
    paymentMethod: new FormGroup({
      transferMode: new FormControl({ value: '' })
    }),
    continousDeductionForm: new FormGroup({
      continuousDeduction: new FormGroup({
        english: new FormControl({ value: '' }),
        arabic: new FormControl({ value: '' })
      }),
      adjustmentAmount: new FormControl({ value: 1234 }),
      monthlyDeductionAmount: new FormControl({ value: 1234 }),
      adjustmentPercentage: new FormGroup({
        english: new FormControl({ value: '' }),
        arabic: new FormControl({ value: '' })
      }),
      adjustmentReason: new FormControl({ value: '' }),
      notes: new FormControl({ value: '' }),
      requestedBy: new FormControl({ value: '' }),
      caseNumber: new FormControl({ value: 1234 }),
      caseDate: new FormControl({ value: '' }),
      city: new FormControl({ value: '' }),
      holdAdjustment: new FormControl({ value: true })
    })
  });
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ id: 1600765 });

  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    [
      'revertTransaction',
      'getTpaAdjustmentsDetails',
      'getThirdPartyAdjustmentValidatorDetails',
      'getValidatorPayeeDetails',
      'submitAdjustmentDetails',
      'getBeneficiaryDetails',
      'getAdjustmentMonthlyDeductionEligibilty',
      'saveValidatorAdjustmentEdit',
      'saveThirdPartyAdjustment'
    ]
  );
  thirdPartyAdjustmentServiceSpy.revertTransaction.and.returnValue(of({}));
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments[0] }] })
  );
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments[0] }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(
    of({ ...new PayeeDetails(), payeeName: { english: '', arabic: '' } })
  );
  thirdPartyAdjustmentServiceSpy.submitAdjustmentDetails.and.returnValue(of({ message: { english: '', arabic: '' } }));
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getAdjustmentMonthlyDeductionEligibilty.and.returnValue(
    of({
      deductionPercentageForSingleAdjustment: 1234,
      deductionPercentageForMultipleAdjustment: 1234,
      minBasicBenefitAmount: 1234
    })
  );
  thirdPartyAdjustmentServiceSpy.saveValidatorAdjustmentEdit.and.returnValue(of(saveAdjustmentResponse));
  thirdPartyAdjustmentServiceSpy.saveThirdPartyAdjustment.and.returnValue(of(saveAdjustmentResponse));
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
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy },
        DatePipe
      ],
      declarations: [ManageThirdPartyHelperComponent, ManageThirdPartyAdjustmentScComponent]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ManageThirdPartyHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialise', () => {
    component.form = helperForm;
    component.ngOnInit();
  });
});
