/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  AddVICServiceStub,
  AlertServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub,
  VicServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { DocumentTransactionType, PurposeOfRegsitrationEnum } from '../../../../shared/enums';
import { ContributorBPMRequest } from '../../../../shared/models';
import { AddVicService, ContributorService, EstablishmentService, VicService } from '../../../../shared/services';
import { ValidateAddVicScComponent } from './validate-add-vic-sc.component';

describe('ValidateAddVicScComponent', () => {
  let component: ValidateAddVicScComponent;
  let fixture: ComponentFixture<ValidateAddVicScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateAddVicScComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AddVicService, useClass: AddVICServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAddVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    spyOn(component, 'initializeValidatorPage');
    component.ngOnInit();
    expect(component.initializeValidatorPage).toHaveBeenCalled();
  });

  it('should set flag for Doctor', inject([RouterDataToken], token => {
    token.assignedRole = 'Doctor';
    component.checkDoctorView();
    expect(component.isDoctor).toBeTruthy();
    expect(component.canReject).toBeFalsy();
    expect(component.canReturn).toBeFalsy();
  }));

  it('should display data on page load', () => {
    component.socialInsuranceNo = 424931258;
    component.engagementId = 1536955076;
    component.initializeValidatorPage();
    expect(component.contributor).toBeDefined();
    expect(component.vicEngagementDetails).toBeDefined();
  });

  it('should throw error for display data on page load', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.initializeValidatorPage();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should get document type for purpose working outside saudi', () => {
    const type = component.checkDocumentTransactionType(PurposeOfRegsitrationEnum.WORKING_OUTSIDE_SAUDI);
    expect(type[0]).toBe(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI);
  });

  it('should get document type for purpose freelancer', () => {
    const type = component.checkDocumentTransactionType(PurposeOfRegsitrationEnum.FREELANCER);
    expect(type[0]).toBe(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL);
  });

  it('should get document type for purpose government employee', () => {
    const type = component.checkDocumentTransactionType(PurposeOfRegsitrationEnum.GOV_EMP_NOT_UNDER_PPA);
    expect(type[0]).toBe(DocumentTransactionType.REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA);
  });

  it('should get document type for purpose international', () => {
    const type = component.checkDocumentTransactionType(PurposeOfRegsitrationEnum.EMP_INT_POL_MIL);
    expect(type[0]).toBe(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS);
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/add-vic/edit']);
  });

  it('should handle vic workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.handleVicWorkflowEvent(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });
});
