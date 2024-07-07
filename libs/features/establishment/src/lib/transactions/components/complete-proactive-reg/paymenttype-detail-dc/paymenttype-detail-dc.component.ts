import { Component, Input, OnInit } from '@angular/core';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'est-paymenttype-detail-dc',
  templateUrl: './paymenttype-detail-dc.component.html',
  styleUrls: ['./paymenttype-detail-dc.component.scss']
})
export class PaymenttypeDetailDcComponent implements OnInit {
  @Input() establishment: Establishment;
  @Input() estToValidate: Establishment;
  @Input() showMofPayment: boolean;
  @Input() showLateFee = false;
  @Input() isPaymentModified: Boolean;
  @Input() isLateFeeModified: boolean;
  @Input() isBankNameModified: boolean;
  @Input() isIbanNumberModified: boolean;
  @Input() isGov: boolean;

  constructor() {}

  ngOnInit(): void {}

}
