/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'blg-credit-terms-condition-dc',
  templateUrl: './credit-terms-condition-dc.component.html',
  styleUrls: ['./credit-terms-condition-dc.component.scss']
})
export class CreditTermsAndConditionDcComponent implements OnInit {
  @Input() parentForm: FormGroup;

  /** Output variable */

  @Output() finalsubmit: EventEmitter<null> = new EventEmitter();

  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  checkForm: FormGroup;
  modalRef: BsModalRef;
  lang = 'en';

  constructor(readonly fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.checkForm = this.createCheckForm();
    if (this.parentForm) {
      this.parentForm.addControl('checkForm', this.checkForm);
    }
  }

  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }]
    });
  }
  /** Method to update payment details. */
  finalSave() {
    this.finalsubmit.emit();
  }

  /** Method to navigate to prevous section. */
  previousSection() {
    this.previous.emit();
  }

  /**
   * Method to show a confirmation popup for cancelling the transaction.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
}
