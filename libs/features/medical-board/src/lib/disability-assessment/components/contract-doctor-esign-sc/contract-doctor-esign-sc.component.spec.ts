import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDoctorEsignScComponent } from './contract-doctor-esign-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService, CoreAdjustmentService, CoreBenefitService, DocumentService, WorkflowService } from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  LookupServiceStub,
  WorkflowServiceStub
} from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  ApplicationTypeToken,
  RouterData,
  RouterDataToken,
  LanguageToken,
  DocumentItem,
  bindToObject,
  BilingualText,
  Alert,
  LovList,
  LookupService,
  WizardItem
} from '@gosi-ui/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { CreateSessionService, DisabilityAssessmentService, DoctorService, RescheduleSessionData, SessionAssessments, SessionConfigurationService, SessionStatusService } from '../../../shared';

describe('ContractDoctorEsignScComponent', () => {
  let component: ContractDoctorEsignScComponent;
  let fixture: ComponentFixture<ContractDoctorEsignScComponent>;
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'validator' });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'socialNumber',
    'identifier'
  ]);
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'injuryId'
  ]);
  const sessionStatusServiceSpy = jasmine.createSpyObj<SessionStatusService>('SessionStatusService', [
    'getRescheduleSessionData'
  ]);
  sessionStatusServiceSpy.getRescheduleSessionData.and.returnValue(of({...new RescheduleSessionData(), sessionType: {english: 'Ad Hoc', arabic: ''}, medicalBoardType: {english: 'Appeal Medical Board', arabic: ''}, startTime: '', endTime: '', mbList: []}));
  const createSessionServiceSpy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'getTemplateId']);
  const sessionConfigServiceSpy = jasmine.createSpyObj<SessionConfigurationService>('SessionConfigurationService', ['getIndividualSessionDetails']);
  const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>('DisabilityAssessmentService', ['getSessionAssessments', 'disabilityAssessmentId', 'nationalID', 'transactionTraceId', 'disabilityType']);
  disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService', ['saveEsignWorkitem']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ ContractDoctorEsignScComponent ],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), taskId: '', assigneeId: '', referenceNo: 1234, payload:  JSON.stringify({ mbProfessionalId: 1234, referenceNo: 1234 }) }
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: LookupService, useClass: LookupServiceStub },
        {provide: SessionStatusService, useValue: sessionStatusServiceSpy},
        {provide: CreateSessionService, useValue: createSessionServiceSpy},
        {provide: SessionConfigurationService, useValue: sessionConfigServiceSpy},
        {provide: DisabilityAssessmentService, useValue: disabilityAssessmentServiceSpy},
        {provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy},
        {provide: CoreBenefitService, useValue: coreBenefitServiceSpy},
        {provide: DoctorService, useValue: doctorServiceSpy},
        {provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: Location, useValue: { back: () => {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDoctorEsignScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.sessionId = 1234;
    expect(component).toBeTruthy();
  });
});
