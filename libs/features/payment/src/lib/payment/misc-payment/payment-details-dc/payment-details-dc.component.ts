import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService, BilingualText, GosiCalendar, LookupService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BenefitPaymentDetails, MiscellaneousPayment } from '@gosi-ui/features/payment/lib/shared/models';

@Component({
  selector: 'pmt-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent implements OnInit {
  @Input() benefitList: BenefitPaymentDetails[];
  @Input() netAmount: number;

  constructor() {}

  ngOnInit(): void {
    this.getLookupValues();
  }

  getLookupValues() {}
}
