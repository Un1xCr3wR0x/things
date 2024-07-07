/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cim-modal-action-dc',
  templateUrl: './modal-action-dc.component.html',
  styleUrls: ['./modal-action-dc.component.scss']
})
export class ModalActionDcComponent extends BaseComponent implements OnInit {
  modalRef: BsModalRef;

  //Input Variables
  @Input() id: string;
  @Input() submitText = 'CUSTOMER-INFORMATION.SAVE';
  @Input() cancelText = 'CUSTOMER-INFORMATION.CANCEL';
  @Input() isSecondaryButtonRequired = true;
  @Input() isPrimaryButtonRequired = true;
  @Input() buttonPrimaryType = 'primary';

  //Ouput Variables
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() submit: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of ModalActionDcComponent
   * @memberof  ModalActionDcComponent
   *
   */
  constructor(readonly bsModalService: BsModalService) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {}

  // Method to emit cancel details

  cancelDetails() {
    this.cancel.emit();
    this.hideCancelModal();
  }
  // Method to emit submit details

  submitDetails() {
    this.submit.emit();
  }

  showCancelModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(templateRef);
  }

  hideCancelModal() {
    this.modalRef.hide();
  }
}
