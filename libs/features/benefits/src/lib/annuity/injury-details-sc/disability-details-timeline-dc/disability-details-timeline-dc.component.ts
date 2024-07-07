/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { InjuryDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-disability-details-timeline-dc',
  templateUrl: './disability-details-timeline-dc.component.html',
  styleUrls: ['./disability-details-timeline-dc.component.scss']
})
export class DisabilityDetailsTimelineDcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() injuryDetails: InjuryDetails[];
  @Output() accept: EventEmitter<number> = new EventEmitter();


  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryDetails.currentValue) {
      this.injuryDetails = changes.injuryDetails.currentValue;
    }
  }
  acceptAssessment(assessmentId: number) {
    if (assessmentId) {
      this.accept.emit(assessmentId);
    }
    // patch benefit - reference num, benefit request id
  }

  appeal() {}
  ngOnDestroy() {}
}
