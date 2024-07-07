import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  AddMemberRequest,
  RescheduleSessionRequest,
  SessionLimitRequest,
  SessionRequest,
  SessionRequestActions,
  UnAvailableMemberListRequest
} from '..';

import { SessionStatusService } from './session-status.service';

describe('SessionStatusService', () => {
  let service: SessionStatusService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SessionStatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getRescheduleSessionData', () => {
    let sessionId = 1234;
    const url = `/api/v1/mb-session/${sessionId}`;
    service.getRescheduleSessionData(sessionId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(sessionId);
  });
  it('should get getSessionStatusDetails', () => {
    let sessionId = 1234;
    const url = `/api/v1/mb-session/${sessionId}`;
    service.getSessionStatusDetails(sessionId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(sessionId);
  });
  it('should hold MB sessions', () => {
    let sessionId = 1234;
    const request = {
      comments: 'reason',
      reason: {
        english: 'Active',
        arabic: 'متصل'
      }
    };
    const url = `/api/v1/mb-session/${sessionId}/hold`;
    service.holdMedicalBoardSession(sessionId, request).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(sessionId);
  });
  it('should getContractedMembers', () => {
    const sessionRequest = new SessionRequest();
    const url = `/api/v1/mb-session/mb-members?doctorType=1001&pageNo=1&pageSize=10&sessionDate=2021-11-12&startTime=00:01&endTime=01:02&specialities=Dentist&subSpecialities=Nurse&location=Riyadh&medicalBoardType=Regular`;
    sessionRequest.doctorType = 1001;
    sessionRequest.limit = {
      pageNo: 1,
      size: 10
    };
    sessionRequest.startTime = '00:01';
    sessionRequest.endTime = '01:02';
    sessionRequest.filterData.speciality = [
      {
        english: 'Dentist',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.subSpeciality = [
      {
        english: 'Nurse',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.location = [
      {
        english: 'Riyadh',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.availability = [
      {
        english: 'Yes',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.medicalBoardType = [
      {
        english: 'Regular',
        arabic: 'متصل'
      }
    ];
    service.getContractedMembers('2021-11-12', sessionRequest).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should getAddParticipants', () => {
    const sessionRequest = new SessionRequest();
    const url = `/api/v1/mb-session/participants?sortOrder=DESC&sessionId=36&pageNo=1&pageSize=10&searchKey=12123&listOfSpecialty=Dentist&listOfAssessmentType=First&listOfLocation=Riyadh`;
    sessionRequest.searchKey = '12123';
    sessionRequest.limit = {
      pageNo: 1,
      size: 10
    };
    sessionRequest.startTime = '00:01';
    sessionRequest.endTime = '01:02';
    sessionRequest.filterData.speciality = [
      {
        english: 'Dentist',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.subSpeciality = [
      {
        english: 'Nurse',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.location = [
      {
        english: 'Riyadh',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.availability = [
      {
        english: 'Yes',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.medicalBoardType = [
      {
        english: 'Regular',
        arabic: 'متصل'
      }
    ];
    sessionRequest.filterData.assessmentType = [
      {
        english: 'First',
        arabic: 'متصل'
      }
    ];
    service.getAddParticipants(sessionRequest, 36).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    // req.flush(SessionCalendarMock);
  });
  it('should getUnavailableMemberList', () => {
    const sessionRequest = new UnAvailableMemberListRequest();
    const url = `/api/v1/mb-session/36/unavailable-doctors?startDate=2021-12-11&startTime=00:01&endTime=01:02&mbProfessionIds=1&mbProfessionIds=2&mbProfessionIds=3&mbProfessionIds=4&mbProfessionIds=5`;
    sessionRequest.sessionId = 36;
    sessionRequest.startDate = '2021-12-11';
    sessionRequest.startTime = '00:01';
    sessionRequest.endTime = '01:02';
    sessionRequest.mbList = [1, 2, 3, 4, 5];
    service.getUnavailableMemberList(sessionRequest).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('to rescheduleSesssion', () => {
    const holdSessionDetails = new RescheduleSessionRequest();
    const templateId = 123;
    const url = `/api/v1/mb-session/${templateId}/reschedule`;
    service.rescheduleSesssion(holdSessionDetails, templateId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to unholdMedicalBoardSession', () => {
    const holdSessionDetails = new SessionRequestActions();
    const templateId = 123;
    const url = `/api/v1/mb-session/${templateId}/remove-hold`;
    service.unholdMedicalBoardSession(templateId, holdSessionDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to addContractedMemberSesssion', () => {
    const holdSessionDetails = [];
    const templateId = 123;
    const url = `/api/v1/mb-session/${templateId}/add-member`;
    service.addContractedMemberSesssion(templateId, holdSessionDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });
});
