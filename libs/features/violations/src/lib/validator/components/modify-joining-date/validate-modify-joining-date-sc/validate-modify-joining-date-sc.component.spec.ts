/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub,
  MemberDecisionDtoMock,
  validatorDetailsMock,
  PenaltyInfoDetails
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ViolationBPMRequest } from '../../../../shared/models';
import { ValidateModifyJoiningDateScComponent } from './validate-modify-joining-date-sc.component';
import { FormBuilder } from '@angular/forms';

describe('ValidateModifyJoiningDateScComponent', () => {
  let component: ValidateModifyJoiningDateScComponent;
  let fixture: ComponentFixture<ValidateModifyJoiningDateScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateModifyJoiningDateScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateModifyJoiningDateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should show modal', () => {
    component.transactionDetails = validatorDetailsMock;
    const fb = new FormBuilder();
    component.modifyJoiningDateForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' }),
        correction: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl('justification', fb.group({ justification: 'test' }));
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component.modalService, 'show');
    component.modalRef = new BsModalRef();
    component.verifyPenalty();
    component.showModal(modalRef, true);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should getClassValueChange', () => {
    const violationClass = PenaltyInfoDetails.violationClass;
    const fb = new FormBuilder();
    component.modifyJoiningDateForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl('justification', fb.group({ justification: 'test' }));
    spyOn(component, 'getClassValueChange');
    component.getClassValue(violationClass);
    expect(component.modifyJoiningDateForm).toBeTruthy();
  });
  it('should getClassValueChange', () => {
    const fb = new FormBuilder();
    const violationClass = null;
    component.modifyJoiningDateForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl('justification', fb.group({ justification: 'test' }));
    spyOn(component, 'getClassValueChange');
    component.getClassValue(violationClass);
    expect(component.modifyJoiningDateForm).toBeTruthy();
  });
  it('should submitPenalty', () => {
    const fb = new FormBuilder();
    component.modifyJoiningDateForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' }),
        correction: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl('justification', fb.group({ justification: 'test' }));
    component.verifyPenalty();
  });

  it('should call  excludeContributorPgae', () => {
    component.navigateToExcludeContributorPage(10);
    expect(component.modalRef).not.toEqual(null);
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'updateValidateResponse');
    spyOn(component, 'hideModal');
    component.manageWorkflowEvents(0);
    expect(component.updateValidateResponse).toHaveBeenCalled();
  });
  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'getWorkflowActions').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(component, 'setWorkflowData').and.returnValue(new ViolationBPMRequest());
    spyOn(component, 'saveWorkflow');
    spyOn(component, 'hideModal');
    component.manageWorkflowEvents(1);
  });
  it('should call updateValidateResponse', () => {
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    let fb = new FormBuilder();
    component.modifyJoiningDateForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyJoiningDateForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' }),
        comments: 'Others'
      })
    );
    component.modifyJoiningDateForm.addControl('justification', fb.group({ justification: 'test' }));
    spyOn(component, 'contributorInfoDtoData').and.callThrough();
    spyOn(component, 'submitMemberDecision').and.callThrough();
    component.updateValidateResponse();
  });
});
