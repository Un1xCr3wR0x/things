import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-payment-details-accordian-view-dc',
  templateUrl: './payment-details-accordian-view-dc.component.html',
  styleUrls: ['./payment-details-accordian-view-dc.component.scss']
})
export class PaymentDetailsAccordianViewDcComponent implements OnInit {
  /**Local Variable */
  @Input() paymentRequest;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
