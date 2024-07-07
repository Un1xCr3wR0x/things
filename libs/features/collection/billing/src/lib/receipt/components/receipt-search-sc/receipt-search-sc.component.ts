import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  LanguageToken,
  LookupService,
  LovList,
  SearchService,
  SortDirectionEnum
} from '@gosi-ui/core';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchBaseScComponent } from '@gosi-ui/foundation-dashboard/lib/search/components/base/search-base-sc.component';
import { FilterParams, ReceiptWrapper } from '../../../shared/models';
import { BillingConstants } from '../../../shared/constants';
import { DetailedBillService } from '../../../shared/services';

@Component({
  selector: 'blg-receipt-search-sc',
  templateUrl: './receipt-search-sc.component.html',
  styleUrls: ['./receipt-search-sc.component.scss']
})
export class ReceiptSearchScComponent extends SearchBaseScComponent implements OnInit, AfterViewInit {
  // Local Variables
  receiptSearchForm: FormGroup = new FormGroup({});
  width = 1680;
  isAdvancedSearch = false;
  maxLength: number;
  filterValues = new FilterParams();
  idNumber: number;
  isSearch = false;
  serachCount = 5;
  receiptModeList$: Observable<LovList>;
  receiptStatus$: Observable<LovList>;
  receiptSortFields$: Observable<LovList>;
  pageNo = 0;
  pageSize = 10;
  currentCurrency = 'SAR';
  exchangeRateValue = 1;
  receiptList: ReceiptWrapper;
  isReceiptSearch = true;
  allowAdvancedSearch: boolean;
  digitsOnly = true;

  /**
   *
   * @param appToken
   * @param dashboardSearchService
   * @param searchService
   * @param alertService
   * @param language
   * @param router
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly dashboardSearchService: DashboardSearchService,
    readonly detailedBillService: DetailedBillService,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly lookUpService: LookupService,
    readonly route: ActivatedRoute
  ) {
    super(appToken, alertService, lookUpService, dashboardSearchService, language);
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.searchForm.addControl('searchKeyForm', this.searchKeyForm);
    this.receiptModeList$ = this.lookUpService.getReceiptMode();
    this.receiptStatus$ = this.lookUpService.getReceiptStatus();
    this.receiptSortFields$ = this.lookUpService.getReceiptSortFields();
    this.maxLength = 15;
    this.route.queryParams.subscribe(params => {
      this.isSearch = params.isSearch;
      if (params.pageNo) {
        this.pageNo = params.pageNo;
        this.idNumber = params.idNo;
      }
    });
    if (history.state.searchDetails) {
      this.isAdvancedSearch = history.state.searchDetails.isAdvancedSearch;
    }
    this.alertService.setInfoByKey('BILLING.FIELD-MUST-CONTAIN-ATLEAST');
  }

  ngAfterViewInit() {
    const searchDetails = history.state.searchDetails;
    if (searchDetails) {
      if (searchDetails.isAdvancedSearch) {
        this.setAdvancedSearch(searchDetails);
        this.onAdvancedSearch();
      } else {
        this.setNormalSearch(searchDetails);
        this.onSearchReceipt();
      }
    }
    this.searchForm
      .get('searchKeyForm')
      .get('searchKey')
      .valueChanges.subscribe(() => {
        this.onReset();
      });
  }

  // setting Advanced search when navigating back from receipt details view
  setAdvancedSearch(searchDetails) {
    this.pageNo = searchDetails.pageNo;
    this.pageSize = searchDetails.pageSize;
    this.filterValues = searchDetails.filterValues;
    const advancedSearchForm = this.searchForm.get('searchKeyForm').get('advancedSearchForm');
    if (this.filterValues.parentReceiptNo) {
      advancedSearchForm.get('receiptNo').setValue(this.filterValues.parentReceiptNo);
    }
    if (this.filterValues.receiptFilter.chequeNumber) {
      advancedSearchForm.get('chequeNo').setValue(this.filterValues.receiptFilter.chequeNumber);
    }
    if (this.filterValues.receiptFilter.referenceNumber) {
      advancedSearchForm.get('referenceNo').setValue(this.filterValues.receiptFilter.referenceNumber);
    }
    if (this.filterValues.receiptFilter.registrationNo) {
      advancedSearchForm.get('registrationNo').setValue(this.filterValues.receiptFilter.registrationNo);
    }
    if (this.filterValues.receiptFilter.receiptMode) {
      advancedSearchForm.get('receiptMode').get('english').setValue(this.filterValues.receiptFilter.receiptMode);
    }
    if (this.filterValues.receiptFilter.maxAmount) {
      advancedSearchForm.get('maxAmount').setValue(this.filterValues.receiptFilter.maxAmount);
    }
    if (this.filterValues.receiptFilter.minAmount) {
      advancedSearchForm.get('minAmount').setValue(this.filterValues.receiptFilter.minAmount);
    }
    if (this.filterValues.receiptFilter.startDate.gregorian) {
      advancedSearchForm
        .get('ReceiptDateFrom')
        .get('gregorian')
        .setValue(this.filterValues.receiptFilter.startDate.gregorian);
    }
    if (this.filterValues.receiptFilter.endDate.gregorian) {
      advancedSearchForm
        .get('ReceiptDateTo')
        .get('gregorian')
        .setValue(this.filterValues.receiptFilter.endDate.gregorian);
    }
  }

  // setting Normal search when navigating back from receipt details view
  setNormalSearch(searchDetails) {
    this.pageNo = searchDetails.pageNo;
    this.pageSize = searchDetails.pageSize;
    this.searchForm.get('searchKeyForm').get('searchKey').setValue(searchDetails.searchKey);
  }

  resumeSearch() {}
  resetFilterAndSort() {}

  onReset() {
    this.receiptList = null;
    this.pageNo = 0;
    // this.searchForm.get('searchKeyForm').reset;
  }

  getSearchResults() {}

  resetPagination() {}

  setFilterValues() {
    const advancedSearchForm = this.searchForm.get('searchKeyForm').get('advancedSearchForm');
    if (
      advancedSearchForm.get('registrationNo').value !== '' &&
      advancedSearchForm.get('registrationNo').value !== null
    ) {
      this.filterValues.receiptFilter.registrationNo = advancedSearchForm.get('registrationNo').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.registrationNo = undefined;
    }
    if (advancedSearchForm.get('referenceNo').value !== '' && advancedSearchForm.get('referenceNo').value !== null) {
      this.filterValues.receiptFilter.referenceNumber = advancedSearchForm.get('referenceNo').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.referenceNumber = undefined;
    }
    if (
      advancedSearchForm.get('ReceiptDateFrom').get('gregorian').value !== '' &&
      advancedSearchForm.get('ReceiptDateFrom').get('gregorian').value !== null
    ) {
      this.filterValues.receiptFilter.startDate.gregorian = advancedSearchForm
        .get('ReceiptDateFrom')
        .get('gregorian').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.startDate.gregorian = undefined;
    }
    if (
      advancedSearchForm.get('ReceiptDateTo').get('gregorian').value !== '' &&
      advancedSearchForm.get('ReceiptDateTo').get('gregorian').value !== null
    ) {
      this.filterValues.receiptFilter.endDate.gregorian = advancedSearchForm
        .get('ReceiptDateTo')
        .get('gregorian').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.endDate.gregorian = undefined;
    }
    if (advancedSearchForm.get('minAmount').value !== '' && advancedSearchForm.get('minAmount').value !== null) {
      this.filterValues.receiptFilter.minAmount = advancedSearchForm.get('minAmount').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.minAmount = undefined;
    }
    if (advancedSearchForm.get('maxAmount').value !== '' && advancedSearchForm.get('maxAmount').value !== null) {
      this.filterValues.receiptFilter.maxAmount = advancedSearchForm.get('maxAmount').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.maxAmount = undefined;
    }
    if (
      advancedSearchForm.get('receiptMode').get('english').value !== '' &&
      advancedSearchForm.get('receiptMode').get('english').value !== null
    ) {
      this.filterValues.receiptFilter.receiptMode = advancedSearchForm.get('receiptMode').get('english').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.receiptMode = undefined;
    }
    if (advancedSearchForm.get('chequeNo').value !== '' && advancedSearchForm.get('chequeNo').value !== null) {
      this.filterValues.receiptFilter.chequeNumber = advancedSearchForm.get('chequeNo').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.receiptFilter.chequeNumber = undefined;
    }
    if (advancedSearchForm.get('receiptNo').value !== '' && advancedSearchForm.get('receiptNo').value !== null) {
      this.filterValues.parentReceiptNo = advancedSearchForm.get('receiptNo').value;
      this.allowAdvancedSearch = true;
    } else {
      this.filterValues.parentReceiptNo = undefined;
    }
  }

  // Method to get receipts on advanced search
  onAdvancedSearch() {
    this.pageNo = history.state.searchDetails ? this.pageNo : 0;
    this.allowAdvancedSearch = false;
    this.setFilterValues();
    this.isSearch = true;
    const search = this.searchForm.get('searchKeyForm').get('searchKey').value;
    if (this.allowAdvancedSearch) {
      this.alertService.clearAlerts();
      this.detailedBillService
        .getReceiptsBySearchCriteria(search, this.pageNo, this.pageSize, this.isAdvancedSearch, this.filterValues)
        .subscribe(
          res => {
            this.receiptList = res;
            if (history.state.searchDetails) {
              history.state.searchDetails = undefined;
            }
          },
          err => {
            this.alertService.showError(err?.error?.message);
            this.receiptList.receiptDetailDto = [];
          }
        );
    }
  }

  // Method to get close advance search details
  onAdvancedSearchClose() {
    this.isAdvancedSearch = false;
    this.onReset();
  }

  // Method to get show advance search details
  onAdvancedSearchShow() {
    this.isAdvancedSearch = true;
    this.searchForm.get('searchKeyForm').get('searchKey').setValue('');
    this.refreshFilter();
  }

  getSelectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.detailedBillService
      .getReceiptsBySearchCriteria(
        this.searchForm.get('searchKeyForm').get('searchKey').value,
        selectedpageNo,
        this.pageSize,
        this.isAdvancedSearch,
        this.filterValues
      )
      .subscribe(
        res => {
          this.receiptList = res;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  // Method to search for receipt in free search using search key
  onSearchReceipt() {
    this.pageNo = history.state.searchDetails ? this.pageNo : 0;
    this.alertService.clearAlerts();
    this.detailedBillService
      .getReceiptsBySearchCriteria(
        this.searchForm.get('searchKeyForm').get('searchKey').value,
        this.pageNo,
        this.pageSize,
        this.isAdvancedSearch,
        this.filterValues
      )
      .subscribe(
        res => {
          this.receiptList = res;
          if (history.state.searchDetails) {
            history.state.searchDetails = undefined;
          }
        },
        err => {
          this.alertService.showError(err?.error?.message);
          this.receiptList.receiptDetailDto = [];
        }
      );
  }

  /**
   * Method to get receipt details.
   * @param details receipt details
   */
  getReceiptDetails(details) {
    this.router.navigate([BillingConstants.RECEIPT_DETAILS_ROUTE], {
      queryParams: {
        receiptNo: details.receiptNo,
        pageNo: this.pageNo,
        idNo: details.registrationNo
      },
      state: {
        searchDetails: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchKey: this.searchForm.get('searchKeyForm').get('searchKey').value,
          filterValues: this.filterValues,
          isAdvancedSearch: this.isAdvancedSearch
        }
      }
    });
  }

  onSearchDetailsChange() {
    this.onReset();
  }
}
