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
  DocumentService,
  LookupService,
  RouterConstants,
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
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  SecondedServiceStub,
  WorkflowServiceStub,
  MockManageWageService
} from 'testing';
import { ContributorRouteConstants } from '../../../shared';
import { ContributorBaseScComponent } from '../../../shared/components';
import { Establishment, PersonalInformation, SecondedDetails } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  SecondedService,
  ManageWageService
} from '../../../shared/services';
import { AddSecondedScComponent } from './add-seconded-sc.component';

describe('AddSecondedScComponent', () => {
  let component: AddSecondedScComponent;
  let fixture: ComponentFixture<AddSecondedScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [AddSecondedScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: SecondedService, useClass: SecondedServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ManageWageService, useClass: MockManageWageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecondedScComponent);
    component = fixture.componentInstance;
    spyOn(component, 'checkKeys');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'add' }, { path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should set keys from token', inject([RouterDataToken], token => {
    token.payload = '{"RegistrationNo": 200085744, "id": 692}';
    component.isEditMode = true;
    component.setKeysForView();
    expect(component.registrationNo).toBe(200085744);
    expect(component.secondedId).toBe(692);
  }));

  it('should set keys from route', () => {
    component.establishmentService.setRegistrationNo = 200085744;
    component.contributorService.personId = 1022128508;
    component.readKeysFromService();
    expect(component.registrationNo).toBe(200085744);
    expect(component.personId).toBe(1022128508);
  });

  it('should initialize view for csr', () => {
    component.registrationNo = 200085744;
    component.personId = 1022128508;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getPersonById').and.returnValue(of(new PersonalInformation()));
    component.initializeView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
  });

  it('should initialize view for edit mode', () => {
    component.registrationNo = 200085744;
    component.secondedId = 691;
    component.isEditMode = true;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getPersonById').and.returnValue(of(new PersonalInformation()));
    spyOn(component.secondedService, 'getSecondedDetails').and.returnValue(of(new SecondedDetails()));
    component.initializeView();
    expect(component.establishment).toBeDefined();
    expect(component.contributor).toBeDefined();
    expect(component.secondedDetails).toBeDefined();
  });

  it('should throw error on initializing view', () => {
    component.registrationNo = 200085744;
    component.personId = 1022128508;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.contributorService, 'getPersonById').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.initializeView();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should submit seconded details by CSR', () => {
    const fb = new FormBuilder();
    const secondedForm = createSecodedForm(fb);
    component.secondedForm.addControl('secondedForm', secondedForm);
    spyOn(component, 'checkTransactionValidity').and.returnValue(true);
    component.submitSecondedDetails();
    expect(component.isTransactionSuccess).toBeTruthy();
  });

  it('should submit seconded details in edit mode', () => {
    const fb = new FormBuilder();
    const secondedForm = createSecodedForm(fb);
    component.secondedForm.addControl('secondedForm', secondedForm);
    component.secondedForm.addControl('comments', fb.group({ comments: null }));
    component.isEditMode = true;
    spyOn(component, 'checkTransactionValidity').and.returnValue(true);
    spyOn(component, 'saveWorkflowOnEdit').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitSecondedDetails();
    expect(component.saveWorkflowOnEdit).toHaveBeenCalled();
  });

  it('should throw error on submitting seconded details', () => {
    const fb = new FormBuilder();
    const secondedForm = createSecodedForm(fb);
    component.secondedForm.addControl('secondedForm', secondedForm);
    spyOn(component, 'checkTransactionValidity').and.returnValue(true);
    spyOn(component.secondedService, 'submitSecondedDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitSecondedDetails();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw mandatory field error', () => {
    const fb = new FormBuilder();
    const secondedForm = createSecodedForm(fb);
    component.secondedForm.addControl('secondedForm', secondedForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const flag = component.checkTransactionValidity();
    expect(flag).toBeFalsy();
  });

  it('should throw mandatory document error', () => {
    const fb = new FormBuilder();
    const secondedForm = fb.group({ startDate: fb.group({ gregorian: null, hijri: null }) });
    component.secondedForm.addControl('secondedForm', secondedForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    const flag = component.checkTransactionValidity();
    expect(flag).toBeFalsy();
  });

  it('should check for changes and show modal', () => {
    const fb = new FormBuilder();
    const docForm = fb.group({ changed: true });
    component.secondedForm.addControl('docStatus', docForm);
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
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.checkForChanges(null);
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should revert the transaction', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkDocumentStatus').and.returnValue(true);
    spyOn(component, 'revertSecondedRequest').and.callThrough();
    spyOn(component, 'navigateBack');
    component.isEditMode = true;
    component.checkRevertRequired();
    expect(component.revertSecondedRequest).toHaveBeenCalled();
  });

  it('should not revert the transaction and navigate back', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkDocumentStatus').and.returnValue(false);
    spyOn(component, 'navigateBack');
    component.isEditMode = false;
    component.checkRevertRequired();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should navigate to establishment admin inbox in edit mode', () => {
    component.isEditMode = true;
    component.isAppPrivate = false;
    spyOn(component.router, 'navigate');
    component.navigateBack(true);
    expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
  });

  it('should navigate to validator view on cancel in edit mode', () => {
    component.isEditMode = true;
    spyOn(component.router, 'navigate');
    component.navigateBack(false);
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_ADD_SECONDED_VALIDATOR]);
  });
});

function createSecodedForm(fb: FormBuilder) {
  return fb.group({
    currentEstablishment: fb.group({ english: [null, { validators: Validators.required }], arabic: null }),
    startDate: fb.group({
      gregorian: new Date(),
      hijiri: null
    }),
    endDate: fb.group({
      gregorian: new Date(),
      hijiri: null
    }),
    contractDate: fb.group({
      gregorian: new Date(),
      hijiri: null
    }),
    salary: 1500
  });
}
