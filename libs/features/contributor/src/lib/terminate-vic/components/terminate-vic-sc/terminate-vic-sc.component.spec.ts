/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  BankAccount,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  TerminateVicServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent, VicBaseScComponent } from '../../../shared/components';
import { Contributor, TerminateContributorPayload, VicContributionDetails } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TerminateVicService,
  VicService
} from '../../../shared/services';
import { TerminateVicScComponent } from './terminate-vic-sc.component';

describe('TerminateVicScComponent', () => {
  let component: TerminateVicScComponent;
  let fixture: ComponentFixture<TerminateVicScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [TerminateVicScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: TerminateVicService, useClass: TerminateVicServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data to display', () => {
    component.socialInsuranceNo = 423976217;
    component.engagementId = 1573223353;
    component.initializeDataToDisplay();
    expect(component.vicEngagementDetails).toBeDefined();
  });

  it('should throw error no getting data to dispaly', () => {
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.initializeDataToDisplay();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should initialize view in edit mode', inject([RouterDataToken], token => {
    token.tabIndicator = 1;
    component.isEditMode = true;
    const doc = new DocumentItem();
    doc.name.english = 'IBAN';
    spyOn(VicBaseScComponent.prototype, 'initializeFromToken');
    spyOn(component.documentService, 'getDocuments').and.returnValue(of([doc]));
    spyOn(component, 'getDocumentsOnEdit').and.callThrough();
    component.getViewForEdit();
    expect(component.getDocumentsOnEdit).toHaveBeenCalled();
  }));

  it('should throw error on fetching contribution details', () => {
    component.socialInsuranceNo = 423976217;
    component.engagementId = 1573223353;
    spyOn(component, 'showError');
    spyOn(component.vicService, 'getVicContributionDetails').and.returnValue(throwError(genericError));
    component.fetchContributionDetails().subscribe();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should handle termination date change', () => {
    spyOn(component, 'fetchContributionDetails').and.callThrough();
    component.terminationDateChange(new Date());
    expect(component.fetchContributionDetails).toHaveBeenCalled();
  });

  it('should get valid bank details without workflow', () => {
    component.contributor = new Contributor();
    component.contributor.bankAccountDetails[0] = new BankAccount();
    spyOn(component.contributorService, 'getBankDetailsWorkflowStatus').and.returnValue(of(null));
    component.checkBankWorkflow().subscribe();
    expect(component.bankAccount).toBeDefined();
  });

  it('should save vic termination details', () => {
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component, 'setNextSection');
    component.onSaveTerminateVic(new TerminateContributorPayload());
    expect(component.hasSaved).toBeTruthy();
  });

  it('should throw mandatory fields error on save', () => {
    spyOn(ContributorBaseScComponent.prototype, 'showMandatoryFieldsError');
    component.onSaveTerminateVic(null);
    expect(ContributorBaseScComponent.prototype.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw error on saving vic termination', () => {
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component.terminateVicService, 'saveVicTermination').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.onSaveTerminateVic(new TerminateContributorPayload());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should fetch bank details when iban is changed', () => {
    spyOn(component.lookupService, 'getBank').and.callThrough();
    component.getBankDetails('51');
    expect(component.lookupService.getBank).toHaveBeenCalled();
  });

  it('should get iban document if iban is changed', () => {
    component.contributor = new Contributor();
    const fb = new FormBuilder();
    const bankForm = fb.group({ ibanAccountNo: 'SA595504ASG66086110DS519' });
    component.terminateVicForm.addControl('bankDetailsForm', bankForm);
    const types = component.identifyTransactionTypes();
    expect(types.length).toEqual(2);
  });

  it('should refresh document', () => {
    spyOn(ContributorBaseScComponent.prototype, 'refreshDocument');
    component.refreshDoc(new DocumentItem());
    expect(ContributorBaseScComponent.prototype.refreshDocument).toHaveBeenCalled();
  });

  it('should submit vic termination when user confirms', () => {
    const fb = new FormBuilder();
    component.terminateVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitVicTermination();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should submit transaction on edit mode', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.terminateVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'submitTransactionOnEdit').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitVicTermination();
    expect(component.submitTransactionOnEdit).toHaveBeenCalled();
  });

  it('should trigger confirmation pop up on submit', () => {
    spyOn(component, 'showModal');
    component.contributor = new Contributor();
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    component.onSubmitTerminateVic();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should throw mandatory document error on submit', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError');
    component.onSubmitTerminateVic();
    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    const fb = new FormBuilder();
    component.terminateVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component.terminateVicService, 'submitVicTermination').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitVicTermination();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should cancel vic termination', () => {
    spyOn(component, 'checkConfirmationRequired').and.returnValue(true);
    spyOn(component, 'showModal');
    component.cancelTerminateVic(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    spyOn(component, 'checkConfirmationRequired').and.returnValue(false);
    spyOn(component.router, 'navigate');
    spyOn(component, 'navigateBack').and.callThrough();
    component.cancelTerminateVic(null);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should revert terminate vic  transaction', () => {
    spyOn(component, 'checkRevertRequired').and.returnValue(true);
    spyOn(component, 'hideModal');
    spyOn(component, 'revertTransaction').and.callThrough();
    spyOn(component.router, 'navigate');
    component.confirmCancel();
    expect(component.revertTransaction).toHaveBeenCalled();
  });

  it('should navigate back without reverting the transaction', () => {
    spyOn(component, 'checkRevertRequired').and.returnValue(false);
    spyOn(component, 'hideModal');
    spyOn(component, 'navigateBack');
    component.confirmCancel();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error  on reverting  transaction', () => {
    spyOn(component, 'showError');
    spyOn(component.vicService, 'revertTransaction').and.returnValue(throwError(genericError));
    component.revertTransaction();
    expect(component.showError).toHaveBeenCalled();
  });
});
