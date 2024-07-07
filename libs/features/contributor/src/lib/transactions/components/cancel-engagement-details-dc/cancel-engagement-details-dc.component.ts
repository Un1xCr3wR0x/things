import { Component, OnInit, Input } from '@angular/core';
import { CancelContributorDetails, Establishment } from '../../../shared/models';
@Component({
  selector: 'cnt-cancel-engagement-details-dc',
  templateUrl: './cancel-engagement-details-dc.component.html',
  styleUrls: ['./cancel-engagement-details-dc.component.scss']
})
export class CancelEngagementDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment;
  @Input() cancellationDetails: CancelContributorDetails;
  constructor() {}

  ngOnInit(): void {}
}
