import { Component, Input } from '@angular/core';
import { SimisBenefit } from '../../models';

@Component({
  selector: 'bnt-payment-history-simis-dc',
  templateUrl: './payment-history-simis-dc.component.html',
  styleUrls: ['./payment-history-simis-dc.component.scss']
})
export class PaymentHistorySimisDcComponent {
  @Input() simisPaymentHistory: Array<SimisBenefit>;
}
