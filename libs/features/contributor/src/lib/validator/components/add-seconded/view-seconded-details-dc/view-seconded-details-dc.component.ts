/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { Establishment, SecondedDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-seconded-details-dc',
  templateUrl: './view-seconded-details-dc.component.html',
  styleUrls: ['./view-seconded-details-dc.component.scss']
})
export class ViewSecondedDetailsDcComponent {
  /** Input variables */
  @Input() establishment: Establishment;
  @Input() secondedDetails: SecondedDetails;
}
