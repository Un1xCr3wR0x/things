import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, bindToObject, CoreAdjustmentService, CoreBenefitService, CoreContributorService, DocumentItem, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ActivatedRouteStub, AlertServiceStub, BilingualTextPipeMock, DocumentServiceStub, memberListData, ModalServiceStub, RegularSessionForms, unAvailableData } from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ContractedMembers, Contracts, CreateSessionService, DisabilityAssessmentService, DisabilityDetails, DoctorService, IndividualSessionDetails, MedicalBoardService, MemberData, RegisterMedicalSessionDetails, SessionConfigurationService, SessionStatusService, UnAvailableMemberListRequest, UnAvailableMemberListResponse, UpdateDoctorResponse } from '../../../shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { FormBuilder } from '@angular/forms';
import { MedicalBoardAssessmentsScComponent } from './medical-board-assessments-sc.component';
describe('MedicalBoardAssessmentsScComponent', () => {
  let component: MedicalBoardAssessmentsScComponent;
  let fixture: ComponentFixture<MedicalBoardAssessmentsScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>('DoctorService',[
    'disabilityAssessmentId',
    'getPreviousDisability',
    'disabilityType',
    'disabilityAssessmentId'

  ]);
  disabilityAssessmentServiceSpy.getPreviousDisability.and.returnValue(of(new DisabilityDetails()));
  const coreContributorServicespy = jasmine.createSpyObj<CoreContributorService>('CoreContributorService', [  
  ]);

  const CoreAdjustmentServicespy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'socialNumber'  
  ]);
  CoreAdjustmentServicespy .identifier = 1234567891;
  CoreAdjustmentServicespy .socialNumber = 123467891;

  const CoreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'injuryId',
    'regNo' 
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [MedicalBoardAssessmentsScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: CoreBenefitService , useValue: CoreBenefitServiceSpy },
        { provide: CoreAdjustmentService, useValue: CoreAdjustmentServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DisabilityAssessmentService,useValue: disabilityAssessmentServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(MedicalBoardAssessmentsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOninit', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
