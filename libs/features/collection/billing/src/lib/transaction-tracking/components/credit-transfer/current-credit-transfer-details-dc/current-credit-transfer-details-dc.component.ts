import { Component, Input, OnInit } from '@angular/core';
import { CreditManagmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-current-credit-transfer-details-dc',
  templateUrl: './current-credit-transfer-details-dc.component.html',
  styleUrls: ['./current-credit-transfer-details-dc.component.scss']
})
export class CurrentCreditTransferDetailsDcComponent implements OnInit {
  @Input() creditEstDetails: CreditManagmentRequest;
  @Input() creditAvailableBalance: boolean;
  constructor() {}

  ngOnInit(): void {}
}
