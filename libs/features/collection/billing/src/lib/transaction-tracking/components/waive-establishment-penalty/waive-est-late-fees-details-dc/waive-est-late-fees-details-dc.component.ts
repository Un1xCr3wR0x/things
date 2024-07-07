import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-waive-est-late-fees-details-dc',
  templateUrl: './waive-est-late-fees-details-dc.component.html',
  styleUrls: ['./waive-est-late-fees-details-dc.component.scss']
})
export class WaiveEstLateFeesDetailsDcComponent implements OnChanges {
  @Input() waiverDetails: PenalityWavier;
  @Input() waiverType: string;
  waivedPenaltyPercentage: string;
  totalGracePeriod = 0;
  waivedViolationPercentage: string;
  constructor() { }


  /**
    * This method is to detect changes in input property.
    * @param changes
    */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      this.waivedPenaltyPercentage = this.waiverDetails.waivedPenaltyPercentage + '%';
      this.waivedPenaltyPercentage = this.waiverDetails.waivedPenaltyPercentage + '%';
      this.waivedViolationPercentage = this.waiverDetails?.waiverViolationsPercentage + '%';
      this.totalGracePeriod = this.waiverDetails.terms.gracePeriod + this.waiverDetails.terms.extendedGracePeriod;
    }
  }
}

