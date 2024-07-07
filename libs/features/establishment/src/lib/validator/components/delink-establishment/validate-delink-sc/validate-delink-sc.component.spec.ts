/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, RouterConstants, WorkflowService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  genericAdminResponse,
  genericError,
  genericEstablishmentResponse,
  WorkflowServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { AdminWrapper, EstablishmentConstants, EstablishmentService } from '../../../../shared';
import { ValidateDelinkScComponent } from './validate-delink-sc.component';

describe('ValidateDelinkScComponent', () => {
  let component: ValidateDelinkScComponent;
  let fixture: ComponentFixture<ValidateDelinkScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateDelinkScComponent],
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
    fixture = TestBed.createComponent(ValidateDelinkScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('initialise component', () => {
      component.estRouterData.referenceNo = 123456;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
    it('initialise component', () => {
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
      spyOn(component, 'getComments');
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT;
      component.isNewGroup = true;
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('get admin details', () => {
    it('should get admin details', () => {
      const refNo = 12345;
      const regNo = 234234;
      const adminWrapper: AdminWrapper = { admins: [genericAdminResponse] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      component.getAdminDetails(refNo, regNo);
      expect(component.establishmentService.getAdminsOfEstablishment).toHaveBeenCalled();
    });
    it('should get admin details throws error', () => {
      const refNo = 12345;
      const regNo = 234234;
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(throwError(genericError));
      component.getAdminDetails(refNo, regNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
