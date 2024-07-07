/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cim-action-area-dc',
  templateUrl: './action-area-dc.component.html',
  styleUrls: ['./action-area-dc.component.scss']
})
export class ActionAreaDcComponent {
  /** Input Variables. */
  @Input() primaryButtonLabel: string;
  @Input() showPreviousSection: boolean;
  @Input() showCancel = true;
  @Input() disablePrimary = false;
  @Input() idValue = '';

  /** Output Variables. */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  /** Method to submit transaction. */
  submitTransaction() {
    this.submit.emit();
  }

  /** Method to navigate to previous section. */
  previousSection() {
    this.previous.emit();
  }

  /** Method to cancel transaction. */
  cancelTransaction() {
    this.cancel.emit();
  }
}
