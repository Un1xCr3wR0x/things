/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'oh-previous-assessment-modal-dc',
  templateUrl: './previous-assessment-modal-dc.component.html',
  styleUrls: ['./previous-assessment-modal-dc.component.scss']
})
export class PreviousAssessmentModalDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() close = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  hideModal() {
    this.close.emit();
  }
}
