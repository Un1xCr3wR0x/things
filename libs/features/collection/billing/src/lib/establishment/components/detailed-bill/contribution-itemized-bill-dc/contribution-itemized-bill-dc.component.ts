/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, SimpleChanges, OnChanges, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ItemizedBillDetailsWrapper,
  ItemizedBill,
  ContributionDetailedBill,
  ItemizedContributionDetails,
  RequestList
} from '../../../../shared/models';
import { LanguageToken, BilingualText, LovList } from '@gosi-ui/core';
import { DueDateWidgetLabels } from '../../../../shared/enums';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'blg-contribution-itemized-bill-dc',
  templateUrl: './contribution-itemized-bill-dc.component.html',
  styleUrls: ['./contribution-itemized-bill-dc.component.scss']
})
export class ContributionItemizedBillDcComponent implements OnInit, OnChanges {
  /***
   * Local Variable
   */
  itemizedBills: ItemizedBill[] = [];
  itemizedList: ItemizedBillDetailsWrapper;
  itemList: ItemizedContributionDetails[] = [];
  calculationValue = 20;
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;
  lang = 'en';
  paginationId = 'itemizedContributionMonth';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  requestParams = new RequestList();
  currentSortColumn = 'CONTRIBUTOR_NAME';
  currentSortDirection = 'ASC';
  queryParams = new RequestList();
  isSearch = false;
  isFilter = false;
  searchValues: number;
  filterValues = new RequestList();

  /**
   * Input variable
   */
  @Input() contributionDetails: ContributionDetailedBill;
  @Input() isMofFlag: boolean;
  @Input() noOfDays: number;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() creditRequired: boolean;
  @Input() nationality: Observable<LovList>;
  @Input() contributionSort: Observable<LovList>;
  @Input() pageNo: number;
  @Input() isPPA : boolean;

  /**
   * Output variable
   */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() requestQuery: EventEmitter<RequestList> = new EventEmitter();
  @Output() searchValue: EventEmitter<RequestList> = new EventEmitter();

  /**
   * This method is used to handle the changes in the input variables.
   * @param changes
   */

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.contributionDetails &&
      changes.contributionDetails.currentValue &&
      !changes.contributionDetails.isFirstChange()
    ) {
      const data = changes.contributionDetails.currentValue;
      this.getItemizedValues(data);
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.getItemizedValues(this.contributionDetails);
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }
  getItemizedValues(contributionDetails: ContributionDetailedBill) {
    this.itemList = contributionDetails.itemizedContribution;
    this.setLabelsForDay();
  }

  /** Method to set day label. */
  setLabelsForDay() {
    if (this.noOfDays === 0) {
      this.dayLabel = DueDateWidgetLabels.ZERO_DAYS;
    } else if (this.noOfDays === 1) {
      this.dayLabel = DueDateWidgetLabels.ONE_DAY;
    } else if (this.noOfDays === 2) {
      this.dayLabel = DueDateWidgetLabels.TWO_DAYS;
    } else if (this.noOfDays > 2 && this.noOfDays < 11) {
      this.dayLabel = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (this.noOfDays > 10) {
      this.dayLabel = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
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
  sortList(columnName) {
    this.currentSortColumn = columnName.value.english;
    if (columnName.value.english === 'Contributor Name') {
      if (this.lang === 'en') this.requestParams.sort.column = 'CONTRIBUTOR_NAME_ENG';
      else this.requestParams.sort.column = 'CONTRIBUTOR_NAME_ARB';
    } else if (columnName.value.english === 'Contributory Wage') this.requestParams.sort.column = 'CONTRIBUTORY_WAGE';
    else if (columnName.value.english === 'Total Amount') this.requestParams.sort.column = 'TOTAL_AMOUNT';

    this.requestParams.page.pageNo = this.currentPage;
    this.requestParams.page.size = this.itemsPerPage;
    this.getRequestParams();
    this.getSortParams(this.requestParams);
  }

  sortOrder(order) {
    this.currentSortDirection = order;
    this.requestParams.sort.direction = order;
    if (this.currentSortColumn === 'Contributor Name') {
      if (this.lang === 'en') this.requestParams.sort.column = 'CONTRIBUTOR_NAME_ENG';
      else this.requestParams.sort.column = 'CONTRIBUTOR_NAME_ARB';
    }
    this.getSortParams(this.requestParams);
  }
  getSortParams(requestParam: RequestList) {
    this.requestQuery.emit(requestParam);
  }
  getRequestParams() {
    this.requestParams.sort.direction = this.currentSortDirection;
  }

  /**
   *
   * @param serach method to trigger the name or nin iqama select event
   */
  onSearchcontributor(searchParam: number) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    this.isSearch = true;
    if (this.isFilter) {
      this.queryParams = this.filterValues;
    }
    this.queryParams.search = searchParam;
    this.searchValues = searchParam;
    this.searchValue.emit(this.queryParams);
  }
  onFilterContributor(filterParam: RequestList) {
    this.isFilter = true;
    this.filterValues = filterParam;
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    this.queryParams = filterParam;
    if (this.isSearch) {
      this.queryParams.search = this.searchValues;
    }
    this.searchValue.emit(this.queryParams);
  }
}
