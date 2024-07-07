import { Component, Input } from '@angular/core';
import { SimisSanedPaymentHistory } from '../../models';

@Component({
  selector: 'bnt-previous-payment-history-simis-dc',
  templateUrl: './previous-payment-history-simis-dc.component.html',
  styleUrls: ['./previous-payment-history-simis-dc.component.scss']
})
export class PreviousPaymentHistorySimisDcComponent {
  @Input() simisSanedPaymentHistory: SimisSanedPaymentHistory;
}
