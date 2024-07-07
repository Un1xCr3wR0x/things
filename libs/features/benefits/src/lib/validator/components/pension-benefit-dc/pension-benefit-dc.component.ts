import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bnt-pension-benefit-dc',
  templateUrl: './pension-benefit-dc.component.html',
  styleUrls: ['./pension-benefit-dc.component.scss']
})
export class PensionBenefitDcComponent implements OnInit {
  date = '18/06/2020';
  payee = 'Self';
  paymentMethod = 'Bank Transfer';
  iban = 'XXXX XXXX XXXX XXXX XXXX 1234';
  bankName = 'Saudi Investment Bank';
  constructor() {}

  ngOnInit(): void {}
}
