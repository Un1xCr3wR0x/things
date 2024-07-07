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
  ApplicationTypeToken,
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
  TerminateContributorServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent } from '../../../shared/components';
import { PersonTypesEnum } from '../../../shared/enums';
import { Contributor, EngagementDetails, Establishment } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TerminateContributorService
} from '../../../shared/services';
import { TerminateContributorScComponent } from './terminate-contributor-sc.component';

describe('TerminateContributorScComponent', () => {
  let component: TerminateContributorScComponent;
  let fixture: ComponentFixture<TerminateContributorScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [TerminateContributorScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: TerminateContributorService, useClass: TerminateContributorServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should fetch data to display', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    const contributor = new Contributor();
    contributor.person.personType = PersonTypesEnum.SAUDI;
    spyOn(component, 'getContributorDetails').and.returnValue(of(contributor));
    spyOn(component, 'getEngagementDetails').and.returnValue(
      of(new EngagementDetails().fromJsonToObject(engagementData))
    );
    component.fetchDataToDisplay();
    expect(component.engagement).toBeDefined();
  });

  it('should throw error on fetching data', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    spyOn(component.engagementService, 'getEngagementDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.fetchDataToDisplay();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should fetch data to display in edit mode', () => {
    component.socialInsuranceNo = 423641258;
    component.engagementId = 1569355076;
    component.isEditMode = true;
    component.fetchDataToDisplay();
    expect(component.terminationDetails).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should refresh document', () => {
    component.establishment = new Establishment();
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });

  it('should submit transaction by csr', () => {
    component.isAppPrivate = true;
    const fb = new FormBuilder();
    const terminateForm = fb.group({ leavingDate: fb.group({ gregorian: null, hijri: null }) });
    component.terminateForm.addControl('terminateDetails', terminateForm);
    component.terminateForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should submit transaction on validator edit', () => {
    component.isEditMode = true;
    component.isAppPrivate = true;
    const fb = new FormBuilder();
    const terminateForm = fb.group({ leavingDate: fb.group({ gregorian: null, hijri: null }) });
    component.terminateForm.addControl('terminateDetails', terminateForm);
    component.terminateForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on submit transaction', () => {
    const fb = new FormBuilder();
    const terminateForm = fb.group({ leavingDate: fb.group({ gregorian: null, hijri: null }) });
    component.terminateForm.addControl('terminateDetails', terminateForm);
    component.terminateForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'showError');
    spyOn(component.terminateContributorService, 'submitTerminateTransaction').and.returnValue(
      throwError(genericError)
    );
    component.submitTransaction();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw mandatory field error', () => {
    const fb = new FormBuilder();
    const terminateForm = fb.group({
      leavingDate: fb.group({ gregorian: [null, { validators: Validators.required }], hijri: null })
    });
    component.terminateForm.addControl('terminateDetails', terminateForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should throw mandatory document error', () => {
    const fb = new FormBuilder();
    const terminateForm = fb.group({ leavingDate: fb.group({ gregorian: null, hijri: null }) });
    component.terminateForm.addControl('terminateDetails', terminateForm);
    component.isAppPrivate = true;
    component.isDocumentsRequired = true;
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should check for changes and show modal', () => {
    const fb = new FormBuilder();
    const docForm = fb.group({ changed: true });
    component.terminateForm.addControl('docStatus', docForm);
    spyOn(component, 'showModal').and.callThrough();
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(1);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    component.checkForChanges(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should check for changes and navigate back', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(0);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'checkDocumentStatus').and.returnValue(false);
    spyOn(component, 'navigateBack');
    component.checkForChanges(null);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should revert the transaction', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkDocumentStatus').and.returnValue(true);
    spyOn(component.contributorService, 'revertTransaction').and.callThrough();
    spyOn(component.router, 'navigate');
    component.isEditMode = true;
    component.checkRevertRequired();
    expect(component.contributorService.revertTransaction).toHaveBeenCalled();
  });

  it('should not revert the transaction and navigate back', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkDocumentStatus').and.returnValue(false);
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.isEditMode = false;
    component.checkRevertRequired();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on reverting transaction', () => {
    spyOn(component.contributorService, 'revertTransaction').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.revertTerminationRequest();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should navigate to validator on cancel by validator in edit mode', () => {
    component.isEditMode = true;
    component.isAppPrivate = true;
    spyOn(component.router, 'navigate');
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should navigate to todolist on cancel by est admin in edit mode', () => {
    component.isEditMode = true;
    spyOn(component.router, 'navigate');
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
