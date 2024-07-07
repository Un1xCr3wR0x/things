/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-waive-est-penalty-account-details-dc',
  templateUrl: './waive-est-penalty-account-details-dc.component.html',
  styleUrls: ['./waive-est-penalty-account-details-dc.component.scss']
})
export class WaiveEstPenaltyAccountDetails implements OnChanges {
  // Input Variables
  @Input() canReturn: boolean;
  @Input() isPPA: boolean;
  @Input() isReopenClosingInProgress: boolean;
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() waiverDetails: PenalityWavier;
  @Input() editFlag: boolean;
  @Input() isLateFeeViolation: boolean;

  // Output Variables
  @Output() navigateToEditDetails: EventEmitter<null> = new EventEmitter();
  // Local Variables
  waivedPenaltyPercentage: string;
  totalGracePeriod = 0;
  waivedViolationPercentage: string;
  hideGracePeriod: boolean;
  constructor() {}

  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      this.waivedPenaltyPercentage = this.waiverDetails.waivedPenaltyPercentage + '%';
      this.waivedViolationPercentage = this.waiverDetails?.waiverViolationsPercentage + '%';
      this.totalGracePeriod = this.waiverDetails.terms.gracePeriod + this.waiverDetails.terms.extendedGracePeriod;
      if(this.totalGracePeriod === 0) this.hideGracePeriod = true;
    }  
  }
  navigateToEdit() {
    this.navigateToEditDetails.emit();
  }
}
