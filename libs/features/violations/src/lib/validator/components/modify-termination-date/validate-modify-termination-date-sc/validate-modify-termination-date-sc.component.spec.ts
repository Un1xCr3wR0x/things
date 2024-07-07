import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
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
  ApplicationTypeEnum,
  LanguageToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  MemberDecisionDtoMock,
  ModalServiceStub,
  validatorDetailsMock,
  WorkflowServiceStub,
  PenaltyInfoDetails
} from 'testing';
import { ViolationBPMRequest } from '../../../../shared/models';
import { ValidateModifyTerminationDateScComponent } from './validate-modify-termination-date-sc.component';

describe('ValidateModifyTerminationDateScComponent', () => {
  let component: ValidateModifyTerminationDateScComponent;
  let fixture: ComponentFixture<ValidateModifyTerminationDateScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule],

      declarations: [ValidateModifyTerminationDateScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateModifyTerminationDateScComponent);
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
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should call  excludeContributorPgae', () => {
    component.navigateToExcludeContributorPage(10);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should show modal', () => {
    component.transactionDetails = validatorDetailsMock;
    const fb = new FormBuilder();
    component.modifyTerminationForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' }),
        correction: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'contributordetails',
      fb.array([
        {
          excluded: [null],
          compensated: fb.group({ english: 'Others', arabic: '' })
        }
      ])
    );
    component.modifyTerminationForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl('justification', fb.group({ justification: 'test' }));
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(modalRef, true);
    component.submitPenalityValues();
    expect(component.modalService.show).toHaveBeenCalled();
  });

  it('should call submitPenalty', () => {
    const fb = new FormBuilder();
    component.modifyTerminationForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' }),
        correction: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'contributordetails',
      fb.array([
        {
          excluded: [null],
          compensated: fb.group({ english: 'Others', arabic: '' })
        }
      ])
    );
    component.modifyTerminationForm.addControl('justification', fb.group({ justification: 'test' }));
    component.submitPenalityValues();
  });
  it('should call updateResponse', () => {
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    let fb = new FormBuilder();
    component.modifyTerminationForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' }),
        comments: 'Others'
      })
    );
    component.modifyTerminationForm.addControl('justification', fb.group({ justification: 'test' }));
    component.modifyTerminationForm.addControl('comments', new FormControl('Test'));
    spyOn(component, 'contributorInfoDtoData').and.callThrough();
    spyOn(component, 'submitMemberDecision').and.callThrough();
    component.updateResponseData();
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
    spyOn(component, 'updateResponseData').and.callThrough();
    component.memberDto = MemberDecisionDtoMock;
    component.transactionDetails = validatorDetailsMock;
    component.manageWorkflowTransaction(0);
    expect(component.updateResponseData).toHaveBeenCalled();
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
    component.modifyTerminationForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl('justification', fb.group({ justification: 'test' }));
    component.transactionDetails = validatorDetailsMock;
    component.assigneeIndex = 0;
    component.getClassValue(PenaltyInfoDetails.violationClass);
    expect(component.penaltyRequest.channel).not.toBe(null);
  });
  it('should getClassValue', () => {
    const fb = new FormBuilder();
    component.modifyTerminationForm.addControl(
      'violations',
      fb.group({
        fiveYears: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl(
      'penalty',
      fb.group({
        penalty: fb.group({ english: 'Others', arabic: '' })
      })
    );
    component.modifyTerminationForm.addControl('justification', fb.group({ justification: 'test' }));
    component.transactionDetails = validatorDetailsMock;
    component.assigneeIndex = 0;
    component.getClassValue();
    expect(component.penaltyRequest.channel).not.toBe(null);
  });
});
