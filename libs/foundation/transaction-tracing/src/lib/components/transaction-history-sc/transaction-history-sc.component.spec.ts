/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionHistoryScComponent } from './transaction-history-sc.component';
import { TransactionService } from '../../services';
import { EnvironmentToken } from '@gosi-ui/core/lib/tokens/tokens';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, BehaviorSubject } from 'rxjs';
import { bindToObject, Transaction } from '@gosi-ui/core';
import { transactionListData } from 'testing';
import { ApplicationTypeToken, ApplicationTypeEnum, LanguageToken } from '@gosi-ui/core';
import { DatePipe } from '@angular/common';
import { TransactionFilter, TransactionSearch } from '../../models';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
declare const require;
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('TransactionHistoryScComponent', () => {
  let transactionComponent: TransactionHistoryScComponent;
  let fixture: ComponentFixture<TransactionHistoryScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionHistoryScComponent],
      imports: [
        HttpClientTestingModule,
        NgxPaginationModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot()
      ],
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
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        BsModalService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryScComponent);
    transactionComponent = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe(' ngOninit', () => {
    it('should  ngOninit', () => {
      spyOn(transactionComponent, 'allTransactions').and.callThrough();
      transactionComponent.isDescending = false;
      transactionComponent.ngOnInit();
      expect(transactionComponent.filteredTransactions).not.toEqual(null);
      expect(transactionComponent.totalItems).not.toEqual(null);
      expect(transactionComponent.lang).not.toEqual(null);
    });
  });
  describe('test suite for allTransactions', () => {
    it('It should get all the transactions', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      spyOn(transactionComponent, 'defaultSort').and.callThrough();
      spyOn(transactionComponent, 'defaultSearch').and.callThrough();
      spyOn(transactionComponent, 'transactionRequestSetter').and.callThrough();
      spyOn(transactionComponent, 'getTransactions').and.callThrough();
      transactionComponent.allTransactions();
      expect(transactionComponent.defaultPagination).toHaveBeenCalled();
      expect(transactionComponent.defaultSort).toHaveBeenCalled();
      expect(transactionComponent.defaultSearch).toHaveBeenCalled();
      expect(transactionComponent.transactionRequestSetter).toHaveBeenCalled();
      expect(transactionComponent.getTransactions).toHaveBeenCalled();
    });
  });

  describe('test suite for search Transactions', () => {
    it('It should search for all the matching transactions ', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      spyOn(transactionComponent, 'defaultSort').and.callThrough();
      spyOn(transactionComponent, 'transactionRequestSetter').and.callThrough();
      spyOn(transactionComponent, 'getTransactions').and.callThrough();
      transactionComponent.searchTransactions('1000');
      expect(transactionComponent.transactionSearch.value).toBe('1000');
      expect(transactionComponent.defaultPagination).toHaveBeenCalled();
      expect(transactionComponent.defaultSort).toHaveBeenCalled();
      expect(transactionComponent.transactionRequestSetter).toHaveBeenCalled();
      expect(transactionComponent.getTransactions).toHaveBeenCalled();
    });
  });

  describe('test suite for filter transactions', () => {
    it('It should filter the transactions', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      spyOn(transactionComponent, 'defaultSearch').and.callThrough();
      spyOn(transactionComponent, 'transactionRequestSetter').and.callThrough();
      spyOn(transactionComponent, 'getTransactions').and.callThrough();
      transactionComponent.filterTransactions(new TransactionFilter());
      expect(transactionComponent.transactionFilter).toBeDefined();
      expect(transactionComponent.defaultPagination).toHaveBeenCalled();
      expect(transactionComponent.transactionRequestSetter).toHaveBeenCalled();
      expect(transactionComponent.getTransactions).toHaveBeenCalled();
    });
  });

  describe('test suite for sorting the  transactions', () => {
    xit('It should sort the transactions', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      spyOn(transactionComponent, 'transactionRequestSetter').and.callThrough();
      spyOn(transactionComponent, 'getTransactions').and.callThrough();
      transactionComponent.sortTransactions();
      expect(transactionComponent.defaultPagination).toHaveBeenCalled();
      expect(transactionComponent.transactionRequestSetter).toHaveBeenCalled();
      expect(transactionComponent.getTransactions).toHaveBeenCalled();
    });
  });

  describe('test suite for paginate the list of transactions', () => {
    it('It should paginate the list of transactions', () => {
      spyOn(transactionComponent, 'transactionRequestSetter').and.callThrough();
      spyOn(transactionComponent, 'getTransactions').and.callThrough();
      transactionComponent.paginateTransactions(2);
      expect(transactionComponent.pageDetails.currentPage).toBe(2);
      expect(transactionComponent.currentPage).toBe(2);
      expect(transactionComponent.transactionRequestSetter).toHaveBeenCalled();
      expect(transactionComponent.getTransactions).toHaveBeenCalled();
    });
  });

  describe('check defaultPagination values', () => {
    it('check currentpage value', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      transactionComponent.defaultPagination();
      expect(transactionComponent.currentPage).toEqual(1);
    });
    it('check itemsPerPageitemsPerPage value', () => {
      spyOn(transactionComponent, 'defaultPagination').and.callThrough();
      transactionComponent.defaultPagination();
      expect(transactionComponent.itemsPerPage).toEqual(10);
    });
  });

  describe('check defaultSort values', () => {
    it('check selectedOption value', () => {
      spyOn(transactionComponent, 'defaultSort').and.callThrough();
      transactionComponent.defaultSort();
      expect(transactionComponent.selectedOption).toEqual('createdDate');
    });
    it('check isDescending value', () => {
      spyOn(transactionComponent, 'defaultSort').and.callThrough();
      transactionComponent.defaultSort();
      expect(transactionComponent.isDescending).toEqual(false);
    });
  });

  describe('check defaultSearch values', () => {
    it('check search value', () => {
      spyOn(transactionComponent, 'defaultSearch').and.callThrough();
      transactionComponent.defaultSearch();
      expect(transactionComponent.transactionSearch.value).toEqual(undefined);
    });
  });

  describe('check changeSortDirection', () => {
    it('check sort direction with isDescending as true', () => {
      spyOn(transactionComponent, 'sortTransactions').and.callThrough();
      transactionComponent.changeSortDirection();
      expect(transactionComponent.isDescending).toEqual(true);
      expect(transactionComponent.sortTransactions).toHaveBeenCalled();
    });
    it('check sort direction with isDescending as false', () => {
      spyOn(transactionComponent, 'sortTransactions').and.callThrough();
      transactionComponent.isDescending = true;
      transactionComponent.changeSortDirection();
      expect(transactionComponent.isDescending).toEqual(false);
      expect(transactionComponent.sortTransactions).toHaveBeenCalled();
    });
  });

  describe('check sortList', () => {
    it('check changeSortDirection is called', () => {
      spyOn(transactionComponent, 'changeSortDirection').and.callThrough();
      transactionComponent.sortList('Initiated On');
      expect(transactionComponent.selectedOption).toEqual('Initiated On');
      expect(transactionComponent.changeSortDirection).toHaveBeenCalled();
    });
    it('check sort method', () => {
      spyOn(transactionComponent, 'sortTransactions').and.callThrough();
      transactionComponent.sort();
      expect(transactionComponent.sortTransactions).toHaveBeenCalled();
    });
  });

  describe('getTransactions', () => {
    it('should get transactions', () => {
      spyOn(transactionComponent.transactionService, 'getTransactions').and.returnValue(
        of(bindToObject(new Transaction(), transactionListData))
      );
      transactionComponent.getTransactions();
      expect(transactionComponent.transactionService.getTransactions).toHaveBeenCalled();
      expect(transactionComponent.filteredTransactions).not.toEqual(null);
      expect(transactionComponent.totalItems).not.toEqual(null);
    });
  });

  describe('should set the transaction', () => {
    it('transaction setter', () => {
      transactionComponent.currentPage = 1;
      transactionComponent.itemsPerPage = 10;
      transactionComponent.selectedOption = 'createdDate';
      transactionComponent.isDescending = false;
      transactionComponent.transactionFilter = new TransactionFilter();
      transactionComponent.transactionSearch = new TransactionSearch();

      transactionComponent.transactionRequestSetter();
      expect(transactionComponent.transactionRequest.page.pageNo).toBe(0);
      expect(transactionComponent.transactionRequest.page.size).toBe(10);

      expect(transactionComponent.transactionRequest.sort.column).toBe('createdDate');
      expect(transactionComponent.transactionRequest.sort.direction).toBe(false);

      expect(transactionComponent.transactionRequest.filter).toBeDefined();
      expect(transactionComponent.transactionRequest.search).toBeDefined();
    });
  });

  describe('should navigate the transaction', () => {
    it('transaction navigation', () => {
      transactionComponent.transactionsJson = require('../../../../../../../transactions.json');
      const txn: Transaction = {
        title: {
          arabic: 'إبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 492707,
        assigneeName: '',
        initiatedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        lastActionedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        status: {
          arabic: 'مكتملة',
          english: 'Completed'
        },
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'Field Office'
        },
        registrationNo: 10000602,
        sin: 601336235,
        businessId: 1001964003,
        transactionId: 101501,
        contributorId: null,
        establishmentId: null,
        taskId: null,
        assignedTo: null,
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
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
      expect(transactionComponent.transactionNavigation(txn)).toBe(routerSpy.navigate('../../oh/101501/492707'));
    });
  });
  describe('check statusbadgetype', () => {
    it('should call statusbadgetype', () => {
      const txn: Transaction = {
        title: {
          arabic: 'إبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 492707,
        assigneeName: '',
        initiatedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        lastActionedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        status: {
          arabic: 'مكتملة',
          english: 'Completed'
        },
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'Field Office'
        },
        registrationNo: 10000602,
        sin: 601336235,
        businessId: 1001964003,
        transactionId: 101501,
        contributorId: null,
        establishmentId: null,
        taskId: null,
        assignedTo: null,
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
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
      };
      transactionComponent.statusBadgeType(txn);
      expect(txn.status.english).not.toEqual(undefined);
    });
  });
  it('should create', () => {
    expect(transactionComponent).toBeTruthy();
  });
});
