/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
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
import { throwError } from 'rxjs';
import {
  AlertServiceStub,
  BulkWageServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import {
  BulkWageService,
  ContributorBPMRequest,
  ContributorRouteConstants,
  ContributorService,
  EstablishmentService,
  ValidatorBaseScComponent
} from '../../../../shared';
import { ValidateBulkWageScComponent } from './validate-bulk-wage-sc.component';

describe('ValidateBulkWageScComponent', () => {
  let component: ValidateBulkWageScComponent;
  let fixture: ComponentFixture<ValidateBulkWageScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateBulkWageScComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: BulkWageService, useClass: BulkWageServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
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
    fixture = TestBed.createComponent(ValidateBulkWageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize validator view', () => {
    component.registrationNo = 200085744;
    component.initializeValidatorView();
    expect(component.bulkWageWorkflowDetails).toBeDefined();
  });

  it('should throw error while initializing validator view', () => {
    spyOn(component.bulkWageService, 'getBulkWageWorkflowDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.initializeValidatorView();
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should read transaction data from token', inject([RouterDataToken], token => {
    token.payload = '{"id": 657}';
    component.readTransactionDataFromToken(token);
    expect(component.requestId).toBe(657);
  }));

  it('should download updated csv', () => {
    spyOn(component, 'saveCsvFile').and.callThrough();
    component.downloadUpdatedCsvFile();
    expect(component.saveCsvFile).toHaveBeenCalled();
  });

  it('should throw error while downloading csv', () => {
    spyOn(component.bulkWageService, 'downloadActiveContributorsCSV').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError');
    component.downloadUpdatedCsvFile();
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should save and handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.handleBulkWageWorkflow(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_BULK_WAGE_UPDATE_EDIT]);
  });
});
