/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { Disease, DiseaseWrapper, ReopenDisease } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'oh-occupational-disease-details-dc',
  templateUrl: './occupational-disease-details-dc.component.html',
  styleUrls: ['./occupational-disease-details-dc.component.scss']
})
export class OccupationalDiseaseDetailsDcComponent implements OnInit {
  /**
   * Input variables
   */

  @Input() diseaseDetails: Disease = new Disease();
  @Input() diseaseDetailsWrapper: DiseaseWrapper;
  @Input() reopenDetails: ReopenDisease;
  @Input() canEdit = true;
  @Input() isContributor : boolean;
  @Input() reopenDisease : boolean;

  constructor() {}

  ngOnInit(): void {}
}
