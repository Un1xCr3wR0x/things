/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'ces-complaint-otp-dc',
  templateUrl: './complaint-otp-dc.component.html',
  styleUrls: ['./complaint-otp-dc.component.scss']
})
export class ComplaintOtpDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() parentForm = new FormGroup({});
  @Input() isOtpValid = true;
  @Input() isResend = false;
  @Input() currentAlert: BilingualText[] = [];
  @Input() enableResend = false;
  /**
   * output variables
   */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() verify: EventEmitter<null> = new EventEmitter();
  @Output() resend: EventEmitter<null> = new EventEmitter();
  /**
   * local variables
   */
  isReSend: boolean;
  noOfIncorrectOtp: number;
  noOfResend: number;
  isExceeded = false;
  isExpiredAlert = false;
  otpForm: FormGroup = new FormGroup({});
  otpParentForm: FormGroup = new FormGroup({});
  /**
   *
   * @param fb
   */
  constructor(readonly fb: FormBuilder) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: [null]
    });
    this.parentForm.removeControl('otpForm');
    if (this.parentForm) {
      this.parentForm.addControl('otpForm', this.otpForm);
    }
  }
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.isOtpValid && changes.isOtpValid.currentValue) {
        this.isOtpValid = changes.isOtpValid.currentValue;
      }

      if (changes.currentAlert && changes.currentAlert.currentValue) {
        this.currentAlert = changes.currentAlert.currentValue;
      }
      if (changes.isResend && changes.isResend.currentValue) {
        this.isResend = changes.isResend.currentValue;
      }
      if (changes.enableResend && changes.enableResend.currentValue) {
        this.enableResend = changes.enableResend.currentValue;
      }
    }
  }
  /**
   * method to emit cancel event
   */
  onCancel() {
    this.cancel.emit();
  }
  /**
   * method to emit verify event
   */
  onVerify() {
    if (this.otpParentForm.valid) this.verify.emit();
  }
  /**
   * method to emit resend event
   */
  onReSendOtp() {
    if (this.isExceeded === true) {
      this.isExceeded = false;
    }
    this.resend.emit();
  }
  hasTimeExceeded() {}
  /**
   * method to clear alert
   */
  onClose() {
    this.currentAlert = [];
    this.isExpiredAlert = false;
  }
  /**
   * method to stop timer
   */
  timerStopped() {
    this.currentAlert = [];
    this.isExpiredAlert = true;
    this.isExceeded = true;
  }
  /**
   * method to close on expire
   */
  onExpireClose() {
    this.isExpiredAlert = false;
  }
}
