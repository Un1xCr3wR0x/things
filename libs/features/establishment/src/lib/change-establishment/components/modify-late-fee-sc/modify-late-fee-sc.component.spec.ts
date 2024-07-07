import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, markFormGroupTouched, RouterConstants, WorkflowService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { genericDocumentItem, genericError, genericEstablishmentResponse, WorkflowServiceStub } from 'testing';
import { EstablishmentConstants, EstablishmentRoutesEnum } from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { ModifyLateFeeScComponent } from './modify-late-fee-sc.component';

describe('ModifyLateFeeScComponent', () => {
  let component: ModifyLateFeeScComponent;
  let fixture: ComponentFixture<ModifyLateFeeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      declarations: [ModifyLateFeeScComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyLateFeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialise', () => {
    it('go back', () => {
      component.changeEstablishmentService.selectedEstablishment = undefined;
      (component as any).estRouterData = undefined;
      spyOn(component.location, 'back').and.callFake(() => {});
      component.ngOnInit();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('and get establishment details', () => {
      component.changeEstablishmentService.selectedEstablishment = { ...genericEstablishmentResponse };
      component.ngOnInit();
      expect(component.establishmentToChange).toBeDefined();
    });
    it('with current data', () => {
      const est = { ...genericEstablishmentResponse };
      est.establishmentAccount.lateFeeIndicator.english = 'No';
      component.establishmentToChange = est;
      component.intialise();
      component.changeLateFeeForm.updateValueAndValidity();
      expect(component.changeLateFeeForm.get('lateFeeIndicator').get('english').value).toBe('No');
    });
    it('with csr/admin change data', () => {
      component.estRouterData.taskId = 'taskId';
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_LATE_FEE;
      const bankAccount = {
        ...genericEstablishmentResponse.establishmentAccount,
        lateFeeIndicator: { english: 'Yes', arabic: undefined }
      };
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of({ ...genericEstablishmentResponse, bankAccount })
      );
      component.ngOnInit();
      expect(component.changeLateFeeForm).toBeDefined();
    });
  });

  describe('Modify Late Fee', () => {
    it('should check if form is valid', () => {
      component.changeLateFeeForm = component.createLateFeeForm();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.submitTransaction();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should check if documents are uploaded', () => {
      component.changeLateFeeForm = component.createLateFeeForm();
      component.changeLateFeeForm.get('lateFeeIndicator.english').setValue('Yes');
      markFormGroupTouched(component.changeLateFeeForm);
      component.documents = [
        { ...genericDocumentItem, documentContent: null, required: true, show: true, fromJsonToObject: () => undefined }
      ];
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitTransaction();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should submit the transaction successfully', () => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      component.changeLateFeeForm = component.createLateFeeForm();
      component.changeLateFeeForm.get('lateFeeIndicator.english').setValue('Yes');
      component.documents = [
        {
          ...genericDocumentItem,
          documentContent: 'success',
          required: true,
          show: true,
          fromJsonToObject: () => undefined
        }
      ];
      spyOn(component.alertService, 'showSuccess');
      component.submitTransaction();
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('should submit and call BPM when validator 1 reenters', () => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      component.changeLateFeeForm = component.createLateFeeForm();
      component.changeLateFeeForm.get('lateFeeIndicator.english').setValue('Yes');
      component.documents = [
        {
          ...genericDocumentItem,
          documentContent: 'success',
          required: true,
          show: true,
          fromJsonToObject: () => undefined
        }
      ];
      component.estRouterData.taskId = 'taskId';
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_LATE_FEE;
      spyOn(component.alertService, 'showSuccess');
      component.isValidator = true;
      spyOn(component.workflowService, 'updateTaskWorkflow');
      component.submitTransaction();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
    it('should submit and handle errors', () => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      component.changeLateFeeForm = component.createLateFeeForm();
      component.changeLateFeeForm.get('lateFeeIndicator.english').setValue('Yes');
      component.documents = [
        {
          ...genericDocumentItem,
          documentContent: 'success',
          required: true,
          show: true,
          fromJsonToObject: () => undefined
        }
      ];
      spyOn(component.alertService, 'showError');
      spyOn(component.changeEstablishmentService, 'changeLateFeeIndicator').and.returnValue(throwError(genericError));
      component.submitTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Cancel Late Fee', () => {
    it('should navigate to previous page', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.isValidator = false;
      component.cancelLateFee();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('should cancel the transaction and navigate to validate page', () => {
      component.isValidator = true;
      component.establishmentToChange = { ...genericEstablishmentResponse, registrationNo: 1111 };
      component.cancelLateFee();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_LATE_FEE]);
    });
    it('should cancel the transaction and navigate to todolist page', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.establishmentToChange = { ...genericEstablishmentResponse, registrationNo: 1111 };
      component.cancelLateFee();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
    });
    it('should handle the error', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.establishmentToChange = { ...genericEstablishmentResponse };
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.cancelLateFee();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Cancel Modal', () => {
    it('cancel the transaction and hide the modal', () => {
      (component.bsModalRef as any) = { hide: () => {} };
      spyOn(component.bsModalRef, 'hide');
      spyOn(component, 'cancelLateFee');
      component.cancelModal();
      expect(component.bsModalRef?.hide).toHaveBeenCalled();
      expect(component.cancelLateFee).toHaveBeenCalled();
    });
  });
});
