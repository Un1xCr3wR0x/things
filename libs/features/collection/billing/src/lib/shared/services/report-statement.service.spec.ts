import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthTokenService } from '@gosi-ui/core';
import { AuthTokenServiceStub } from 'testing';

import { ReportStatementService } from './report-statement.service';

describe('ReportStatementService', () => {
  let reportStatementservice: ReportStatementService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthTokenService, useClass: AuthTokenServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    reportStatementservice = TestBed.inject(ReportStatementService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(reportStatementservice).toBeTruthy();
  });
});
