import { Component, OnInit, Input } from '@angular/core';
import { AdjustmentPaymentDetails } from '@gosi-ui/features/payment/lib/shared/models/adjustment-payment-details';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pmt-validator-adjustment-payment-dc',
  templateUrl: './validator-adjustment-payment-dc.component.html',
  styleUrls: ['./validator-adjustment-payment-dc.component.scss']
})
export class ValidatorAdjustmentPaymentDcComponent implements OnInit {
  @Input() adjustmentPaymentDetails: AdjustmentPaymentDetails;
  @Input() checkForm: FormGroup;
  @Input() isAdustValidPaymenterror: boolean;
  @Input() disableDirectPayment = false;
  @Input() showPayment = true;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {}
}
