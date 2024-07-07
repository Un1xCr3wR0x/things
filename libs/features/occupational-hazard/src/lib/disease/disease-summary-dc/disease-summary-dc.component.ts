/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Disease, InjuryStatus } from '../../shared';

@Component({
  selector: 'oh-disease-summary-dc',
  templateUrl: './disease-summary-dc.component.html',
  styleUrls: ['./disease-summary-dc.component.scss']
})
export class DiseaseSummaryDcComponent implements OnInit, OnChanges {
  showReopen = false;

  @Output() reopen: EventEmitter<null> = new EventEmitter();

  @Input() diseaseDetails: Disease;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.diseaseDetails && changes.diseaseDetails.currentValue) {
      this.diseaseDetails = changes.diseaseDetails.currentValue;
    }
    this.reOpenScenarios();
  }
  reopenDiseaseNavigation() {
    this.reopen.emit();
  }

  reOpenScenarios() {
    if (this.diseaseDetails && this.diseaseDetails.diseaseStatus) {
      const diseaseStatus = this.diseaseDetails.diseaseStatus.english;
      switch (diseaseStatus) {
        case InjuryStatus.CURED_WITHOUT_DISABILITY: {
          if (this.diseaseDetails.reopenAllowedIndicator) {
            this.showReopen = true;
          }
          break;
        }
        case InjuryStatus.CURED_WITH_DISABILITY: {
          if (this.diseaseDetails.reopenAllowedIndicator) {
            this.showReopen = true;
          }
          break;
        }
        case InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT: {
          if (this.diseaseDetails.reopenAllowedIndicator) {
            this.showReopen = true;
          }
          break;
        }
      }
    }
  }
}
