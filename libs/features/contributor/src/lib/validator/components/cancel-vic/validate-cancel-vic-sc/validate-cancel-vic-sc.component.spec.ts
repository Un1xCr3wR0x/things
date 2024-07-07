/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  CancelVicServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { CancelContributorDetails, Contributor, ContributorBPMRequest } from '../../../../shared/models';
import { CancelVicService, ContributorService, EstablishmentService, VicService } from '../../../../shared/services';
import { ValidateCancelVicScComponent } from './validate-cancel-vic-sc.component';

describe('ValidateCancelVicScComponent', () => {
  let component: ValidateCancelVicScComponent;
  let fixture: ComponentFixture<ValidateCancelVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateCancelVicScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: CancelVicService, useClass: CancelVicServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCancelVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component, 'initializeVICCancel');
    component.ngOnInit();
    expect(component.initializeVICCancel).toHaveBeenCalled();
  });

  it('should get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.cancelVicService, 'getCancellationDetails').and.returnValue(of(new CancelContributorDetails()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.initializeVICCancel();
    expect(component.contributor).toBeDefined();
    expect(component.cancellationDetails).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.cancelVicService, 'getCancellationDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeVICCancel();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'saveWorkflow');
    component.vicCancelWorkflowEvents(0);
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit(0);
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_CANCEL_VIC_EDIT]);
  });
});
