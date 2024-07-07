/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionSearchScComponent } from './transaction-search-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock, ContactForms, Transaction, TransactionServiceStub } from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchRequest, RequestLimit, RequestSort } from '../../../../shared';
import { TransactionsSortConstants } from '../../../constants';
import { of, BehaviorSubject, throwError } from 'rxjs';
import {
  bindToObject,
  ApplicationTypeToken,
  LanguageToken,
  GosiCalendar,
  Transaction as Txn,
  EnvironmentToken,
  TransactionService
} from '@gosi-ui/core';
import { transactionListData } from 'testing';
import { TransactionEntriesDcComponent } from '../transaction-entries-dc/transaction-entries-dc.component';
import { SearchCardDcComponent } from '../../search-components';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonSortFilterDcComponent } from '../../search-components';
import { FormBuilder } from '@angular/forms';

declare const require;
const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('TransactionSearchScComponent', () => {
  let component: TransactionSearchScComponent;
  let fixture: ComponentFixture<TransactionSearchScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionSearchScComponent, TransactionEntriesDcComponent],
      imports: [
        NgxPaginationModule,
        TranslateModule.forRoot(),
        TabsModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard/search/establishment',
            component: TransactionSearchScComponent
          }
        ]),
        RouterTestingModule,
        HttpClientTestingModule
      ],

      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        {
          provide: TransactionService,
          useClass: TransactionServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.isSearch = false;
      spyOn(component, 'initiateSearch').and.callThrough();
      component.ngOnInit();
    });
  });
  describe(' initiate search', () => {
    it(' should initiate search ', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.limit = new RequestLimit();
      component.searchRequest.sort = new RequestSort();
      component.searchRequest.sort.column = TransactionsSortConstants.SORT_FOR_TRANSACTIONS[0].column;
      component.initiateSearch();
      expect(component.searchRequest.limit.pageNo).toBe(0);
      expect(component.searchRequest.limit.pageSize).toBe(10);
      expect(component.searchRequest.sort.direction).toBe('DESC');
      expect(component.searchRequest.sort.column).toBe(TransactionsSortConstants.SORT_FOR_TRANSACTIONS[0].column);
      expect(component.searchRequest.limit).toBeDefined();
      expect(component.searchRequest.sort).toBeDefined();
    });
  });
  describe('test suite for search transactions', () => {
    it('It should search for all the matching transactions ', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      component.isSearch = true;
      component.onSearchTransaction();
      expect(component.isSearch).toEqual(true);
    });
  });
  describe('getSearchResult for txns', () => {
    it('should getSearchResult for txns', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.searchKey = '10000';
      spyOn(component.dashboardSearchService, 'searchTransaction').and.returnValue(
        of(bindToObject(new Txn(), transactionListData))
      );
      component.getSearchResults();
      expect(component.transactionEntry).not.toEqual(null);
      expect(component.transactionSearchCount).not.toEqual(null);
      expect(component.searchRequest).toBeDefined();
    });
    it('should throw error', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.searchKey = '10000';
      spyOn(component.dashboardSearchService, 'searchTransaction').and.returnValue(
        throwError({
          error: {
            message: {
              english: 'please try again later',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getSearchResults();
      expect(component.searchRequest).toBeDefined();
      expect(component).toBeTruthy();
    });
    it('should throw error', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.searchKey = '10000';
      component.isFilter = true;
      spyOn(component.dashboardSearchService, 'searchTransaction').and.returnValue(
        throwError({
          error: {
            status: 400,
            message: {
              english: 'please try again later',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getSearchResults();
      expect(component.searchRequest).toBeDefined();
      expect(component.isFilter).toEqual(true);
      expect(component).toBeTruthy();
    });
  });
  describe('test suite  onTransactionSearchEnable', () => {
    it('It should  onTransactionSearchEnable', () => {
      spyOn(component, 'clearSearchDetails').and.callThrough();
      component.onTransactionSearchEnable(true);
      expect(component.clearSearchDetails).toHaveBeenCalled();
      expect(component.isSearch).toEqual(false);
    });
  });

  describe('test suite for  clearSearchDetails ', () => {
    it('It should  clearSearchDetails', () => {
      component.clearSearchDetails();
      expect(component.transactionEntry).toEqual([]);
      expect(component.transactionSearchCount).toBe(0);
    });
  });
  describe('should navigate the transaction', () => {
    it('transaction navigation', () => {
      component.transactionsJson = require('../../../../../../../../../transactions.json');
      const transaction: Txn = {
        title: {
          arabic: 'إبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 495012,
        lastActionedDate: new GosiCalendar(),
        initiatedDate: new GosiCalendar(),
        channel: {
          arabic: 'مكتملة',
          english: 'RASED'
        },
        assignedTo: '100000',
        status: {
          arabic: 'مكتملة',
          english: 'Completed'
        },
        assigneeName: '',
        transactionId: 101501,
        registrationNo: 10000602,
        sin: 608312345,
        businessId: 1235646,
        contributorId: 12435676879,
        establishmentId: 9089753423,
        taskId: 'afggh46y5vnj',
        params: null,
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
      expect(component.transactionNavigation(transaction)).toBe(
        routerSpy.navigate('/home/oh/transactions/101501/495012/report-occupational-hazard')
      );
    });
  });
  describe('test suite for reset pagination', () => {
    it('It should reset the pagination', () => {
      component.txnEntry = new TransactionEntriesDcComponent();
      component.searchTxnEntry = new SearchCardDcComponent(component.language);
      spyOn(component.txnEntry, 'resetPagination').and.callThrough();
      spyOn(component.searchTxnEntry, 'resetPagination').and.callThrough();
      component.resetPagination();
      expect(component.txnEntry).toBeDefined();
      expect(component.searchTxnEntry).toBeDefined();
      expect(component.txnEntry.resetPagination).toHaveBeenCalled();
      expect(component.searchTxnEntry.resetPagination).toHaveBeenCalled();
    });
  });
  describe('test suite for  refresh filter ', () => {
    it('It should  refresh filter', () => {
      const fb = new FormBuilder();
      const lang = new BehaviorSubject(null);
      component.commonSortFilter = new CommonSortFilterDcComponent(fb, lang);
      component.refreshFilter();
      expect(component).toBeTruthy();
      expect(component.commonSortFilter).toBeDefined();
    });
  });
  describe('test suite for  close adv search ', () => {
    it('It should  close adv search', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.searchParam.personIdentifier = undefined;
      component.searchRequest.searchParam.registrationNo = undefined;
      component.onAdvancedSearchClose();
      expect(component.searchRequest).toBeDefined();
    });
  });
  describe('test suite for  adv search ', () => {
    it('It should  adv search', () => {
      const forms = new ContactForms();
      component.searchForm = forms.searchForm();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('12334');
      component.searchForm.get('AdvsearchKeyForm').get('personIdentifier').setValue(123344);
      component.searchForm.get('AdvsearchKeyForm').get('registrationNo').setValue(12345);
      component.onAdvancedSearch();
      expect(component.searchForm.valid).toBeTruthy();
    });
  });

  describe('test suite for resume search transactions', () => {
    it('It should resume search  ', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      component.isSearch = true;
      component.resumeSearch();
      expect(component).toBeTruthy();
    });
  });
  describe('test suite for   onsearch ', () => {
    it('It should onsearch', () => {
      const forms = new ContactForms();
      component.searchForm = forms.searchForm();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('12334');
      component.searchForm.get('AdvsearchKeyForm').get('personIdentifier').setValue(123344);
      component.searchForm.get('AdvsearchKeyForm').get('registrationNo').setValue(12345);
      component.onSearchTransaction();
      expect(component.searchForm.valid).toBeTruthy();
    });
  });
  describe('show advanced search', () => {
    it('should show advanced search', () => {
      component.onAdvancedSearchShow();
      expect(component.dashboardSearchService.enableTransactionAdvancedSearch).toEqual(true);
    });
  });
  describe('reset search', () => {
    it('should reset search', () => {
      component.onReset();
      expect(component).toBeTruthy();
    });
  });
});
