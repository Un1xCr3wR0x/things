/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  bindToObject,
  DocumentItem,
  DocumentService,
  Establishment,
  InspectionService,
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
  changeEngagementEstablishment,
  changeEngagementPerson,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  engagementInChangeWorkflow,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  InspectionServiceStub,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, PersonalInformation, UpdatedWageDetails } from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';
import { ValidateIndividualEngagementScComponent } from './validate-individual-engagement-sc.component';

describe('ValidateIndividualEngagementScComponent', () => {
  let component: ValidateIndividualEngagementScComponent;
  let fixture: ComponentFixture<ValidateIndividualEngagementScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateIndividualEngagementScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: InspectionService, useClass: InspectionServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateIndividualEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    const contributor: Contributor = new Contributor();
    const engagement: UpdatedWageDetails = bindToObject(new UpdatedWageDetails(), engagementInChangeWorkflow);
    engagement.penaltyIndicator = 1;
    contributor.person = new PersonalInformation().fromJsonToObject(changeEngagementPerson);
    contributor.active = true;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(
      of(bindToObject(new Establishment(), changeEngagementEstablishment))
    );
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(contributor));
    spyOn(component.manageWageService, 'getEngagementInWorkflow').and.returnValue(of(engagement));
    component.getDataForView();

    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
    expect(component.engagement).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    const contributor: Contributor = new Contributor();
    contributor.person = new PersonalInformation().fromJsonToObject(changeEngagementPerson);
    contributor.active = true;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(contributor));
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError').and.callThrough();
    spyOn(component.router, 'navigate');
    component.getDataForView();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorBaseScComponent.prototype, 'saveWorkflow');
    component.handleWorkflowEvents(0);
    expect(ValidatorBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should throw error while saving penalty', () => {
    spyOn(component.engagementService, 'updatePenaltyIndicator').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.savePenaltyIndicator(new ContributorBPMRequest());
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should check for active inspection', () => {
    spyOn(component.alertService, 'showErrorByKey');
    spyOn(component, 'getPersonName');
    component.checkForActiveInspection();
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });

  it('should initiate inspection in case of no active inspections', () => {
    spyOn(ValidatorBaseScComponent.prototype, 'initiateInspection');
    spyOn(component.inspectionService, 'getInspectionList').and.returnValue(of([]));
    component.checkForActiveInspection();
    expect(ValidatorBaseScComponent.prototype.initiateInspection).toHaveBeenCalled();
  });

  it('should throw error while checking active inspection', () => {
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    spyOn(component.inspectionService, 'getInspectionList').and.returnValue(throwError(genericError));
    component.checkForActiveInspection();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should get inspection documents', () => {
    component.documents = [];
    spyOn(component.documentService, 'getRasedDocuments').and.returnValue(of([new DocumentItem()]));
    component.getInspectionDocuments().subscribe();
    expect(component.documents.length).toEqual(1);
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/engagement/change/edit']);
  });

  it('should navigate to scan', () => {
    spyOn(component.router, 'navigate');
    component.navigateToScan();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/engagement/change/edit']);
  });
});
