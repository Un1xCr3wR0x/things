import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityAssessmentScComponent } from './disability-assessment-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertService,
  CoreAdjustmentService,
  CoreBenefitService,
  DocumentService,
  Lov,
  WorkflowService
} from '@gosi-ui/core';
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
import {
  AssessmentDetail,
  AssessmentDetailsResponse,
  ComplicationWrapper,
  Contributor,
  CreateSessionService,
  DisabilityAssessmentService,
  DisabilityDetails,
  DisabiliyDtoList,
  DoctorService,
  IndividualSessionDetails,
  InjuredPerson,
  InjuryWrapper,
  MbList,
  MedicalBoardService,
  PersonWrapper,
  RescheduleSessionData,
  SessionAssessments,
  SessionConfigurationService,
  SessionStatusService
} from '../../../shared';

describe('DisabilityAssessmentScComponent', () => {
  let component: DisabilityAssessmentScComponent;
  let fixture: ComponentFixture<DisabilityAssessmentScComponent>;
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({
    sin: 1234,
    personId: 1234,
    injuryId: 1234,
    disabilityType: 'Occupational Disability'
  });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'socialNumber',
    'identifier'
  ]);
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'injuryId',
    'assessmentRequestId',
    'regNo',
    'benefitRequestId'
  ]);
  const sessionStatusServiceSpy = jasmine.createSpyObj<SessionStatusService>('SessionStatusService', [
    'getRescheduleSessionData'
  ]);
  sessionStatusServiceSpy.getRescheduleSessionData.and.returnValue(
    of({
      ...new RescheduleSessionData(),
      sessionType: { english: 'Ad Hoc', arabic: '' },
      medicalBoardType: { english: 'Appeal Medical Board', arabic: '' },
      startTime: '',
      endTime: '',
      mbList: []
    })
  );
  const createSessionServiceSpy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', ['getTemplateId']);
  createSessionServiceSpy.getTemplateId.and.returnValue(1234);
  const sessionConfigServiceSpy = jasmine.createSpyObj<SessionConfigurationService>('SessionConfigurationService', [
    'getIndividualSessionDetails'
  ]);
  sessionConfigServiceSpy.getIndividualSessionDetails.and.returnValue(of(new IndividualSessionDetails()));
  const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>(
    'DisabilityAssessmentService',
    [
      'getSessionAssessments',
      'disabilityAssessmentId',
      'nationalID',
      'transactionTraceId',
      'disabilityType',
      'sessionId',
      'isGosiDr',
      'isCompleted',
      'personIdentifier',
      'getNonOccDisabilityReasons',
      'getContributorBySin',
      'getAssessmentDetails',
      'getComplicationDetailsById',
      'getPreviousDisability',
      'getVisitingDoctorDetails',
      'getCityList',
      'getHelperReason',
      'getSpecialities',
      'getDisabilityDetails',
      'getInjuryDetailsById'
    ]
  );
  disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));
  disabilityAssessmentServiceSpy.getNonOccDisabilityReasons.and.returnValue(of(new LovList([new Lov()])));
  disabilityAssessmentServiceSpy.getContributorBySin.and.returnValue(
    of({ ...new Contributor(), identity: [{ id: 1234, idType: 'NIN' }] })
  );
  disabilityAssessmentServiceSpy.getAssessmentDetails.and.returnValue(of([new AssessmentDetailsResponse()]));
  disabilityAssessmentServiceSpy.getComplicationDetailsById.and.returnValue(of(new ComplicationWrapper()));
  disabilityAssessmentServiceSpy.getPreviousDisability.and.returnValue(of(new DisabilityDetails()));
  disabilityAssessmentServiceSpy.getVisitingDoctorDetails.and.returnValue(of(new MbList()));
  disabilityAssessmentServiceSpy.getCityList.and.returnValue(of([new Lov()]));
  disabilityAssessmentServiceSpy.getHelperReason.and.returnValue(of(new LovList([new Lov()])));
  disabilityAssessmentServiceSpy.getSpecialities.and.returnValue(of([new Lov()]));
  disabilityAssessmentServiceSpy.getDisabledPartsById.and.returnValue(of({}));
  disabilityAssessmentServiceSpy.getDisabilityDetails.and.returnValue(of([new InjuredPerson()]));
  disabilityAssessmentServiceSpy.getInjuryDetailsById.and.returnValue(of(new InjuryWrapper()));
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService', ['getPerson', 'getAssessmentDetails']);
  doctorServiceSpy.getPerson.and.returnValue(of(new PersonWrapper()));
  doctorServiceSpy.getAssessmentDetails.and.returnValue(of(new AssessmentDetail()));
  const medicalBoardServiceSpy = jasmine.createSpyObj<MedicalBoardService>('MedicalBoardService', [
    'getDisabilityDetails'
  ]);
  medicalBoardServiceSpy.getDisabilityDetails.and.returnValue(of(new DisabiliyDtoList()));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, BilingualTextPipeMock],
      declarations: [DisabilityAssessmentScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: {
            ...new RouterData(),
            taskId: '',
            assigneeId: '',
            referenceNo: 1234,
            resourceType: 'Assign Assessment to GOSI Doctor',
            assignedRole: 'MedicalBoardOfficer',
            payload: JSON.stringify({
              identifier: 1234,
              assessmentRequestId: 1234,
              mdSessionId: 1234,
              disabilityAssessmentId: 1234,
              referenceNo: 1234
            })
          }
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: SessionStatusService, useValue: sessionStatusServiceSpy },
        { provide: CreateSessionService, useValue: createSessionServiceSpy },
        { provide: SessionConfigurationService, useValue: sessionConfigServiceSpy },
        { provide: DisabilityAssessmentService, useValue: disabilityAssessmentServiceSpy },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
        { provide: DoctorService, useValue: doctorServiceSpy },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: Location, useValue: { back: () => {} } },
        FormBuilder,
        { provide: MedicalBoardService, useValue: medicalBoardServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
