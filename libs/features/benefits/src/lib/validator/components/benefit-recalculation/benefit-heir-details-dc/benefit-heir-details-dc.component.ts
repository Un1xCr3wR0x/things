import { Component, OnInit, Input } from '@angular/core';
import { statusBadgeType } from '@gosi-ui/core';
import { BenefitRecalculation } from '../../../../shared';

@Component({
  selector: 'bnt-benefit-heir-details-dc',
  templateUrl: './benefit-heir-details-dc.component.html',
  styleUrls: ['./benefit-heir-details-dc.component.scss']
})
export class BenefitHeirDetailsDcComponent implements OnInit {
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(status) {
    return statusBadgeType(status);
  }
}
