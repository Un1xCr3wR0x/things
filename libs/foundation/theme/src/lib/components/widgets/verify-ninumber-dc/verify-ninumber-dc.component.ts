import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';

@Component({
  selector: 'fea-verify-ninumber-dc',
  templateUrl: './verify-ninumber-dc.component.html',
  styleUrls: ['./verify-ninumber-dc.component.scss']
})
export class VerifyNinumberDcComponent implements OnInit {
  @Input() isVerified = false;
  @Input() ninumber;
  @Input() isSend = false;
  @Output() send: EventEmitter<null> = new EventEmitter();
  @Output() verify: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();

  verificationCodeForm: FormGroup = null;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.verificationCodeForm = this.createVerificationCodeForm();
  }
  createVerificationCodeForm() {
    return this.fb.group({
      data: [null, Validators.required]
    });
  }

  sendVerification() {
    this.send.emit(this.ninumber);
  }

  verifyCode() {
    markFormGroupTouched(this.verificationCodeForm);
    if (this.verificationCodeForm.valid) {
      this.verify.emit(this.verificationCodeForm.getRawValue().data);
    }
  }

  closeWindow() {
    this.close.emit();
  }
}
