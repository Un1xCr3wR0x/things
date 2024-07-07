/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { transactionTraceData } from 'testing/test-data';
import { Transaction } from '../models';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentToken } from '../tokens';
import { CryptoService } from './crypto.service';
import { CryptoServiceStub } from 'testing';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        TransactionService,
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: CryptoService, useClass: CryptoServiceStub }
      ]
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('Should get the transaction with the specified transaction traceid', () => {
    const transactionTraceUrl = '/api/v1/transaction/492050';
    let transactionTraceId = 492050;
    service.getTransaction(transactionTraceId).subscribe(() => {
      expect(transactionTraceData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(transactionTraceUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionTraceData);
    httpMock.verify();
  });
  it('getTransactionDetails to be called', () => {
    service['transaction'] = {
      transactionRefNo: 1234,
      title: {
        arabic: 'إبلاغ عن أخطار مهنية',
        english: 'Report Occupational Hazard'
      },
      description: {
        arabic: '10000602 :للمنشأة رقم',
        english: 'for Establishment: 10000602'
      },
      contributorId: 1234,
      establishmentId: 12334,
      initiatedDate: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      lastActionedDate: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      status: {
        arabic: 'قيد المعالجة',
        english: 'In Progress'
      },
      channel: {
        arabic: '',
        english: 'unknown'
      },
      assigneeName: '',
      transactionId: 1234,
      registrationNo: 1234,
      sin: 1234,
      businessId: 3527632,
      taskId: '123456',
      assignedTo: 'abc',
      params: {
        BUSINESS_ID: 1234
      },
      idParams: new Map(),
      pendingWith: null,
      fromJsonToObject(json) {
        Object.keys(new Transaction()).forEach(key => {
          if (key in json) {
            if (key === 'params' && json[key]) {
              this[key] = json[key];
              const params = json.params;
              Object.keys(params).forEach(paramKey => {
                this.idParams.set(paramKey, params[paramKey]);
              });
            } else {
              this[key] = json[key];
            }
          }
        });
        return this;
      }
    };
    const transaction = service.getTransactionDetails();
    expect(transaction.businessId).toEqual(3527632);
  });
  it('setTransactionDetails to be called', () => {
    const transationData = (service['transaction'] = {
      transactionRefNo: 1234,
      title: {
        arabic: 'إبلاغ عن أخطار مهنية',
        english: 'Report Occupational Hazard'
      },
      description: {
        arabic: '10000602 :للمنشأة رقم',
        english: 'for Establishment: 10000602'
      },
      contributorId: 1234,
      establishmentId: 12334,
      assigneeName: '',
      initiatedDate: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      lastActionedDate: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      status: {
        arabic: 'قيد المعالجة',
        english: 'In Progress'
      },
      channel: {
        arabic: '',
        english: 'unknown'
      },
      transactionId: 1234,
      registrationNo: 1234,
      sin: 1234,
      businessId: 3527632,
      taskId: '123456',
      assignedTo: 'abc',
      params: {
        BUSINESS_ID: 1234
      },
      pendingWith: null,
      idParams: new Map(),
      fromJsonToObject(json) {
        Object.keys(new Transaction()).forEach(key => {
          if (key in json) {
            if (key === 'params' && json[key]) {
              this[key] = json[key];
              const params = json.params;
              Object.keys(params).forEach(paramKey => {
                this.idParams.set(paramKey, params[paramKey]);
              });
            } else {
              this[key] = json[key];
            }
          }
        });
        return this;
      }
    });
    service.setTransactionDetails(transationData);
    expect(service['transaction'].businessId).toEqual(3527632);
  });
});
