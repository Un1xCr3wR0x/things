/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hijriDateData } from 'testing';
import { GosiCalendar } from '../models';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add to hijiri date', () => {
    const url = `/api/v1/calendar/add-hijiri?hijiriDate=1410-11-23&years=15&months=0&days=0`;
    service.addToHijiriDate('1410-11-23', 15).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new GosiCalendar());
  });
  it('Should get gregorian Date', () => {
    service.getGregorianDate('1442-10-20').subscribe(() => {
      expect(hijriDateData.gregorian).toEqual('2020-09-08T00:00:00.000Z');
    });
    const calenderUrl = `/api/v1/calendar/gregorian?hijiri=1442-10-20`;
    const httpRequest = httpMock.expectOne(calenderUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(hijriDateData);
    httpMock.verify();
  });
});
