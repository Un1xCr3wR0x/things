import { Component, Input, OnInit } from '@angular/core';
import { InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-account-details-dc',
  templateUrl: './installment-account-details-dc.component.html',
  styleUrls: ['./installment-account-details-dc.component.scss']
})
export class InstallmentAccountDetailsDcComponent implements OnInit {
  @Input() installmentSubmittedDetails: InstallmentRequest;
  constructor() {}

  ngOnInit(): void {}
}
