import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
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
  ModalServiceStub,
  MemberServiceStub,
  WorkflowServiceStub,
  MedicalBoardServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock
} from 'testing';
import { ValidateAddMemberScComponent } from './validate-add-member-sc.component';
import { ValidatorMemberBaseScComponent } from '../../../../shared/components';
import { CreateSessionService, DisabilityAssessmentService, MedicalBoardService, MemberService } from '../../../../shared/services';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SessionAssessments } from '@gosi-ui/features/medical-board/lib/shared';

describe('ValidateAddMemberScComponent', () => {
  let component: ValidateAddMemberScComponent;
  let fixture: ComponentFixture<ValidateAddMemberScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  const createSessionServiceSpy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'getTemplateId']);
    const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>('DisabilityAssessmentService', ['getSessionAssessments', 'disabilityAssessmentId', 'nationalID', 'transactionTraceId', 'disabilityType']);
    disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));
     disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateAddMemberScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        {provide: DisabilityAssessmentService, useValue: disabilityAssessmentServiceSpy},
        {provide: CreateSessionService, useValue: createSessionServiceSpy},
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateAddMemberScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.professionalId = 1000000084;
    component.contractId = 12345;
    spyOn(component, 'initializeParameters');
    component.ngOnInit();
    expect(component.initializeParameters).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorMemberBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorMemberBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorMemberBaseScComponent.prototype, 'saveWorkflow');
    component.ManageWorkflowEvents(0);
    expect(ValidatorMemberBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.router, 'navigateByUrl');
    component.confirmCancel();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/home/transactions/list/worklist');
  });
});
