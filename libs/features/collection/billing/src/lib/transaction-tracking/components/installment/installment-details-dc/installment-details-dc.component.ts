import { Component, Input, OnInit } from '@angular/core';
import { InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-details-dc',
  templateUrl: './installment-details-dc.component.html',
  styleUrls: ['./installment-details-dc.component.scss']
})
export class InstallmentDetailsDcComponent implements OnInit {
  @Input() installmentSubmittedDetails: InstallmentRequest;
  constructor() {}

  ngOnInit(): void {}
}
