/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { bindToObject, Establishment, MobileDetails, WorkflowService, ApplicationTypeEnum } from '@gosi-ui/core';
import { of } from 'rxjs';
import { EstablishmentStubService, genericEstablishmentResponse, mobileNoTestData, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentService, EstablishmentConstants } from '../../../../shared';
import { ISD_PREFIX_MAPPING, ValidateContactDetailsScComponent } from './validate-contact-details-sc.component';

describe('ValidateContactDetailsScComponent', () => {
  let component: ValidateContactDetailsScComponent;
  let fixture: ComponentFixture<ValidateContactDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateContactDetailsScComponent],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateContactDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component with referenceNo', () => {
      component.estRouterData.referenceNo = 123456;
      spyOn(component, 'initialiseViewWithContact');
      component.ngOnInit();
      expect(component.initialiseViewWithContact).toHaveBeenCalled();
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
      spyOn(component, 'getISDCodePrefix');
      component.initialiseViewWithContact(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getValidatingEstablishmentDetails).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
      expect(component.getISDCodePrefix).toHaveBeenCalled();
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
  describe('should get prefix for the corresponsing isd code', () => {
    it('should get prefix for the corresponsing isd code', () => {
      const mobileNum = bindToObject(new MobileDetails(), mobileNoTestData);
      expect(component.getISDCodePrefix(mobileNum)).toBe(ISD_PREFIX_MAPPING.sa);
    });
  });
});
