import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Alert, AlertService, ApplicationTypeToken, BilingualText, RequestSort } from '@gosi-ui/core';
import { AlertServiceStub, filterHistoryData } from 'testing';
import { FilterHistory, HistoryRequest, Page } from '../models';
import { EstablishmentViolationsService } from './establishment-violations.service';

describe('EstablishmentViolationsService', () => {
  let service: EstablishmentViolationsService;
  let httpMock: HttpTestingController;
  let historyrequest: HistoryRequest = <HistoryRequest>{};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        },
        DatePipe,
        { provide: AlertService, useClass: AlertServiceStub }
      ]
    });
    service = TestBed.inject(EstablishmentViolationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getViolationHistory', () => {
    it('should fetch establishment violations history', () => {
      let registrationNo = 200085744;
      const url = `/api/v1/establishment/${registrationNo}/unpaid-violation?pageNo=0&pageSize=10&searchKey=491887&sortOrder=ASC&listOfViolationType=In Progress&listOfViolationType=Completed&startDate=2021-12-01&endDate=2021-12-09&listOfStatus=In Progress`;
      historyrequest.page = new Page();
      historyrequest.page.pageNo = 0;
      historyrequest.page.size = 10;

      historyrequest.sort = new RequestSort();
      historyrequest.sort.column = 'description';
      historyrequest.sort.direction = 'ASC';

      historyrequest.filter = new FilterHistory();
      historyrequest.filter.status = [
        {
          english: 'In Progress',
          arabic: 'بلاغ قيد المعالج'
        }
      ];
      historyrequest.filter.period = {
        startDate: '12/01/21',
        endDate: '12/09/21'
      };
      historyrequest.filter.violationType = [
        {
          english: 'In Progress',
          arabic: 'بلاغ قيد المعالج'
        },
        {
          english: 'Completed',
          arabic: 'بلاغ قيد المعالج'
        }
      ];
      historyrequest.searchKey = '491887';
      service.getViolationHistory(registrationNo, historyrequest).subscribe(() => {
        expect(filterHistoryData).not.toBe(null);
      });
      const httpRequest = httpMock.expectOne(url);
      expect(httpRequest.request.method).toBe('GET');
      httpRequest.flush(filterHistoryData);
      httpMock.verify();
    });
    it('should fetch establishment violations history', () => {
      let registrationNo = 200085744;
      const url = `/api/v1/establishment/${registrationNo}/unpaid-violation?pageNo=0&pageSize=10&searchKey=491887&sortOrder=ASC&listOfViolationType=In Progress&listOfViolationType=Completed&startDate=2021-12-01&endDate=2021-12-09&listOfStatus=In Progress`;
      historyrequest.page = new Page();
      historyrequest.page.pageNo = 0;
      historyrequest.page.size = 10;

      historyrequest.sort = new RequestSort();
      historyrequest.sort.column = 'description';
      historyrequest.sort.direction = 'ASC';

      historyrequest.filter = new FilterHistory();
      historyrequest.filter.status = [
        {
          english: 'In Progress',
          arabic: 'بلاغ قيد المعالج'
        }
      ];
      historyrequest.filter.period = {
        startDate: '12/01/21',
        endDate: '12/09/21'
      };
      historyrequest.filter.violationType = [
        {
          english: 'In Progress',
          arabic: 'بلاغ قيد المعالج'
        },
        {
          english: 'Completed',
          arabic: 'بلاغ قيد المعالج'
        }
      ];
      historyrequest.searchKey = '491887';
      const errMsg = 'expect 404 error';
      service.getViolationHistory(registrationNo, historyrequest).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('show error', () => {
    it('should throw error', () => {
      spyOn(service.alertService, 'showError');
      service.showAlerts({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(service.alertService.showError).toHaveBeenCalled();
    });
  });
});
