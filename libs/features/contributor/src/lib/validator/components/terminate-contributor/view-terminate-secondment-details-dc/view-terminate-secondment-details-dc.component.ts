import { Component, OnInit, Input } from '@angular/core';
import { SecondmentDetailsDto } from '@gosi-ui/features/contributor/lib/shared/models/terminate-contributor-payload';

@Component({
  selector: 'cnt-view-terminate-secondment-details-dc',
  templateUrl: './view-terminate-secondment-details-dc.component.html',
  styleUrls: ['./view-terminate-secondment-details-dc.component.scss']
})
export class ViewTerminateSecondmentDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() secondmentDetails: SecondmentDetailsDto;

  constructor() {}

  ngOnInit(): void {}
}
