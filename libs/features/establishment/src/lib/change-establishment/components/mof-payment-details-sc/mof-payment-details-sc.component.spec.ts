/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterConstants, WorkflowService } from '@gosi-ui/core';
import {
  EstablishmentStubService,
  EstLookupServiceStub,
  genericEstablishmentResponse,
  WorkflowServiceStub
} from 'testing';
import {
  EstablishmentService,
  EstablishmentWorkFlowStatus,
  EstLookupService,
  WorkFlowStatusType
} from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { MofPaymentDetailsScComponent } from './mof-payment-details-sc.component';

describe('MofPaymentDetailsScComponent', () => {
  let component: MofPaymentDetailsScComponent;
  let fixture: ComponentFixture<MofPaymentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [MofPaymentDetailsScComponent],
      providers: [
        ...commonProviders,
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstLookupService,
          useClass: EstLookupServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MofPaymentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component', () => {
      component.changeEstablishmentService['selectedRegistrationNo'] = genericEstablishmentResponse.registrationNo;
      component.changeEstablishmentService['selectedEstablishment'] = genericEstablishmentResponse;
      component.estRouterData.taskId = 'taskId';
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS;
      component.viewMode = true;
      component.ngOnInit();
      expect(component.viewMode).toBe(true);
    });
  });
  describe('navigate Back', () => {
    it('should navigate back', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('navigate to mof payment', () => {
    it('with mof already in workflow', () => {
      component.selectedEstablishment = { ...genericEstablishmentResponse };
      component.mainEstablishment = { ...genericEstablishmentResponse };
      const mofWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.MOF_PAYMENT);
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      component.workflows = [mofWorkflow, legalEntityWorkflow];
      spyOn(component, 'showModal');
      component.modifyMofPayment({ key: 'testing' } as unknown as TemplateRef<HTMLElement>);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
});
export function getWorkflowResponseOfType(type: WorkFlowStatusType): EstablishmentWorkFlowStatus {
  return {
    type: type,
    message: {
      english: 'workflow',
      arabic: 'workflow'
    },
    referenceNo: 12345,
    count: 0
  };
}
