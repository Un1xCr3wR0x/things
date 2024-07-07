import { Component, OnInit, Input } from '@angular/core';
import { ContributorDetails } from '../../../shared';

@Component({
  selector: 'bnt-pay-adjustment-details-view-dc',
  templateUrl: './pay-adjustment-details-view-dc.component.html',
  styleUrls: ['./pay-adjustment-details-view-dc.component.scss']
})
export class PayAdjustmentDetailsViewDcComponent implements OnInit {
  constructor() {}
  @Input() contributorDetails: ContributorDetails;
  isSadad = false;
  ngOnInit(): void {}
  navigateToBenefit() {}
}
