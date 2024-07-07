/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Complication } from '../../models/complication';

@Component({
  selector: 'oh-modified-complication-details-dc',
  templateUrl: './modified-complication-details-dc.component.html',
  styleUrls: ['./modified-complication-details-dc.component.scss']
})
export class ModifiedComplicationDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() complication: Complication;
  @Input() idCode: string;
  @Input() showHeading = true;
  isContributor: boolean;
  /**
   *
   * @param changes Capture input changes
   */
  ngOnInit() {
    this.complication.initiatedBy === 'taminaty' ? (this.isContributor = true) : (this.isContributor = false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
      this.complication.initiatedBy === 'taminaty' ? (this.isContributor = true) : (this.isContributor = false);
    }
    if (changes && changes.idCode) {
      this.idCode = changes.idCode.currentValue;
    }
  }
}
