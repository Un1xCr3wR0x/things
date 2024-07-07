/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisabilityDetails } from '@gosi-ui/features/medical-board';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'oh-previous-assessment-details-dc',
  templateUrl: './previous-assessment-details-dc.component.html',
  styleUrls: ['./previous-assessment-details-dc.component.scss']
})
export class PreviousAssessmentDetailsDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() close = new EventEmitter();
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() onAssessmentIdClicked: EventEmitter<DisabilityDetails> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
  }
  hideModal() {
    this.close.emit();
  }
  onAssessmentIdClick(disabilityDetail) {
    this.onAssessmentIdClicked.emit(disabilityDetail);
  }
}
