import { Component, Input, OnInit } from '@angular/core';
import { Establishment } from '@gosi-ui/core';
import { TerminateResponse } from '@gosi-ui/features/establishment';
import { TerminatePaymentMethodEnum } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-bank-account-details-dc',
  templateUrl: './bank-account-details-dc.component.html',
  styleUrls: ['./bank-account-details-dc.component.scss']
})
export class BankAccountDetailsDcComponent implements OnInit {
  bankPaymentMethod = TerminatePaymentMethodEnum.BANK;
  //Input Variables
  @Input() establishment: Establishment;
  @Input() estToValidate: Establishment;
  @Input() closeEstDetails: TerminateResponse;
  constructor() {}

  ngOnInit(): void {}
}
