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
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorServiceStub,
  ContributorsWageMockService,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  TransferContributorServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorBPMRequest, Establishment } from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EstablishmentService,
  TransferContributorService
} from '../../../../shared/services';
import { ValidateTransferAllContributorScComponent } from './validate-transfer-all-contributor-sc.component';

describe('ValidateTransferAllContributorScComponent', () => {
  let component: ValidateTransferAllContributorScComponent;
  let fixture: ComponentFixture<ValidateTransferAllContributorScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateTransferAllContributorScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: TransferContributorService, useClass: TransferContributorServiceStub },
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
    fixture = TestBed.createComponent(ValidateTransferAllContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on page load', () => {
    component.registrationNo = 200085744;
    component.requestId = 25;
    spyOn(component, 'getDataToDisplay');
    component.ngOnInit();
    expect(component.getDataToDisplay).toHaveBeenCalled();
  });

  it('should read transaction data from token', inject([RouterDataToken], token => {
    token.payload = '{"requestId": 657}';
    component.readTransactionDataFromToken(token);
    expect(component.requestId).toBe(657);
  }));

  it('should get data to display', () => {
    component.registrationNo = 200085744;
    component.requestId = 20;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    component.getDataToDisplay();
    expect(component.transferAllDetails).toBeDefined();
    expect(component.contributorDetails).toBeDefined();
  });

  it('should throw error on get data to display', () => {
    component.registrationNo = 200085744;
    component.requestId = 20;
    spyOn(component.transferContributorService, 'getTransferAllDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.getDataToDisplay();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should save and handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.transferAllWorkflowEvent(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/transfer/all/edit']);
  });
});
