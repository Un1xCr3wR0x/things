/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DebitCreditDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-wage-details-dc',
  templateUrl: './wage-details-dc.component.html',
  styleUrls: ['./wage-details-dc.component.scss']
})
export class WageDetailsDcComponent implements OnInit, OnChanges {
  //Input Variables
  @Input() wageDetails: DebitCreditDetails;

  constructor() {}

  ngOnInit(): void {}
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.wageDetails) this.wageDetails = changes.wageDetails.currentValue;
  }
}
