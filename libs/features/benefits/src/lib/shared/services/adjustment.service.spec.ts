/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AdjustmentService } from '.';
import { TransactionHistoryFilter, PaymentHistoryFilter, AppealDetails } from '..';

describe('AdjustmentService', () => {
  let httpMock: HttpTestingController;
  let service: AdjustmentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(AdjustmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('should getSanedHoldReasons', () => {
    expect(service.adjustmentDetails(24345, 2532121, true)).not.toEqual(null);
  });
  it('should directPayment', () => {
    expect(service.directPayment(24345, 7665, 65655)).not.toEqual(null);
  });
});
