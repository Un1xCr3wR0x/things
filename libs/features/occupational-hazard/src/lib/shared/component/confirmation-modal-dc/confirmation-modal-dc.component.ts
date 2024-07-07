/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RejectedContributor } from '../../../shared';
import { BaseComponent } from '@gosi-ui/core';

@Component({
  selector: 'oh-confirmation-modal-dc',
  templateUrl: './confirmation-modal-dc.component.html',
  styleUrls: ['./confirmation-modal-dc.component.scss']
})

export class ConfirmationModalDcComponent extends BaseComponent implements OnInit, OnChanges {
  periods = [];
  type = 'warning';
  /**Input variables */
  @Input() contributors: RejectedContributor[];
  @Input() stringToDisplay: string;
  @Input() warningMessage: string;
  @Input() lang: string;

  /**Ouput Variables */
  @Output() update: EventEmitter<boolean> = new EventEmitter();

  /**Method to initialize ConfirmationModalDcComponent */
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.warningMessage) {
      this.warningMessage = changes.warningMessage.currentValue;
    }
    if (changes && changes.lang) {
      this.lang = changes.lang.currentValue;
    }
    if (changes && changes.contributors) {
      this.contributors = changes.contributors.currentValue;
    }
  }

  /**Method to hide modal and emit modify */
  updateConfirm(): void {
    this.update.emit(true);
    this.modalRef.hide();
  }
  /**Method is to hide modal */
  hideModal(): void {
    this.modalRef.hide();
  }
}
