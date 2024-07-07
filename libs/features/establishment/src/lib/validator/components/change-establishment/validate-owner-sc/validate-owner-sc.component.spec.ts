/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, WorkflowService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  genericError,
  genericEstablishmentResponse,
  genericOwnerReponse,
  WorkflowServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentConstants, EstablishmentService } from '../../../../shared';
import { ValidateOwnerScComponent } from './validate-owner-sc.component';

describe('ValidateOwnerScComponent', () => {
  let component: ValidateOwnerScComponent;
  let fixture: ComponentFixture<ValidateOwnerScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateOwnerScComponent],
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
    fixture = TestBed.createComponent(ValidateOwnerScComponent);
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
      spyOn(component, 'getRejectReasonList');
      spyOn(component, 'getReturnReasonList');
      spyOn(component, 'getComments');
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'searchOwnerWithQueryParams').and.returnValue(
        of([genericOwnerReponse])
      );
      component.initialiseView(referenceNumber);
      expect(component.getRejectReasonList).toHaveBeenCalled();
      expect(component.getReturnReasonList).toHaveBeenCalled();
      expect(component.getComments).toHaveBeenCalled();
      expect(component.currentOwners.length).toBe(1);
    });
  });

  describe('get Establishment Validating Owner Details', () => {
    it('should get Establishment Validating Owner Details', () => {
      const referenceNumber = 19424916;
      const registrationNo = 12345;
      spyOn(component.changeEstablishmentService, 'searchOwnerWithQueryParams').and.returnValue(
        of([genericOwnerReponse])
      );
      component.getEstablishmentValidatingOwnerDetails(registrationNo, referenceNumber);
      expect(component.changeEstablishmentService.searchOwnerWithQueryParams).toHaveBeenCalled();
    });
  });
  describe('navigate to edit Owner Details', () => {
    it('should navigate to edit Owner Details', () => {
      const tabIndex = 1;
      spyOn(component.changeEstablishmentService, 'navigateToEditOwnerDetails');
      component.navigateToEditOwnerDetails(tabIndex);
      expect(component.changeEstablishmentService.navigateToEditOwnerDetails).toHaveBeenCalled();
    });
  });
});
