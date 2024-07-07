/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, Role, WorkflowService } from '@gosi-ui/core';
import { EstablishmentConstants, EstablishmentService } from '@gosi-ui/features/establishment';
import {
  commonImports,
  commonProviders
} from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentStubService, genericAdminResponse, WorkflowServiceStub } from 'testing';

import { ValidateAddSuperAdminScComponent } from './validate-add-super-admin-sc.component';

describe('ValidateAddSuperAdminScComponent', () => {
  let component: ValidateAddSuperAdminScComponent;
  let fixture: ComponentFixture<ValidateAddSuperAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateAddSuperAdminScComponent],
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
    fixture = TestBed.createComponent(ValidateAddSuperAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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
      component.estRouterData.registrationNo = undefined;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ROUTE_TO_INBOX(component.appToken)
      ]);
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.estRouterData.assignedRole = Role.VALIDATOR;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getISDCodePrefix');
      spyOn(component, 'getComments');
      component.initialiseView();
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('navigate to replacesuper admin', () => {
    it('should navigate to replace super admin', () => {
      component.navigateToRegisterSuperAdmin();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
