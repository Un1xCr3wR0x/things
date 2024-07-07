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
  ContributorsWageMockService,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  TerminateVicServiceStub,
  TransferContributorServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, TerminateContributorDetails } from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EstablishmentService,
  TerminateVicService,
  TransferContributorService,
  VicService
} from '../../../../shared/services';
import { ValidateTerminateVicScComponent } from './validate-terminate-vic-sc.component';

describe('ValidateTerminateVicScComponent', () => {
  let component: ValidateTerminateVicScComponent;
  let fixture: ComponentFixture<ValidateTerminateVicScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateTerminateVicScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: TransferContributorService, useClass: TransferContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: TerminateVicService, useClass: TerminateVicServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTerminateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component, 'initializeTerminateVic');
    component.ngOnInit();
    expect(component.initializeTerminateVic).toHaveBeenCalled();
  });

  it('should display data on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(of(new Contributor()));
    spyOn(component.terminateVicService, 'getTerminateVicDetails').and.returnValue(
      of(new TerminateContributorDetails())
    );
    component.initializeTerminateVic();
    expect(component.contributor).toBeDefined();
    expect(component.terminateVicDetails).toBeDefined();
  });

  it('should throw error get details when page loads', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.terminateVicService, 'getTerminateVicDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeTerminateVic();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should save and handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.terminateVicWorkflowEvents(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/terminate-vic/edit']);
  });
});
