/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ApplicationTypeEnum, bindToObject, Establishment, WorkflowService } from '@gosi-ui/core';
import { EstablishmentConstants } from '@gosi-ui/features/establishment';
import { of } from 'rxjs';
import { BilingualTextPipeMock, genericEstablishmentResponse, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { ValidateIdentifierDetailsScComponent } from './validate-identifier-details-sc.component';

describe('ValidateIdentifierDetailsScComponent', () => {
  let component: ValidateIdentifierDetailsScComponent;
  let fixture: ComponentFixture<ValidateIdentifierDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateIdentifierDetailsScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        ...commonProviders,
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateIdentifierDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component with referenceNo', () => {
      component.estRouterData.referenceNo = 123456;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
    it('should initialise component without referenceNo', () => {
      component.estRouterData.referenceNo = undefined;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ROUTE_TO_INBOX(component.appToken)
      ]);
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      const referenceNumber = 19424916;
      component.estRouterData.referenceNo = 123123;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getValidatingEstablishmentDetails');
      spyOn(component, 'getComments');
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getValidatingEstablishmentDetails).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('get Validating Establishment Details', () => {
    it('should get validating establishment details', () => {
      const referenceNumber = 19424916;
      const regNo = 19424916;
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );
      spyOn(component, 'getEstablishmentDetails');
      component.getValidatingEstablishmentDetails(regNo, referenceNumber);
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
});
