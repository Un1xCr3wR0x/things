/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, WorkflowService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { EstablishmentStubService, genericError, genericEstablishmentResponse, WorkflowServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentRoutesEnum, EstablishmentService } from '../../../../shared';
import { ValidateMainEstablishmentScComponent } from './validate-main-establishment-sc.component';

describe('ValidateMainEstablishmentScComponent', () => {
  let component: ValidateMainEstablishmentScComponent;
  let fixture: ComponentFixture<ValidateMainEstablishmentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateMainEstablishmentScComponent],
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
    fixture = TestBed.createComponent(ValidateMainEstablishmentScComponent);
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
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
  describe('navigate change branch to main', () => {
    it('should navigate To change branch to main Page', () => {
      component.navigateToChangeMainEst();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN]);
    });
  });
});
