import { Component, OnInit, Input } from '@angular/core';
import { SecondmentDetailsDto } from '@gosi-ui/features/contributor/lib/shared/models/terminate-contributor-payload';

@Component({
  selector: 'cnt-terminate-secondment-details-dc',
  templateUrl: './terminate-secondment-details-dc.component.html',
  styleUrls: ['./terminate-secondment-details-dc.component.scss']
})
export class TerminateSecondmentDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() secondmentDetails: SecondmentDetailsDto;

  constructor() {}

  ngOnInit(): void {}
}
