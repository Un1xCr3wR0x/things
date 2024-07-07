import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdjustmentCreateScComponent } from './adjustment-create-sc.component';
import {
  AdjustmentService,
  AdjustmentDetails,
  BeneficiaryList,
  SaveAdjustmentResponse,
  BenefitDetails,
  Adjustment,
  AdjustmentConstants
} from '../../../shared';
import { of } from 'rxjs';
import { activeAdjustments, benefits, adjustmentModificationById } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  bindToObject,
  RouterDataToken,
  RouterData,
  WizardItem,
  CoreAdjustmentService
} from '@gosi-ui/core';
import { AlertServiceStub, DocumentServiceStub, ModalServiceStub, Form } from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';

describe('AdjustmentCreateScComponent', () => {
  let component: AdjustmentCreateScComponent;
  let fixture: ComponentFixture<AdjustmentCreateScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getBeneficiaryList',
    'saveAdjustments',
    'adjustmentValidator',
    'modifyAdjustments'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of({ ...new BeneficiaryList(), ...benefits }));
  adjustmentServiceSpy.saveAdjustments.and.returnValue(
    of(<SaveAdjustmentResponse>{
      adjustmentModificationId: 0,
      referenceNo: 0
    })
  );
  adjustmentServiceSpy.adjustmentValidator.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  adjustmentServiceSpy.modifyAdjustments.and.returnValue(
    of(<SaveAdjustmentResponse>{
      adjustmentModificationId: 0,
      referenceNo: 0
    })
  );
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AdjustmentCreateScComponent],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentCreateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should createAdjustmentAddForm', () => {
    component.createAdjustmentAddForm();
    expect(component.createAdjustmentAddForm()).not.toEqual(null);
  });
  it('should patchAdjustmentAddForm', () => {
    component.beneficiaries = [{ ...new BenefitDetails(), ...benefits.beneficiaryBenefitList[0] }];
    component.patchAdjustmentAddForm(adjustmentModificationById.adjustments[0]);
  });
  it('should getBenefits', () => {
    component.beneficiaries = [{ ...new BenefitDetails(), ...benefits.beneficiaryBenefitList[0] }];
    component.getBenefits({ sequence: 0 });
    expect(component.benefitItems).not.toEqual(null);
  });
  it('should getActiveAdjustments', () => {
    component.identifier = 1034681524;
    component.getActiveAdjustments();
    expect(component.activeAdjustments).not.toEqual(null);
  });
  it('should getAdjustmentValidator', () => {
    component.identifier = 1034681524;
    component.adjustmentModificationId = 900;
    component.getAdjustmentValidator();
    spyOn(component, 'patchAdjustmentAddForm');
    expect(component.activeAdjustments).not.toEqual(null);
  });
  it('should getBeneficiaryList', () => {
    component.identifier = 1034681524;
    component.type = 'Saned Pension';
    component.getBeneficiaryList();
    expect(component.beneficiaries).not.toEqual(null);
  });
  it('should addAdjustment', () => {
    component.addAdjustment(true);
    expect(component.isAddAdjustment).toEqual(true);
  });

  it('should saveAdjustment', () => {
    component.identifier = 1034681524;
    component.adjustmentAddForm = new FormGroup({
      adjustmentPercentage: new FormGroup({ english: new FormControl('10'), arabic: new FormControl('10') })
    });
    spyOn(component, 'getRequiredDocument');
    spyOn(component, 'setNextTab');
    component.saveAdjustment();
    expect(component.adjustmentSubmitResponse).not.toEqual(null);
  });
  it('should saveAdjustment by validator', () => {
    component.identifier = 1034681524;
    component.adjustmentModificationId = 900;
    component.adjustmentAddForm = new FormGroup({});
    spyOn(component, 'getRequiredDocument');
    spyOn(component, 'setNextTab');
    component.saveAdjustment();
    expect(component.getRequiredDocument).toHaveBeenCalled();
  });
  describe('selectWizard', () => {
    it('should selectedWizard', () => {
      spyOn(component, 'selectedWizard');
      component.selectedWizard(1);
      expect(component.currentTab).not.toEqual(null);
      expect(component.selectedWizard).toBeDefined();
    });
  });
  describe('selectedWizard', () => {
    it('should selectedWizard', () => {
      component.selectedWizard(1);
      expect(component.selectedWizard).toBeTruthy();
    });
  });
  describe('setNextTab', () => {
    it('should setNextTab', () => {
      component.currentTab = 0;
      component.adjustmentWizard = new ProgressWizardDcComponent();
      component.setNextTab();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('navigateToAdjustment', () => {
    it('should navigateToAdjustment', () => {
      component.navigateToAdjustment();
      expect(component.navigateToAdjustment).toBeDefined();
    });
  });
  describe('Show Modal', () => {
    it('should modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('onSubmitDocuments', () => {
    it('should onSubmitDocuments', () => {
      spyOn(component, 'submitAdjustments');
      component.submitAdjustments();
      expect(component.submitAdjustments).toHaveBeenCalled();
    });
  });
  describe('submitAdjustments', () => {
    it('should submitAdjustments', () => {
      component.identifier = 1234;
      component.adjustmentSubmitResponse = { adjustmentModificationId: 1234, referenceNo: 1234 };
      component.parentForm = new FormGroup({
        documentsForm: new FormGroup({ comments: new FormControl({ value: '' }) })
      });
      spyOn(component, 'submitAdjustmentDetails');
      component.submitAdjustments();
      expect(component.submitAdjustmentDetails).toHaveBeenCalled();
    });
  });
});
