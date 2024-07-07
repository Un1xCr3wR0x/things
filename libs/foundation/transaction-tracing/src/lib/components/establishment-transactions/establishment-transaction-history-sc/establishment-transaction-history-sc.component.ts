/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, AlertService, LovList, Lov, SortDirectionEnum, BilingualText } from '@gosi-ui/core';
import {
  TransactionHistoryRequest,
  TransactionLimit,
  TransactionSort,
  TransactionHistoryResponse,
  TransactionFilter,
  TransactionSearch
} from '../../../models';

import { TransactionService } from '../../../services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { EstablishmentSortConstants } from '../../../constants';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
@Component({
  selector: 'trn-establishment-transaction-history-sc',
  templateUrl: './establishment-transaction-history-sc.component.html',
  styleUrls: ['./establishment-transaction-history-sc.component.scss']
})
export class EstablishmentTransactionHistoryScComponent implements OnInit {
  transactions: Transaction[];
  request: TransactionHistoryRequest = <TransactionHistoryRequest>{};
  totalRecords: number;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn: string;
  sortMode: BilingualText = new BilingualText();
  isDescending = true;
  registrationNo: string;
  sortList: LovList;
  filterRequest: TransactionFilter = new TransactionFilter();
  searchRequest: TransactionSearch = new TransactionSearch();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  constructor(
    readonly router: Router,
    readonly alertService: AlertService,
    readonly transactionService: TransactionService,
    readonly changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route?.paramMap?.subscribe((params: ParamMap) => {
      this.registrationNo = params.get('registrationNo');
    });
    this.initiateSort();
    this.getEstablishmentTransactions();
    this.sortList = new LovList(EstablishmentSortConstants.SORT_FOR_TRANSACTIONS);
  }
  setTransactionRequest() {
    this.request.page = new TransactionLimit();
    this.request.page.pageNo = this.currentPage - 1;
    this.request.page.size = this.itemsPerPage;
    this.request.sort = new TransactionSort();
    this.request.sort.column = this.sortColumn;
    this.request.sort.direction = this.isDescending;
    this.request.filter = new TransactionFilter();
    this.request.filter = this.filterRequest;
    this.request.search = new TransactionSearch();
    this.request.search = this.searchRequest;
  }
  initiateSort(): void {
    this.sortMode = EstablishmentSortConstants.SORT_FOR_TRANSACTIONS[0].value;
    this.sortColumn = EstablishmentSortConstants.SORT_FOR_TRANSACTIONS[0].column;
    this.isDescending = true;
  }
  getEstablishmentTransactions() {
    this.alertService.clearAlerts();
    this.setTransactionRequest();
    this.transactionService.getTransactions(this.request, this.registrationNo).subscribe(
      (items: TransactionHistoryResponse) => {
        this.transactions = items?.listOfTransactionDetails;
        this.totalRecords = items?.totalRecords;
      },
      err => {
        this.alertService.showError(err.error.message);
        this.transactions = [];
        this.totalRecords = 0;
      }
    );
  }
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
    this.getEstablishmentTransactions();
  }
  resetPagination() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.pageDetails = {
      currentPage: this.currentPage,
      goToPage: 1
    };
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  /**
   * Method to toggle direction of sort
   * @param order
   */
  directionToggle(order: string) {
    if (order === SortDirectionEnum.ASCENDING) this.isDescending = false;
    else this.isDescending = true;
    this.onSort();
  }
  /**
   * Method to get results on selecting sort parameter
   * @param sortBy
   */
  onSortItemSelected(sortBy: Lov) {
    this.sortColumn = EstablishmentSortConstants?.SORT_FOR_TRANSACTIONS?.find(
      item => item.code === sortBy.code
    )?.column;
    this.onSort();
  }
  onSort() {
    this.resetPagination();
    this.getEstablishmentTransactions();
  }

  filterTransactionList(requestFilter?: TransactionFilter) {
    this.filterRequest = requestFilter;
    this.resetPagination();
    this.getEstablishmentTransactions();
  }
  onSearchEnable(searchKey: string) {
    if (!searchKey) {
      this.searchEstablishmentTransaction(searchKey);
    }
  }
  searchEstablishmentTransaction(value) {
    this.searchRequest.value = value;
    this.resetPagination();
    this.getEstablishmentTransactions();
  }
  onBack() {
    if (this.changePersonService.fromIndividualSearch) {
      this.dashboardSearchService.isSummaryPage = true;
      const personId = this.changePersonService.getPersonId();
      this.router.navigate([`home/profile/individual/internal/${personId}/establishments`]);
    }
  }
}
