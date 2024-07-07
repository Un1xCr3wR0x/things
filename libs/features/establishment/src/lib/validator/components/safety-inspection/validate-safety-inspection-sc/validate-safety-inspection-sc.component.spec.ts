/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum } from '@gosi-ui/core';
import { WorkflowService } from '@gosi-ui/core/lib/services';
import { of, throwError } from 'rxjs';
import {
  genericError,
  genericEstablishmentResponse,
  genericInspectionResponse,
  genericOhRateResponse,
  SafetyInspectionStubService,
  WorkflowServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, SafetyInspectionService } from '../../../../shared';
import { ValidateSafetyInspectionScComponent } from './validate-safety-inspection-sc.component';

describe('ValidateSafetyInspectionComponent', () => {
  let component: ValidateSafetyInspectionScComponent;
  let fixture: ComponentFixture<ValidateSafetyInspectionScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateSafetyInspectionScComponent],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: SafetyInspectionService,
          useClass: SafetyInspectionStubService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSafetyInspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(of(undefined));
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component with regNo', () => {
      component.estRouterData.registrationNo = 123456;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
    it('should initialise component without regNo', () => {
      component.estRouterData.registrationNo = null;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ROUTE_TO_INBOX(component.appToken)
      ]);
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(of(undefined));
      component.initialiseView();
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
    });
  });
  describe('go to establishment profile', () => {
    it('go to establishment profile', () => {
      component.goToEstProfile();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('get safety inspection details', () => {
    it('should get safety inspection details', () => {
      const registrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(of(genericOhRateResponse));
      component.getEstablishmentOHDeatils(registrationNo);
      expect(component.safetyInspectionService.getEstablishmentOHRate).toHaveBeenCalled();
    });
    it('should get safety inspection details throw error', () => {
      const registrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getEstablishmentOHDeatils(registrationNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('get new Oh details', () => {
    it('should get new Oh details', () => {
      const registrationNo = genericEstablishmentResponse.registrationNo;
      const referenceNo = 123456;
      component.isReturn = true;
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(of(genericOhRateResponse));
      component.getEstablishmentNewOHDeatils(registrationNo, referenceNo);
      expect(component.safetyInspectionService.getEstablishmentOHRate).toHaveBeenCalled();
    });
    it('should get safety inspection details throw error', () => {
      const registrationNo = genericEstablishmentResponse.registrationNo;
      const referenceNo = 123456;
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getEstablishmentNewOHDeatils(registrationNo, referenceNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = component.createForm();
      component.isOperationManagerTransaction = true;
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.approveTransaction(form, modalRef);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
    it('should trigger the approval popup error message', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = component.createForm();
      component.isOperationManagerTransaction = false;
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'showModal');
      component.approveTransaction(form, modalRef);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('get inspection details', () => {
    it('should get inspection details', () => {
      component.inspectionId = 12124324;
      component.registrationNo = 123;
      spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(
        of(genericInspectionResponse)
      );
      component.getEstablishmentInspectionDeatils(component.inspectionId);
      expect(component.safetyInspectionService.getEstablishmentInspectionDetails).toHaveBeenCalled();
    });
    it('should get inspection details throws error', () => {
      component.inspectionId = 12124324;
      spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getEstablishmentInspectionDeatils(component.inspectionId);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  // describe('invoke workflow', () => {
  //   it('should invoke workflow', () => {
  //     const isApprove = true;
  //     const forms = new Forms();
  //     component.safetyInspectionValidationForm = forms.createMockSafetyDetailsForm();
  //     const formValues = component.safetyInspectionValidationForm.getRawValue();
  //     const safetyBPMRequest = new SafetyBPMRequest();
  //     spyOn(component.safetyInspectionService, 'invokeEstablishmentWorkflow').and.returnValue(
  //       of(transactionFeedbackMockData.message)
  //     );
  //     component.invokeEstablishmentWorkflow(isApprove);
  //     expect(component.safetyInspectionService.invokeEstablishmentWorkflow).toHaveBeenCalled();
  //   });
  //   it('should invoke workflow', () => {
  //     const isApprove = true;
  //     const forms = new Forms();
  //     component.safetyInspectionValidationForm = forms.createMockSafetyDetailsForm();
  //     const formValues = component.safetyInspectionValidationForm.getRawValue();
  //     const safetyBPMRequest = new SafetyBPMRequest();
  //     spyOn(component.safetyInspectionService, 'invokeEstablishmentWorkflow').and.returnValue(throwError(genericError));
  //     spyOn(component.alertService, 'showError');
  //     component.invokeEstablishmentWorkflow(isApprove);
  //     expect(component.alertService.showError).toHaveBeenCalled();
  //   });
  // });
});
