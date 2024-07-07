/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnChanges, Inject } from '@angular/core';
import { ItemizedAdjustmentWrapper, ItemizedAdjustment, RequestList } from '../../../../shared/models';
import { BilingualText, CalendarTypeEnum, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DueDateWidgetLabels } from '../../../../shared/enums';

@Component({
  selector: 'blg-itemized-backdated-wage-details-dc',
  templateUrl: './itemized-backdated-wage-details-dc.component.html',
  styleUrls: ['./itemized-backdated-wage-details-dc.component.scss']
})
export class ItemizedBackdatedWageDetailsDcComponent implements OnInit, OnChanges {
  /* local variables */
  backDatedWageList: ItemizedAdjustment[] = [];
  dateFormat = CalendarTypeEnum;
  totalAmount = 0;
  paginationId = 'itemizedwagedetails';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  sortOrder = 'ASC';
  lang = 'en';
  currentSortColumn = 'CONTRIBUTOR_NAME_ENG';
  arabicDayLabel: string = DueDateWidgetLabels.ZERO_DAYS;
  /* input values */
  @Input() lateFeeFlag: boolean;
  @Input() isPPA: boolean;
  @Input() HeadingName: string;
  @Input() backDatedWageDetails: ItemizedAdjustmentWrapper;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() isMofFlag: boolean;
  @Input() creditRequired: boolean;
  @Input() residentType: Observable<LovList>;
  @Input() pageNo: number;
  @Input() adjustmentSort: Observable<LovList>;

  /* output values */
  @Output() searchValues: EventEmitter<number> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() adjustmentFilterDetails: EventEmitter<RequestList> = new EventEmitter();
  @Output() sortListValues = new EventEmitter<{ sortBy: string; sortOrder: string }>();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /* Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.pageDetail?.currentValue) {
      this.pageDetails = changes.pageDetail.currentValue;
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (
      changes &&
      changes.backDatedWageDetails &&
      changes.backDatedWageDetails.currentValue &&
      !changes.backDatedWageDetails.isFirstChange()
    ) {
      const data = changes.backDatedWageDetails.currentValue;
      this.getItemizedValue(data);
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.getItemizedValue(this.backDatedWageDetails);
  }
  getItemizedValue(contributionDetails: ItemizedAdjustmentWrapper) {
    this.backDatedWageList = contributionDetails.itemizedAdjustment;
    this.totalAmount = contributionDetails.total;
  }
  setLabelsForArabicDay(contributionUnit: number) {
    if (contributionUnit === 0) {
      return DueDateWidgetLabels.ZERO_DAYS;
    } else if (contributionUnit === 1) {
      return DueDateWidgetLabels.ONE_DAY;
    } else if (contributionUnit === 2) {
      return DueDateWidgetLabels.TWO_DAYS;
    } else if (contributionUnit > 2 && contributionUnit < 11) {
      return DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (contributionUnit > 10) {
      return DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
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
  /**
   *
   * @param page method to get sorting parameter
   */
  sortListValue(sortBy: string) {
    this.currentSortColumn = sortBy;
    this.sortListValues.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }
  sortListOrder(order) {
    this.sortOrder = order;
    this.sortListValues.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }

  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchValue(searchParam: number) {
    this.pageDetails.currentPage = 1;
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
