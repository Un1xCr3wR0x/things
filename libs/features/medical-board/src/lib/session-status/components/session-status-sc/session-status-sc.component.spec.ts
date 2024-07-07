/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionStatusScComponent } from './session-status-sc.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  bindToObject,
  BilingualText,
  convertToYYYYMMDD,
  AlertService,
  LanguageToken
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  bulkPartipantsMock,
  genericError,
  medicalBoardForm,
  ModalServiceStub,
  participantsList,
  SessionRequestActionsock
} from 'testing';
import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { MbRouteConstants } from '../../../shared/constants';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMemberRequest, AddParticipantsList, BulkParticipants, ContractedMemberWrapper, DoctorService, SessionStatusService } from '../../../shared';
import moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

describe('SessionStatusScComponent', () => {
  let component: SessionStatusScComponent;
  let fixture: ComponentFixture<SessionStatusScComponent>;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SessionStatusScComponent, PaginatePipe, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DoctorService, useValue: DoctorService },
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
    fixture = TestBed.createComponent(SessionStatusScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('navigateToReschedule', () => {
    it('Should navigateToReschedule', () => {
      component.sessionId = 36;
      // spyOn(component.router, 'navigate');
      component.navigateToReschedule();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `/home/medical-board/medical-board-session-status/${component.sessionId}/reschedule-session`
      ]);
    });
  });
  describe('onMedicalBoardToNewTab', () => {
    it('Should onMedicalBoardToNewTab', () => {
      const accountTab = 'MEDICAL-BOARD.PARTICIPANTS';
      component.onMedicalBoardToNewTab(accountTab);
      expect(component.medicalBoardTabs).not.toEqual(null);
    });
  });
  describe('navigateToBulkAddition', () => {
    it('Should navigateToBulkAddition', () => {
      component.sessionId = 36;
      const action = 'add';
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.navigateToBulkAddition(modalRef, action);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show popup', () => {
    it('should show pop up', () => {
      spyOn(component.modalService, 'show');
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.cancelSession(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show popup', () => {
    it('should show pop up', () => {
      spyOn(component.modalService, 'show');
      component.addByNinModalPopup();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show popup', () => {
    it('should show pop up', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.modalService, 'show');
      component.showHoldModal(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.cancelHold();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  it('should navigateToRgularSession', () => {
    component.sessionStatusDetails.sessionType.english = 'Regular';
    component.navigateToSession();
    expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
      queryParams: {
        templateId: component.templateId,
        sessionType: 'Regular'
      }
    });
  });
  it('should navigateToAdhocSession', () => {
    // spyOn(component.router, 'navigate');
    component.sessionStatusDetails.sessionType.english = 'Ad Hoc';
    component.navigateToSession();
    expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
      queryParams: {
        sessionId: component.sessionId,
        sessionType: 'AdHoc'
      }
    });
  });
  it('should replaceParticipant', () => {
    spyOn(component, 'removeMedicalMember').and.callThrough();
    spyOn(component, 'addBulkParticipantsMember').and.callThrough();
    component.replaceParticipant([new BulkParticipants()]);
    expect(component.removeMedicalMember).toHaveBeenCalled();
    expect(component.addBulkParticipantsMember).toHaveBeenCalled();
  });
  xit('should onCancelSession', () => {
    const forms = new medicalBoardForm();
    const response = { english: 'completed', arabic: '' };
    component.sessionStatusForm = forms.sessionStatusForm();
    component.sessionStatusForm.updateValueAndValidity();
    spyOn(component.sessionStatusService, 'cancelSesssion').and.returnValue(
      of(bindToObject(new BilingualText(), response))
    );
    spyOn(component.alertService, 'showSuccess').and.callThrough();
    spyOn(component, 'getSessionstatusDetails').and.callThrough();
    component.onCancelSession(SessionRequestActionsock);
    expect(component.sessionStatusForm).toBeTruthy();
    expect(component.sessionStatusService.cancelSesssion).toHaveBeenCalled();
  });
  xit('should throw err onCancelSession', () => {
    spyOn(component.alertService, 'showError');
    spyOn(component.sessionStatusService, 'cancelSesssion').and.returnValue(throwError(genericError));
    component.onCancelSession(SessionRequestActionsock);
  });
  it('should hideCancelModal', () => {
    component.sessionStatusForm.reset();
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide').and.callThrough();
    component.hideCancelModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should call setReplaceIndex', () => {
    const data = 12;
    component.setReplaceIndex(data);
    expect(component.replaceIndex).not.toEqual(null);
  });
  it('should cancelUnHold', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide').and.callThrough();
    component.cancelUnHold();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  xit('should confirmHold', () => {
    const response = { english: 'completed', arabic: '' };
    spyOn(component.sessionStatusService, 'holdMedicalBoardSession').and.returnValue(
      of(bindToObject(new BilingualText(), response))
    );
    spyOn(component.alertService, 'showSuccess').and.callThrough();
    component.confirmHold(SessionRequestActionsock);
    expect(component.sessionStatusService.holdMedicalBoardSession).toHaveBeenCalled();
  });
  xit('should confirmUnHold', () => {
    const response = { english: 'completed', arabic: '' };
    spyOn(component.sessionStatusService, 'unholdMedicalBoardSession').and.returnValue(
      of(bindToObject(new BilingualText(), response))
    );
    spyOn(component.alertService, 'showSuccess').and.callThrough();
    component.confirmUnHold(SessionRequestActionsock);
    expect(component.sessionStatusService.unholdMedicalBoardSession).toHaveBeenCalled();
  });
  it('should addParticipants', () => {
    spyOn(component, 'addBulkParticipantsMember').and.callThrough();
    component.addParticipants([new BulkParticipants()]);
    expect(component.addBulkParticipantsMember).toHaveBeenCalled();
  });
  it('should navigateToAddMembers', () => {
    component.navigateToAddMembers();
    expect(component.router.navigate).toHaveBeenCalledWith(
      [`/home/medical-board/medical-board-session-status/add-members`],
      {
        queryParams: {
          sessionDate: convertToYYYYMMDD(
            moment(component.sessionStatusDetails?.sessionDate?.gregorian).toDate().toString()
          )
        }
      }
    );
  });
  it('should navigateToAddDoctors', () => {
    component.navigateToAddDoctors();
    expect(component.router.navigate).toHaveBeenCalledWith([
      `/home/medical-board/medical-board-session-status/add-doctors`
    ]);
  });
  xit('should getParticipants', () => {
    spyOn(component.sessionStatusService, 'getAddParticipants').and.returnValue(
      of(bindToObject(new Array<AddParticipantsList>(), participantsList))
    );
    component.getParticipants();
    expect(component.sessionStatusService.getAddParticipants).toHaveBeenCalled();
    expect(component.participantsDetails).not.toEqual(null);
    expect(component.totalParticipants).not.toEqual(null);
  });
  xit('should throw err for getParticipants', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.sessionStatusService, 'getAddParticipants').and.returnValue(throwError(genericError));
    component.getParticipants();
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
