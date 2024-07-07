/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cnt-validator-action-area-dc',
  templateUrl: './validator-action-area-dc.component.html',
  styleUrls: ['./validator-action-area-dc.component.scss']
})
export class ValidatorActionAreaDcComponent {
  //Input Variables
  @Input() showReturn = false;
  @Input() showReject = false;
  @Input() showApprove = false;
  @Input() showRequestInspection = false;
  @Input() isReInspection = false;
  @Input() disableApprove = false;
  //Output Variables
  @Output() approveEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() rejectEvent: EventEmitter<null> = new EventEmitter();
  @Output() returnEvent: EventEmitter<null> = new EventEmitter();
  @Output() requestInspection: EventEmitter<null> = new EventEmitter();

  // Method to emit return details
  validatorReturnEventDetails() {
    this.returnEvent.emit();
  }

  // Method to emit reject details
  validatorRejectEventDetails() {
    this.rejectEvent.emit();
  }

  // Method to emit approve details
  validatorApproveEventDetails() {
    this.approveEvent.emit();
  }

  // Method to emit request inspection details
  validatorRequestInspectionEventDetails() {
    this.requestInspection.emit();
  }

  // Method to emit cancel event details
  validatorCancelEventDetails() {
    this.cancelEvent.emit();
  }
}
