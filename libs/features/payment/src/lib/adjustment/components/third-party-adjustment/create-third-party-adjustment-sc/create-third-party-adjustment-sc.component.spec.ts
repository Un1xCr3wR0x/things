import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  ApplicationTypeToken,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock
} from 'testing';
import {
  AdjustmentDetails,
  Adjustment,
  PayeeDetails,
  ThirdpartyAdjustmentService,
  BeneficiaryList,
  MonthlyDeductionEligibility,
  AdjustmentMapModel,
  AddData
} from '../../../../shared';
import { CreateThirdPartyAdjustmentScComponent } from './create-third-party-adjustment-sc.component';
import { of } from 'rxjs';
import { activeAdjustments, benefits } from '../../../../shared/test-data/adjustment';

describe('CreateThirdPartyAdjustmentScComponent', () => {
  let component: CreateThirdPartyAdjustmentScComponent;
  let fixture: ComponentFixture<CreateThirdPartyAdjustmentScComponent>;
  const saveAdjustmentResponse = {
    adjustmentModificationId: 1234,
    referenceNo: 1234,
    adjustmentRepayId: 1234
  };
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
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(of(new PayeeDetails()));
  thirdPartyAdjustmentServiceSpy.submitAdjustmentDetails.and.returnValue(of({ message: '' }));
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getAdjustmentMonthlyDeductionEligibilty.and.returnValue(
    of(new MonthlyDeductionEligibility())
  );
  thirdPartyAdjustmentServiceSpy.saveValidatorAdjustmentEdit.and.returnValue(of(saveAdjustmentResponse));
  thirdPartyAdjustmentServiceSpy.saveThirdPartyAdjustment.and.returnValue(of(saveAdjustmentResponse));
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  const adjustmentModificationId = 1234;
  const identifier = 1234;
  const referenceNumber = 1234;
  coreAdjustmntServiceSpy.identifier = identifier;
  const adjustmentMap: Map<number, AdjustmentMapModel> = new Map([
    [
      0,
      {
        adjustment: null,
        form: new FormGroup({
          documentsForm: new FormGroup({
            comments: new FormControl({ value: '' })
          })
        }),
        isAdd: true,
        addData: new AddData(),
        modifyData: null,
        isSaved: true
      }
    ]
  ]);
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
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
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
      declarations: [CreateThirdPartyAdjustmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThirdPartyAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should loadEditView', () => {
    component.identifier = identifier;
    component.adjustmentModificationId = adjustmentModificationId;
    component.loadEditView();
  });
  it('should selectWizard', () => {
    component.selectWizard(0);
  });
  it('should change selectWizard', () => {
    component.adjustmentModificationId = adjustmentModificationId;
    component.isValidator = false;
    component.referenceNumber = referenceNumber;
    component.transactionName = '';
    component.transactionType = '';
    component.selectWizard(1);
  });
  it('should saveTpadjustment', () => {
    component.adjustmentModificationId = adjustmentModificationId;
    component.isValidator = false;
    component.referenceNumber = referenceNumber;
    component.transactionName = '';
    component.transactionType = '';
    component.saveTpadjustment(false);
  });
  it('should saveTpadjustment final', () => {
    component.adjustmentModificationId = adjustmentModificationId;
    component.isValidator = false;
    component.referenceNumber = referenceNumber;
    component.saveTpadjustment(true);
  });
  it('should saveTransaction', () => {
    component.adjustmentModificationId = adjustmentModificationId;
    component.isValidator = false;
    component.referenceNumber = referenceNumber;
    component.transactionName = '';
    component.transactionType = '';
    component.saveTransaction();
  });
  it('should submitAdjustmentDetails', () => {
    component.adjustmentModificationId = adjustmentModificationId;
    component.isValidator = false;
    component.referenceNumber = referenceNumber;
    component.adjustmentMap = adjustmentMap;
    component.submitAdjustmentDetails();
  });
  it('should getTpaRequiredDocument', () => {
    component.getTpaRequiredDocument('thirdParty', 'adjustment');
    expect(component.documents).not.toEqual(null);
  });
});
