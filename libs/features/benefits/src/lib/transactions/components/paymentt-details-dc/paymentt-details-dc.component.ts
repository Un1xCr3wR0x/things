import { Component, Input, OnInit } from '@angular/core';
import { PaymentDetails } from '../../../shared';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-paymentt-details-dc',
  templateUrl: './paymentt-details-dc.component.html',
  styleUrls: ['./paymentt-details-dc.component.scss']
})
export class PaymenttDetailsDcComponent implements OnInit {
  @Input() paymentDetails;
  @Input() pageName;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
