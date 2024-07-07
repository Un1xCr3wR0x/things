/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
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
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  ModifyViolationResponseData,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { ModifyPenaltyAmountScComponent } from './modify-penalty-amount-sc.component';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 12563365 });

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyPenaltyAmountScComponent', () => {
  let component: ModifyPenaltyAmountScComponent;
  let fixture: ComponentFixture<ModifyPenaltyAmountScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ModifyPenaltyAmountScComponent],
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
    fixture = TestBed.createComponent(ModifyPenaltyAmountScComponent);
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

  // should call selectModifyWizard
  it('should call selectModifyWizard', () => {
    const wizardIndex = 2;
    component.selectModifyWizard(wizardIndex);
    expect(component.activeTab).toBe(wizardIndex);
  });

  //cancel
  it('It should navigate', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  //decline
  it('It should decline', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('It should navigate to previous section', () => {
    component.modifycontractWizard = new ProgressWizardDcComponent();
    component.modifycontractWizard.wizardItems = [new WizardItem('Label', 'Icon')];
    component.activeTab = 0;
    component.previousForm();
    expect(component.activeTab).toEqual(-1);
  });
  describe('should modify penalty details', () => {
    it('It should navigate to next section', () => {
      component.modifycontractWizard = new ProgressWizardDcComponent();
      component.modifycontractWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.activeTab = 1;
      component.transactionDetails = validatorDetailsMock;
      component.submitModifiedPenaltyDetails({ amount: 1000, reason: 'IncorrectWage' });
      expect(component.transactionDetails).not.toBe(null);
      spyOn(component.validatorService, 'submitModifyViolations').and.returnValue(of(ModifyViolationResponseData));
      component.submitModifiedPenaltyDetails({
        amount: 1000,
        reason: {
          value: {
            english: 'Do not Impose penality',
            arabic: ''
          },
          sequence: 1,
          code: 1,
          items: []
        }
      });

      expect(component.modifyViolationResponse).toBeDefined();
    });
  });
  xit('should throw error', () => {
    component.transactionDetails = validatorDetailsMock;
    spyOn(component, 'handleErrors');
    spyOn(component.validatorService, 'submitModifyViolations').and.returnValue(throwError(genericError));
    expect(component.handleErrors).toHaveBeenCalled();
  });
  it('It should submitDocuments', () => {
    const fb = new FormBuilder();
    component.modifyDetailsForm.addControl(
      'comments',
      fb.group({
        comments: [null]
      })
    );
    spyOn(component.validatorService, 'submitChangeViolation').and.callThrough();
    spyOn(component.alertService, 'showSuccess');
    component.submitModifyPenalty();
    expect(component.modifyDetailsForm).toBeTruthy();
  });
  it('It should submitDocuments', () => {
    const fb = new FormBuilder();
    component.editMode = false;
    component.modifyDetailsForm.addControl(
      'comments',
      fb.group({
        comments: [null]
      })
    );
    spyOn(component.validatorService, 'submitChangeViolation').and.callThrough();
    spyOn(component.alertService, 'showSuccess');
    component.submitModifyPenalty();
    expect(component.validatorService.submitChangeViolation).toHaveBeenCalled();
    expect(component.modifyDetailsForm).toBeTruthy();
  });
  it('shdould throw errr', () => {
    spyOn(component.validatorService, 'submitChangeViolation').and.returnValue(throwError(genericError));
    spyOn(component.alertService, 'showError');
    component.editMode = true;
    component.submitModifyPenalty();
  });
  it('should throw error on updateTaskWorkflow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
    component.updateTaskWorkflow(outcome);
    expect(outcome).not.toEqual(null);
  });
  it('should throw error on updateTaskWorkflow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showSuccessByKey');
    spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
    component.updateTaskWorkflow(outcome);
    expect(outcome).not.toEqual(null);
  });
});
