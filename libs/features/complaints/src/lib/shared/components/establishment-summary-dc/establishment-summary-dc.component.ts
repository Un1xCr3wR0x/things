/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComplaintConstants } from '../../constants';
import { EstablishmentSummary } from '../../models';

@Component({
  selector: 'ces-establishment-summary-dc',
  templateUrl: './establishment-summary-dc.component.html',
  styleUrls: ['./establishment-summary-dc.component.scss']
})
export class EstablishmentSummaryDcComponent implements OnInit, OnChanges {
  //Local Variables
  heading = ComplaintConstants.ESTABLISHMENT_SUMMARY;

  //Input variables
  @Input() establishmentSummary: EstablishmentSummary;
  establishmentSummaryArray: EstablishmentSummary[] = [];
  constructor() {}

  ngOnInit(): void {}

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentSummary && changes.establishmentSummary.currentValue)
      this.establishmentSummary = changes.establishmentSummary.currentValue;
    this.establishmentSummaryArray.push(this.establishmentSummary);
  }
}
