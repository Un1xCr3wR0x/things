/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { transactionListFilterData } from 'testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { EnvironmentToken } from '@gosi-ui/core/lib/tokens/tokens';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionHistoryRequest, TransactionLimit, TransactionSort, TransactionFilter } from '../models';
import { TransactionSearch } from '../models/transaction-search';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { DatePipe } from '@angular/common';
describe('TransactionService', () => {
  let transactionService: TransactionService;
  let httpMock: HttpTestingController;

  let transactionRequest: TransactionHistoryRequest = <TransactionHistoryRequest>{};
  /**
   * Filter and Search variables
   */
  let transactionFilter: TransactionFilter = new TransactionFilter();
  let transactionSearch: TransactionSearch = new TransactionSearch();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        TransactionService,
        DatePipe,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080' }
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });
    transactionService = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('TransactionService should be created', () => {
    expect(transactionService).toBeTruthy();
  });

  it('Should get the filtered Transaction list search with transaction id and filter by channel', () => {
    const transactionListUrl =
      '/api/v1/transaction?page.pageNo=1&page.size=10&filter.initiatedDateFrom=01-01-2020&filter.initiatedDateTo=12-01-2020&filter.lastActionDate=02-05-2020&filter.listOfChannels=gosi-online&searchKey=1000&sort.column=transactionId&sort.direction=ASC';
    transactionRequest.page = new TransactionLimit();
    transactionRequest.page.pageNo = 1;
    transactionRequest.page.size = 10;

    transactionRequest.sort = new TransactionSort();
    transactionRequest.sort.column = 'transactionId';
    transactionRequest.sort.direction = false;

    transactionFilter = new TransactionFilter();
    transactionFilter.channel = [
      {
        english: 'gosi-online',
        arabic: 'متصل'
      }
    ];
    transactionFilter.status = [];
    transactionFilter.initiatedFrom = new Date('2020-01-01T10:48:49.112Z');
    transactionFilter.initiatedTo = new Date('2020-01-12T10:48:49.112Z');
    transactionFilter.lastActionDate = new Date('2020-05-02T10:48:49.112Z');
    transactionRequest.filter = transactionFilter;

    transactionSearch = new TransactionSearch();
    transactionSearch.value = '1000';
    transactionRequest.search = transactionSearch;
    transactionService.getTransactions(transactionRequest).subscribe(() => {
      expect(transactionListFilterData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(transactionListUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListFilterData);
    httpMock.verify();
  });

  it('Should get the filtered Transaction list search with transaction type and filter by status', () => {
    const transactionListUrl =
      '/api/v1/transaction?page.pageNo=1&page.size=10&filter.listOfStatus=Approved&searchKey=Register&sort.column=transactionType&sort.direction=DESC';
    transactionRequest.page = new TransactionLimit();
    transactionRequest.page.pageNo = 1;
    transactionRequest.page.size = 10;

    transactionRequest.sort = new TransactionSort();
    transactionRequest.sort.column = 'transactionType';
    transactionRequest.sort.direction = true;

    transactionFilter = new TransactionFilter();

    transactionFilter.status = [
      {
        english: 'Approved',
        arabic: 'اعتماد'
      }
    ];
    transactionFilter.channel = [];
    transactionRequest.filter = transactionFilter;
    transactionSearch = new TransactionSearch();
    transactionSearch.value = 'Register';
    transactionRequest.search = transactionSearch;
    transactionService.getTransactions(transactionRequest).subscribe(() => {
      expect(transactionListFilterData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(transactionListUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListFilterData);
    httpMock.verify();
  });

  it('Should get the filtered Transaction list from public API with pagination and sorting', () => {
    const transactionListUrl =
      '/api/v1/transaction?page.pageNo=0&page.size=10&sort.column=createdDate&sort.direction=DESC';
    transactionRequest.page = new TransactionLimit();
    transactionRequest.page.pageNo = 0;
    transactionRequest.page.size = 10;

    transactionRequest.sort = new TransactionSort();
    transactionRequest.sort.column = 'createdDate';
    transactionRequest.sort.direction = true;

    transactionRequest.filter = new TransactionFilter();
    transactionRequest.search = new TransactionSearch();

    transactionService.getTransactions(transactionRequest).subscribe(() => {
      expect(transactionListFilterData.items.length).toBeGreaterThan(0);
    });
    const httpRequest = httpMock.expectOne(transactionListUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(transactionListFilterData);
    httpMock.verify();
  });
});
