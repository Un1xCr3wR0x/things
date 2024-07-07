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
  BilingualText,
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  noActiveEstablishmentError,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ProgressWizardDcMockComponent } from 'testing/mock-components';
import { ContributorBaseScComponent } from '../../../shared/components';
import { PurposeOfRegsitrationEnum } from '../../../shared/enums';
import {
  ContributorSinResponse,
  HealthRecordDetails,
  PersonalInformation,
  VicEngagementPayload
} from '../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import { AddVicScComponent } from './add-vic-sc.component';

describe('AddVicScComponent', () => {
  let component: AddVicScComponent;
  let fixture: ComponentFixture<AddVicScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [AddVicScComponent, ProgressWizardDcMockComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: AddVicService, useClass: AddVICServiceStub },
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
    fixture = TestBed.createComponent(AddVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should search for saudi person', () => {
    const query = 'NIN=1866985722&birthDate=1990-06-19&role=vic';
    const personDetails = new PersonalInformation();
    personDetails.personId = 1123408;
    spyOn(component.contributorService, 'getPersonDetails').and.returnValue(of(personDetails));
    spyOn(component.contributorService, 'setSin').and.returnValue(of(new ContributorSinResponse()));
    component.searchSaudiPerson(query, 1866985722);
    expect(component.activeTab).toBe(1);
  });

  it('should throw error on search', () => {
    const query = 'NIN=1866985722&birthDate=1990-06-19&role=vic';
    spyOn(component.contributorService, 'getPersonDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.searchSaudiPerson(query, 1866985722);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should save vic person', () => {
    component.progressWizard = new ProgressWizardDcComponent();
    spyOn(component, 'setNextTab').and.callThrough();
    component.onSavePerson(new PersonalInformation());
    expect(component.setNextTab).toHaveBeenCalled();
  });

  it('should throw mandatory error on saving person', () => {
    spyOn(component, 'showMandatoryFieldsError');
    component.onSavePerson(null);
    expect(component.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should update existing person', () => {
    component.socialInsuranceNo = 423641249;
    spyOn(component, 'setNextTab');
    spyOn(component, 'getVICWageCategories').and.returnValue(of([]));
    component.saveVicPerson(new PersonalInformation());
    expect(component.setNextTab).toHaveBeenCalled();
  });

  it('should throw error on updating person', () => {
    component.socialInsuranceNo = 423641249;
    spyOn(component.addVicService, 'updateVICPerson').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveVicPerson(new PersonalInformation());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on saving person', () => {
    spyOn(component.addVicService, 'saveVICPerson').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveVicPerson(new PersonalInformation());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should  handle purpose of registration change', () => {
    spyOn(component, 'getVICWageCategories').and.returnValue(of([]));
    component.handlePurposeOfRegistrationChange('Freelancer');
    expect(component.getVICWageCategories).toHaveBeenCalled();
  });

  it('should throw error on purpose of registration change', () => {
    spyOn(component, 'getVICWageCategories').and.returnValue(throwError(genericError));
    component.handlePurposeOfRegistrationChange('Freelancer');
    expect(component.getVICWageCategories).toHaveBeenCalled();
  });

  it('should save vic engagement details', () => {
    spyOn(component, 'setNextTab');
    spyOn(component, 'fetchHealthRecords').and.callThrough();
    component.onSaveVicEngagement(new VicEngagementPayload());
    expect(component.fetchHealthRecords).toHaveBeenCalled();
    expect(component.setNextTab).toHaveBeenCalled();
  });

  it('shoud show mandatory fields error on engagement save', () => {
    spyOn(component, 'showMandatoryFieldsError');
    component.onSaveVicEngagement(null);
    expect(component.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw error while saving engagement', () => {
    spyOn(component.addVicService, 'saveVicEngagement').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveVicEngagement(new VicEngagementPayload());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should save engagement in edit mode', () => {
    component.isEditMode = true;
    component.hasDoctorVerified = true;
    spyOn(component, 'getDocumentsOnEdit');
    spyOn(component, 'setNextTab');
    spyOn(component, 'fetchHealthRecords').and.returnValue(of([]));
    component.onSaveVicEngagement(new VicEngagementPayload());
    expect(component.fetchHealthRecords).toHaveBeenCalled();
    expect(component.setNextTab).toHaveBeenCalled();
  });

  xit('should trigger no active establishment pop up', () => {
    spyOn(component.addVicService, 'saveVicEngagement').and.returnValue(throwError(noActiveEstablishmentError));
    spyOn(component, 'showModal');
    component.saveVicEngagement(new VicEngagementPayload());
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should save health records details', () => {
    spyOn(component, 'setNextTab');
    component.saveHealthRecordDetails([new HealthRecordDetails()]);
    expect(component.setNextTab).toHaveBeenCalled();
  });

  it('should save health records details in edit mode', () => {
    component.isEditMode = true;
    spyOn(component, 'getDocumentsOnEdit');
    spyOn(component, 'setNextTab');
    component.saveHealthRecordDetails([new HealthRecordDetails()]);
    expect(component.setNextTab).toHaveBeenCalled();
    expect(component.getDocumentsOnEdit).toHaveBeenCalled();
  });

  it('should throw mandatory fields error on saving health records', () => {
    spyOn(component, 'showMandatoryFieldsError');
    component.saveHealthRecordDetails([]);
    expect(component.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should throw mandatory declartion error on saving health records', () => {
    spyOn(component.alertService, 'showErrorByKey');
    component.saveHealthRecordDetails(null);
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });

  it('should throw error on savong health records', () => {
    spyOn(component.addVicService, 'saveHealthRecordDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveHealthRecordDetails([new HealthRecordDetails()]);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should refresh document', () => {
    spyOn(ContributorBaseScComponent.prototype, 'refreshDocument');
    component.refreshDocument(new DocumentItem());
    expect(ContributorBaseScComponent.prototype.refreshDocument).toHaveBeenCalled();
  });

  it('should submit transaction', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: 'test' }));
    component.parentForm.get('vicSubmitCheck').setValue(true);
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    spyOn(component, 'setNextTab');
    component.onSubmitVicRegistration();
    expect(component.setNextTab).toHaveBeenCalled();
  });

  it('should throw mandatory documents error', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError');
    component.onSubmitVicRegistration();
    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should submit transaction in edit mode', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: 'test' }));
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    spyOn(component, 'submitTransactionOnEdit').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitVicRegistration();
    expect(component.submitTransactionOnEdit).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('comments', fb.group({ comments: 'test' }));
    spyOn(component.addVicService, 'submitVicRegistration').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitVicRegistration();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should initialize view on edit mode', inject([RouterDataToken], token => {
    token.tabIndicator = 4;
    spyOn(component, 'getEngagementDetailsInWorkflow').and.callThrough();
    const doctorReport = new DocumentItem();
    doctorReport.name.english = 'Doctor Report';
    spyOn(component.documentService, 'getDocuments').and.returnValue(of([doctorReport, new DocumentItem()]));
    spyOn(component, 'initializeFromToken');
    spyOn(component, 'setWizardOnEdit');
    component.initializeViewForEdit();
    expect(component.getEngagementDetailsInWorkflow).toHaveBeenCalled();
  }));

  it('should throw error while  initializing edit mode', () => {
    spyOn(component, 'initializeFromToken');
    spyOn(component, 'setWizardOnEdit');
    spyOn(component.addVicService, 'getVicEngagementDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.initializeViewForEdit();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should submit for doctor', () => {
    spyOn(component, 'submitTransactionOnEdit').and.returnValue(of(new BilingualText()));
    component.onDoctorSubmit();
    expect(component.submitTransactionOnEdit).toHaveBeenCalled();
  });

  it('should check for changes', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(1);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'showModal').and.callThrough();
    component.checkForChanges(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('it should navigate back in case of no changes', () => {
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(0);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'checkChangesInDocument').and.returnValue(false);
    spyOn(component.router, 'navigate');
    component.checkForChanges(null);
    expect(component.router.navigate).toHaveBeenCalledWith(['home/contributor/add-vic/refresh']);
  });

  it('should cancel in edit mode', () => {
    component.isEditMode = true;
    component.modalRef = new BsModalRef();
    const fb = new FormBuilder();
    const docForm = fb.group({ changed: true });
    component.parentForm.addControl('docStatus', docForm);
    spyOn(component, 'revertTransaction').and.callThrough();
    spyOn(component, 'navigateBack');
    component.confirmCancel();
    expect(component.revertTransaction).toHaveBeenCalled();
  });

  it('should throw error on reverting transaction', () => {
    spyOn(component.vicService, 'revertTransaction').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.revertTransaction();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    spyOn(component, 'hideModal');
    spyOn(component, 'navigateBack');
    component.confirmCancel();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should reset saudi search', () => {
    const fb = new FormBuilder();
    const searchForm = fb.group({ calenderType: fb.group({ english: 'Gregorian', arabic: null }) });
    component.parentForm.addControl('saudiSearch', searchForm);
    spyOn(component, 'hideModal');
    component.resetSaudiSearch();
    expect(component.hideModal).toHaveBeenCalled();
  });

  it('should navigate to previous section', () => {
    component.progressWizard = new ProgressWizardDcComponent();
    spyOn(component, 'handlePrevious').and.callThrough();
    component.setPreviousTab();
  });

  it('should get document for type military employee', () => {
    const types = component.getDocumentTransactionType(PurposeOfRegsitrationEnum.EMP_INT_POL_MIL, false);
    expect(types.length).toEqual(2);
  });

  it('should get document for type freelancer', () => {
    const types = component.getDocumentTransactionType(PurposeOfRegsitrationEnum.FREELANCER, true);
    expect(types.length).toEqual(2);
  });

  it('should get document for type outside saudi', () => {
    const types = component.getDocumentTransactionType(PurposeOfRegsitrationEnum.WORKING_OUTSIDE_SAUDI, true);
    expect(types.length).toEqual(2);
  });

  it('should get document for type not PPA', () => {
    const types = component.getDocumentTransactionType(PurposeOfRegsitrationEnum.GOV_EMP_NOT_UNDER_PPA, true);
    expect(types.length).toEqual(2);
  });

  it('should get document for doctor', () => {
    component.isDoctorEdit = true;
    component.isEditMode = true;
    const types = component.getDocumentTransactionType(PurposeOfRegsitrationEnum.PROFESSIONAL, true);
    expect(types.length).toEqual(3);
  });
});
