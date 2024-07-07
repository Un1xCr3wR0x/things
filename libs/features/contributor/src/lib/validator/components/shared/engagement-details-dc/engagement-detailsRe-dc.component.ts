import { Component, Input, OnInit } from '@angular/core';
import { ReactivateEngagementDetails } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cnt-engagement-detailsRe-dc',
  templateUrl: './engagement-detailsRe-dc.component.html',
  styleUrls: ['./engagement-detailsRe-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit {

  @Input() reactivateEngagements : ReactivateEngagementDetails;
  
  constructor() { }

  ngOnInit(): void {
  }

}
