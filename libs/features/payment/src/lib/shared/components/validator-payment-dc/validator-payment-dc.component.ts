import { Component, OnInit, Input } from '@angular/core';
import { MiscellaneousPaymentRequest } from '../../models';

@Component({
  selector: 'pmt-validator-payment-dc',
  templateUrl: './validator-payment-dc.component.html',
  styleUrls: ['./validator-payment-dc.component.scss']
})
export class ValidatorPaymentDcComponent implements OnInit {
  /**Local Variable */
  @Input() paymentRequest: MiscellaneousPaymentRequest;
  @Input() lang: string;

  type = { english: '', arabic: '' };
  constructor() {}

  ngOnInit(): void {}
}
