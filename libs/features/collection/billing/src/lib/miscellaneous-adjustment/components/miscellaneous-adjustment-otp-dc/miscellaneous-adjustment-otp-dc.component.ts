import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'blg-miscellaneous-adjustment-otp-dc',
  templateUrl: './miscellaneous-adjustment-otp-dc.component.html',
  styleUrls: ['./miscellaneous-adjustment-otp-dc.component.scss']
})
export class MiscellaneousAdjustmentOtpDcComponent implements OnInit {
  /** Local Variables */
  isOtpValid: boolean;
  otpForm: FormGroup;
  modalRef: BsModalRef;

  /** Input Variables */
  @Input() parentForm: FormGroup;
  @Input() establishmentDetails: String;
  @Input() adjustedAmount: number;

  /** Output Variables */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() verify: EventEmitter<null> = new EventEmitter();

  constructor(private modalService: BsModalService, private fb: FormBuilder) {}

  ngOnInit() {
    this.otpForm = this.fb.group({
      otp: [null]
    });
    if (this.parentForm) {
      this.parentForm.addControl('otpForm', this.otpForm);
    }
  }

  hasRetriesExceeded() {}

  verifyOTP() {
    this.verify.emit();
  }

  /** Method to show popup for cancelling the transaction. */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form */
  confirmCancelBtn() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /** Method to decline the popUp. */
  declinePopup() {
    this.modalRef.hide();
  }
}
