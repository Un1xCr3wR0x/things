/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  ValidateWageUpdateServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, Establishment, UpdatedWageListResponse } from '../../../../shared/models';
import { ContributorService, EstablishmentService, ValidateWageUpdateService } from '../../../../shared/services';
import { ManageWageScComponent } from './manage-wage-sc.component';

describe('ManageWageScComponent', () => {
  let component: ManageWageScComponent;
  let fixture: ComponentFixture<ManageWageScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ManageWageScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ValidateWageUpdateService, useClass: ValidateWageUpdateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data For view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1569355076;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    spyOn(component.wageUpdateService, 'getOccupationAndWageDetails').and.returnValue(
      of(new UpdatedWageListResponse())
    );
    component.fetchDataForView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    const contributor: Contributor = new Contributor();
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(contributor));
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError').and.callThrough();
    spyOn(component.router, 'navigate');
    component.fetchDataForView();
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

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToCSR();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/wage/individual/update/edit']);
  });
});
