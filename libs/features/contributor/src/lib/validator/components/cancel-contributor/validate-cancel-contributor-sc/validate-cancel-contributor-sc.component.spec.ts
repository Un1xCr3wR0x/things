/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentItem,
  DocumentService,
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
  CancelContributorServiceStub,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  InspectionServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, Establishment } from '../../../../shared/models';
import {
  CancelContributorService,
  ContractAuthenticationService,
  ContributorService,
  EstablishmentService
} from '../../../../shared/services';
import { ValidateCancelContributorScComponent } from './validate-cancel-contributor-sc.component';

describe('ValidateCancelContributorScComponent', () => {
  let component: ValidateCancelContributorScComponent;
  let fixture: ComponentFixture<ValidateCancelContributorScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateCancelContributorScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: CancelContributorService, useClass: CancelContributorServiceStub },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: InspectionService, useClass: InspectionServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCancelContributorScComponent);
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
    spyOn(component, 'initializeView');
    component.ngOnInit();
    expect(component.initializeView).toHaveBeenCalled();
  });

  it('should get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.initializeView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
    expect(component.cancellationDetails).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.cancelContributorService, 'getCancellationDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeView();
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
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/cancel/edit']);
  });
});
