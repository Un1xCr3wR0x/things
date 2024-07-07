/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateCancelEngagementScComponent } from './validate-cancel-engagement-sc.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ModalServiceStub,
  LookupServiceStub,
  DocumentServiceStub,
  AlertServiceStub,
  WorkflowServiceStub,
  validatorDetailsMock,
  MemberDecisionDtoMock,
  PenaltyInfoDetails
} from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  LookupService,
  DocumentService,
  AlertService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  WorkflowService,
  RouterDataToken,
  RouterData,
  WorkFlowActions
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { ViolationBPMRequest } from '../../../../shared/models';

describe('ValidateCancelEngagementScComponent', () => {
  let component: ValidateCancelEngagementScComponent;
  let fixture: ComponentFixture<ValidateCancelEngagementScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateCancelEngagementScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateCancelEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('saveWorkFlowActions', () => {
    it('should handle workflow events', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'getWorkflowActions').and.returnValue(WorkFlowActions.APPROVE);
      spyOn(component, 'setWorkflowData').and.returnValue(new ViolationBPMRequest());
      spyOn(component, 'saveWorkflow');
      component.saveWorkFlowActions(0);
      expect(component.getWorkflowActions).toHaveBeenCalled();
      expect(component.setWorkflowData).toHaveBeenCalled();
    });
  });
  describe('initializeParameters', () => {
    it('should initializeParameters', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'getDataFromToken');
      spyOn(component, 'getRolesForView');
      component.initializeParameters();
    });
  });
  describe('getPenaltyDetails', () => {
    it('should getPenaltyDetails', () => {
      component.modalRef = new BsModalRef();
      component.transactionDetails = validatorDetailsMock;
      spyOn(component.modalService, 'show');
      component.getPenaltyDetails(1);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('get class value', () => {
    it('should getClassValueChange', () => {
      const violationClass = PenaltyInfoDetails.violationClass;
      const fb = new FormBuilder();
      component.cancelEngagementForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
      spyOn(component, 'getClassValueChange');
      component.getClassValue(violationClass);
      expect(component.cancelEngagementForm).toBeTruthy();
    });
    it('should getClassValueChange', () => {
      const fb = new FormBuilder();
      const violationClass = null;
      component.cancelEngagementForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
      spyOn(component, 'getClassValueChange');
      component.getClassValue(violationClass);
      expect(component.cancelEngagementForm).toBeTruthy();
    });
  });
  describe('submit penalty', () => {
    it('should call submitPenalty', () => {
      const fb = new FormBuilder();
      component.cancelEngagementForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' }),
          correction: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.cancelEngagementForm.addControl(
        'contributordetails',
        fb.array([
          {
            excluded: [null],
            compensated: fb.group({ english: 'Others', arabic: '' })
          }
        ])
      );
      component.cancelEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
      component.submitPenalty();
      expect(component.cancelEngagementForm).toBeTruthy();
    });
  });
  describe('manageWorkflowEvents', () => {
    it('should handle workflow events', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'updateValidateResponse').and.callThrough();
      component.memberDto = MemberDecisionDtoMock;
      component.transactionDetails = validatorDetailsMock;
      component.manageWorkflowEvents(0);
      expect(component.updateValidateResponse).toHaveBeenCalled();
    });
    it('should handle workflow events', () => {
      component.memberDto = MemberDecisionDtoMock;
      component.transactionDetails = validatorDetailsMock;
      component.modalRef = new BsModalRef();
      spyOn(component, 'getWorkflowActions').and.returnValue(WorkFlowActions.APPROVE);
      spyOn(component, 'setWorkflowData').and.returnValue(new ViolationBPMRequest());
      spyOn(component, 'saveWorkflow');
      spyOn(component, 'hideModal');
      component.manageWorkflowEvents(1);
      expect(component.getWorkflowActions).toHaveBeenCalled();
    });
  });
  describe('should confirm cancel', () => {
    it('should confirm cancel', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('excludeContributorPgae', () => {
    it('should call  excludeContributorPgae', () => {
      component.navigateToExcludeContributorPage(10);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('verifyCompensated', () => {
    it('should call  verifyCompensated', () => {
      const fb = new FormBuilder();
      component.cancelEngagementForm.addControl(
        'contributordetails',
        fb.array([
          {
            excluded: [null],
            compensated: fb.group({ english: 'Others', arabic: '' })
          }
        ])
      );
      component.transactionDetails?.contributors.forEach(contributor => {
        contributor.compensated = false;
      });
      component.verifyCompensated();
      expect(component.cancelEngagementForm.get('contributordetails')).not.toBeNull();
    });
  });
  it('should show modal', () => {
    const fb = new FormBuilder();
    component.transactionDetails = validatorDetailsMock;
    component.cancelEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' }),
        correction: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.cancelEngagementForm.addControl(
      'contributordetails',
      fb.array([
        {
          excluded: [null],
          compensated: fb.group({ english: 'Others', arabic: '' })
        }
      ])
    );
    component.cancelEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.cancelEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(modalRef, true);
    component.submitPenalty();
    expect(component.modalRef).not.toEqual(null);
  });
});
