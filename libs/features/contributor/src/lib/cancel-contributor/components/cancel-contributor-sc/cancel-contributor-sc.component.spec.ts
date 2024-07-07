/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  CancelContributorServiceStub,
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
import { CancelContributorRequest, Contributor, EngagementDetails, Establishment } from '../../../shared/models';
import {
  CancelContributorService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { CancelContributorScComponent } from './cancel-contributor-sc.component';

describe('CancelContributorScComponent', () => {
  let component: CancelContributorScComponent;
  let fixture: ComponentFixture<CancelContributorScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CancelContributorScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: CancelContributorService, useClass: CancelContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component, 'setKeysForView');
    spyOn(component, 'fetchDataToDisplay');
    component.ngOnInit();
    expect(component.fetchDataToDisplay).toHaveBeenCalled();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should fetch data to display', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    spyOn(component.engagementService, 'getEngagementDetails').and.returnValue(
      of(new EngagementDetails().fromJsonToObject(engagementData))
    );
    component.fetchDataToDisplay();
    expect(component.engagement).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should throw error on fetching data', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    spyOn(component.engagementService, 'getEngagementDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.fetchDataToDisplay();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should fetch data to display in edit mode', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    component.isEditMode = true;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.fetchDataToDisplay();
    expect(component.cancellationDetails).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should refresh document', () => {
    component.establishment = new Establishment();
    spyOn(ContributorBaseScComponent.prototype, 'refreshDocument');
    component.refreshDocument(new DocumentItem());
    expect(ContributorBaseScComponent.prototype.refreshDocument).toHaveBeenCalled();
  });

  it('should submit transaction by csr', () => {
    const fb = new FormBuilder();
    const cancelForm = fb.group({ cancellationReason: fb.group({ english: null, arabic: null }) });
    component.parentForm.addControl('cancelForm', cancelForm);
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkFormValidity').and.returnValue(true);
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    spyOn(component, 'checkFormValidity').and.returnValue(true);
    spyOn(component, 'assemblePayload').and.returnValue(new CancelContributorRequest());
    spyOn(component.cancelContributorService, 'submitCancelContributor').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitTransaction();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should submit transaction on validator edit', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkFormValidity').and.returnValue(true);
    spyOn(component, 'assemblePayload').and.returnValue(new CancelContributorRequest());
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should check for changes in screen', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('docStatus', fb.group({ changed: true }));
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(1);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'showModal').and.callThrough();
    component.checkForChanges(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should navigate back if no changes in screen', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(0);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'checkDocumentStatus').and.returnValue(false);
    spyOn(component, 'navigateBack');
    component.checkForChanges(null);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should pass form validity check', () => {
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const doc = new DocumentItem();
    doc.documentContent = 'true';
    component.documents = [doc];
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const isValid = component.checkFormValidity();
    expect(isValid).toBeTruthy();
  });

  it('should throw mandatory field error', () => {
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const fb = new FormBuilder();
    const cancelForm = fb.group({
      cancellationReason: fb.group({ english: [null, { validators: Validators.required }], arabic: null })
    });
    component.parentForm.addControl('cancelForm', cancelForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    spyOn(ContributorBaseScComponent.prototype, 'showMandatoryFieldsError');
    component.checkFormValidity();
    expect(ContributorBaseScComponent.prototype.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw mandatory document error', () => {
    component.establishment = new Establishment();
    component.establishment.gccEstablishment = undefined;
    const doc = new DocumentItem();
    component.documents = [doc];
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const flag = component.checkFormValidity();
    expect(flag).toBeFalsy();
  });

  it('should revert the transaction on validator edit cancel', () => {
    component.isEditMode = true;
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkDocumentStatus').and.returnValue(true);
    spyOn(component.contributorService, 'revertTransaction').and.callThrough();
    spyOn(component.router, 'navigate');
    component.checkRevertRequired();
    expect(component.contributorService.revertTransaction).toHaveBeenCalled();
  });

  it('should navigate back without revert on cancel', () => {
    spyOn(component, 'hideModal');
    spyOn(component, 'navigateBack');
    component.checkRevertRequired();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on reverting transaction', () => {
    spyOn(component.contributorService, 'revertTransaction').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.revertCancelRequest();
    expect(component.showError).toHaveBeenCalled();
  });
});
