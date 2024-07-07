/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ItemizedContributionMonthWrapper, MofContributionRequestList } from '../../../../shared/models';
import { ItemizedContributionMonth } from '../../../../shared/models';
import { LovList } from '@gosi-ui/core';
import { MofItemizedContributionFilter } from '../../../../shared/models/mof-itemized-contribution-filter';
@Component({
  selector: 'blg-itemized-bill-contribution-month-dc',
  templateUrl: './itemized-bill-contribution-month-dc.component.html',
  styleUrls: ['./itemized-bill-contribution-month-dc.component.scss']
})
export class ItemizedBillContributionMonthDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() itemizedContributionMonth: ItemizedContributionMonthWrapper;
  @Input() mofContributionSortFields: LovList;
  @Input() yesOrNoList: LovList;
  @Input() pageNo: number;
  @Input() establishmentType: string;

  // Output Variables
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() registrationNo: EventEmitter<number> = new EventEmitter();
  @Output() searchValue: EventEmitter<MofContributionRequestList> = new EventEmitter();
  @Output() sortListValues = new EventEmitter<{ sortBy: string; sortOrder: string }>();
  @Output() mofContributionFilterValues: EventEmitter<MofItemizedContributionFilter> = new EventEmitter();

  // Local Variables
  paginationId = 'itemizedContributionMonth';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  isSearch = false;
  isFilter = false;
  searchValues: string;
  filterValues = new MofContributionRequestList();
  queryParams = new MofContributionRequestList();
  contributionMonthDetails: ItemizedContributionMonth[];
  currentSortColumnValue = 'EST_NAME_ENG';
  sortDirection = 'ASC';

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.itemizedContributionMonth &&
      changes.itemizedContributionMonth.currentValue &&
      !changes.itemizedContributionMonth.isFirstChange()
    ) {
      this.contributionMonthDetails = changes.itemizedContributionMonth.currentValue.thirdPartyItemizedBillBreakDown;
    } else if (this.itemizedContributionMonth?.thirdPartyItemizedBillBreakDown !== null) {
      this.contributionMonthDetails = this.itemizedContributionMonth?.thirdPartyItemizedBillBreakDown;
    }
    if (changes?.pageNo?.currentValue) {
      this.pageDetails.currentPage = changes.pageNo.currentValue;
    }
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
  getContributorDetails(registrationNumber: number) {
    this.registrationNo.emit(registrationNumber);
  }

  /**
   *
   * @param serach method to trigger the name or nin iqama select event
   */
  onSearchEstablishment(searchParam: string) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    this.isSearch = true;
    if (this.isFilter) {
      this.queryParams = this.filterValues;
    }
    if (searchParam === '') {
      this.queryParams.searchKey = undefined;
    } else {
      this.queryParams.searchKey = searchParam;
    }
    this.searchValues = searchParam;
    this.searchValue.emit(this.queryParams);
  }
  /**
   *
   * @param sortBy method to get sorting parameter
   */
  sortListValue(sortBy: string) {
    this.currentSortColumnValue = sortBy;
    this.sortListValues.emit({ sortBy: this.currentSortColumnValue, sortOrder: this.sortDirection });
  }
  /**
   *
   * @param order method to get sorting order
   */
  sortListOrder(order: string) {
    this.sortDirection = order;
    this.sortListValues.emit({ sortBy: this.currentSortColumnValue, sortOrder: this.sortDirection });
  }
  applyFilterValues(filterValues) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
    this.mofContributionFilterValues.emit(filterValues);
  }
}
