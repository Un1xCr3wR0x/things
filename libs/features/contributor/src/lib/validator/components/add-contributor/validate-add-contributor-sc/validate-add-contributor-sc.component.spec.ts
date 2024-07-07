/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  RouterConstants
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  engagementData,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, EngagementDetails, Establishment } from '../../../../shared/models';
import { ContributorService, EngagementService, EstablishmentService } from '../../../../shared/services';
import { ValidateAddContributorScComponent } from '../../../components';

describe('ValidateAddContributorScComponent', () => {
  let component: ValidateAddContributorScComponent;
  let fixture: ComponentFixture<ValidateAddContributorScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateAddContributorScComponent],
      providers: [
        FormBuilder,
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateAddContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrive data For view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1569355076;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    spyOn(component.engagementService, 'getEngagementDetails').and.returnValue(
      of(new EngagementDetails().fromJsonToObject(engagementData))
    );
    component.getDataForView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should check for contract preview screen', () => {
    component.engagement = new EngagementDetails();
    component.engagement.isContributorActive = true;
    component.engagement.backdatingIndicator = false;
    component.contributor = new Contributor();
    component.contributor.contributorType = 'SAUDI';
    component.establishment = new Establishment();
    component.establishment.legalEntity.english = 'Private';
    component.checkContractPreviewRequired();
    expect(component.isContractRequired).toBeTruthy();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorBaseScComponent.prototype, 'saveWorkflow');
    component.handleWorkflowEvents(0);
    expect(ValidatorBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should save penalty indicator while saving workflow', () => {
    component.modalRef = new BsModalRef();
    component.routerDataToken.assignedRole = 'Validator';
    component.engagement = new EngagementDetails();
    component.engagement.backdatingIndicator = true;
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorBaseScComponent.prototype, 'saveWorkflow');
    spyOn(component, 'savePenaltyIndicator').and.callThrough();
    component.handleWorkflowEvents(0);
    expect(component.savePenaltyIndicator).toHaveBeenCalled();
  });

  it('should  throw error while  saving penalty', () => {
    spyOn(component.engagementService, 'updatePenaltyIndicator').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.savePenaltyIndicator(new ContributorBPMRequest());
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToCsrView(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/add/edit']);
  });

  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.router, 'navigateByUrl');
    component.confirmCancel();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(RouterConstants.ROUTE_INBOX);
  });

  it('should open preview screen', () => {
    spyOn(window, 'open');
    component.onViewContractsClick();
    expect(window.open).toHaveBeenCalled();
  });
});
