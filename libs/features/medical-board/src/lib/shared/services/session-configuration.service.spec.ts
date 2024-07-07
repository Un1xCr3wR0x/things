import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { configListData } from 'testing';
import {
  SessionFilterRequest,
  SessionLimitRequest,
  SessionRequest,
  HoldSessionDetails,
  StopSessionDetails,
  SortQueryParam
} from '../models';
import { SessionConfigurationService } from './session-configuration.service';

describe('ConfigurationService', () => {
  let service: SessionConfigurationService;
  let request: SessionRequest = <SessionRequest>{};
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DatePipe,
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });
    service = TestBed.inject(SessionConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('Should get the configuration list', () => {
    const url = `/api/v1/mb-session-template?pageNo=0&pageSize=10&status=Active&medicalBoardType=Primary Medical Board&sessionType=Regular&fieldOfficeCode=Riyadh&sessionChannel=Virtual&sessionStartDate=2020-01-01&sessionEndDate=2020-01-12`;
    request.limit = new SessionLimitRequest();
    request.limit.pageNo = 0;
    request.limit.size = 10;
    request.filter = new SessionFilterRequest();
    request.filter.channel = [
      {
        english: 'Virtual',
        arabic: 'متصل'
      }
    ];
    request.filter.status = [
      {
        english: 'Active',
        arabic: 'متصل'
      }
    ];
    request.filter.medicalBoardType = [
      {
        english: 'Primary Medical Board',
        arabic: 'متصل'
      }
    ];
    request.filter.sessionType = [
      {
        english: 'Regular',
        arabic: 'متصل'
      }
    ];
    request.filter.fieldOffice = [
      {
        english: 'Riyadh',
        arabic: 'متصل'
      }
    ];
    request.filter.sessionPeriodFrom = new Date('2020-01-01T10:48:49.112Z');
    request.filter.sessionPeriodTo = new Date('2020-01-12T10:48:49.112Z');

    service.getConfigurationList(request, new SortQueryParam()).subscribe(() => {
      expect(configListData).not.toEqual(null);
    });
    const httpRequest = httpMock.expectOne(url);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(configListData);
    httpMock.verify();
  });

  it('to HoldSessionDetails', () => {
    const holdSessionDetails = new HoldSessionDetails();
    const templateId = 123;
    const url = `/api/v1/mb-session-template/${templateId}/hold`;
    service.onHoldMbSession(templateId, holdSessionDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should throw error', () => {
    const holdSessionDetails = new HoldSessionDetails();
    const templateId = 123;
    const url = `/api/v1/mb-session-template/${templateId}/hold`;
    const errMsg = 'expect 404 error';
    service.onHoldMbSession(templateId, holdSessionDetails).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('to StopSessionDetails', () => {
    const stopSessionDetails = new StopSessionDetails();
    const templateId = 123;
    const url = `/api/v1/mb-session-template/${templateId}/stop`;
    service.onStopMbSession(templateId, stopSessionDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should throw error', () => {
    const stopSessionDetails = new StopSessionDetails();
    const templateId = 123;
    const errMsg = 'expect 404 error';
    const url = `/api/v1/mb-session-template/${templateId}/stop`;
    service.onStopMbSession(templateId, stopSessionDetails).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('to show alerts', () => {
    const error = '';
    spyOn(service.alertService, 'showError').and.callThrough();
    service.showAlerts(error);
    expect(service).toBeTruthy();
  });
});
