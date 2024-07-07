import { Component, Input, OnInit } from '@angular/core';
import { ContributorCountDetails, TransferAllContributorDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-transferall-details-dc',
  templateUrl: './transferall-details-dc.component.html',
  styleUrls: ['./transferall-details-dc.component.scss']
})
export class TransferallDetailsDcComponent implements OnInit {
  @Input() transferAllDetails: TransferAllContributorDetails;
  @Input() contributorDetails: ContributorCountDetails;

  @Input() showTo;
  @Input() showFrom;

  constructor() {}

  ngOnInit(): void {}
}
