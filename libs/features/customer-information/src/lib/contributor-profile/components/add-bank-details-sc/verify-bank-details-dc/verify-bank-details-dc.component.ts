import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContractAuthConstant } from '@gosi-ui/features/contributor';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'cim-verify-bank-details-dc',
  templateUrl: './verify-bank-details-dc.component.html',
  styleUrls: ['./verify-bank-details-dc.component.scss']
})
export class VerifyBankDetailsDcComponent implements OnInit {
  contractAuthForm: FormGroup;
  private fb: FormBuilder = new FormBuilder();
  isResend = false;
  minutes = 1;
  noOfIncorrectOtp = 0;
  _isValid: boolean;
  _errorRes: BilingualText;
  errorMsg = false;
  disabledOTP = false;
  noOfResend = ContractAuthConstant.NO_OF_OTP_RETRIES;
  @Input() bankDetails: any;
  @Input() public get isValid() {
    return this._isValid;
  }
  public set isValid(flag) {
    if (flag) this.showOtpScreen();
  }
  @Input() public get errorRes() {
    return this._errorRes;
  }
  constructor() {}

  ngOnInit(): void {
    this.contractAuthForm = this.fb.group({
      otp: [null]
    });
    //console.log(this.bankDetails);
  }
  reSendOtp() {}
  showOtpScreen() {
    //  this.clearAlert();
    this.isResend = false;
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      //This timeout is set because , OTP resend is only for 3time .
      //after 3rd RESEND click on this if condition is satisfied and on the
      // same time field got disable and error msg is shown.But it should
      // be after 4:59sec after 3rd resend .
      setTimeout(() => {
        this.isResend = true;
        this.disabledOTP = true;
        // this.setError(MaxEntriedReached);
      }, 296000);
    }
  }
}
