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
  WorkflowServiceStub,
  TransferContributorServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, Establishment } from '../../../../shared/models';
import { ContributorService, EstablishmentService, TransferContributorService } from '../../../../shared/services';
import { ValidateTransferContributorScComponent } from './validate-transfer-contributor-sc.component';

describe('ValidateTransferContributorScComponent', () => {
  let component: ValidateTransferContributorScComponent;
  let fixture: ComponentFixture<ValidateTransferContributorScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateTransferContributorScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
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
    fixture = TestBed.createComponent(ValidateTransferContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on page load', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component, 'getDataToDisplay');
    component.ngOnInit();
    expect(component.getDataToDisplay).toHaveBeenCalled();
  });

  it('should get data to display', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.getDataToDisplay();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
    expect(component.transferDetails).toBeDefined();
  });

  it('should throw error on get data to display', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.transferContributorService, 'getTransferDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.getDataToDisplay();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorBaseScComponent.prototype, 'saveWorkflow');
    component.transferWorkflowEvents(0);
    expect(ValidatorBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/transfer/individual/edit']);
  });
});
