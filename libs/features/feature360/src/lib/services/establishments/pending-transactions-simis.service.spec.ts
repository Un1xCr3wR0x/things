import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { PendingTransactionsSimis } from '../../models/establishments/pending-transactions-simis';

import { PendingTransactionsSimisService } from './pending-transactions-simis.service';

describe('PendingTransactionsSimisService', () => {
  let service: PendingTransactionsSimisService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PendingTransactionsSimisService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(PendingTransactionsSimisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('pending transactions simis service', () => [
    it('should get transactions', () => {
      const registrationNo = 34564566;
      let pendingTransactionsSimis: PendingTransactionsSimis[] = [];
      const response = {
        elements: pendingTransactionsSimis
      };
      const url = `${service.interceptUrl}/customer360/bv_pending_transactions_simis/views/bv_pending_transactions_simis?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
      service.getPendingTransactionsSimis(registrationNo).subscribe(res => {
        expect(res).toEqual(pendingTransactionsSimis);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
