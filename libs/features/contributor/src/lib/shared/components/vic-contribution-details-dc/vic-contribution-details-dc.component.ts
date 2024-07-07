import { Component, OnInit, Input } from '@angular/core';
import { VicContributionDetails } from '../../models';

@Component({
  selector: 'cnt-vic-contribution-details-dc',
  templateUrl: './vic-contribution-details-dc.component.html',
  styleUrls: ['./vic-contribution-details-dc.component.scss']
})
export class VicContributionDetailsDcComponent implements OnInit {
  /**Local variables */
  @Input() vicContributionDetails: VicContributionDetails;
  @Input() isCancelVic: boolean;
  @Input() isPREligible = false;
  @Input() lang: string;

  constructor() {}

  ngOnInit(): void {}
}
