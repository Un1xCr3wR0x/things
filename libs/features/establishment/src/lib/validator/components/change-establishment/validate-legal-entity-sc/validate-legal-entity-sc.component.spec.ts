/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ApplicationTypeEnum, bindToObject, Establishment, WorkflowService, Role } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  EstablishmentStubService,
  genericEstablishmentResponse,
  WorkflowServiceStub,
  genericError
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentService } from '../../../../shared';
import { ValidateLegalEntityScComponent } from './validate-legal-entity-sc.component';

describe('ValidateLegalEntityScComponent', () => {
  let component: ValidateLegalEntityScComponent;
  let fixture: ComponentFixture<ValidateLegalEntityScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateLegalEntityScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        ...commonProviders,
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateLegalEntityScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component with referenceNo ', () => {
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
      component.estRouterData.assignedRole = Role.VALIDATOR;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getModifiedEstablishmentDetails');
      spyOn(component, 'getComments');
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getModifiedEstablishmentDetails).toHaveBeenCalled();
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
      component.getModifiedEstablishmentDetails(regNo, referenceNumber);
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
    it('should get validating establishment details throw error', () => {
      const referenceNumber = 19424916;
      const regNo = 19424916;
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        throwError(genericError)
      );
      spyOn(component, 'getEstablishmentDetails');
      spyOn(component.alertService, 'showError');
      component.getModifiedEstablishmentDetails(regNo, referenceNumber);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('navigate To Edit Legal Entity', () => {
    it('should navigate to edit legal entity', () => {
      const tabIndex = 123;
      spyOn(component.changeEstablishmentService, 'navigateToEditLegalEntity').and.callThrough();
      component.navigateToEditLegalEntity(tabIndex);
      expect(component.changeEstablishmentService.navigateToEditLegalEntity).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.bsModalRef = new BsModalRef();
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
});
