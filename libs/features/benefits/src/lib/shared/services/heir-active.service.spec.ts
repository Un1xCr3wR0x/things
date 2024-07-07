import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { HeirActiveService } from './heir-active.service';

describe('HeirActiveService', () => {
  let httpMock: HttpTestingController;
  let service: HeirActiveService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(HeirActiveService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('to  getHeirDetails', () => {
    const benefitRequestId = 5656454;
    const sin = 23453543434;
    const identifier = 56567567;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/${identifier}/benefit`;
    service.getHeirDetails(sin, benefitRequestId, identifier).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getPaymentDetails', () => {
    const benefitRequestId = 5656454;
    const sin = 23453543434;
    const identifier = 56567567;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/${identifier}/payment-detail`;
    service.getPaymentDetails(sin, benefitRequestId, identifier).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getActiveHeirDetails', () => {
    expect(service.getActiveHeirDetails()).not.toEqual(null);
  });
  it('should  setActiveHeirDetails', () => {
    const activeHeirDetails = {
      sin: 34456556
    };
    expect(service.setActiveHeirDetails(activeHeirDetails)).not.toEqual(null);
  });
});
