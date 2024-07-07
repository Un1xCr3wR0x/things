/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, BaseComponent, BilingualText, CaptchaService, OTPService, RouterData, RouterDataToken } from '@gosi-ui/core';
import { tap } from 'rxjs/operators';
import { ContractAuthConstant, ContributorRouteConstants } from '../../../shared/constants';
import { ContractAuthenticationService } from '../../../shared/services';
import { routerData } from 'testing';

@Component({
  selector: 'cnt-validate-individual-contract-sc',
  templateUrl: './validate-individual-contract-sc.component.html',
  styleUrls: ['./validate-individual-contract-sc.component.scss']
})
export class ValidateIndividualContractScComponent extends BaseComponent implements OnInit {
  /** Local variables. */
  isValid: boolean;
  referenceNo: string;
  type: string;
  uuid: string;
  xOtp: string;
  errorRes: BilingualText;
  personIdentifier: number;
  captcha: string;
  captchaId: number;
  xCaptcha: string;
  isEngagement:boolean;
  /** Creates an instance of ValidateIndividualContractScComponent. */
  constructor(
    readonly contractService: ContractAuthenticationService,
    readonly captchaService: CaptchaService,
    readonly otpService: OTPService,
    readonly router: Router,
    private route: ActivatedRoute,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.getContractReferenceID();
    this.alertService.clearAlerts();
  }
  /* get captcha based on nin */
  getCaptcha() {
    this.alertService.clearAlerts();
    this.captchaService.getCaptchaCode(this.personIdentifier).subscribe(
      data => {
        this.captcha = data['captcha'];
        this.captchaId = data['captchaId'];
      },
      err => {
        if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.errorRes = err['error']['message'];
      }
    );
  }
  /** Method to get contract reference id. */
  getContractReferenceID() {
    this.initialiseFromRoute().subscribe();
  }

  // initialiseFromRoute() {
  //   return this.route.queryParams.pipe(
  //     tap(params => {
  //       if (params['reference_number']) {
  //         this.referenceNo = params['reference_number']?.toString()?.substr(0, 8);
  //         this.type=params['type']?.toString();
  //         this.checkType();

  //       } else {
  //                   this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
  //       }
  //     })
  //   );
  // }

  initialiseFromRoute() {
    return this.route.queryParams.pipe(
      tap(params => {
        let referenceNumber = params['reference_number'];
        if (referenceNumber) {
          // Handle variations in reference_number format
          referenceNumber = referenceNumber.toString().replace(/\s/g, '').replace(/\$/g, '');
          this.referenceNo = referenceNumber.substr(0, 8);
          const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
          const containsEngAuth = queryString.includes('type');
          if (containsEngAuth) {
            this.type = "ENG_AUTH"
          }
          this.checkType();
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        }
      })
    );
   }

  checkType(){
    if(this.type==="ENG_AUTH"){
      this.isEngagement=true;
      this.validateEngagementDetails();}
    else this.validateContractDetails();
  }

  /** Method to validate contract details. */
  validateContractDetails() {
    this.contractService.validateContract(this.referenceNo).subscribe(
      data => {
        this.personIdentifier = data?.personIdentifier;
        this.getCaptcha();
      },
      error => {
        this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
      }
    );
  }
   /** Method to validate contract details. */
   validateEngagementDetails() {
    this.contractService.validateEngagement(this.referenceNo).subscribe(
      data => {
        if(data.type==="ENG_AUTH"){
        this.personIdentifier = data?.personIdentifier;
        this.getCaptcha();}
      },
      error => {
        this.routerDataToken.priority=1;
        this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
      }
    );
  }

  /* On continue click validate NIN and captcha. */
  sendOTP(captchaDetails) {
    this.alertService.clearAlerts();
    this.isValid = false;
    this.contractService.identifier = captchaDetails.identity;
    this.xCaptcha = this.captchaId + ':' + captchaDetails.captchaValue;
    if(this.type==="ENG_AUTH"){
      this.contractService.validateCaptchaEngagement(this.referenceNo, captchaDetails.identity, this.xCaptcha).subscribe(
        data => {
          this.isValid = data ? true : false;
        },
        err => {
          if (err?.status === 401) {
            this.uuid = err['error']['uuid'];
            this.isValid = true;
          } else {
            if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
              this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
            } else this.errorRes = err['error']['message'];
          }
        }
      );
    }
    else{
    this.contractService.validateCaptchaContract(this.referenceNo, captchaDetails.identity, this.xCaptcha).subscribe(
      data => {
        this.isValid = data ? true : false;
      },
      err => {
        if (err?.status === 401) {
          this.uuid = err['error']['uuid'];
          this.isValid = true;
        } else {
          if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
            this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
          } else this.errorRes = err['error']['message'];
        }
      }
    );
    }


  }

  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.xOtp = this.uuid + ':' + otpValue;
    if(this.type==="ENG_AUTH"){
      this.contractService.EverifyOTP(this.referenceNo, this.xOtp).subscribe(
        data => {
          this.contractService.authorization = data.headers.get('Authorization');
          this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATE_CONTRACT], {
            queryParams: {
              reference_number: this.referenceNo,
              type:this.type
            }
          });
        },
        err => {
          if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
            this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
          } else this.errorRes = err['error']['message'];
        }
      );
    }
    else{
    this.contractService.verifyOTP(this.referenceNo, this.xOtp).subscribe(
      data => {
        this.contractService.authorization = data.headers.get('Authorization');
        this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATE_CONTRACT], {
          queryParams: {
            reference_number: this.referenceNo
          }
        });
      },
      err => {
        if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.errorRes = err['error']['message'];
      }
    );
    }
  }

  /** Method to cancel login. */
  cancelLogin() {
    if (this.referenceNo && this.type==="ENG_AUTH") {
      this.validateEngagementDetails();
    }
    else if(this.referenceNo)
     this.validateContractDetails();
    else {
      this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
    }
  }

  /** Method to relaod. */
  reload() {
    window.location.reload();
  }
  /** Method to to show error alert */
  showErrorAlert(key: string) {
    this.alertService.showErrorByKey(key);
  }

  /** Method to resend otp. */
  reSendOTP() {
    this.otpService.reSendOTP(this.uuid, false).subscribe({
      error: err => (this.errorRes = err['error']['message'])
    });
  }
}
