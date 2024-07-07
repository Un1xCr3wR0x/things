/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { bindToObject, Establishment, WorkflowService } from '@gosi-ui/core';
import { of } from 'rxjs';
import { genericEstablishmentResponse, EstablishmentStubService, mockPipe, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentService } from '../../../../shared';
import { ValidateBankDetailsScComponent } from './validate-bank-details-sc.component';

describe('ValidateBankDetailsScComponent', () => {
  let component: ValidateBankDetailsScComponent;
  let fixture: ComponentFixture<ValidateBankDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateBankDetailsScComponent, mockPipe({ name: 'bilingualText' })],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateBankDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      const referenceNumber = 19424916;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getValidatingEstablishmentDetails');
      spyOn(component, 'getComments');
      component.initialiseViewWithBank(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getValidatingEstablishmentDetails).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('get Validating Establishment Details', () => {
    it('should get validating establishment details', () => {
      const referenceNumber = 19424916;
      const registrationNo = 19424916;
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );
      spyOn(component, 'getEstablishmentDetails');
      component.getValidatingEstablishmentDetails(registrationNo, referenceNumber);
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
});
