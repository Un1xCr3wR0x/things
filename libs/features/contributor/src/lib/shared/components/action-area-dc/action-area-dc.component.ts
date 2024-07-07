/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cnt-action-area-dc',
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
  @Input() isUnclaimed: any;

  /** Output Variables. */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  constructor(public modalService: BsModalService) {}
  commonModalRef: BsModalRef;
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
  navigateToPrevious() {
    this.cancelTransaction();
  }
  hideModal() {
    this.commonModalRef.hide();
  }

  showModalRef(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'md'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
}
