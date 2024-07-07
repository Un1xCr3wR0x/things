/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, bindToObject, Establishment, WorkflowService } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { EstablishmentStubService, genericEstablishmentResponse, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentService } from '../../../../shared';
import { ValidateAddressDetailsScComponent } from './validate-address-details-sc.component';

describe('ValidateAddressDetailsScComponent', () => {
  let component: ValidateAddressDetailsScComponent;
  let fixture: ComponentFixture<ValidateAddressDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateAddressDetailsScComponent],
      providers: [
        ...commonProviders,
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAddressDetailsScComponent);
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
      component.initialiseViewWithAddress(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getValidatingEstablishmentDetails).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('get Validating Establishment Details', () => {
    it('should get validating establishment details', () => {
      const referenceNumber = 19424916;
      const registratioNo = 19424916;
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );
      spyOn(component, 'getEstablishmentDetails');
      component.getValidatingEstablishmentDetails(registratioNo, referenceNumber);
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
  describe(' confirm cancel', () => {
    it('should confirm cancel', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.confirmCancel();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ROUTE_TO_INBOX(component.appToken)
      ]);
    });
  });
});
