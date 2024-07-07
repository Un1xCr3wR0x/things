/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { TransactionSearchResponse } from '../../../models';
import { SearchRequest, RequestLimit, RequestSort, RequestFilter } from '../../../../shared';
import { TransactionsSortConstants } from '../../../constants';
import { TransactionEntriesDcComponent } from '../transaction-entries-dc/transaction-entries-dc.component';
import { DashboardSearchService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApplicationTypeToken,
  AlertService,
  LanguageToken,
  SearchService,
  SortDirectionEnum,
  LookupService,
  TransactionService,
  Transaction,
  getChannel,
  BilingualText,
  BPMTaskConstants,
  IdentityManagementService
} from '@gosi-ui/core';
import { SearchBaseScComponent } from '../../base/search-base-sc.component';
import { tap, takeUntil } from 'rxjs/operators';
import { SearchCardDcComponent } from '../../search-components';
import { BehaviorSubject } from 'rxjs';

declare const require;
@Component({
  selector: 'dsb-transaction-search-sc',
  templateUrl: './transaction-search-sc.component.html',
  styleUrls: ['./transaction-search-sc.component.scss']
})
export class TransactionSearchScComponent extends SearchBaseScComponent implements OnInit, OnDestroy {
  //ViewChild components
  @ViewChild('txnEntry') txnEntry: TransactionEntriesDcComponent;
  @ViewChild('searchTxnEntry', { static: false }) searchTxnEntry: SearchCardDcComponent;

  /*
   * Local variables
   */
  transactionsJson = require('../../../../../../../../../transactions.json');
  item = null;
  transactionEntry: Transaction[] = [];
  transactionSearchCount: number;
  isSearch: boolean;
  isFilter = false;
  isShow = true;
  searchRequest: SearchRequest = new SearchRequest();
  /**
   *
   * @param dashboardSearchService
   * @param router
   * @param searchService
   * @param route
   * @param alertService
   * @param appToken
   * @param language
   */
  constructor(
    public dashboardSearchService: DashboardSearchService,
    readonly router: Router,
    readonly searchService: SearchService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly transactionService: TransactionService,
    readonly lookUpService: LookupService,
    readonly idmService: IdentityManagementService
  ) {
    super(appToken, alertService, lookUpService, dashboardSearchService, language);
  }
  /*
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.isTransaction = true;
    this.resetTabs();
    this.alertService.clearAlerts();
    this.searchForm.addControl('searchKeyForm', this.searchKeyForm);
    if (this.dashboardSearchService.transactionSearchRequest === undefined) {
      this.initiateSearch();
    } else this.resumeSearch();
  }
  /**
   * Method to intiate search
   */
  initiateSearch() {
    this.isSearch = false;
    this.searchRequest.limit = new RequestLimit();
    this.searchRequest.sort = new RequestSort();
    this.searchRequest.filter = new RequestFilter();
    this.resetFilterAndSort();
    if (!this.isPrivate && this.searchService.getSearchKey()) {
      this.searchRequest.searchKey = this.searchService.getSearchKey();
    }
  }
  /**
   * Method to resume search
   */
  resumeSearch() {
    this.isSearch = true;
    this.searchRequest = this.dashboardSearchService.transactionSearchRequest;
    this.searchKey = this.dashboardSearchService?.transactionSearchRequest?.searchKey;
    this.getSearchResults();
  }
  /**
   * method to trigger the search transaction event
   * @param searchKey
   */
  onSearchTransaction() {
    if (this.searchForm.value?.searchKeyForm?.searchKey) {
      this.searchRequest.searchKey = this.searchForm.value?.searchKeyForm?.searchKey;
      this.searchRequest.searchParam.personIdentifier = this.searchForm?.value?.advancedSearchForm?.personIdentifier;
      this.searchRequest.searchParam.registrationNo = this.searchForm?.value?.advancedSearchForm?.registrationNo;
      this.resetFilterAndSort();
      this.getSearchResults();
    }
  }
  /**
   * Method to get search results
   */
  getSearchResults() {
    this.clearErrorAlerts();
    this.noResults = false;
    this.isSearched = false;
    if (
      this.searchRequest?.searchKey ||
      this.searchRequest?.searchParam.personIdentifier ||
      this.searchRequest?.searchParam?.registrationNo
    ) {
      if (this.searchRequest?.searchKey){
        this.searchRequest.searchKey = this.searchRequest?.searchKey.includes(' ') ? this.searchRequest?.searchKey.split(' ').join('') : this.searchRequest?.searchKey;
      }
      this.dashboardSearchService
        .searchTransaction(this.searchRequest)
        .pipe(
          takeUntil(this.destroy$),
          tap((res: TransactionSearchResponse) => {
            if (res && res.listOfTransactionDetails && res.listOfTransactionDetails.length === 0) {
              this.isShow = false;
              this.noResults = true;
              this.isSearched = true;
            }
          })
        )
        .subscribe(
          (transactionSearchResponse: TransactionSearchResponse) => {
            if (transactionSearchResponse) {
              this.transactionEntry = transactionSearchResponse.listOfTransactionDetails;
              if (this.transactionEntry) {
                this.transactionEntry.forEach(values => {
                  values.channel = getChannel(values.channel.english);
                  values.pendingWith = new BilingualText();
                  if (
                    values.assignedTo === BPMTaskConstants.BPM_SYSTEM ||
                    values.assignedTo === BPMTaskConstants.ITSM_GROUP
                  ) {
                    values.pendingWith.english = values.assignedTo;
                  } else if (values.assigneeName) {
                    values.pendingWith.english = values.pendingWith.arabic = values.assigneeName;
                  } else if (values.assignedTo) {
                    this.idmService.getProfile(values.assignedTo).subscribe(
                      profile => {
                        if (profile && profile.longNameArabic)
                          values.pendingWith.english = values.pendingWith.arabic = profile.longNameArabic;
                        else values.pendingWith.english = values.pendingWith.arabic = values.assignedTo;
                      },
                      () => {
                        values.pendingWith.english = values.pendingWith.arabic = values.assignedTo;
                      }
                    );
                  }
                  if (values?.pendingViolation?.length > 0) {
                    values.pendingWith.english = values.pendingWith.arabic = values?.pendingViolation.join(' & ');
                  }
                });
              }
              this.transactionSearchCount = transactionSearchResponse.totalRecords;
              this.isSearch = true;
              this.isShow = false;
              this.isSearchCount = true;
              if (this.transactionSearchCount === 0 && this.isFilter === false) {
                this.isSearch = false;
              } else if (this.transactionSearchCount === 0 && this.isFilter === true) {
                this.isSearch = true;
                this.isSearchCount = true;
              }
            }
          },
          error => {
            this.isSearch = false;
            this.transactionEntry = [];
            this.transactionSearchCount = 0;
            this.isSearchCount = false;
            if (error.status === 400) {
              this.noResults = true;
              this.isSearched = true;
            }
            if (error.status === 400 && this.isFilter === true) {
              this.isSearch = true;
              this.isSearchCount = true;
            }
          }
        );
    } else {
      this.isShow = false;
      this.isSearch = false;
      this.isSearched = false;
      this.transactionEntry = [];
      this.transactionSearchCount = 0;
      this.isSearchCount = false;
    }
  }
  /**
   * method to trigger the search enable event
   * @param event
   */
  onTransactionSearchEnable(event: boolean) {
    this.isSearch = event;
    this.clearSearchDetails();
  }
  /**
   * method to clear search results
   */
  public clearSearchDetails() {
    this.transactionEntry = [];
    this.transactionSearchCount = 0;
    this.isShow = true;
    this.dashboardSearchService.transactionSearchRequest = new SearchRequest();
    this.initiateSearch();
    this.alertService.clearAlerts();
  }
  /**
   * method to trigger the navigation of a corresponding transaction
   * @param item
   */
  transactionNavigation(item: Transaction) {
    this.transactionService.navigate(item);
  }
  /**
   * method to reset pagination
   */
  public resetPagination() {
    this.txnEntry.resetPagination();
    this.searchTxnEntry.resetPagination();
  }
  /**
   * Method to destroy component
   */
  ngOnDestroy() {
    this.clearAlerts();
  }
  /**
   * Method to handle advanced search operation
   */
  onAdvancedSearch() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.valid) {
      this.resetFilterAndSort();
      this.searchRequest.searchKey = this.searchForm?.value?.searchKeyForm?.searchKey;
      this.searchRequest.searchParam.personIdentifier = this.searchForm?.value?.advancedSearchForm?.personIdentifier;
      this.searchRequest.searchParam.registrationNo = this.searchForm?.value?.advancedSearchForm?.registrationNo;
      this.searchRequest.searchParam.startDate = this.searchForm?.value?.advancedSearchForm?.startDate;
      this.searchRequest.searchParam.endDate = this.searchForm?.value?.advancedSearchForm?.endDate;
      this.searchRequest.searchParam.status = this.searchForm?.value?.advancedSearchForm?.status.english;
      this.searchRequest.searchParam.channel = this.searchForm?.value?.advancedSearchForm?.channel.english;
      this.searchRequest.searchParam.transactionId = this.searchForm?.value?.advancedSearchForm?.transactionId.english;
      this.getSearchResults();
    }
  }
  /**
   * method to stop advanced search
   */
  onAdvancedSearchClose() {
    this.dashboardSearchService.enableTransactionAdvancedSearch = false;
    this.dashboardSearchService.enableTransactionAdvancedSearch = false;
    this.searchRequest.searchParam.personIdentifier = undefined;
    this.searchRequest.searchParam.registrationNo = undefined;
    this.searchRequest.searchParam.startDate = undefined;
    this.searchRequest.searchParam.endDate = undefined;
    this.searchRequest.searchParam.status = undefined;
    this.searchRequest.searchParam.channel = undefined;
    this.searchRequest.searchParam.transactionId = undefined;
    this.refreshFilter();
    this.getSearchResults();
  }
  /**
   * method to refresh filter and sort
   */
  resetFilterAndSort() {
    this.searchRequest.filter.channel = [];
    this.searchRequest.filter.status = [];
    this.searchRequest.sort.column = TransactionsSortConstants.SORT_FOR_TRANSACTIONS[0].column;
    this.searchRequest.sort.direction = SortDirectionEnum.DESCENDING;
  }
  /**
   * method to perform advanced search
   */
  onAdvancedSearchShow() {
    this.dashboardSearchService.enableTransactionAdvancedSearch = true;
    this.refreshFilter();
  }
  /**
   * method to reset transaction search
   */
  onReset() {
    this.onTransactionSearchEnable(false);
  }

  // nagivate(){
  //   this.router.navigate(['/home/contributor/reActivate']);
  // }

}
