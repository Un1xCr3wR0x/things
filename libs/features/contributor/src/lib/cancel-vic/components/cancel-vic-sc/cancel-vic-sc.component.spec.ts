/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  CancelVicServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent, VicBaseScComponent } from '../../../shared/components';
import { CancelContributorRequest, Contributor, VicContributionDetails } from '../../../shared/models';
import {
  CancelVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import { CancelVicScComponent } from './cancel-vic-sc.component';

describe('CancelVicScComponent', () => {
  let component: CancelVicScComponent;
  let fixture: ComponentFixture<CancelVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CancelVicScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: CancelVicService, useClass: CancelVicServiceStub },
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should intialize view', () => {
    component.socialInsuranceNo = 423976217;
    component.initializeView();
    expect(component.vicEngagement).toBeDefined();
  });

  it('should throw error no getting data to dispaly', () => {
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.initializeView();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on fetching contribution details', () => {
    spyOn(component, 'showError');
    spyOn(component.vicService, 'getVicContributionDetails').and.returnValue(throwError(genericError));
    component.initializeView();
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

  it('should get valid bank details without workflow', () => {
    component.contributor = new Contributor();
    component.contributor.bankAccountDetails = new BankAccount();
    spyOn(component.contributorService, 'getBankDetailsWorkflowStatus').and.returnValue(of(null));
    component.checkBankWorkflow().subscribe();
    expect(component.bankAccountDetails).toBeDefined();
  });

  it('should save vic cancel details', () => {
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component, 'setNextSection');
    component.onCancelVicSave(new CancelContributorRequest());
    expect(component.hasSaved).toBeTruthy();
  });

  it('should throw mandatory fields error on save', () => {
    spyOn(ContributorBaseScComponent.prototype, 'showMandatoryFieldsError');
    component.onCancelVicSave(null);
    expect(ContributorBaseScComponent.prototype.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw error on saving vic cancel', () => {
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component.cancelVicService, 'saveVicCancellation').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.onCancelVicSave(new CancelContributorRequest());
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
    component.cancelVicForm.addControl('bankDetailsForm', bankForm);
    const types = component.identifyTransactionTypes();
    expect(types.length).toEqual(2);
  });

  it('should refresh document', () => {
    spyOn(ContributorBaseScComponent.prototype, 'refreshDocument');
    component.refreshDoc(new DocumentItem());
    expect(ContributorBaseScComponent.prototype.refreshDocument).toHaveBeenCalled();
  });

  it('should trigger confirmation pop up on submit', () => {
    spyOn(component, 'showModal');
    component.contributor = new Contributor();
    component.vicContributionDetails = new VicContributionDetails();
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    component.onSubmitCancelVic();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should submit transaction when user confirms', () => {
    component.modalRef = new BsModalRef();
    const fb = new FormBuilder();
    component.cancelVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'navigateBack');
    component.submitCancelVicRequest();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should submit transaction on edit mode', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.cancelVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'submitTransactionOnEdit').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitCancelVicRequest();
    expect(component.submitTransactionOnEdit).toHaveBeenCalled();
  });

  it('should throw mandatory document error on submit', () => {
    spyOn(component, 'checkDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError');
    component.contributor = new Contributor();
    component.onSubmitCancelVic();
    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    const fb = new FormBuilder();
    component.cancelVicForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component.cancelVicService, 'submitVicCancellation').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitCancelVicRequest();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should cancel vic transaction', () => {
    spyOn(component, 'checkConfirmationRequired').and.returnValue(true);
    spyOn(component, 'showModal');
    component.onTransactionCancel(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    spyOn(component, 'checkConfirmationRequired').and.returnValue(false);
    spyOn(component.router, 'navigate');
    spyOn(component, 'navigateBack').and.callThrough();
    component.onTransactionCancel(component.vicCancelConfirmationMessage);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should revert cancel vic  transaction', () => {
    spyOn(component, 'checkRevertRequired').and.returnValue(true);
    spyOn(component, 'hideModal');
    spyOn(component, 'revertCancelVicTransaction').and.callThrough();
    spyOn(component.router, 'navigate');
    component.confirmCancel();
    expect(component.revertCancelVicTransaction).toHaveBeenCalled();
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
    component.revertCancelVicTransaction();
    expect(component.showError).toHaveBeenCalled();
  });
});
