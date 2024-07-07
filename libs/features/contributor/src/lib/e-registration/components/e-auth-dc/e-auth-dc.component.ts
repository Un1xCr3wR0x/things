import { Component, OnInit ,Input,Output,EventEmitter,Inject, TemplateRef, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert, AlertIconEnum, AlertTypeEnum, BilingualText, checkNull, LanguageToken, markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { ContractAuthConstant, ContractAuthenticationService, ContributorRouteConstants } from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import {AlertService} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';


const MaxEntriedReached = 'CONTRIBUTOR.ERROR.MAX-ENTRIES-OTP';

@Component({
  selector: 'cnt-e-auth-dc',
  templateUrl: './e-auth-dc.component.html',
  styleUrls: ['./e-auth-dc.component.scss']
})
export class EAuthDcComponent implements OnInit {
  /** Local variables. */
  trim: string;
  message: string;
  _isValid = true;
  _errorRes: BilingualText;
  errorMsg = false;
  contractAuthForm: FormGroup;
  uuid: string;
  xOtp: string;
  referenceNo: string;
  captchaId: number;
  xCaptcha: string;
  //Check if the entered otp is valid
  showOtp = false; // Otp Screen View
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  noOfResend = ContractAuthConstant.NO_OF_OTP_RETRIES; // Maximum no of resend possible
  showOtpError: boolean;
  noOfIncorrectOtp = 0;
  minutes = 4;
  disabledOTP = false;
  absherVerified = true; //Field to check if the mobile number has been verified with abhser
  mobileVerifiedPage = false; // Mobile verified successfull
  otpErrorMessageKey: string;
  // alert variables
  contractInfo: Alert = new Alert();
  errorAlert: Alert;
  lang: string;
  bsModal: BsModalRef;

  /** Input variables. */
  @Input() public get isValid() {
    return this._isValid;
  }
  public set isValid(flag) {
    if (flag) this.showOtpScreen();
  }
  @Input() public get errorRes() {
    return this._errorRes;
  }
  public set errorRes(err) {
    scrollToTop();
    this._errorRes = err;
    this.errorAlert = new Alert();
    this.errorAlert.message = err;
    this.errorAlert.type = AlertTypeEnum.DANGER;
    this.errorAlert.dismissible = true;
    this.errorAlert.icon = AlertIconEnum.ERROR;
    this.errorMsg = true;
    
  }
  @Input() captcha: string;
  @Input() isApiTriggered: boolean;
  @Input() mob_num : string;

  /** Output variables. */
  @Output() onVerifyClicked: EventEmitter<string> = new EventEmitter();
  @Output() onCancelClicked: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() onResendOTPClicked: EventEmitter<null> = new EventEmitter();
  @Output() onApplicationReload: EventEmitter<null> = new EventEmitter();
  @Output() refresh = new EventEmitter<null>();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();

  /** Creates  an instance of ContractAuthDcComponent. */
    
    
    constructor(private fb: FormBuilder,readonly alertService: AlertService,private route: ActivatedRoute,readonly contractService: ContractAuthenticationService,readonly router: Router, readonly modalService: BsModalService, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    // this.trim=this.message.substring(0,6);/
    // 
    // console.log(this.trim);
    //console.log(this.message);
    this.getContractReferenceID();
     this.contractAuthForm = this.fb.group({
      // identity: [null, Validators.required],
      // captchaControl: [null, Validators.required],

    });
    this.showOtpScreen();
    
    this.language.subscribe(language => (this.lang = language));
  }

  ngOnChanges(changes:SimpleChanges){
     if(changes.mob_num && changes.mob_num.currentValue)
     {
      //console.log(this.mob_num);
      //  this.message=`OTP has been sent to your registered mobile number xxxxxx${this.mob_num}`;
    }
  }


  /** Method to get contract reference id. */
  getContractReferenceID() {
    this.initialiseFromRoute().subscribe();
  }

  initialiseFromRoute() {
    return this.route.queryParams.pipe(
      tap(params => {
        if (params['reference_number']) {
          this.referenceNo = params['reference_number']?.toString()?.substr(0, 8);
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        }
      })
    );
  }

  


  


  /** Method to handle the show otp Screen. */
  showOtpScreen() {
    this.clearAlert();
    this.isResend = false;
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      //This timeout is set because , OTP resend is only for 3time .
      //after 3rd RESEND click on this if condition is satisfied and on the
      // same time field got disable and error msg is shown.But it should
      // be after 4:59sec after 3rd resend .
      setTimeout(() => {
        this.isResend = true;
        this.disabledOTP = true;
        this.setError(MaxEntriedReached);
      }, 296000);
    }
    
        this.contractAuthForm.addControl('otp', new FormControl(['', Validators.required]));
        // this.showOtp = !this.showOtp;
        // this.isOtpValid = true;
    
  }

  /** Method to verify the mobile number in abhser with an otp. */
  verifyOtp() {
    this.clearAlert();
    if (!checkNull(this.contractAuthForm.get('otp').value) && !checkNull(this.contractAuthForm.get('otp').value[0])) {
      this.isOtpValid = true;
      this.absherVerified = true;
      this.mobileVerifiedPage = true;
      this.onVerifyClicked.emit(this.contractAuthForm.get('otp').value);
    } else if (
      checkNull(this.contractAuthForm.get('otp').value) ||
      checkNull(this.contractAuthForm.get('otp').value[0])
    ) {
      this.setError('CONTRIBUTOR.ERROR.OTP_ERROR_NO_OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    } else {
      this.setError('CONTRIBUTOR.ERROR.OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    }
  }

  /** Method to resend the otp after 2 minutes. */
  reSendOtp() {
    if (this.isOtpValid === false) {
      this.isOtpValid = true;
    }
    this.clearAlert();
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.onResendOTPClicked.emit();
      this.isResend = false;
    }
  }

  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
    }
  }

  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpError = false;
    this.errorMsg = false;
  }

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }

  /** Method to handle cancel button click. */
  cancelAuth() {
    this.decline();
    this.clearAlert();
    if (this.showOtp) {
      this.showOtp = false;
      this.contractAuthForm.get('identity').reset(null);
      this.contractAuthForm.get('identity').enable();
    }
    this.onCancelClicked.emit();
  }
  
  confirmCancel(): void {
    this.cancel.emit();
    this.decline();
  }

  decline(): void {
    this.bsModal.hide();
  }

  previousForm(): void {
    this.previous.emit();
  }

  /** Method to reload application. */
  reLoadApplication() {
    this.cancelAuth();
    this.onApplicationReload.emit();
  }

  /** Method to handle captcha and nin verification on continue button click. */
  continueAuth() {
    this.errorMsg = false;
    // this.onContinueClicked.emit();//for checking remove after proper working
    }
  /** captcha regenerate */
  refreshCaptcha() {
    this.refresh.emit();
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.bsModal = this.modalService.show(template, config);
  }
}



