import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
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
  MemberDecisionDtoMock,
  ModalServiceStub,
  PenaltyInfoDetails,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { ViolationBPMRequest } from '../../../../shared/models';
import { ValidateIncorrectWageScComponent } from './validate-incorrect-wage-sc.component';

describe('ValidateIncorrectWageScComponent', () => {
  let component: ValidateIncorrectWageScComponent;
  let fixture: ComponentFixture<ValidateIncorrectWageScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateIncorrectWageScComponent],
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
    fixture = TestBed.createComponent(ValidateIncorrectWageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should confirm cancel', () => {
    it('should confirm cancel', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('should show modal', () => {
    it('should show modal', () => {
      component.transactionDetails = validatorDetailsMock;
      const fb = new FormBuilder();
      component.incorrectWageForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' }),
          correction: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectWageForm.addControl(
        'contributordetails',
        fb.array([
          {
            excluded: [null],
            compensated: fb.group({ english: 'Others', arabic: '' })
          }
        ])
      );
      component.incorrectWageForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectWageForm.addControl('justification', fb.group({ justification: 'test' }));
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.modalService, 'show');
      component.modalRef = new BsModalRef();
      component.submitPenalty();
      component.showModal(modalRef, true);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('should submitPenalty', () => {
    it('should submitPenalty', () => {
      const fb = new FormBuilder();
      component.incorrectWageForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' }),
          correction: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectWageForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectWageForm.addControl(
        'contributordetails',
        fb.array([
          {
            excluded: [null],
            compensated: fb.group({ english: 'Others', arabic: '' })
          }
        ])
      );
      component.incorrectWageForm.addControl('justification', fb.group({ justification: 'test' }));
      component.submitPenalty();
      expect(component.incorrectWageForm).toBeTruthy();
    });
  });

  describe('should excludeContributorPgae', () => {
    it('should call  excludeContributorPgae', () => {
      component.navigateToExcludeContributorPage(10);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('should manageWorkflowEvents', () => {
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
      expect(component.getWorkflowActions).toHaveBeenCalled();
    });
  });
  describe('should update value response', () => {
    it('should call updateValidateResponse', () => {
      component.memberDto = MemberDecisionDtoMock;
      component.transactionDetails = validatorDetailsMock;
      let fb = new FormBuilder();
      component.incorrectWageForm.addControl(
        'violations',
        fb.group({
          fiveYears: fb.group({ english: 'Others', arabic: '' })
        })
      );
      component.incorrectWageForm.addControl(
        'penalty',
        fb.group({
          penalty: fb.group({ english: 'Others', arabic: '' }),
          comments: 'Others'
        })
      );
      component.incorrectWageForm.addControl('justification', fb.group({ justification: 'test' }));
      spyOn(component, 'contributorInfoDtoData').and.callThrough();
      spyOn(component, 'submitMemberDecision').and.callThrough();
      component.updateValidateResponse();
      expect(component.incorrectWageForm).toBeTruthy();
    });
    describe('get class value', () => {
      it('should getClassValueChange', () => {
        const violationClass = PenaltyInfoDetails.violationClass;
        const fb = new FormBuilder();
        component.incorrectWageForm.addControl(
          'violations',
          fb.group({
            fiveYears: fb.group({ english: 'Others', arabic: '' })
          })
        );
        component.incorrectWageForm.addControl(
          'penalty',
          fb.group({
            penalty: fb.group({ english: 'Others', arabic: '' })
          })
        );
        component.incorrectWageForm.addControl('justification', fb.group({ justification: 'test' }));
        spyOn(component, 'getClassValueChange');
        component.getClassValue(violationClass);
        expect(component.incorrectWageForm).toBeTruthy();
      });
      it('should getClassValueChange', () => {
        const fb = new FormBuilder();
        const violationClass = null;
        component.incorrectWageForm.addControl(
          'violations',
          fb.group({
            fiveYears: fb.group({ english: 'Others', arabic: '' })
          })
        );
        component.incorrectWageForm.addControl(
          'penalty',
          fb.group({
            penalty: fb.group({ english: 'Others', arabic: '' })
          })
        );
        component.incorrectWageForm.addControl('justification', fb.group({ justification: 'test' }));
        spyOn(component, 'getClassValueChange');
        component.getClassValue(violationClass);
        expect(component.incorrectWageForm).toBeTruthy();
      });
    });
  });
});
