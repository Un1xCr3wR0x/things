import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, AlertServiceStub, BilingualTextPipeMock, DocumentServiceStub, DummysessionStatusDetails, memberListData, ModalServiceStub, RegularSessionForms, sessionStatusDetail, sessionStatusDetails, unAvailableData } from 'testing';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, BilingualText, LanguageToken, RouterData, RouterDataToken, bindToObject } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { ConfigurationTypeEnum } from '../../enums';
import {
  AddMemberFilterRequest,
  AddMemberRequest,
  BulkParticipants,
  ContractedMemberWrapper,
  ParticipantsDetails,
  RescheduleSessionData,
  SessionLimitRequest,
  SessionRequest,
  SessionStatusDetails
} from '../../models';
import { AddContractedMembersDcComponent } from '../add-contracted-members-dc/add-contracted-members-dc.component';

import { MedicalMembersBaseScComponent } from './medical-members-base-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import { CreateSessionService, SessionStatusService } from '../../services';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

@Component({
  selector: 'medical-member-base-derived'
})
export class DerivedMedicalMembersBaseScComponent extends MedicalMembersBaseScComponent {}
describe('MedicalMembersBaseScComponent', () => {
  let component: DerivedMedicalMembersBaseScComponent;
  let fixture: ComponentFixture<MedicalMembersBaseScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  const sessionStatusServiceSpy = jasmine.createSpyObj<SessionStatusService>('SessionStatusService', [
    'getRescheduleSessionData',
    'getContractedMembers',
    'addContractedMemberSesssion',
    'getSessionStatusDetails',
    'getAddParticipants',
    'addBulkParticipants',
    'addBulkParticipantsbyMB',
    'removeMembers'
  ]);
  sessionStatusServiceSpy.getContractedMembers.and.returnValue(of(new ContractedMemberWrapper()));
  sessionStatusServiceSpy.addContractedMemberSesssion.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.getSessionStatusDetails.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.getAddParticipants.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.addBulkParticipants.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.addBulkParticipantsbyMB.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.removeMembers.and.returnValue(of(new AddMemberRequest[1]));
  sessionStatusServiceSpy.getRescheduleSessionData.and.returnValue(of({...new RescheduleSessionData(), sessionType: {english: 'Ad Hoc', arabic: ''}, medicalBoardType: {english: 'Appeal Medical Board', arabic: ''}, startTime: '', endTime: '', mbList: []}));
  const createSessionServiceSpy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'getTemplateId']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {provide: SessionStatusService, useValue: sessionStatusServiceSpy},
        {provide: CreateSessionService, useValue: createSessionServiceSpy},
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
      declarations: [DerivedMedicalMembersBaseScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedMedicalMembersBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should showContractedDrModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = true;
    component.showContractedDrModal(modalRef, isDoctor);
    expect(isDoctor).toBeTruthy();
  });
  it('should showContractedDrModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = false;
    component.isAmb = true;
    component.sessionRequest.filterData = new AddMemberFilterRequest();
    component.showContractedDrModal(modalRef, isDoctor);
    expect(component.isAmb).toBeTruthy();
    expect(component.sessionRequest.filterData).toBeDefined();
  });
  it('should showContractedDrModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = false;
    component.isAmb = false;
    component.sessionRequest.filterData = new AddMemberFilterRequest();
    component.showContractedDrModal(modalRef, isDoctor);
    expect(component.isAmb).toBeFalsy();
    expect(component.sessionRequest.filterData).toBeDefined();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.isEditMode = true;
    component.showContractedMemberModal(modalRef);
    expect(component.isEditMode).toBeTruthy();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.isEditMode = false;
    component.showContractedMemberModal(modalRef);
    expect(component.isEditMode).toBeFalsy();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = true;
    component.showContractedMemberModal(modalRef, isDoctor);
    expect(isDoctor).toBeTruthy();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = false;
    component.isAmb = true;
    component.sessionRequest.filterData = new AddMemberFilterRequest();
    component.showContractedMemberModal(modalRef, isDoctor);
    expect(component.isAmb).toBeTruthy();
    expect(component.sessionRequest.filterData).toBeDefined();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = false;
    component.isAmb = false;
    component.sessionRequest.filterData = new AddMemberFilterRequest();
    component.showContractedMemberModal(modalRef, isDoctor);
    expect(component.isAmb).toBeFalsy();
    expect(component.sessionRequest.filterData).toBeDefined();
  });
  it('should showContractedMemberModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const isDoctor = false;
    component.isAmb = false;
    component.sessionRequest.filterData = new AddMemberFilterRequest();
    component.showContractedMemberModal(modalRef, isDoctor);
    expect(component.isAmb).toBeFalsy();
    expect(component.sessionRequest.filterData).toBeDefined();
  });
  it('should  getcontactedMembers', () => {
    const request = new SessionRequest();
    const date = '2021-12-21';
    spyOn(component.sessionStatusService, 'getContractedMembers').and.returnValue(
      of(bindToObject(new ContractedMemberWrapper(), memberListData))
    );
    component.getcontactedMembers(date, request);
    expect(component.contractedMembers).not.toEqual(null);
    expect(component.totalResponse).not.toEqual(null);
  });
  it('should getSearchResult', () => {
    const request = new SessionRequest();
    const date = '2021-12-21';
    spyOn(component.sessionStatusService, 'getContractedMembers').and.returnValue(
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
    component.getcontactedMembers(date, request);
    expect(component).toBeTruthy();
  });
  it('should  onLimit', () => {
    component.sessionRequest = new SessionRequest();
    const limit = new SessionLimitRequest();
    component.onLimit(limit);
    expect(component.sessionRequest).toBeDefined();
  });
  it('should  onSearchMember', () => {
    component.sessionRequest = new SessionRequest();
    const key = 'Ahmed';
    const language = new BehaviorSubject<string>('en');
    const fb = new FormBuilder();
    component.addMembersList = new AddContractedMembersDcComponent(fb, language);
    spyOn(component.addMembersList, 'resetPagination').and.callThrough();
    component.onSearchMember(key);
    expect(component.sessionRequest).toBeDefined();
    expect(component.addMembersList).toBeDefined();
    expect(component.addMembersList.resetPagination).toHaveBeenCalled();
  });
  it('should  addContractedMembers', () => {
    const request = new AddMemberRequest();
    component.addContractedMembers(request);
    expect(request).not.toEqual(null);
  });
  it('should addContractedMembers', () => {
    const request = new AddMemberRequest();
    spyOn(component.sessionStatusService, 'addContractedMemberSesssion').and.returnValue(
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
    component.addContractedMembers(request);
    expect(request).not.toEqual(null);
  });
  it('should  getSessionstatusDetails', () => {
    const sessionId = 157;
    spyOn(component.sessionStatusService, 'getSessionStatusDetails').and.returnValue(
      of(bindToObject(new SessionStatusDetails(), sessionStatusDetails))
    );
    component.getSessionstatusDetails(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getSessionstatusDetails', () => {
    const sessionId = 157;
    spyOn(component.sessionStatusService, 'getSessionStatusDetails').and.returnValue(
      of(bindToObject(new SessionStatusDetails(), sessionStatusDetail))
    );
    component.getSessionstatusDetails(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getSessionstatusDetails', () => {
    const sessionId = 157;
    spyOn(component.sessionStatusService, 'getSessionStatusDetails').and.returnValue(
      of(bindToObject(new SessionStatusDetails(), DummysessionStatusDetails))
    );
    component.getSessionstatusDetails(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getSessionstatusDetails', () => {
    const sessionId = 157;
    component.getSessionstatusDetails(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getSessionstatusDetails', () => {
    const sessionId = 157;
    spyOn(component.sessionStatusService, 'getSessionStatusDetails').and.returnValue(
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
    component.getSessionstatusDetails(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getYearFromDate', () => {
    const date = new Date();
    component.getYearFromDate(date);
    expect(component).toBeTruthy();
  });
  it('should  getMonthFromDate', () => {
    const date = new Date();
    component.getMonthFromDate(date);
    expect(component).toBeTruthy();
  });
  it('should  getDayFromDate', () => {
    const date = new Date();
    component.getDayFromDate(date);
    expect(component).toBeTruthy();
  });
  it('should  onAddMembers', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.onAddMembers(modalRef);
    expect(component).toBeTruthy();
  });
  it('should  onAddParticipants', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    const action = 'Remove';
    component.onAddParticipants(modalRef, action);
    expect(component).toBeTruthy();
  });
  it('should  onSearchParticipants', () => {
    component.sessionRequest = new SessionRequest();
    const key = 'Ahmed';
    const language = new BehaviorSubject<string>('en');
    const fb = new FormBuilder();
    component.addMembersList = new AddContractedMembersDcComponent(fb, language);
    spyOn(component.addMembersList, 'resetPagination').and.callThrough();
    component.onSearchParticipants(key);
    expect(component.sessionRequest).toBeDefined();
    expect(component.addMembersList).toBeDefined();
    expect(component.addMembersList.resetPagination).toHaveBeenCalled();
  });
  it('should  onSearchDoctors', () => {
    component.sessionRequest = new SessionRequest();
    const key = 'Ahmed';
    const language = new BehaviorSubject<string>('en');
    const fb = new FormBuilder();
    component.addMembersList = new AddContractedMembersDcComponent(fb, language);
    spyOn(component.addMembersList, 'resetPagination').and.callThrough();
    component.onSearchDoctors(key);
    expect(component.sessionRequest).toBeDefined();
    expect(component.addMembersList).toBeDefined();
    expect(component.addMembersList.resetPagination).toHaveBeenCalled();
  });
  it('should  onFilterValue', () => {
    const value = new AddMemberFilterRequest();
    const language = new BehaviorSubject<string>('en');
    const fb = new FormBuilder();
    component.addMembersList = new AddContractedMembersDcComponent(fb, language);
    spyOn(component.addMembersList, 'resetPagination').and.callThrough();
    component.onFilterValue(value);
    expect(value).toBeDefined();
    expect(component.addMembersList).toBeDefined();
    expect(component.addMembersList.resetPagination).toHaveBeenCalled();
  });
  it('should  onFilterApply', () => {
    const value = new AddMemberFilterRequest();
    const language = new BehaviorSubject<string>('en');
    const fb = new FormBuilder();
    component.addMembersList = new AddContractedMembersDcComponent(fb, language);
    spyOn(component.addMembersList, 'resetPagination').and.callThrough();
    component.onFilterApply(value);
    expect(value).toBeDefined();
    expect(component.addMembersList).toBeDefined();
    expect(component.addMembersList.resetPagination).toHaveBeenCalled();
  });
  it('should hide modal reference', () => {
    component.modalRef = new BsModalRef();
    component.sessionRequest = new SessionRequest();
    component.cancelAddParticipants();
    expect(component.hideModal).toBeDefined();
  });
  it('should  getDateDetails', () => {
    const date = new Date();
    component.getDateDetails();
    expect(component).toBeTruthy();
  });
  it('should  formatSessionDates', () => {
    const date = new Date();
    component.formatSessionDates(date);
    expect(component).toBeTruthy();
  });
  it('should  onCheckAvailability', () => {
    const request = new AddMemberRequest();
    component.onCheckAvailability(request);
    expect(request).not.toEqual(null);
  });
  it('should onCheckAvailability', () => {
    const request = new AddMemberRequest();
    spyOn(component.sessionService, 'checkAvailability').and.returnValue(
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
    component.onCheckAvailability(request);
    expect(request).not.toEqual(null);
  });
  it('should  checkOfficerType', () => {
    component.checkOfficerType();
    expect(component).toBeTruthy();
  });
  it('should  getPartcipants', () => {
    component.sessionId = 157;
    const request = new SessionRequest();
    component.getPartcipants(request);
    expect(component.sessionId).not.toEqual(null);
  });
  it('should  getPartcipants', () => {
    component.sessionId = 157;
    const request = new SessionRequest();
    spyOn(component.sessionStatusService, 'getAddParticipants').and.returnValue(
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
    component.getPartcipants(request);
    expect(component.sessionId).not.toEqual(null);
  });
  it('should   addBulkParticipantsMember', () => {
    const request = new BulkParticipants();
    component.addBulkParticipantsMember(request);
    expect(request).not.toEqual(null);
  });
  it('should  addBulkParticipantsMember', () => {
    const request = new BulkParticipants();
    spyOn(component.sessionStatusService, 'addBulkParticipants').and.returnValue(
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
    component.addBulkParticipantsMember(request);
    expect(request).not.toEqual(null);
  });
  it('should  navigateToProfile', () => {
    const id = 123456789;
    component.navigateToProfile(id);
    expect(component).toBeTruthy();
  });
  it('should   removeMedicalMember', () => {
    const sessionId = 12;
    const inviteeId = 19;
    const type = ConfigurationTypeEnum.REMOVE_MEMBER;
    component.removeMedicalMember(sessionId, inviteeId, type);
    expect(sessionId).not.toEqual(null);
  });
  it('should   removeMedicalMember', () => {
    const sessionId = 12;
    const inviteeId = 19;
    const type = ConfigurationTypeEnum.REMOVE_PARTICIPANT;
    component.removeMedicalMember(sessionId, inviteeId, type);
    expect(sessionId).not.toEqual(null);
  });
  xit('should   removeMedicalMember', () => {
    const sessionId = 12;
    const inviteeId = 19;
    const type = ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT;
    component.removeMedicalMember(sessionId, inviteeId, type);
    expect(sessionId).not.toEqual(null);
  });
  it('should  removeMedicalMember', () => {
    const sessionId = 12;
    const inviteeId = 19;
    const type = ConfigurationTypeEnum.REMOVE_MEMBER;
    spyOn(component.sessionStatusService, 'removeMembers').and.returnValue(
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
    component.removeMedicalMember(sessionId, inviteeId, type);
    expect(sessionId).not.toEqual(null);
  });
  it('should  getTimeFromString', () => {
    const time = '00::11';
    component.getTimeFromString(time);
    expect(component).toBeTruthy();
  });
});
