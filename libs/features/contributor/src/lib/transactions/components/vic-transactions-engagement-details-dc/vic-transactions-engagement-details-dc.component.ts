import { Component, OnInit, Input } from '@angular/core';
import { VicEngagementDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-vic-transactions-engagement-details-dc',
  templateUrl: './vic-transactions-engagement-details-dc.component.html',
  styleUrls: ['./vic-transactions-engagement-details-dc.component.scss']
})
export class VicTransactionsEngagementDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() engagementDetails: VicEngagementDetails;

  constructor() {}

  ngOnInit(): void {}
}
