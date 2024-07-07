/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EngagementPeriod } from '../../../shared';
import { CalendarTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'cnt-confirmation-modal-dc',
  templateUrl: './confirmation-modal-dc.component.html',
  styleUrls: ['./confirmation-modal-dc.component.scss']
})
/** Class for confirmation pop up for engagement page */
export class ConfirmationModalDcComponent {
  periods = [];
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  /**Input variables */
  @Input() deletedPeriods: EngagementPeriod[];
  @Input() stringToDisplay: string;

  /**Ouput Variables */
  @Output() modify: EventEmitter<boolean> = new EventEmitter();

  /**Method to initialize ConfirmationModalDcComponent */
  constructor(private modalRef: BsModalRef) {}

  /**Method to hide modal and emit modify */
  modifyPeriods(): void {
    this.modify.emit(true);
    this.modalRef.hide();
  }
  /**Method is to hide modal */
  hideModal(): void {
    this.modalRef.hide();
  }
}
