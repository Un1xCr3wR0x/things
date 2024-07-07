import { TestBed } from '@angular/core/testing';

import { HandleDelayedPaymentService } from './handle-delayed-payment.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ApplicationTypeToken, AuthTokenService} from "@gosi-ui/core";
import {AuthTokenServiceStub, reversedLateFeesMockData} from "../../../../../../../../testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('HandleDelayedPaymentService', () => {
  let service: HandleDelayedPaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        },
        {provide: AuthTokenService, useClass: AuthTokenServiceStub}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(HandleDelayedPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("getReversedLateFees", () => {
    it('should get reversed late fees', () => {
      const getReversedLateFees = '/api/v1/establishment/500500921/handle-delayed-payment?startDate=2023-08-01'
      service.getReversedLateFees(500500921, '2023-08-01')
        .subscribe(res => {
          expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(getReversedLateFees)
      expect(req.request.method).toBe('GET');
      req.flush(reversedLateFeesMockData)
    });
  })
});
