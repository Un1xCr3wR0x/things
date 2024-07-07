/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { PenalityWavier } from '../../models/penality-wavier';

@Component({
  selector: 'blg-previously-approved-indicator-details-dc',
  templateUrl: './previously-approved-indicator-details-dc.component.html',
  styleUrls: ['./previously-approved-indicator-details-dc.component.scss']
})
export class PreviouslyApprovedIndicatorDetailsDcComponent implements OnInit {
  @Input() wavierDetails: PenalityWavier;

  /* Method to instantiate the component. */
  ngOnInit() {}
}
