import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BenefitPaymentDetails, HoldBenefitDetails } from '../../models';

@Component({
  selector: 'bnt-current-payment-details-dc',
  templateUrl: './current-payment-details-dc.component.html',
  styleUrls: ['./current-payment-details-dc.component.scss']
})
export class CurrentPaymentDetailsDcComponent implements OnInit {
  @Input() benefitPaymentDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  @Input() restartEditdetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() inEditMode: boolean;
  @Input() removePadding = false;
  @Input() showCard = true;

  constructor() {}

  ngOnInit(): void {}
}
