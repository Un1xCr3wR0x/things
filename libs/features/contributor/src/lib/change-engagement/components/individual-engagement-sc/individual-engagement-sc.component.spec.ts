/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  RouterConstants
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  changedEngagementData,
  changeEngagementEstablishment,
  changeEngagementPerson,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  engagementData,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent } from '../../../shared/components';
import { Contributor, EngagementDetails, Establishment, PersonalInformation } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { IndividualEngagementScComponent } from './individual-engagement-sc.component';

describe('IndividualEngagementScComponent', () => {
  let component: IndividualEngagementScComponent;
  let fixture: ComponentFixture<IndividualEngagementScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [IndividualEngagementScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: Location, useValue: { back: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'change' }, { path: 'edit' }]);
    component.checkEditMode();

    expect(component.isEditMode).toBeTruthy();
  }));

  it('should read keys from token', inject([RouterDataToken], token => {
    token.tabIndicator = 2;
    component.isEditMode = true;
    component.isAppPrivate = true;
    spyOn(component, 'readKeysFromToken').and.callThrough();
    spyOn(component, 'initializeFromToken');
    component.setDataForView();
    expect(component.readKeysFromToken).toHaveBeenCalled();
  }));

  it('should get data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    component.isScanEdit = true;
    component.isEditMode = true;
    const contributor: Contributor = new Contributor();
    contributor.person = new PersonalInformation().fromJsonToObject(changeEngagementPerson);
    contributor.active = true;
    spyOn(component, 'getEstablishmentDetails').and.returnValue(
      of(bindToObject(new Establishment(), changeEngagementEstablishment))
    );
    spyOn(component, 'getContributorDetails').and.returnValue(of(contributor));
    spyOn(component, 'getEngagementDetails').and.returnValue(
      of(new EngagementDetails().fromJsonToObject(engagementData))
    );
    spyOn(component, 'getRequiredDocuments');
    component.getDataForView();

    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
    expect(component.engagement).toBeDefined();
  });

  it('should throw error on getting data for view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component, 'getEstablishmentDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getDataForView();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should verify engagement wage after change', () => {
    component.verifyEngagementWage(new EngagementDetails().fromJsonToObject(changedEngagementData));

    expect(component.isEngagementVerified).toBeTruthy();
  });

  it('should throw error on verifying engagement wage', () => {
    spyOn(component.manageWageService, 'verifyWageChange').and.returnValue(throwError(genericError));
    component.verifyEngagementWage(new EngagementDetails().fromJsonToObject(changedEngagementData));

    expect(component.isEngagementVerified).toBeFalsy();
  });

  it('should modify engagement wage ', () => {
    component.isEditMode = true;
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    spyOn(component, 'getRequiredDocuments').and.callThrough();
    component.changeEngagementWizard = new ProgressWizardDcComponent();
    component.engagementForm.addControl('engagementDetails', new FormGroup({}));
    spyOn(component.changeEngagementWizard, 'setNextItem');
    component.modifyEngagementWage(new EngagementDetails().fromJsonToObject(changedEngagementData));

    expect(component.getRequiredDocuments).toHaveBeenCalled();
  });

  it('should throw error on modify engagement wage ', () => {
    spyOn(component, 'showError');
    spyOn(component.manageWageService, 'modifyEnagagementPeriodWage').and.returnValue(throwError(genericError));
    component.engagementForm.addControl('engagementDetails', new FormGroup({}));
    component.modifyEngagementWage(new EngagementDetails().fromJsonToObject(changedEngagementData));

    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw mandatory error message on save and next', () => {
    spyOn(component, 'showMandatoryFieldsError');
    const fb: FormBuilder = new FormBuilder();
    component.engagementForm.addControl(
      'engagementDetails',
      fb.group({
        english: [null, { validators: Validators.required }]
      })
    );
    component.modifyEngagementWage(new EngagementDetails().fromJsonToObject(changedEngagementData));
    expect(component.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should get the required documents after period changed', () => {
    component.periodChanged = true;
    spyOn(component, 'nextTab');
    component.getRequiredDocuments();

    expect(component.nextTab).toHaveBeenCalled();
  });

  it('should navigate to previous section', () => {
    component.currentTab = 2;
    component.changeEngagementWizard = new ProgressWizardDcComponent();
    spyOn(component.changeEngagementWizard, 'setNextItem');
    component.navigateToPreviousSection();

    expect(component.currentTab).toBe(1);
  });

  it('should submit changed engagement', () => {
    let contributor = new Contributor();
    contributor.person = new PersonalInformation().fromJsonToObject(changeEngagementPerson);
    component.contributor = contributor;
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const fb = new FormBuilder();
    component.engagementForm.addControl('comments', fb.group({ comments: 'test' }));
    spyOn(component.location, 'back');
    component.submitChangedEngagement();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should submit changed engagement in edit mode', () => {
    component.isEditMode = true;
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const fb = new FormBuilder();
    component.engagementForm.addControl('comments', fb.group({ comments: 'test' }));
    component.engagementForm.addControl(
      'engagementDetails',
      fb.group({ penalty: fb.group({ english: 'Yes', arabic: '' }) })
    );
    spyOn(component.router, 'navigate');
    spyOn(component, 'saveWorkflowInEdit').and.callThrough();
    component.submitChangedEngagement();

    expect(component.saveWorkflowInEdit).toHaveBeenCalled();
  });

  it('should throw error on submit changed engagement', () => {
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const fb = new FormBuilder();
    component.engagementForm.addControl('comments', fb.group({ comments: 'test' }));
    spyOn(component.manageWageService, 'submitEngagementAfterChange').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitChangedEngagement();

    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on save workflow in edit', () => {
    const fb = new FormBuilder();
    component.engagementForm.addControl('comments', fb.group({ comments: 'test' }));
    component.engagementForm.addControl(
      'engagementDetails',
      fb.group({ penalty: fb.group({ english: 'Yes', arabic: '' }) })
    );
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveWorkflowInEdit(new BilingualText());

    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on mandatory documents', () => {
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError');
    component.submitChangedEngagement();

    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should navigate on selecting wizard', () => {
    component.selectWizard(1);
    expect(component.currentTab).toBe(2);
  });

  it('should navigate to profile', () => {
    spyOn(component.location, 'back');
    component.navigateBack();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should navigate to inbox of validator 1', () => {
    spyOn(component.router, 'navigate');
    component.isEditMode = true;
    component.isAppPrivate = true;
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/validator/change-engagement']);
  });

  it('should navigate to inbox of establishment admin', () => {
    spyOn(component.router, 'navigate');
    component.isEditMode = true;
    component.isAppPrivate = false;
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
  });

  it('should cancel the transaction if changes are made', () => {
    component.isPeriodEditInProgress = true;
    component.counter = 1;
    component.periodChanged = true;
    const fb: FormBuilder = new FormBuilder();
    component.engagementForm.addControl(
      'engagementDetails',
      fb.group({
        english: [null, { validators: Validators.required }]
      })
    );
    spyOn(component, 'showModal');
    component.cancelTransaction();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should cancel transaction if no changes are made', () => {
    component.isPeriodEditInProgress = false;
    component.counter = 0;
    component.periodChanged = false;
    const fb: FormBuilder = new FormBuilder();
    component.engagementForm.addControl(
      'engagementDetails',
      fb.group({
        english: [null, { validators: Validators.required }]
      })
    );
    spyOn(component, 'navigateBack');
    component.cancelTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should trigger popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component.modalService, 'show');
    component.showModal(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });

  it('should hide popup', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should confirm cancel validator edit transaction', () => {
    component.modalRef = new BsModalRef();
    component.isEditMode = true;
    component.periodChanged = true;
    component.isAppPrivate = true;
    spyOn(component, 'cancelValidatorEditTransaction').and.callThrough();
    spyOn(component, 'navigateBack');
    component.confirm();
    expect(component.navigateBack).toHaveBeenCalled();
    expect(component.cancelValidatorEditTransaction).toHaveBeenCalled();
  });

  it('should confirm cancel in csr after save and next', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.periodChanged = true;
    spyOn(component, 'navigateBack');
    component.confirm();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should confirm cancel on csr view', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.isEditMode = false;
    spyOn(component, 'navigateBack');
    component.confirm();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on validator edit transaction', () => {
    spyOn(component, 'showError');
    spyOn(component.contributorService, 'revertTransaction').and.returnValue(throwError(genericError));
    component.cancelValidatorEditTransaction();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should toggle period edit flag', () => {
    component.togglePeriodEditFlag(true);
    expect(component.isPeriodEditInProgress).toBeTruthy();
  });
});
