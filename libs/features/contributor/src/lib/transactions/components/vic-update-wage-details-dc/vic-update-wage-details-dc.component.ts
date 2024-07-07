import { Component, Input } from '@angular/core';
import { VicWageUpdateDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-vic-update-wage-details-dc',
  templateUrl: './vic-update-wage-details-dc.component.html',
  styleUrls: ['./vic-update-wage-details-dc.component.scss']
})
export class VicUpdateWageDetailsDcComponent {
  /** Input variables */
  @Input() vicEngagement: VicWageUpdateDetails;
  @Input() eligiblePRBoolean: boolean;
}
