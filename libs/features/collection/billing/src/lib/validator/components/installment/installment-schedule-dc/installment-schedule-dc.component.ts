import { Component, Input, OnInit } from '@angular/core';
import { InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-schedule-dc',
  templateUrl: './installment-schedule-dc.component.html',
  styleUrls: ['./installment-schedule-dc.component.scss']
})
export class InstallmentScheduleDcComponent implements OnInit {
  /*
   * Input Variables
   */
  @Input() installmentSubmittedDetails: InstallmentRequest;
  constructor() {}

  ngOnInit(): void {}
}
