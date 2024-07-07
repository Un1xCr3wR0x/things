/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionCalendarMock } from 'testing/mock-services';
import { SessionFilterRequest, SessionRequest } from '..';
import { SessionCalendarService } from './session-calendar.service';

describe('SessionCalendarService', () => {
  let service: SessionCalendarService;
  let request: SessionRequest = <SessionRequest>{};
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(SessionCalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should get calendar service', () => {
    it('should fetch Member Details', () => {
      let currentMonth = 11;
      let currentYear = 2021;
      const url = `/api/v1/mb-session/calendar-summary?month=11&year=2021&listOfChannel=Virtual&listOfFieldOffice=Riyadh&listOfSessionType=Regular&listOfSlotAvailability=yes&listOfStatus=cancelled`;
      request.filter = new SessionFilterRequest();
      request.filter.channel = [
        {
          english: 'Virtual',
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
      request.filter.slot = [
        {
          english: 'yes',
          arabic: 'متصل'
        }
      ];
      request.filter.status = [
        {
          english: 'cancelled',
          arabic: 'متصل'
        }
      ];
      service.getSessionDetails(currentMonth, currentYear, request).subscribe(res => {
        expect(res).not.toBeNull;
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(SessionCalendarMock);
    });
  });
  describe('getIndividualSessionDetails', () => {
    it('should getIndividualSessionDetails', () => {
      let selectedDate = '2021-11-21';
      const url = `/api/v1/mb-session/calendar-day-details?date=${selectedDate}&listOfSessionType=Regular&listOfFieldOffice=Riyadh&listOfChannel=Virtual&listOfSlotAvailability=yes&listOfStatus=cancelled`;
      request.filter = new SessionFilterRequest();
      request.filter.channel = [
        {
          english: 'Virtual',
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
      request.filter.slot = [
        {
          english: 'yes',
          arabic: 'متصل'
        }
      ];
      request.filter.status = [
        {
          english: 'cancelled',
          arabic: 'متصل'
        }
      ];
      service.getDateSessionDetails(selectedDate, request).subscribe(res => {
        expect(res).not.toBeNull;
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(SessionCalendarMock);
    });
  });
  describe('getCalendarfilter', () => {
    it('should getCalendarfilter', () => {
      service.getCalendarfilter();
    });
  });
});
