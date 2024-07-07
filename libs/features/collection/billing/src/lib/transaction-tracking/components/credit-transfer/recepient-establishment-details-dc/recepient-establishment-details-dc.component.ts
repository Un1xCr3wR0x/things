import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditManagmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-recepient-establishment-details-dc',
  templateUrl: './recepient-establishment-details-dc.component.html',
  styleUrls: ['./recepient-establishment-details-dc.component.scss']
})
export class RecepientEstablishmentDetailsDcComponent implements OnChanges {
  @Input() creditEstDetails: CreditManagmentRequest;
  @Input() currentBalanceList;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.creditEstDetails?.currentValue) {
      this.creditEstDetails = changes?.creditEstDetails?.currentValue;
    }
    if (changes?.currentBalanceList?.currentValue) {
      this.currentBalanceList = changes?.currentBalanceList?.currentValue;
    }
  }
}
