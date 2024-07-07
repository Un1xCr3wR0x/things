/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { PenalityWavier } from '../../../shared/models';

//TODO: component is already there in shared, if not there move to shared.
@Component({
  selector: 'blg-penality-summary-dc',
  templateUrl: './penality-summary-dc.component.html',
  styleUrls: ['./penality-summary-dc.component.scss']
})
export class PenalitySummaryDcComponent implements OnChanges {
  waivedPenaltyPercentage: string;
  waiverDetails: PenalityWavier;
  // Input Variable
  @Input() wavierDetails: PenalityWavier;
  @Output() navigateBack: EventEmitter<null> = new EventEmitter();
  constructor() {}

  // // Method to get details on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.wavierDetails && changes.wavierDetails.currentValue) {
      this.waivedPenaltyPercentage = this.wavierDetails.waivedPenaltyPercentage + '%';
      this.waiverDetails = changes.wavierDetails.currentValue;
    }
  }
  //method to navigate back
  navigate() {
    this.navigateBack.emit();
  }
}
