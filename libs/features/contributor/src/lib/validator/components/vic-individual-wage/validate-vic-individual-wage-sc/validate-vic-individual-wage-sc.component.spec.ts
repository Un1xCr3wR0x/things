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
  TransferContributorServiceStub,
  UpdateVICServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { Contributor, ContributorBPMRequest, VicWageUpdateDetails } from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EstablishmentService,
  TransferContributorService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';
import { ValidateVicIndividualWageScComponent } from './validate-vic-individual-wage-sc.component';

describe('ValidateVicIndividualWageScComponent', () => {
  let component: ValidateVicIndividualWageScComponent;
  let fixture: ComponentFixture<ValidateVicIndividualWageScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateVicIndividualWageScComponent],
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
        { provide: VicWageUpdateService, useClass: UpdateVICServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateVicIndividualWageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component, 'initializeVICWagePage');
    component.ngOnInit();
    expect(component.initializeVICWagePage).toHaveBeenCalled();
  });

  it('should initialize the validator view on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(of(new Contributor()));
    spyOn(component.updateVicService, 'getVicWageUpdateDetails').and.returnValue(of(new VicWageUpdateDetails()));
    component.initializeVICWagePage();
    expect(component.contributor).toBeDefined();
    expect(component.updateVicWorkflowDetails).toBeDefined();
  });

  it('should throw error get details when page loads', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component.updateVicService, 'getVicWageUpdateDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeVICWagePage();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should save and handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.vicWageWorkflowEvents(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/wage/update/vic-wage/edit']);
  });
});
