import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  MemberDecisionDtoMock,
  ModalServiceStub,
  PenaltyInfoDetails,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { ViolationBPMRequest } from '../../../../shared/models';
import { ValidateAddNewEngagementScComponent } from './validate-add-new-engagement-sc.component';

describe('ValidateAddNewEngagementScComponent', () => {
  let component: ValidateAddNewEngagementScComponent;
  let fixture: ComponentFixture<ValidateAddNewEngagementScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateAddNewEngagementScComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateAddNewEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  xit('should getClassViolations', () => {
    component.getClassViolations(true);
    expect(component.allExcluded).toBeTrue();
  });
  xit('should getClassViolations', () => {
    component.getClassViolations(false);
    expect(component.allExcluded).toBeFalse();
  });
  it('should show modal', () => {
    const fb = new FormBuilder();
    component.transactionDetails = validatorDetailsMock;
    component.addEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(modalRef, true);
    component.submitPenalityDetails();
    expect(component.modalService.show).toHaveBeenCalled();
  });
  it('should call  excludeContributorPgae', () => {
    component.navigateToExcludeContributorPage(10);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should call submitPenalty', () => {
    const fb = new FormBuilder();
    component.addEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    component.submitPenalityDetails();
  });
  it('should call updateResponse', () => {
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    let fb = new FormBuilder();
    component.addEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' }),
        comments: 'Others'
      })
    );
    component.addEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    component.addEngagementForm.addControl('comments', new FormControl('Test'));
    spyOn(component, 'contributorInfoDtoData').and.callThrough();
    spyOn(component, 'submitMemberDecision').and.callThrough();
    component.updateResponse();
  });
  xit('should navigate to Profile screen', () => {
    spyOn(component.router, 'navigate');
    const regNo = component.transactionDetails.establishmentInfo.registrationNo;
    const sinNo = component.transactionDetails.contributors[0].socialInsuranceNo;
    component.navigateToProfile(0);
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'updateResponse').and.callThrough();
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    component.manageWorkflowTransaction(0);
    expect(component.updateResponse).toHaveBeenCalled();
  });
  it('should handle workflow events', () => {
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    component.modalRef = new BsModalRef();
    spyOn(component, 'getWorkflowActions').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(component, 'setWorkflowData').and.returnValue(new ViolationBPMRequest());
    spyOn(component, 'saveWorkflow');
    spyOn(component, 'hideModal');
    component.manageWorkflowTransaction(1);
  });
  it('should getClassValue', () => {
    const fb = new FormBuilder();
    component.addEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    component.transactionDetails = validatorDetailsMock;
    component.assigneeIndex = 0;
    component.getClassValue(PenaltyInfoDetails.violationClass);
    expect(component.penaltyRequest.channel).not.toBe(null);
  });
  it('should getClassValue', () => {
    const fb = new FormBuilder();
    component.addEngagementForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.addEngagementForm.addControl('justification', fb.group({ justification: 'test' }));
    component.transactionDetails = validatorDetailsMock;
    component.assigneeIndex = 0;
    component.getClassValue();
    expect(component.penaltyRequest.channel).not.toBe(null);
  });
});
