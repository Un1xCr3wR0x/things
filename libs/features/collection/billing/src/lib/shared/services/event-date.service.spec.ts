/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EventDateService } from './event-date.service';
import { eventDateDetailsMockData, pendingEventDates } from 'testing/test-data';
import { TransactionOutcome } from '../enums';
import { AuthTokenService } from '@gosi-ui/core';
import { AuthTokenServiceStub } from 'testing';

describe('EventDateService', () => {
  let eventDateService: EventDateService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthTokenService, useClass: AuthTokenServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    eventDateService = TestBed.inject(EventDateService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const service: EventDateService = TestBed.inject(EventDateService);
    expect(service).toBeTruthy();
  });

  describe('get event date details', () => [
    it('should get event date details', () => {
      const url = `/api/v1/contribution-event-date?approvalStatus=PENDING_APPROVAL`;
      eventDateService.getEventDetails().subscribe(res => {
        expect(res).toBeDefined;
      });
      response => {
        expect(response).toBeDefined();
      };
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(eventDateDetailsMockData);
    })
  ]);
  describe('approve event date details', () => {
    it('should approve event date details', () => {
      const approvePayment = `/api/process-manager/v1/taskservice/update`;
      eventDateService
        .approveEventDate({ user: 'mahesh', taskId: '1234' }, TransactionOutcome.APPROVE)
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(approvePayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('return event date details', () => {
    it('should return event date details', () => {
      const returnPayment = `/api/process-manager/v1/taskservice/update`;
      eventDateService.returnEventDate({ user: 'mahesh', taskId: '1234' }).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(returnPayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('reject event date details', () => {
    it('should reject event date details', () => {
      const rejectPayment = `/api/process-manager/v1/taskservice/update`;
      eventDateService
        .rejectEventDate({ user: 'mahesh', taskId: '1234', outcome: TransactionOutcome.REJECT })
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(rejectPayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('return event details by year', () => {
    it('should return event details by year', () => {
      const eventDetailsUrl = `/api/v1/contribution-event-date?fromYear=2019&toYear=2021`;
      eventDateService.getEventDetailsByDate(2019, 0, 2021, 0).subscribe(res => {
        expect(res).toBeDefined;
      });
      response => {
        expect(response).toBeDefined();
      };
      const req = httpMock.expectOne(eventDetailsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(eventDateDetailsMockData);
    });
  });

  describe('submit Event Details', () => {
    it('should submit Event Details', () => {
      const submitEventDateUrl = `/api/v1/contribution-event-date`;
      eventDateService.submitEventDetails(eventDateDetailsMockData).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(submitEventDateUrl);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });

  describe('return event details by approval status', () => {
    it('should return event details by approval status', () => {
      const approvalStatus = 'PENDING_APPROVAL';
      const eventDetailsBuStatusUrl = `/api/v1/contribution-event-date?approvalStatus=${approvalStatus}`;
      eventDateService.getEventDetailsByApprovalStatus(approvalStatus).subscribe(res => {
        expect(res).toBeDefined;
      });
      response => {
        expect(response).toBeDefined();
      };
      const req = httpMock.expectOne(eventDetailsBuStatusUrl);
      expect(req.request.method).toBe('GET');
      req.flush(pendingEventDates);
    });
  });

  describe('modify Event Details', () => {
    it('should modify Event Details', () => {
      const editEventDateUrl = `/api/v1/contribution-event-date`;
      eventDateService.modifyEventDetails(pendingEventDates).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(editEventDateUrl);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
});
