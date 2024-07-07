import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AddMemberRequest, RegisterMedicalSessionDetails } from '..';
import { CreateSessionService } from './create-session.service';

describe('SessionService', () => {
  let service: CreateSessionService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CreateSessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('registerMedicalBoardSession', () => {
    it('to registerMedicalBoardSession', () => {
      const registerMedicalSessionDetails = new RegisterMedicalSessionDetails();
      const url = `/api/v1/mb-session-template`;
      service.registerMedicalBoardSession(registerMedicalSessionDetails).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('POST');
    });
  });
  describe('get SessionDetails', () => {
    it('to get SessionDetails', () => {
      const url = `/api/v1/mb-session-template/mb-detail`;
      service.getMbDetails().subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  it('to get updateRegularMedicalBoardSession', () => {
    const templateId = 45;
    const registerMedicalSessionDetails = new RegisterMedicalSessionDetails();
    const url = `/api/v1/mb-session-template/45`;
    service.updateRegularMedicalBoardSession(registerMedicalSessionDetails, templateId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to get checkAvailability', () => {
    const request = new AddMemberRequest();
    request.sessionId = 34;
    request.contractId = 45;
    const url = `/api/v1/mb-session/${request.sessionId}/verify-member?contractId=${request.contractId}`;
    service.checkAvailability(request).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });
});
