/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
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
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  BankAccount,
  BilingualText
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock
} from 'testing';
import {
  AdjustmentService,
  ThirdpartyAdjustmentService,
  AdjustmentDetails,
  Adjustment,
  PayeeDetails,
  BeneficiaryList,
  MonthlyDeductionEligibility,
  AdjustmentMapModel,
  AddData
} from '../../../../shared';
import { ManageThirdPartyAdjustmentScComponent } from './manage-third-party-adjustment-sc.component';
import { of } from 'rxjs';
import { activeAdjustments, benefits, payeeDetails } from '../../../../shared/test-data/adjustment';

describe('ManageThirdPartyAdjustmentScComponent', () => {
  let component: ManageThirdPartyAdjustmentScComponent;
  let fixture: ComponentFixture<ManageThirdPartyAdjustmentScComponent>;
  const identifier = 1234;
  const adjustmentModificationId = 1234;
  const referenceNumber = 1234;
  const saveAdjustmentResponse = {
    adjustmentModificationId: 1234,
    referenceNo: 1234,
    adjustmentRepayId: 1234
  };
  const payeeDetails = {
    payeeId: 1234,
    payeeName: new BilingualText(),
    payeeCode: '',
    payeeType: new BilingualText(),
    crn: '',
    iban: '',
    ibanStatus: '',
    ibanId: 1234,
    nationalId: 123456,
    iqama: 123456,
    nin: 1234567890
  };
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
        isSaved: true,
        addData: {
          ...new AddData(),
          selectedpayee: payeeDetails,
          csrSelectedpayee: payeeDetails,
          csrAdjustmentValues: { ...new Adjustment(), payeeId: 1 },
          payeeCurrentBank: new BankAccount(),
          payeebankName: { english: '', arabic: '' }
        },
        hasModified: true,
        modifyData: null,
        hasSavedData: false,
        savedAdjustmentData: { ...new Adjustment(), payeeId: 1 }
      }
    ]
  ]);
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
      declarations: [ManageThirdPartyAdjustmentScComponent, BilingualTextPipeMock, NumToPositiveTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageThirdPartyAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getTpaAdjustments', () => {
    component.identifier = identifier;
    component.isValidator = true;
    component.getTpaAdjustments();
    expect(component.disableSaveAndNext).not.toEqual(null);
  });
  it('should loadEditView', () => {
    component.identifier = identifier;
    component.adjustmentModificationId = adjustmentModificationId;
    component.loadEditView();
  });
  it('should selectWizard', () => {
    component.selectWizard(0);
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
    component.commentForm = new FormGroup({
      documentsForm: new FormGroup({
        comments: new FormControl({ value: '' })
      })
    });
    component.saveTpadjustment(true);
    expect(component.router.navigate).toHaveBeenCalled();
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
    component.commentForm = new FormGroup({
      documentsForm: new FormGroup({
        comments: new FormControl({ value: '' })
      })
    });
    component.submitAdjustmentDetails();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should addThirdParty', () => {
    component.showAddTpaBtn = true;
    component.adjustmentMap = adjustmentMap;
    spyOn(component, 'checkActiveStatus').and.returnValue(false);
    component.addThirdParty();
    expect(component.showAddTpaBtn).toEqual(false);
  });
  it('should onModify', () => {
    component.adjustmentMap = adjustmentMap;
    spyOn(component, 'checkActiveStatus').and.returnValue(false);
    component.onModify(0);
  });
  it('should fetchPayeedetails', () => {
    component.adjustmentMap = adjustmentMap;
    component.fetchPayeedetails(1, 0, false);
  });
  it('should checkActiveStatus', () => {
    component.adjustmentMap = adjustmentMap;
    component.checkActiveStatus();
  });
  it('should checkModidfyStatus', () => {
    component.adjustmentMap = adjustmentMap;
    component.checkModidfyStatus();
    expect(component.disableSaveAndNext).toEqual(false);
  });
  it('should setCancelMapIndex', () => {
    component.setCancelMapIndex(1);
    expect(component.cancelMapIndex).toEqual(1);
  });
  it('should cancelModifyTpa', () => {
    component.adjustmentMap = adjustmentMap;
    component.cancelModifyTpa(0);
    expect(component.disableSaveAndNext).toEqual(false);
  });
  it('should cancelAddTpa', () => {
    component.adjustmentMap = adjustmentMap;
    component.cancelMapIndex = 0;
    component.modalRef = new BsModalRef();
    component.cancelAddTpa();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should onAddModifySave Add', () => {
    component.adjustmentMap = adjustmentMap;
    component.onAddModifySave(0, true);
  });
  it('should onAddModifySave Modify', () => {
    component.adjustmentMap = adjustmentMap;
    component.onAddModifySave(0, false);
  });
});
