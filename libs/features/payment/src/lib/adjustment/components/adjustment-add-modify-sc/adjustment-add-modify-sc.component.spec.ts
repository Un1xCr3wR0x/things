import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken, RouterData, ApplicationTypeToken, bindToObject, CoreAdjustmentService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdjustmentAddModifyScComponent } from './adjustment-add-modify-sc.component';
import {
  AdjustmentService,
  AdjustmentDetails,
  BeneficiaryList,
  SaveAdjustmentResponse,
  Adjustment
} from '../../../shared';
import { of } from 'rxjs';
import { activeAdjustments, benefits, adjustmentModificationById } from '../../../shared/test-data/adjustment';
import { AlertService, DocumentService } from '@gosi-ui/core';
import { AlertServiceStub, DocumentServiceStub, ModalServiceStub } from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';

describe('AdjustmentAddModifyScComponent', () => {
  let component: AdjustmentAddModifyScComponent;
  let fixture: ComponentFixture<AdjustmentAddModifyScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getAdjustmentByStatusAndType',
    'adjustmentValidator',
    'getBeneficiaryList',
    'saveAdjustments',
    'modifyAdjustments'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getAdjustmentByStatusAndType.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.saveAdjustments.and.returnValue(
    of(<SaveAdjustmentResponse>{
      adjustmentModificationId: 0,
      referenceNo: 0
    })
  );
  adjustmentServiceSpy.modifyAdjustments.and.returnValue(
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
      declarations: [AdjustmentAddModifyScComponent],
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
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentAddModifyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      const index = 1;
      spyOn(component, 'selectedWizard');
      component.selectedWizard(index);
      expect(component.selectedWizard).toBeDefined();
    });
  });
  describe('getAdjustmentValidator', () => {
    it('should getAdjustmentValidator', () => {
      component.identifier = 1034681524;
      component.adjustmentModificationId = 900;
      component.getAdjustmentValidator();
      expect(component.activeAdjustments).not.toEqual(null);
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
  /*describe('navigateToPreviousTab', () => {
    it('should navigateToPreviousTab', () => {
      component.currentTab = 1;
      component.adjustmentWizard = new ProgressWizardDcComponent();
      component.navigateToPreviousTab();
      expect(component.currentTab).toEqual(0);
    });
  });*/
  describe('Show Modal', () => {
    it('should modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('getAdjustmentId', () => {
    it('should getAdjustmentId', () => {
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      component.getAdjustmentId(adjustmentModificationById.adjustments[2]);
      expect(component.getAdjustmentId(adjustmentModificationById.adjustments[2])).not.toEqual(null);
    });
  });
  describe('selectedWizard', () => {
    it('should selectedWizard', () => {
      const index = 1;
      component.selectedWizard(index);
      expect(component.selectedWizard).not.toEqual(index);
    });
  });
  describe('navigateToAdjustment', () => {
    it('should navigateToAdjustment', () => {
      component.navigateToAdjustment();
      expect(component.navigateToAdjustment).toBeDefined();
    });
  });
  describe('adjustmentFunctions', () => {
    it('should getActiveAdjustments', () => {
      component.type = 'Saned Pension';
      component.identifier = 1034681524;
      component.getActiveAdjustments();
      expect(component.activeAdjustments).not.toEqual(null);
    });
    it('should getActiveAdjustments', () => {
      component.identifier = 1034681524;
      component.getActiveAdjustments();
      expect(component.activeAdjustments).not.toEqual(null);
    });
    it('should getBeneficiaryList', () => {
      component.identifier = 1034681524;
      component.getBeneficiaryList();
      expect(component.beneficiaries).not.toEqual(null);
    });
    it('should addAdjustments', () => {
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      component.addAdjustments(adjustmentModificationById.adjustments[0]);
      expect(component.activeAdjustments.adjustments).not.toEqual(null);
    });
    it('should editAdjustments', () => {
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      component.editAdjustments(adjustmentModificationById.adjustments[0]);
      expect(component.activeAdjustments.adjustments).not.toEqual(null);
    });
    it('should modifyAdjustments', () => {
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      component.modifyAdjustments(adjustmentModificationById.adjustments[0]);
      expect(component.activeAdjustments.adjustments).not.toEqual(null);
    });
    it('should saveAdjustment', () => {
      component.identifier = 1034681524;
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      spyOn(component, 'getRequiredDocument');
      spyOn(component, 'setNextTab');
      component.saveAdjustment();
      expect(component.getRequiredDocument).toHaveBeenCalled();
    });
    it('should saveAdjustment by validator', () => {
      component.identifier = 1034681524;
      component.activeAdjustments = {
        ...new AdjustmentDetails(),
        adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
      };
      component.adjustmentModificationId = 900;
      spyOn(component, 'getRequiredDocument');
      spyOn(component, 'setNextTab');
      component.saveAdjustment();
      expect(component.adjustmentSubmitResponse).not.toEqual(null);
    });
  });
});
