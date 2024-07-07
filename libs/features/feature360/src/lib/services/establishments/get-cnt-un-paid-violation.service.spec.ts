import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntUnPaidViolation } from '../../models/establishments/get-cnt-un-paid-violation';

import { GetCntUnPaidViolationService } from './get-cnt-un-paid-violation.service';

describe('GetCntUnPaidViolationService', () => {
  let service: GetCntUnPaidViolationService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntUnPaidViolationService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntUnPaidViolationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt unpaid violation service', () => [
    it('should get unpaid violation', () => {
      const establishmentId = 34564566;
      const entityId = 12345;
      let cntUnPaidViolation: GetCntUnPaidViolation = new GetCntUnPaidViolation();
      cntUnPaidViolation.amount = 5;

      const response = {
        elements: [cntUnPaidViolation]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_get_unpaid_violation/views/bv_cnt_get_unpaid_violation?$filter=p_entityid+in+%27${entityId}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntUnPaidViolation(entityId, establishmentId).subscribe(res => {
        expect(res.amount).toBe(cntUnPaidViolation.amount);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
