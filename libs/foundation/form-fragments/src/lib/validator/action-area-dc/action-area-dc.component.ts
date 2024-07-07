/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'frm-action-area-dc',
  templateUrl: './action-area-dc.component.html',
  styleUrls: ['./action-area-dc.component.scss']
})
export class ActionAreaDcComponent extends BaseComponent implements OnInit {
  //Input Variables
  @Input() canReturn = false;
  @Input() canReject = true;
  @Input() canAssignToSpecialist = false;
  @Input() canApprove = true;
  @Input() isReturn = false;
  @Input() disableApprove = false;
  @Input() disableReject = false;
  @Input() disableReturn = false;
  @Input() isValidatorShow = true;
  bsModalRef: BsModalRef;

  //Output Variables
  @Output() approveEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() rejectEvent: EventEmitter<null> = new EventEmitter();
  @Output() returnEvent: EventEmitter<null> = new EventEmitter();
  @Output() assignToSpecialist: EventEmitter<void> = new EventEmitter();
  /**
   * Creates an instance of ActionAreaDcComponent
   * @memberof  ActionAreaDcComponent
   *
   */
  constructor() {
    super();
  }

  /** This method is to initialise the component */
  ngOnInit() {}

  // Method to emit return details

  returnEventDetails() {
    this.returnEvent.emit();
  }
  // Method to emit reject details

  rejectEventDetails() {
    this.rejectEvent.emit();
  }

  // Method to emit Assign to Specialist
  onAssignToSpecialist() {
    this.assignToSpecialist.emit();
  }
  // Method to emit approve details

  approveEventDetails() {
    this.approveEvent.emit();
  }

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
}
