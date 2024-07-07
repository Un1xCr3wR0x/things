/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  ApplicationTypeEnum,
  bindToObject,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  WorkflowService
} from '@gosi-ui/core';
import { of } from 'rxjs';
import { genericEstablishmentResponse, mockPipe, WorkflowServiceStub, Forms, Form } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { ValidateBasicDetailsScComponent } from './validate-basic-details-sc.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EstablishmentConstants } from '@gosi-ui/features/establishment';

describe('ValidateBasicDetailsScComponent', () => {
  let component: ValidateBasicDetailsScComponent;
  let fixture: ComponentFixture<ValidateBasicDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateBasicDetailsScComponent, mockPipe({ name: 'bilingualText' })],
      providers: [
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstablishmentToken,
          useValue: new EstablishmentRouterData()
        },
        FormBuilder,
        ...commonProviders
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateBasicDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component with referenceNo', () => {
      component.estRouterData.referenceNo = 123456;
      spyOn(component, 'initialiseViewWithBasicDetails');
      component.ngOnInit();
      expect(component.initialiseViewWithBasicDetails).toHaveBeenCalled();
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
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getValidatingEstablishmentDetails');
      spyOn(component, 'getComments');
      component.initialiseViewWithBasicDetails(referenceNumber);
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
  describe('confirm approve', () => {
    it('should confirm approve', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmApprove(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('confirm reject', () => {
    it('should confirm reject', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmReject(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('confirm return', () => {
    it('should confirm return', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmReturn(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.approveTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.rejectTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.returnTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('hide modal', () => {
    it('should hide modal', () => {
      component.bsModalRef = new BsModalRef();
      component.hideModal();
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
});
