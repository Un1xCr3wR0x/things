import { Component, OnInit, Output, EventEmitter, Input, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { ThirdPartyBillAllocations } from '../../../../shared/models/third-party-bill-allocations';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AllocationFilterSearch } from '../../../../shared/models/allocation-filter-search';

@Component({
  selector: 'blg-mof-allocation-of-credit-table-dc',
  templateUrl: './mof-allocation-of-credit-table-dc.component.html',
  styleUrls: ['./mof-allocation-of-credit-table-dc.component.scss']
})
export class MofAllocationOfCreditTableDcComponent implements OnInit, OnChanges {
  lang = 'en';
  paginationId = 'MofAllocation';
  itemsPerPage = 10;

  currentCurrencyLable = 'BILLING.SAR';
  manualClear = false;
  isDebitFirstChange = false;
  isAllocationFirstChange = false;
  isBalanceFirstChange = false;
  defaultMaxValue = 100000;
  defaultMinValue = 0;
  debitAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  allocationAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  balanceAfterAllocation = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  filterParams: AllocationFilterSearch = new AllocationFilterSearch();
  /************************Input**************************************** */
  @Input() itemlist: ThirdPartyBillAllocations[] = [];
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  @Input() noOfRecords = 0;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  /************************Output**************************************** */
  @Output() navigateToEstAllocation: EventEmitter<number> = new EventEmitter();
  @Output() filterDetails: EventEmitter<AllocationFilterSearch> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() onSearch: EventEmitter<string> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.itemlist?.currentValue) {
      this.itemlist = changes.itemlist.currentValue;
    }
    if (changes?.pageDetails?.currentValue) {
      this.pageDetails = changes?.pageDetails?.currentValue;
    }
    if (changes?.noOfRecords?.currentValue) {
      this.noOfRecords = changes.noOfRecords.currentValue;
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
  }
  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchAmount(searchKey: string) {
    this.onSearch.emit(searchKey);
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = page;
      this.selectPageNo.emit(this.pageDetails.currentPage - 1);
    }
  }

  routeToEstAllocation(registrationNo: number) {
    this.navigateToEstAllocation.emit(registrationNo);
  }
  /********************************Filter Functions******************************* */
  clearAllFiters() {
    this.debitAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.allocationAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.balanceAfterAllocation = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.filterParams = new AllocationFilterSearch();
    this.isDebitFirstChange = false;
    this.isAllocationFirstChange = false;
    this.isBalanceFirstChange = false;
    if (!this.manualClear) {
      this.filterDetails.emit(this.filterParams);
    }
    this.manualClear = false;
  }
  manualFitersReset() {
    this.manualClear = true;
    this.clearAllFiters();
  }
  applyFilter() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    this.fetchDebitAmount();
    this.fetchAllocationiAmount();
    this.fetchBalanceAmount();
    this.filterDetails.emit(this.filterParams);
  }
  fetchDebitAmount() {
    if (!this.isDebitFirstChange) {
      if (this.debitAmount.value[0] !== this.defaultMinValue || this.debitAmount.value[1] !== this.defaultMaxValue) {
        this.filterParams.minDebitAmount = this.debitAmount.value[0];
        this.filterParams.maxDebitAmount = this.debitAmount.value[1];
        this.isDebitFirstChange = true;
        this.filterParams.isFilter = true;
      }
    } else {
      this.filterParams.minDebitAmount = this.debitAmount.value[0];
      this.filterParams.maxDebitAmount = this.debitAmount.value[1];
    }
  }

  fetchAllocationiAmount() {
    if (!this.isAllocationFirstChange) {
      if (
        this.allocationAmount.value[0] !== this.defaultMinValue ||
        this.allocationAmount.value[1] !== this.defaultMaxValue
      ) {
        this.filterParams.minAllocatedAmount = this.allocationAmount.value[0];
        this.filterParams.maxAllocatedAmount = this.allocationAmount.value[1];
        this.isAllocationFirstChange = true;
        this.filterParams.isFilter = true;
      }
    } else {
      this.filterParams.minAllocatedAmount = this.allocationAmount.value[0];
      this.filterParams.maxAllocatedAmount = this.allocationAmount.value[1];
    }
  }

  fetchBalanceAmount() {
    if (!this.isBalanceFirstChange) {
      if (
        this.balanceAfterAllocation.value[0] !== this.defaultMinValue ||
        this.balanceAfterAllocation.value[1] !== this.defaultMaxValue
      ) {
        this.filterParams.minBalanceAmount = this.balanceAfterAllocation.value[0];
        this.filterParams.maxBalanceAmount = this.balanceAfterAllocation.value[1];
        this.isBalanceFirstChange = true;
        this.filterParams.isFilter = true;
      }
    } else {
      this.filterParams.minBalanceAmount = this.balanceAfterAllocation.value[0];
      this.filterParams.maxBalanceAmount = this.balanceAfterAllocation.value[1];
    }
  }
  /********************************Filter Functions Ends******************************* */
}
