import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent implements OnChanges {
  @Input() waiverDetails: PenalityWavier;
  totalGracePeriod = 0;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      if (this.waiverDetails.terms !== null) {
        this.totalGracePeriod = this.waiverDetails.terms.gracePeriod + this.waiverDetails.terms.extendedGracePeriod;
      }
    }
  }
}
