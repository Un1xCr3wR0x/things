/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  cancelViolationResponseData,
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  validatorDetailsMock,
  ViolationsWizardMock,
  WorkflowServiceStub
} from 'testing';
import { CancelViolationScComponent } from './cancel-violation-sc.component';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 12563365 });

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('CancelViolationScComponent', () => {
  let component: CancelViolationScComponent;
  let fixture: ComponentFixture<CancelViolationScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [CancelViolationScComponent, ViolationsWizardMock],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(CancelViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    component.activatedroute.params = of({
      transactionId: 12563365
    });
    component.ngOnInit();
    expect(component.violationId).toBe(12563365);
  });

  describe('initialiseWizard', () => {
    it('should initialiseWizard', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.cancelViolationWizard = new ProgressWizardDcComponent();
      component.initialiseWizard();
      expect(component.cancelViolationWizard).not.toBe(null);
    });
  });
  describe('getWizardItems', () => {
    it('should set wizaditems array', () => {
      component.getWizard();
      expect(component.cancelViolationWizardItems).not.toBe(null);
    });
  });
  it('It should navigate', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  describe('test suite for selectWizard', () => {
    it('It should navigate to selected section', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.cancelViolationWizard = new ProgressWizardDcComponent();
      component.cancelViolationWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.previousForm();
      expect(component.currentTab).toEqual(0);
    });
  });
  describe('saveCancelVolationDetails', () => {
    it('It should saveCancelVolationDetails', () => {
      component.cancelViolationWizard = new ProgressWizardDcComponent();
      component.cancelViolationWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.transactionDetails = validatorDetailsMock;
      spyOn(component.validatorService, 'submitCancelViolations').and.returnValue(of(cancelViolationResponseData));
      component.saveCancelVolationDetails({ reason: { english: 'IncorrectWage', arabic: '' } });
      expect(component.cancelViolationResponse).toBeDefined();
    });
  });
  describe('submitDocuments', () => {
    it('It should submitDocuments', () => {
      const fb = new FormBuilder();
      component.cancelDetailsForm.addControl(
        'comments',
        fb.group({
          comments: [null]
        })
      );
      spyOn(component.validatorService, 'submitChangeViolation').and.callThrough();
      spyOn(component.alertService, 'showSuccess');
      component.submitCancelVolations();
      expect(component.cancelDetailsForm).toBeTruthy();
    });

    it('shdould throw errr', () => {
      component.editMode = false;
      spyOn(component.validatorService, 'submitChangeViolation').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.submitCancelVolations();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  it('It should submitDocuments', () => {
    const fb = new FormBuilder();
    component.editMode = false;
    component.cancelDetailsForm.addControl(
      'comments',
      fb.group({
        comments: [null]
      })
    );
    spyOn(component.validatorService, 'submitChangeViolation').and.callThrough();
    spyOn(component.alertService, 'showSuccess');
    component.submitCancelVolations();
    expect(component.validatorService.submitChangeViolation).toHaveBeenCalled();
    expect(component.cancelDetailsForm).toBeTruthy();
  });
  describe('test suite for nextForm', () => {
    it('It should navigate to next section', () => {
      component.cancelViolationWizard = new ProgressWizardDcComponent();
      component.cancelViolationWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      spyOn(component.cancelViolationWizard, 'setNextItem');
      component.currentTab = 1;
      component.nextForm();
      expect(component.currentTab).toEqual(2);
    });
  });
  describe('should FormValidity', () => {
    it('should call checkFormValidity', () => {
      const fb = new FormBuilder();
      component.cancelDetailsForm.addControl(
        'cancelViolatonDetailsForm',
        fb.group({
          reason: fb.group({ english: 'reason', arabic: '' })
        })
      );
      component.checkFormValidity();
      expect(component.cancelDetailsForm).toBeTruthy();
    });
    it('should call checkFormValidity to check error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.checkFormValidity();
      component.cancelDetailsForm.markAllAsTouched();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  it('should throw error on updateTaskWorkflow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    component.updateTaskWorkflows(outcome);
    expect(outcome).not.toEqual(null);
  });
});
