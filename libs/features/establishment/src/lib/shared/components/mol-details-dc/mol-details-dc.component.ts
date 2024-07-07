/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { BilingualText, MOLEstablishmentDetails } from '@gosi-ui/core';

@Component({
  selector: 'est-mol-details-dc',
  templateUrl: './mol-details-dc.component.html',
  styleUrls: ['./mol-details-dc.component.scss']
})
export class MolDetailsDcComponent implements OnInit {
  @Input() molDetails: MOLEstablishmentDetails;
  @Input() molFileStatus: BilingualText;

  constructor() {}

  ngOnInit(): void {}
}
