/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, Channel, WorkflowService } from '@gosi-ui/core';
import { EstablishmentStubService, genericEstablishmentResponse, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentService } from '../../../../shared';
import { ValidateSuperAdminScComponent } from './validate-super-admin-sc.component';

describe('ValidateSuperAdminScComponent', () => {
  let component: ValidateSuperAdminScComponent;
  let fixture: ComponentFixture<ValidateSuperAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateSuperAdminScComponent],
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
    fixture = TestBed.createComponent(ValidateSuperAdminScComponent);
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
      component.estRouterData.channel = Channel.FIELD_OFFICE;
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getISDCodePrefix');
      spyOn(component, 'getComments');
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = 19424916;
      component.initialiseView();
      expect(component.getRejectReasonList).toHaveBeenCalled();
      // expect(component.getReturnReasonList).toHaveBeenCalled();
      // expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('navigate to replacesuper admin', () => {
    it('should navigate to replace super admin', () => {
      component.navigateToReplaceSuperAdmin();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('go to establishment profile', () => {
    it('go to establishment profile', () => {
      component.goToEstProfile();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
