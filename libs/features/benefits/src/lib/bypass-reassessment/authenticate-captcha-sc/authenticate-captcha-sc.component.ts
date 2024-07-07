/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, CaptchaService } from '@gosi-ui/core';
import { tap } from 'rxjs/operators';
import { AssessmentConstants } from '../../shared/constants';
import { BypassReassessmentService } from '../../shared/services';

@Component({
  selector: 'bnt-authenticate-captcha-sc',
  templateUrl: './authenticate-captcha-sc.component.html',
  styleUrls: ['./authenticate-captcha-sc.component.scss']
})
export class AuthenticateCaptchaScComponent implements OnInit {
  //Local Variables
  personIdentifier: number;
  captcha: string;
  captchaId: number;
  isValid: boolean;
  xCaptcha: string;
  uuid: string;
  referenceNo: string;
  mobNo: string;

  /**
   *
   * @param captchaService
   * @param router
   * @param alertservice
   * @param route
   * @param bypassReassessmentService
   */
  constructor(
    readonly captchaService: CaptchaService,
    readonly router: Router,
    readonly alertservice: AlertService,
    readonly route: ActivatedRoute,
    readonly bypassReassessmentService: BypassReassessmentService
  ) {}

  ngOnInit(): void {
    this.initialiseFromRoute();
  }
  /**
   * Method to get person id
   * @param nin
   */
  initialiseFromRoute() {
    return this.route.queryParams
      .pipe(
        tap(params => {
          if (params['reference_number']) {
            this.referenceNo = params['reference_number']?.toString()?.substr(0, 8);
            this.validateCaptchaDetails();
          }
        })
      )
      .subscribe();
  }
  /**
   * Method to get captcha
   */
  getCaptcha() {
    this.captchaService.getCaptchaCode(this.personIdentifier).subscribe(
      data => {
        this.captcha = data['captcha'];
        this.captchaId = data['captchaId'];
      },
      err => {
        this.alertservice.showError(err.error?.message);
      }
    );
  }
  getPersonId(nin: number) {
    this.personIdentifier = nin;
    this.getCaptcha();
  }
  /** Method to validate contract details. */
  validateCaptchaDetails() {
    this.bypassReassessmentService.validateAssessment(this.referenceNo).subscribe(
      data => {
        this.personIdentifier = data.personIdentifier;
        this.bypassReassessmentService.setMobileNo(data?.mobileNo);
        this.getCaptcha();
      },
      err => {
        this.alertservice.showError(err.error?.message);
      }
    );
  }

  /**
   * Method to verify captcha
   */
  verifyCaptcha() {
    this.router.navigate([AssessmentConstants.ROUTE_VERIFY_OTP], {
      queryParams: {
        personId: this.personIdentifier,
        referenceNo: this.referenceNo
      }
    });
  }
  /* On continue click validate NIN and captcha. */
  sendOTP(captchaDetails) {
    // this.alertservice.clearAlerts();
    this.isValid = false;
    // this.verifyCaptcha();
    this.bypassReassessmentService.identifier = captchaDetails.identity;
    this.xCaptcha = this.captchaId + ':' + captchaDetails.captchaValue;
    this.bypassReassessmentService.validateCaptcha(this.referenceNo, captchaDetails.identity, this.xCaptcha).subscribe(
      data => {
        this.isValid = data ? true : false;
        this.bypassReassessmentService.setisValid(this.isValid);
        this.bypassReassessmentService.setMobileNo(data?.mobileNo);
        this.verifyCaptcha();
      },
      err => {
        if (err.status === 401) {
          this.uuid = err['error']['uuid'];
          this.bypassReassessmentService.setUuid(this.uuid);
          this.isValid = true;
          this.verifyCaptcha();
        } else {
          this.alertservice.showError(err?.error?.message);
          // if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          //   this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
          // } else this.errorRes = err['error']['message'];
        }
        this.bypassReassessmentService.setisValid(this.isValid);
      }
    );
  }
  /** Method to to show error alert */
  showErrorAlert(key: string) {
    this.alertservice.showErrorByKey(key);
  }
}
