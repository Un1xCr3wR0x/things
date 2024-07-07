/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, Inject } from '@angular/core';
import { ItemizedAdjustment, RequestList } from '../../../../shared/models';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DueDateWidgetLabels } from '../../../../shared/enums';
import { ViolationAdjustmentDetails } from '../../../../shared/models/violation-adjustment-details';

@Component({
  selector: 'blg-itemized-violation-adjustment-details-dc',
  templateUrl: './itemized-violation-adjustment-details-dc.component.html',
  styleUrls: ['./itemized-violation-adjustment-details-dc.component.scss']
})
export class ItemizedViolationAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  /* input values  */

  @Input() exchangeRate = 1;
  @Input() violationCurrencyType: BilingualText;
  @Input() violationAdjustment: ViolationAdjustmentDetails = new ViolationAdjustmentDetails();

  /**
   * Output variable
   */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  /* local variables  */
  // itemList: ItemizedAdjustment[] = [];
  itemList = [];
  periodList: ItemizedAdjustment[] = [];
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;
  requestParams = new RequestList();
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 0;
  itemsPerPage = 10;
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /* Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /* Method to detect changes on input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.violationCurrencyType?.currentValue) {
      this.violationCurrencyType = changes.violationCurrencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (
      changes &&
      changes.violationAdjustment &&
      changes.violationAdjustment.currentValue &&
      !changes.violationAdjustment.isFirstChange()
    ) {
      this.itemList = changes.violationAdjustment.currentValue;
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
}
