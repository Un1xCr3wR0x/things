/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { EstablishmentTransactionHistoryScComponent } from './establishment-transaction-history-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTypeToken, ApplicationTypeEnum, Lov, bindToObject, Transaction } from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionSearch, TransactionFilter } from '../../../models';
import { of, throwError } from 'rxjs';
import { transactionListData } from 'testing';
describe('EstablishmentTransactionHistoryScComponent', () => {
  let component: EstablishmentTransactionHistoryScComponent;
  let fixture: ComponentFixture<EstablishmentTransactionHistoryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentTransactionHistoryScComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, NgxPaginationModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        DatePipe,
        { provide: ActivatedRoute, useFactory: activatedRouteStub }
      ]
    }).compileComponents();
  });
  const activatedRouteStub = () => ({
    queryParams: { subscribe: f => f([]) }
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentTransactionHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('search txns', () => {
    it('should search txns', () => {
      component.searchRequest = new TransactionSearch();
      const value = 'abcd';
      component.searchEstablishmentTransaction(value);
      expect(component.searchRequest).toBeDefined();
    });
  });
  describe('enable search txns', () => {
    it('should enable search txns', () => {
      const value = null;
      spyOn(component, 'searchEstablishmentTransaction').and.callThrough();
      component.onSearchEnable(value);
      expect(value).toEqual(null);
    });
  });
  describe('filter txns', () => {
    it('should filter txns', () => {
      component.filterRequest = new TransactionFilter();
      const request = {
        channel: null,
        status: [{ english: 'In Progress', arabic: '--' }],
        lastActionDate: undefined,
        initiatedFrom: undefined,
        initiatedTo: undefined
      };
      component.filterTransactionList(request);
      expect(component.filterRequest).toBeDefined();
    });
  });
  describe('on sort', () => {
    it('should sort columns', () => {
      spyOn(component, 'resetPagination').and.callThrough();
      component.onSort();
      expect(component).toBeTruthy();
    });
  });
  describe('on sort item selection', () => {
    it('should sort item selection', () => {
      const value = new Lov();
      spyOn(component, 'onSort').and.callThrough();
      component.onSortItemSelected(value);
      expect(component).toBeTruthy();
    });
  });
  describe('toggle direction', () => {
    it('should toggle direction', () => {
      const order = 'ASC';
      component.directionToggle(order);
      expect(component.isDescending).toEqual(false);
    });
    it('should toggle direction', () => {
      const order = 'DESC';
      component.directionToggle(order);
      expect(component.isDescending).toEqual(true);
    });
  });
  describe('select page', () => {
    it('should select page', () => {
      const page = 1;
      component.selectPage(page);
      expect(component).toBeTruthy();
    });
  });
  describe('getTransactions', () => {
    it('should get transactions', () => {
      spyOn(component.transactionService, 'getTransactions').and.returnValue(
        of(bindToObject(new Transaction(), transactionListData))
      );
      component.getEstablishmentTransactions();
      expect(component.transactions).not.toEqual(null);
      expect(component.totalRecords).not.toEqual(null);
    });
    it('should throw error', () => {
      spyOn(component.transactionService, 'getTransactions').and.returnValue(
        throwError({
          error: {
            message: {
              english: 'please try again later',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getEstablishmentTransactions();
      expect(component.transactions).toEqual([]);
      expect(component.totalRecords).toEqual(0);
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
