import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditManagmentRequest } from '../../../../shared/models';
@Component({
  selector: 'blg-credit-transfer-details-dc',
  templateUrl: './credit-transfer-details-dc.component.html',
  styleUrls: ['./credit-transfer-details-dc.component.scss']
})
export class CreditTransferDetailsDcComponent implements OnChanges {
  @Input() creditEstDetails: CreditManagmentRequest;
  @Input() creditAvailableBalance: boolean;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.creditEstDetails?.currentValue) {
      this.creditEstDetails = changes?.creditEstDetails?.currentValue;
    }
  }
}
