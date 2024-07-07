/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'blg-action-area-dc',
  templateUrl: './action-area-dc.component.html',
  styleUrls: ['./action-area-dc.component.scss']
})
export class ActionAreaDcComponent {
  /** Input Variables. */
  @Input() primaryButtonLabel: string;
  @Input() secondaryButtonLabel: string;
  @Input() showPreviousSection: boolean;
  @Input() disablePrimary = false;
  @Input() previousButtonLabel: string;

  /** Output Variables. */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  /** Method to navigate to previous section. */
  previousSections() {
    this.previous.emit();
  }

  /** Method to submit transaction. */
  submitTransactions() {
    this.submit.emit();
  }
  /** Method to cancel transaction. */
  cancelTransactions() {
    this.cancel.emit();
  }
}
