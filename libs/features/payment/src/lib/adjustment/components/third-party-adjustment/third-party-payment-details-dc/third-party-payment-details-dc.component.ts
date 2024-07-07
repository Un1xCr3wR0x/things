import { Component, OnInit, Input } from '@angular/core';
import { AdjustmentConstants, PaymentList } from '../../../../shared';
@Component({
  selector: 'pmt-third-party-payment-details-dc',
  templateUrl: './third-party-payment-details-dc.component.html',
  styleUrls: ['./third-party-payment-details-dc.component.scss']
})
export class ThirdPartyPaymentDetailsDcComponent implements OnInit {
  @Input() paymentList: Map<number, PaymentList>;
  bankTransfer = AdjustmentConstants.BANK_TRANSFER;

  constructor() {}

  ngOnInit(): void {}
}
