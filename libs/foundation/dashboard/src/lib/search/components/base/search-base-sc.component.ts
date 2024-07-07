/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, Directive, ViewChild } from '@angular/core';
import {
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AlertService,
  LovList,
  LookupService,
  BaseComponent,
  isObject,
  isEmpty,
  checkEmpty,
  LanguageToken,
  LanguageEnum
} from '@gosi-ui/core';
import { RequestSort, SearchRequest, RequestFilter, RequestLimit } from '../../../shared';
import { FormGroup } from '@angular/forms';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { CommonSortFilterDcComponent } from '../search-components';
import { takeUntil, map, tap } from 'rxjs/operators';
import { DashboardSearchService } from '../../services';
import moment from 'moment';

@Directive()
export abstract class SearchBaseScComponent extends BaseComponent {
  @ViewChild('commonSortFilterComponent', { static: false }) commonSortFilter: CommonSortFilterDcComponent;
  /**
   * local variables
   */
  isPrivate: boolean;
  searchRequest: SearchRequest;
  isFilter = false;
  searchForm: FormGroup = new FormGroup({});
  noResults = false;
  isSearched = false;
  fieldOfficeList$: Observable<LovList>;
  entityList$: Observable<LovList>;
  statusList$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  isSearchCount = false;
  searchKeyForm: FormGroup = new FormGroup({});
  searchKey = null;
  isEstablishment = false;
  isTransaction = false;
  isIndividual = false;
  width = window.innerWidth;
  selectedLanguage: LanguageEnum;
  /**
   *
   * @param appToken
   * @param alertService
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly dashboardSearchService: DashboardSearchService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.searchForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res?.searchKeyForm?.searchKey) {
        // this.searchRequest?.searchKey = res?.searchKeyForm?.searchKey;
      }
    });
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.width = window.innerWidth;
        })
      )
      .subscribe();
    this.language.pipe(takeUntil(this.destroy$)).subscribe((lang: LanguageEnum) => (this.selectedLanguage = lang));
  }
  /**
   * abstract method to get search results
   */
  abstract getSearchResults();
  /**
   * abstract method to reset pagination
   */
  abstract resetPagination();
  /**
   * abstarct method to close advanced search
   */
  abstract onAdvancedSearchClose();
  /**
   * abstarct method to get advanced search results
   */
  abstract onAdvancedSearch();

  abstract resetFilterAndSort();
  abstract resumeSearch();
  /**
   * method to clear alerts
   */
  clearAlerts() {
    this.alertService.clearAlerts();
  }
  // method to clear all alerts
  clearErrorAlerts() {
    this.alertService.clearAllErrorAlerts();
  }
  /**
   * method for sorting
   * @param sortItem
   */
  onSort(sortItem: RequestSort) {
    if (this.searchRequest) {
      this.searchRequest.sort = sortItem;
      this.resetPagination();
      this.getSearchResults();
    }
  }
  /**
   * method for filtering
   * @param statusFilter
   */
  onFilter(statusFilter: RequestFilter) {
    if (this.searchRequest) {
      this.searchRequest.filter = statusFilter;
      this.isFilter = true;
      this.resetPagination();
      this.getSearchResults();
    }
  }
  /**
   * method for pagination
   * @param limitItem
   */
  onLimit(limitItem: RequestLimit) {
    if (this.searchRequest) {
      this.searchRequest.limit = limitItem;
      this.getSearchResults();
    }
  }
  /**
   * method to reset search
   */
  resetSearch() {
    this.isSearched = false;
    this.noResults = false;
  }
  /**
   * Method to get field office list
   */
  getOfficeList() {
    this.fieldOfficeList$ = this.lookUpService.getFieldOfficeList().pipe(
      map((lovList: LovList) => {
        if (lovList) {
          lovList.items.forEach(item => {
            item.value.arabic = item.value.arabic.trim();
            item.value.english = item.value.english.trim();
          });
          return lovList;
        }
      })
    );
  }
  /**
   * Method to get field office list
   */
  getStatusList() {
    this.statusList$ = this.lookUpService.getEstablishmentStatusList().pipe(
      map((lovList: LovList) => {
        if (lovList) {
          lovList.items.forEach((item, index) => {
            item.sequence = index + 1;
          });

          return lovList;
        }
      })
    );
  }
  /**
   * Method to get field entity list
   */
  getEntityList() {
    this.entityList$ = this.lookUpService.getlegalEntityList();
  }
  /**
   * method to get nationalityList
   */
  getNationalityList() {
    this.nationalityList$ = this.lookUpService.getNationalityList();
  }
  getGccCountryList() {
    this.gccCountryList$ = this.lookUpService.getGccCountryList();
  }
  /**
   * method for search params validation
   */
  checkSearchParamValidity(): boolean {
    if (this.searchRequest && this.searchRequest.searchParam) {
      const searchParam = this.searchRequest.searchParam;
      if (searchParam) {
        const searchParams = Object.keys(searchParam).map(function (key) {
          if (
            (key === 'unifiedEstablishmentId' && checkEmpty(searchParam['unifiedEstablishmentIdPrefix'])) ||
            (key === 'establishmentId' && checkEmpty(searchParam['establishmentIdPrefix']))
          ) {
            return null;
          }
          if (
            key !== 'unifiedEstablishmentIdPrefix' &&
            key !== 'establishmentIdPrefix' &&
            key !== 'nationalityCode' &&
            key !== 'gccCountry' &&
            key !== 'gccCountryList'
          )
            return searchParam[key];
        });
        for (const item of searchParams) {
          if (Array.isArray(item) && item.length > 0) {
            return true;
          } else if ((isObject(item) && item?.english !== null && item?.english !== undefined) || moment.isDate(item)) {
            return true;
          } else if (item && !isObject(item) && item.toString()?.trim()?.length > 2 && !moment.isDate(item)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  /**
   * method to refresh filter
   */
  refreshFilter() {
    if (this.commonSortFilter) this.commonSortFilter?.refreshFilter();
  }
  resetTabs() {
    if (this.isTransaction) {
      this.dashboardSearchService.individualSearchRequest = undefined;
      this.dashboardSearchService.establishmentSearchRequest = undefined;
      this.dashboardSearchService.enableEstablishmentAdvancedSearch = false;
      this.dashboardSearchService.enableIndividualAdvancedSearch = false;
    } else if (this.isEstablishment) {
      this.dashboardSearchService.individualSearchRequest = undefined;
      this.dashboardSearchService.transactionSearchRequest = undefined;
      this.dashboardSearchService.enableTransactionAdvancedSearch = false;
      this.dashboardSearchService.enableIndividualAdvancedSearch = false;
    } else if (this.isIndividual) {
      this.dashboardSearchService.establishmentSearchRequest = undefined;
      this.dashboardSearchService.transactionSearchRequest = undefined;
      this.dashboardSearchService.enableTransactionAdvancedSearch = false;
      this.dashboardSearchService.enableEstablishmentAdvancedSearch = false;
    }
  }
}
