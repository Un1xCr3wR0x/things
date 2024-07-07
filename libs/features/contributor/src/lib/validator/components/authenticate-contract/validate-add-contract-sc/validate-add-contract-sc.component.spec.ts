/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MockManageWageService,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, Establishment } from '../../../../shared/models';
import { ContributorService, EstablishmentService, ManageWageService } from '../../../../shared/services';
import { ValidateAddContractScComponent } from './validate-add-contract-sc.component';

describe('ValidateAddContractScComponent', () => {
  let component: ValidateAddContractScComponent;
  let fixture: ComponentFixture<ValidateAddContractScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ValidateAddContractScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAddContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  initialize component', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component, 'initializeView');
    component.ngOnInit();
    expect(component.initializeView).toHaveBeenCalled();
  });

  it('should initialize trannsaction specific data', inject([RouterDataToken], token => {
    token.payload = '{"id": 1569355076, "contractId": 269865, "resource": "Cancel Contract"}';
    component.initializeTransactionSpecificData(token);
    expect(component.contractId).toBe(269865);
    expect(component.engagementId).toBe(1569355076);
  }));

  it('should  initialize view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    component.isAddContract = true;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.initializeView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeView();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should handle contract workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorBaseScComponent.prototype, 'saveWorkflow');
    component.handleContractWorklowEvents(0);
    expect(ValidatorBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToCsrView(0);
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/contract/add-contract/edit']);
  });

  it('should open preview screen', () => {
    spyOn(window, 'open');
    component.openPreviewTab();
    expect(window.open).toHaveBeenCalled();
  });
});
