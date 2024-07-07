/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tm-remove-block-modal-dc',
  templateUrl: './remove-block-modal-dc.component.html',
  styleUrls: ['./remove-block-modal-dc.component.scss']
})
export class RemoveBlockModalDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() message: string;
  /**
   * output variables
   */
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  /**
   * method to emit confirm action
   */
  confirmSubmit() {
    this.onConfirm.emit();
  }

  /** Method to close the modal. */
  closeModal() {
    this.onCancel.emit();
  }
}
