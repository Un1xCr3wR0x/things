import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledSessionsScComponent } from './scheduled-sessions-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, LanguageToken } from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, AlertServiceStub, BilingualTextPipeMock, ModalServiceStub, SessionDataMock } from 'testing';
import { DatePipe } from '@angular/common';
import { CreateSessionService, DisabilityAssessmentService, IndividualSessionEvents, MBConstants, SessionAssessments, SessionFilterRequest, SessionRequest } from '../../../../shared';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { RouterDataToken, RouterData } from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaginatePipe } from 'ngx-pagination';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ScheduledSessionsScComponent', () => {
  let component: ScheduledSessionsScComponent;
  let fixture: ComponentFixture<ScheduledSessionsScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  const createSessionServiceSpy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'getTemplateId']);
    const disabilityAssessmentServiceSpy = jasmine.createSpyObj<DisabilityAssessmentService>('DisabilityAssessmentService', ['getSessionAssessments', 'disabilityAssessmentId', 'nationalID', 'transactionTraceId', 'disabilityType']);
    disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));
     disabilityAssessmentServiceSpy.getSessionAssessments.and.returnValue(of(new SessionAssessments()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduledSessionsScComponent, PaginatePipe, BilingualTextPipeMock],
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
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
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ScheduledSessionsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for filtering', () => {
    it('It should filter', () => {
      const filterItem = new SessionFilterRequest();
      component.sessionRequest = new SessionRequest();
      component.onFilter(filterItem);
      expect(component.sessionRequest.filter).toEqual(filterItem);
      expect(component.sessionRequest).toBeDefined();
    });
  });
  describe('getCurrentMonthDetails', () => {
    it('It should getCurrentMonthDetails', () => {
      const selectedValues = { selectedMonth: 11, selectedYear: 2021 };
      spyOn(component, 'getCurrentMonthDetails').and.callThrough();
      component.getSelectedSession(selectedValues);
    });
  });
  describe('getCurrentValue', () => {
    it('It should getCurrentValue', () => {
      const date = new Date();
      component.isFiltered = true;
      spyOn(component, 'getIndividualSessionDetails').and.callThrough();
      component.getCurrentValue(date);
      expect(component.sessionRequest.filter).toBeDefined();
    });
  });
  it('It should navigateToSessionStatus', () => {
    component.navigateToSessionStatus(new IndividualSessionEvents());
    expect(component.router.navigate).toHaveBeenCalledWith([MBConstants.SESSION_STATUS], {
      queryParams: {
        sessionId: 12123,
        templateId: 123123,
        sessionType: 'Appeal'
      }
    });
  });
});
