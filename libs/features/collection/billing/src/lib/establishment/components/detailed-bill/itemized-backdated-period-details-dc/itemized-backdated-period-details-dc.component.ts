/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, CalendarTypeEnum, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DueDateWidgetLabels } from '../../../../shared/enums';
import {
  ItemizedAdjustment,
  ItemizedAdjustmentDetails,
  ItemizedAdjustmentWrapper,
  RequestList
} from '../../../../shared/models';

@Component({
  selector: 'blg-itemized-backdated-period-details-dc',
  templateUrl: './itemized-backdated-period-details-dc.component.html',
  styleUrls: ['./itemized-backdated-period-details-dc.component.scss']
})
export class ItemizedBackdatedPeriodDetailsDcComponent implements OnInit, OnChanges {
  /* input values  */

  @Input() HeadingName: string;
  @Input() isPPA: boolean;
  @Input() adjustmentBreakupDetails: ItemizedAdjustmentWrapper;
  @Input() lateFeeFlag: boolean;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() isMofFlag: boolean;
  @Input() creditRequired: boolean;
  @Input() residentType: Observable<LovList>;
  @Input() adjustmentSort: Observable<LovList>;
  @Input() pageNo: number;
  @Input() isCoverageRemoval: boolean;

  /**
   * Output variable
   */
  @Output() adjustmentFilterDetails: EventEmitter<RequestList> = new EventEmitter();
  @Output() searchValues: EventEmitter<number> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() sortListValues = new EventEmitter<{ sortBy: string; sortOrder: string }>();

  /* local variables  */
  dateFormat = CalendarTypeEnum;
  itemList: ItemizedAdjustment[] = [];
  sortOrder = 'ASC';
  currentSortColumn = 'CONTRIBUTOR_NAME_ENG';
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 0;
  noOfRecords = 0;
  itemsPerPage = 10;
  totalAmount = 0;
  lang = 'en';
  periodList: ItemizedAdjustment[] = [];
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;
  requestParams = new RequestList();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /* Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /* Method to detect changes on input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (
      changes &&
      changes.adjustmentBreakupDetails &&
      changes.adjustmentBreakupDetails.currentValue &&
      !changes.adjustmentBreakupDetails.isFirstChange()
    ) {
      const data = changes.adjustmentBreakupDetails.currentValue;
      this.getItemizedValues(data);
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.getItemizedValues(this.adjustmentBreakupDetails);
  }
  getItemizedValues(adjustmentDetails: ItemizedAdjustmentWrapper) {
    this.periodList = adjustmentDetails.itemizedAdjustment;
    this.totalAmount = adjustmentDetails.total;
    this.setLabelsForDay();
  }
  /** Method to set day label. */
  setLabelsForDay() {
    this.adjustmentBreakupDetails.itemizedAdjustment.forEach(key => {
      if (key.contributionUnit === 0) {
        this.dayLabel = DueDateWidgetLabels.ZERO_DAYS;
      } else if (key.contributionUnit === 1) {
        this.dayLabel = DueDateWidgetLabels.ONE_DAY;
      } else if (key.contributionUnit === 2) {
        this.dayLabel = DueDateWidgetLabels.TWO_DAYS;
      } else if (key.contributionUnit > 2 && key.contributionUnit < 11) {
        this.dayLabel = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
      } else if (key.contributionUnit > 10) {
        this.dayLabel = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
      }
    });
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
  /**
   *
   * @param page method to get sorting parameter
   */
  sortListDetails(sortBy: string) {
    this.currentSortColumn = sortBy;

    this.sortListValues.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }
  sortOrderList(order) {
    this.sortOrder = order;
    this.sortListValues.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }

  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchValue(searchParam: number) {
    this.searchValues.emit(searchParam);
    if (searchParam === null) {
      this.searchValues.emit(undefined);
    }
  }
  // This method is used to get filter values applied
  applyFilterValues(filterParams: RequestList) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
    this.adjustmentFilterDetails.emit(filterParams);
  }
}
