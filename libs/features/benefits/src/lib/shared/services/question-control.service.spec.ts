/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { RequestEventType } from '../models/questions';
import { QuestionControlService } from './question-control.service';

describe('QuestionControlService', () => {
  let service: QuestionControlService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(QuestionControlService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get EventsFromApi', () => {
    const personId = 67189827;
    const sin = 1234;
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const effectiveStartDate = new GosiCalendar();
    const effectiveEndDate = new GosiCalendar();
    const modifyHeir = false;
    // service.effectiveStartDate.gregorian = new Date('2022-01-07');
    const url = `/api/v1/beneficiary/${personId}/benefit/event?effectiveStartDate=${currentDate}&effectiveEndDate=${currentDate}&modifyHeir=${modifyHeir}`;
    // const url = `/api/v1/beneficiary/${personId}/benefit/event?effectiveStartDate=${effectiveStartDate}&effectiveEndDate=${effectiveEndDate}`;
    // const url =`/api/v1/beneficiary/${personId}/benefit/event`;
    service.getEventsFromApi(personId, sin, effectiveStartDate, effectiveEndDate).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get Event Types', () => {
    const getEventTypesParmas = new RequestEventType();
    getEventTypesParmas.missingDate = new GosiCalendar();
    getEventTypesParmas.requestDate = new GosiCalendar();
    getEventTypesParmas.relationship = new BilingualText();
    service.getEventTypes(getEventTypesParmas);
    expect(service.getEventTypes).toBeDefined();
  });
  /*it('should getExistingEvents', () => {
    expect(service.getExistingEvents(65454)).not.toEqual(null);
  });*/
});
