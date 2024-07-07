/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  RouterDataToken,
  RouterData,
  LanguageToken,
  AlertService,
  ApplicationTypeToken,
  LookupService,
  AppConstants
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { SessionStatusParticipantsScComponent } from './session-status-participants-sc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  DoctorServiceStub,
  LookupServiceStub,
  MedicalBoardListMock,
  ModalServiceStub,
  participantsListMock
} from 'testing';
import { BehaviorSubject } from 'rxjs';
import { DoctorService, MbRouteConstants, ParticipantsList } from '../../../shared';

describe('SessionStatusParticipantsComponent', () => {
  let component: SessionStatusParticipantsScComponent;
  let fixture: ComponentFixture<SessionStatusParticipantsScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SessionStatusParticipantsScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(SessionStatusParticipantsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    component.ngOnInit();
    expect(component.sessionId).not.toEqual(null);
    expect(component.ngOnInit).toBeDefined();
  });
  it('should go to selected page no', () => {
    expect(component.pageDetails.currentPage).toBe(1);
    component.selectPage(2);
    expect(component.pageDetails.currentPage).toBe(2);
  });
  it('should isPhoneClicked', () => {
    component.isPhoneClicked(2);
  });
  it('should navigateToProfile', () => {
    component.navigateToProfile(12345);
    expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(12345)]);
  });
  it('should call setIndex', () => {
    const data = 12;
    component.setValue(data);
    expect(component.index).not.toEqual(null);
  });
  it('should call setIndex', () => {
    const data = 12;
    component.setValue(data);
    expect(component.index).not.toEqual(null);
  });
  it('should replaceParticipants', () => {
    component.replaceParticipants();
  });
  it('should getISDCodePrefix', () => {
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === MedicalBoardListMock.isdCode) return AppConstants.ISD_PREFIX_MAPPING[key];
    });
    component.getISDCodePrefix(new ParticipantsList());
  });
  it('should removeMember', () => {
    spyOn(component, 'removeMedicalMember').and.callThrough();
    component.removeParticipant();
    expect(component.removeMedicalMember).toHaveBeenCalled();
  });
});
