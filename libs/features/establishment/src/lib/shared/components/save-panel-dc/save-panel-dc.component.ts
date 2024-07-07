/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'est-save-panel-dc',
  templateUrl: './save-panel-dc.component.html',
  styleUrls: ['./save-panel-dc.component.scss']
})
export class SavePanelDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() saveEvent: EventEmitter<void> = new EventEmitter();

  constructor(readonly bsModalService: BsModalService) {}

  ngOnInit(): void {}

  /**
   * Method to show the modal
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  /**
   * Method to hide the modal
   */
  hideModal() {
    this.modalRef.hide();
  }

  // Method to emit to save details

  saveEventDetails() {
    this.saveEvent.emit();
  }
  // Method to emit to cancel details

  cancelDetails() {
    this.cancel.emit();
  }
}
