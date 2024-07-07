/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddressDetails,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  CalendarService,
  DocumentItem,
  DocumentService,
  LookupService,
  Person,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { ComponentHostDirective, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  CalendarServiceStub,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  engagement,
  EngagementServiceStub,
  establishmentData,
  EstablishmentServiceStub,
  genericError,
  getEngagementResponse,
  LookupServiceStub,
  ModalServiceStub,
  personalDetailsTestData,
  ProgressWizardDcMockComponent,
  WorkflowServiceStub
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  ClausesWrapper,
  ContractAuthenticationService,
  ContractRequest,
  Contributor,
  ContributorService,
  ContributorTypesEnum,
  EngagementDetails,
  EngagementService,
  Establishment,
  EstablishmentService,
  PersonalInformation
} from '../../../shared';
import {
  GccPersonDetailsDcComponent,
  ImmigratedTribePersonDetailsDcComponent,
  NonSaudiPersonDetailsDcComponent,
  SaudiPersonDetailsDcComponent,
  SplForeignerPersonDetailsDcComponent
} from '../person-details';
import { AddContributorScComponent } from './add-contributor-sc.component';

describe('AddContributorScComponent', () => {
  let component: AddContributorScComponent;
  let fixture: ComponentFixture<AddContributorScComponent>;

  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      declarations: [
        AddContributorScComponent,
        ComponentHostDirective,
        GccPersonDetailsDcComponent,
        ImmigratedTribePersonDetailsDcComponent,
        NonSaudiPersonDetailsDcComponent,
        SaudiPersonDetailsDcComponent,
        SplForeignerPersonDetailsDcComponent,
        ProgressWizardDcMockComponent
      ],
      providers: [
        { provide: ProgressWizardDcComponent, useClass: ProgressWizardDcMockComponent },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: CalendarService, useClass: CalendarServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          GccPersonDetailsDcComponent,
          ImmigratedTribePersonDetailsDcComponent,
          NonSaudiPersonDetailsDcComponent,
          SaudiPersonDetailsDcComponent,
          SplForeignerPersonDetailsDcComponent
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make tab active', () => {
    component.selectFormWizard(1);
    expect(component.activeTab).toBe(1);
  });

  it('should create alert error', () => {
    spyOn(component.alertService, 'showErrorByKey');
    component.showAlertError('ERROR');
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });

  it('should load person components', () => {
    component.person = bindToObject(new Person(), personalDetailsTestData);
    component.isValidatorEdit = false;
    component.isEditAdmin = false;
    component.establishment = new Establishment();
    component.establishment.contactDetails.addresses = [
      bindToObject(new AddressDetails(), establishmentData.contactDetails.addresses)
    ];
    component.loadPersonDetailsComponent(ContributorTypesEnum.SAUDI);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.loadPersonDetailsComponent(ContributorTypesEnum.NON_SAUDI);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.loadPersonDetailsComponent(ContributorTypesEnum.GCC);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.loadPersonDetailsComponent(ContributorTypesEnum.IMMIGRATED_TRIBE);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.loadPersonDetailsComponent(ContributorTypesEnum.SPECIAL_FOREIGNER);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should set total tabs', () => {
    component.checkDocumentsRequired();
    expect(component.totalTabs).toBe(6);
  });

  it('should set total tabs to 5', () => {
    component.isEditAdmin = false;
    component.isValidatorEdit = false;
    component.contributorType = ContributorTypesEnum.SAUDI;
    component.checkDocumentsRequired();
    expect(component.totalTabs).toBe(5);
  });

  it('should handle initialization', () => {
    component.handleInitialisation();
    expect(component.registrationNo).toBeDefined();
  });

  it('should save contributor details', () => {
    component.parentForm.addControl('personDetails', new FormControl());
    spyOn(component, 'navigateToNextTab');
    component.onContributorSave(bindToObject(new PersonalInformation(), personalDetailsTestData));
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should save engagement details', () => {
    component.isContractRequired = true;
    component.contributor = new Contributor();
    spyOn(component, 'navigateToNextTab');
    component.onSaveEngagementDetails({ engagementDetails: engagement, wageDetails: engagement.engagementPeriod });
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should save engagement details', () => {
    component.isContractRequired = true;
    component.contributor = new Contributor();
    spyOn(component, 'navigateToNextTab');
    component.engagementId = null;
    component.onSaveEngagementDetails({ engagementDetails: engagement, wageDetails: engagement.engagementPeriod });
    expect(component.engagementId).toBeDefined();
  });

  it('should submit documents', () => {
    spyOn(component, 'navigateToNextTab');
    component.activeTab = 2;
    const form = new FormGroup({
      comments: new FormControl()
    });
    component.modalRef = new BsModalRef();
    component.parentForm.addControl('documentsForm', form);
    component.confirmSubmit();
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should show mandatory error', () => {
    component.parentForm.addControl('documentsForm', new FormGroup({}));
    const docItem = new DocumentItem();
    docItem.required = true;
    docItem.valid = false;
    docItem.documentContent = null;
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    component.documents = [docItem];
    component.modalRef = new BsModalRef();
    spyOn(component.alertService, 'showMandatoryDocumentsError');
    component.onSubmitDocuments(true);
    expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should submit document details', () => {
    component.parentForm.addControl('documentsForm', new FormGroup({}));
    component.modalRef = new BsModalRef();
    component.engagement = bindToObject(new EngagementDetails(), getEngagementResponse.engagements[0]);
    spyOn(component, 'showConfirmationTemplate');
    component.onSubmitDocuments(true);
    expect(component.showConfirmationTemplate).toHaveBeenCalled();
  });

  it('should throw error on refersh documents', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocumentItem(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });

  it('should verify scanned documents', () => {
    spyOn(component, 'navigateToNextTab');
    component.verifyDocuments();
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should throw error while verifying documents', () => {
    spyOn(component.contributorService, 'submitUploadedDocuments').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.verifyDocuments();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should save contract details', () => {
    spyOn(component, 'navigateToNextTab');
    component.saveContractDetails(new ContractRequest());
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should throw error while saving contracts', () => {
    spyOn(component.contractService, 'addContractDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveContractDetails(new ContractRequest());
    expect(component.showError).toHaveBeenCalled();
  });

  it('should save clauses', () => {
    component.contractClauses = new ClausesWrapper();
    spyOn(component, 'navigateToNextTab');
    component.saveContractClauses({ finalClausesList: null, selectedClauses: null });
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should throw error while saveing clauses', () => {
    component.contractClauses = new ClausesWrapper();
    spyOn(component.contractService, 'saveClauseDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.saveContractClauses({ finalClausesList: null, selectedClauses: null });
    expect(component.showError).toHaveBeenCalled();
  });
});
