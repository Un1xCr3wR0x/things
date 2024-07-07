import { Component, Input } from '@angular/core';
import { MainframeBenefit } from '../../models';

@Component({
  selector: 'bnt-payment-history-mainframe-dc',
  templateUrl: './payment-history-mainframe-dc.component.html',
  styleUrls: ['./payment-history-mainframe-dc.component.scss']
})
export class PaymentHistoryMainframeDcComponent {
  @Input() mainframePaymentHistory: Array<MainframeBenefit>;
}
