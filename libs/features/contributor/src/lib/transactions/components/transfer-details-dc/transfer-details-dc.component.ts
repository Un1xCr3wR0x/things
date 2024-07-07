import { Component, Input, OnInit } from '@angular/core';
import { TransferContributorDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-transfer-details-dc',
  templateUrl: './transfer-details-dc.component.html',
  styleUrls: ['./transfer-details-dc.component.scss']
})
export class TransferDetailsDcComponent implements OnInit {
  @Input() transferDetails: TransferContributorDetails;

  constructor() {}

  ngOnInit(): void {}
}
