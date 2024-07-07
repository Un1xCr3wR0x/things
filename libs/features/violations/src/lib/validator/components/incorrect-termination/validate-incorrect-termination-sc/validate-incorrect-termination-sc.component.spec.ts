import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
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
import { ViolationBPMRequest } from '../../../../shared/models';
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
import { ValidateIncorrectTerminationScComponent } from './validate-incorrect-termination-sc.component';

describe('ValidateIncorrectTerminationScComponent', () => {
  let component: ValidateIncorrectTerminationScComponent;
  let fixture: ComponentFixture<ValidateIncorrectTerminationScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateIncorrectTerminationScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateIncorrectTerminationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
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
  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'routeToInbox');
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  xit('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(modalRef, true);
    expect(component.modalService.show).toHaveBeenCalled();
  });

  xit('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, true);
    expect(component.modalRef).not.toEqual(null);
  });

  it('should call submitPenalty', () => {
    const fb = new FormBuilder();
    component.incorrectReasonForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.incorrectReasonForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.incorrectReasonForm.addControl('justification', fb.group({ justification: 'test' }));

    expect(component.incorrectReasonForm).toBeTruthy();
  });

  it('should show modal', () => {
    const fb = new FormBuilder();
    component.transactionDetails = validatorDetailsMock;
    component.incorrectReasonForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.incorrectReasonForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    // component.incorrectReasonForm.addControl(
    //   'justification',fb.control('val'));
    component.incorrectReasonForm.addControl('justification', fb.control(null, { updateOn: 'blur' }));
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.submitPenalty();
    component.showModal(modalRef, true);
    expect(component.modalRef).not.toEqual(null);
  });

  it('should call  excludeContributorPgae', () => {
    component.navigateToExcludeContributorPage(10);
    expect(component.modalRef).not.toEqual(null);
  });

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
    component.manageWorkflowEvents(1);
  });
  describe('get class value', () => {
    it('should getClassValueChange', () => {
      const violationClass = PenaltyInfoDetails.violationClass;
      const fb = new FormBuilder();
      component.incorrectReasonForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectReasonForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectReasonForm.addControl('justification', fb.group({ justification: 'test' }));

      spyOn(component, 'getClassValueChange');
      component.getClassValue(violationClass);
      expect(component.incorrectReasonForm).toBeTruthy();
    });
    it('should getClassValueChange', () => {
      const fb = new FormBuilder();
      const violationClass = null;
      component.incorrectReasonForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectReasonForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectReasonForm.addControl('justification', fb.group({ justification: 'test' }));

      spyOn(component, 'getClassValueChange');
      component.getClassValue(violationClass);
      expect(component.incorrectReasonForm).toBeTruthy();
    });
  });
});
