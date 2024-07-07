/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { monthDiff, formatDate } from '@gosi-ui/core';
import { RecalculationConstants } from '../../constants';

@Component({
  selector: 'bnt-recalculation-wage-dc',
  templateUrl: './recalculation-wage-dc.component.html',
  styleUrls: ['./recalculation-wage-dc.component.scss']
})
export class RecalculationWageDcComponent implements OnInit {
  @Input() benefitRecalculationDetails;
  @Input() lang: string;

  @Output() onTransactionClicked = new EventEmitter();
  bgColor = 'danger';
  monthDifference = monthDiff;
  recalculationConstants = RecalculationConstants;

  constructor() {}

  ngOnInit(): void {}
  /* Method to get months */
  getMonths(startDate, endDate) {
    return Math.round(monthDiff(startDate, endDate));
  }
  /** Method  to  view  transaction */
  onTransactionView(traceId) {
    this.onTransactionClicked.emit(traceId);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
