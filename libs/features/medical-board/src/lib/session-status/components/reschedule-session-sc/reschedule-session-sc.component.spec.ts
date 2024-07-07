import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, bindToObject, DocumentItem, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ActivatedRouteStub, AlertServiceStub, BilingualTextPipeMock, DocumentServiceStub, memberListData, ModalServiceStub, RegularSessionForms, unAvailableData } from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ContractedMembers, Contracts, CreateSessionService, DoctorService, IndividualSessionDetails, MedicalBoardService, MemberData, RegisterMedicalSessionDetails, SessionConfigurationService, SessionStatusService, UnAvailableMemberListRequest, UnAvailableMemberListResponse, UpdateDoctorResponse } from '../../../shared';
import { RescheduleSessionScComponent } from './reschedule-session-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { FormBuilder } from '@angular/forms';
describe('RescheduleSessionScComponent', () => {
  let component: RescheduleSessionScComponent;
  let fixture: ComponentFixture<RescheduleSessionScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService',[
    'getContractDetails',
    'getFees',
    'modifyDoctorDetail',
    'getmbProfessionalId',
    'revertTransactionDetails',
    'submitModifyContractDetail'

  ]);
  doctorServiceSpy.getContractDetails.and.returnValue(of(new Contracts[0]()));
  doctorServiceSpy.getFees.and.returnValue(of(new MemberData[0]()));
  doctorServiceSpy.modifyDoctorDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));
  doctorServiceSpy.getmbProfessionalId.and.returnValue(23232323);
  doctorServiceSpy.revertTransactionDetails.and.returnValue(of(true));
  doctorServiceSpy.submitModifyContractDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));

  const medicalBoardServicespy = jasmine.createSpyObj<MedicalBoardService>('MedicalBoardService', [
    
  ]);

  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getDocuments',
    'refreshDocument'
    
  ]);

  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getDocuments.and.returnValue(of([new DocumentItem()]));
  const sessionStatusServiceSpy = jasmine.createSpyObj<SessionStatusService>('SessionStatusService', [
    'getUnavailableMemberList'
  ]);
  sessionStatusServiceSpy.getUnavailableMemberList.and.returnValue(of(new UnAvailableMemberListRequest[0]()));
  const sessionConfigurationServiceSpy = jasmine.createSpyObj<SessionConfigurationService>(
    'SessionConfigurationService',
    ['getIndividualSessionDetails']
  );
  sessionConfigurationServiceSpy.getIndividualSessionDetails.and.returnValue(of(new IndividualSessionDetails()));
  const createSessionServicespy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'registerAdhocSession',
    'updateAdhocMedicalBoardSession',
    'setSelectedMembers'
  ]);
  createSessionServicespy.registerAdhocSession.and.returnValue(of({ ...new RegisterMedicalSessionDetails[0]() }));
  createSessionServicespy.updateAdhocMedicalBoardSession.and.returnValue(
    of({ ...new RegisterMedicalSessionDetails[0]() })
  );
  createSessionServicespy.setSelectedMembers.and.returnValue();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [RescheduleSessionScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: SessionStatusService, useValue: sessionStatusServiceSpy },
        { provide: CreateSessionService, useValue: createSessionServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: SessionConfigurationService, useValue: sessionConfigurationServiceSpy },
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
    fixture = TestBed.createComponent(RescheduleSessionScComponent);
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
  it('should setTimeFromForm', () => {
    component.setTimeFromForm();
    expect(component).toBeTruthy();
  });
  it('should handle errors', () => {
    const errors = {
      error: {
        message: { englis: 'error occurred', arabic: 'error occured' }
      }
    };
    component.showError(errors);
    expect(component).toBeTruthy();
  });
  it('should add contracted member', () => {
    const memberValues = memberListData.sessionMembers;
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.onAddContractedMembers([new ContractedMembers()]);
    expect(memberValues).not.toEqual(null);
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should declineValue', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.declineValue();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should goBackToHome', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.goBackToHome();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should onAddContractedDoctor', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isGosiDoctor = true;
    component.onAddContractedDoctor(modalRef, isGosiDoctor);
    expect(isGosiDoctor).toBeTruthy();
  });
  it('should onAddContractedDoctor', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isGosiDoctor = false;
    component.isAmb = true;
    component.onAddContractedDoctor(modalRef, isGosiDoctor);
    expect(isGosiDoctor).toBeFalsy();
  });
  it('should onAddContractedDoctor', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isGosiDoctor = false;
    component.isAmb = false;
    component.onAddContractedDoctor(modalRef, isGosiDoctor);
    expect(isGosiDoctor).toBeFalsy();
  });
  it('should  getUnAvailableList', () => {
    const request = new UnAvailableMemberListRequest();
    spyOn(component.statusService, 'getUnavailableMemberList').and.returnValue(
      of(bindToObject(new UnAvailableMemberListResponse(), unAvailableData))
    );
    component.getUnAvailableList(request);
    expect(component.unAvailableMemberList).not.toEqual(null);
  });
  it('should getUnAvailableList', () => {
    const request = new UnAvailableMemberListRequest();
    spyOn(component.statusService, 'getUnavailableMemberList').and.returnValue(
      throwError({
        status: 400,
        error: {
          message: {
            english: 'Invalid',
            arabic: 'رمز التحقق غير صحيح'
          }
        }
      })
    );
    component.getUnAvailableList(request);
    expect(component).toBeTruthy();
  });
  it('should setUnAvailablemembers', () => {
    component.setUnAvailablemembers();
    expect(component).toBeTruthy();
  });
  it('should onRescheduleSession', () => {
    const forms = new RegularSessionForms();
    component.reScheduleForm = forms.rescheduleForm();
    component.reScheduleForm.updateValueAndValidity();
    component.reScheduleForm
      .get('session')
      .get('startDate')
      .get('gregorian')
      .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
    component.reScheduleForm.get('session').get('startTimePicker').get('injuryHour').setValue('01');
    component.reScheduleForm.get('session').get('startTimePicker').get('injuryMinute').setValue('01');
    component.reScheduleForm.get('endTime').get('injuryHour').setValue('03');
    component.reScheduleForm.get('endTime').get('injuryMinute').setValue('09');
    component.onRescheduleSession();
    expect(component.reScheduleForm).not.toEqual(null);
    expect(component.reScheduleForm.valid).toBeTruthy();
    expect(component.reScheduleForm.value).not.toEqual(null);
  });
  it('should onRescheduleSession', () => {
    const forms = new RegularSessionForms();
    component.reScheduleForm = forms.rescheduleForm();
    component.reScheduleForm.updateValueAndValidity();
    component.reScheduleForm
      .get('session')
      .get('startDate')
      .get('gregorian')
      .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
    component.reScheduleForm.get('session').get('startTimePicker').get('injuryHour').setValue('01');
    component.reScheduleForm.get('session').get('startTimePicker').get('injuryMinute').setValue('01');
    component.reScheduleForm.get('endTime').get('injuryHour').setValue('00');
    component.reScheduleForm.get('endTime').get('injuryMinute').setValue('00');
    component.onRescheduleSession();
    expect(component.reScheduleForm).not.toEqual(null);
  });
});
