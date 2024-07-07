/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ApplicationTypeEnum, Role, WorkflowService } from '@gosi-ui/core';
import {
  commonImports,
  commonProviders
} from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentService } from '@gosi-ui/features/establishment/lib/shared';
import { EstablishmentStubService, mockPipe, WorkflowServiceStub } from 'testing';

import { ValidateMofPaymentDetailsScComponent } from './validate-mof-payment-details-sc.component';

describe('ValidateMofPaymentDetailsScComponent', () => {
  let component: ValidateMofPaymentDetailsScComponent;
  let fixture: ComponentFixture<ValidateMofPaymentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateMofPaymentDetailsScComponent, mockPipe({ name: 'bilingualText' })],
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
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateMofPaymentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component', () => {
      component.estRouterData.referenceNo = 123324;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      const referenceNumber = 19424916;
      component.estRouterData.assignedRole = Role.VALIDATOR;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getComments');
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
});
