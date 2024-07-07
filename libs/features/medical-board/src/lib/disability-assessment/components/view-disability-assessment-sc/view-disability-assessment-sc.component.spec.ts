import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDisabilityAssessmentScComponent } from './view-disability-assessment-sc.component';
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
import { AssessmentDetail, Contributor, CreateSessionService, DisabilityAssessmentService, DisabilityDetails, DoctorService, InjuryWrapper, MbList, RescheduleSessionData, SessionAssessments, SessionConfigurationService, SessionStatusService } from '../../../shared';

describe('ViewDisabilityAssessmentScComponent', () => {
  let component: ViewDisabilityAssessmentScComponent;
  let fixture: ComponentFixture<ViewDisabilityAssessmentScComponent>;
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ referenceNo: 1234 });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'socialNumber',
    'identifier'
  ]);
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
     'regNo', 'assessmentRequestId', 'injuryId'
  ]);
  const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>('DisabilityAssessmentService', 
  ['getSessionAssessments', 'disabilityAssessmentId', 'nationalID', 'transactionTraceId', 'disabilityType', 'contractDoctor','isAmbType', 'disabilityType', 'disabilityAssessmentId', 'getContributorBySin', 'getInjuryDetailsSinById', 'getPreviousDisability', 'getVisitingDoctorDetails']);
  disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));
  disabilityAssessmentServiceSpy.disabilityType = {english: 'Occupational Disability', arabic: ''};
  disabilityAssessmentServiceSpy.getContributorBySin.and.returnValue(of({...new Contributor(), identity: [{id: 1234, idType: 'NIN'}]}));
  disabilityAssessmentServiceSpy.getInjuryDetailsSinById.and.returnValue(of(new InjuryWrapper()));
  disabilityAssessmentServiceSpy.getPreviousDisability.and.returnValue(of(new DisabilityDetails()));
  disabilityAssessmentServiceSpy.getVisitingDoctorDetails.and.returnValue(of(new MbList()));
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService', ['getAssessmentDetails']);
  doctorServiceSpy.getAssessmentDetails.and.returnValue(of(new AssessmentDetail()));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ ViewDisabilityAssessmentScComponent, BilingualTextPipeMock ],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), taskId: '', assigneeId: '', referenceNo: 1234, payload: {} }
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: LookupService, useClass: LookupServiceStub },
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
    fixture = TestBed.createComponent(ViewDisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
