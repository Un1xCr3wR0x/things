import { Component, Input, OnInit } from '@angular/core';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'est-payment-transaction-details-dc',
  templateUrl: './payment-transaction-details-dc.component.html',
  styleUrls: ['./payment-transaction-details-dc.component.scss']
})
export class PaymentTransactionDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment = null;
  @Input() showMofPayment: boolean;
  @Input() showLateFee = false;
  constructor() {}

  ngOnInit(): void {}
}
