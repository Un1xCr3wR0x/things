import { Component, Input, OnInit } from '@angular/core';
import { UiBenefitsService } from '@gosi-ui/features/benefits/lib/shared';
import { PaymentDetails } from '../../models';

@Component({
  selector: 'pmt-direct-payment-history-dc',
  templateUrl: './direct-payment-history-dc.component.html',
  styleUrls: ['./direct-payment-history-dc.component.scss']
})
export class DirectPaymentHistoryDcComponent implements OnInit {
  @Input() history: PaymentDetails;
  // history : PaymentDetails;

  constructor(readonly uiBenefitsService: UiBenefitsService) {}

  ngOnInit(): void {
    // this.uiBenefitsService.getPaymentDetails().subscribe(res => {
    //   this.history = res;
    //   console.log(res);
    //   console.log(this.history);
    // });
  }
}
