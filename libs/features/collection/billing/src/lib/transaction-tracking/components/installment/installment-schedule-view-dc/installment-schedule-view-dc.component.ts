import { Component, Input, OnInit } from '@angular/core';
import { InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-schedule-view-dc',
  templateUrl: './installment-schedule-view-dc.component.html',
  styleUrls: ['./installment-schedule-view-dc.component.scss']
})
export class InstallmentScheduleViewDcComponent implements OnInit {
  @Input() installmentSubmittedDetails: InstallmentRequest;
  constructor() {}

  ngOnInit(): void {}
}
