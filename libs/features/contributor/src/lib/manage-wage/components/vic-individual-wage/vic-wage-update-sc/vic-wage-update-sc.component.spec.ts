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
  DocumentItem,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AddVICServiceStub,
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
  ProgressWizardDcMockComponent,
  UpdateVICServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { VicEngagementPayload } from '../../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';
import { VicWageUpdateScComponent } from './vic-wage-update-sc.component';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { Location } from '@angular/common';

describe('VicWageUpdateScComponent', () => {
  let component: VicWageUpdateScComponent;
  let fixture: ComponentFixture<VicWageUpdateScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [VicWageUpdateScComponent, ProgressWizardDcMockComponent],
      providers: [
        { provide: Location, useValue: { back: () => {} } },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: VicWageUpdateService, useClass: UpdateVICServiceStub },
        { provide: AddVicService, useClass: AddVICServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VicWageUpdateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'update' }, { path: 'vic' }, { path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should handle selecting wizard', () => {
    component.selectFormWizard(0);
    expect(component.activeTab).toBe(0);
  });

  it('should get data to display', () => {
    component.socialInsuranceNo = 423976217;
    component.getDataToDisplay();
    expect(component.vicEngagementDetails).toBeDefined();
  });

  it('should throw error no getting data to dispaly', () => {
    spyOn(component.contributorService, 'getContributorBySin').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getDataToDisplay();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should initialize view in edit mode', inject([RouterDataToken], token => {
    token.tabIndicator = 1;
    component.isEditMode = true;
    component.socialInsuranceNo = 423976217;
    spyOn(ContributorBaseScComponent.prototype, 'initializeFromToken');
    spyOn(component.vicWageUpdateService, 'getVicWageUpdateDetails').and.callThrough();
    component.initializeViewForEdit();
    expect(component.vicWageUpdateService.getVicWageUpdateDetails).toHaveBeenCalled();
  }));

  it('should save updated wage details', () => {
    component.progressWizard = new ProgressWizardDcComponent();
    component.onUpdateVicWage(new VicEngagementPayload());
    expect(component.hasSaved).toBeTruthy();
  });

  it('should throw mandatory fields error on save', () => {
    spyOn(ContributorBaseScComponent.prototype, 'showMandatoryFieldsError');
    component.onUpdateVicWage(null);
    expect(ContributorBaseScComponent.prototype.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw error on saving  updated wage details', () => {
    spyOn(component.vicWageUpdateService, 'updateVicWage').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.updateVicWage(new VicEngagementPayload());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should refresh document', () => {
    spyOn(ContributorBaseScComponent.prototype, 'refreshDocument');
    component.refreshDoc(new DocumentItem());
    expect(ContributorBaseScComponent.prototype.refreshDocument).toHaveBeenCalled();
  });

  it('should submit vic wage update', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    spyOn(component.location, 'back');
    component.onSubmitVicWageUpdate();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should submit transaction on edit mode', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'submitTransactionOnEdit').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitVicUpdate();
    expect(component.submitTransactionOnEdit).toHaveBeenCalled();
  });

  it('should throw mandatory document error on submit', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError');
    component.onSubmitVicWageUpdate();
    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component.vicWageUpdateService, 'submitVicWageUpdate').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitVicUpdate();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should cancel vic wage update transaction after changes', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(1);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'showModal').and.callThrough();
    component.cancelVicWageUpdate(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should cancel transaction without anny changes', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(0);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    const fb = new FormBuilder();
    const docForm = fb.group({ changed: false });
    component.parentForm.addControl('docStatus', docForm);
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.cancelVicWageUpdate(null);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should confirm cancel for csr', () => {
    component.isEditMode = false;
    spyOn(component, 'hideModal');
    spyOn(component, 'navigateBack');
    component.confirmCancel();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should confirm cancel and revert transaction in edit mode', () => {
    component.isEditMode = true;
    component.hasSaved = true;
    spyOn(component, 'navigateBack');
    spyOn(component, 'hideModal');
    component.confirmCancel();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error  on reverting  transaction', () => {
    spyOn(component, 'showError');
    spyOn(component.vicService, 'revertTransaction').and.returnValue(throwError(genericError));
    component.revertVicWageTransaction();
    expect(component.showError).toHaveBeenCalled();
  });

  xit('should navigate to previous section', () => {
    component.activeTab = 1;
    component.progressWizard = new ProgressWizardDcComponent();
    spyOn(component.progressWizard, 'setNextItem');
    component.setPreviousSection();
    expect(component.activeTab).toBe(0);
  });
});
