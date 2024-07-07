/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditBalanceDetails } from '../../models';

@Component({
  selector: 'bnt-refund-voluntary-contributions-dc',
  templateUrl: './refund-voluntary-contributions-dc.component.html',
  styleUrls: ['./refund-voluntary-contributions-dc.component.scss']
})
export class RefundVoluntaryContributionsDcComponent implements OnInit, OnChanges {
  @Input() creditBalanceDetails: CreditBalanceDetails;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    // if (changes && changes.creditBalanceDetails.currentValue) {
    //   this.creditBalanceDetails = changes.creditBalanceDetails.currentValue;
    // }
  }
}
