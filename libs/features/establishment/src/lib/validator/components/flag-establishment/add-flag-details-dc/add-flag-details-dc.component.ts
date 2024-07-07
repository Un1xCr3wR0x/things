/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FlagDetails } from '../../../../shared';

@Component({
  selector: 'est-add-flag-details-dc',
  templateUrl: './add-flag-details-dc.component.html',
  styleUrls: ['./add-flag-details-dc.component.scss']
})
export class AddFlagDetailsDcComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() flagDetails: FlagDetails;
  @Input() isModify = false;
  @Input() isJustificationModified: boolean;
  @Input() isEndDateModified: boolean;

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isModify && changes.isModify.currentValue) {
      this.isModify = changes.isModify.currentValue;
    }
    if (changes.flagDetails && changes.flagDetails.currentValue) {
      this.flagDetails = changes.flagDetails.currentValue;
    }

    if (changes.isJustificationModified && changes.isJustificationModified.currentValue) {
      this.isJustificationModified = changes.isJustificationModified.currentValue;
    }
    if (changes.isEndDateModified && changes.isEndDateModified.currentValue) {
      this.isEndDateModified = changes.isEndDateModified.currentValue;
    }
  }
}
