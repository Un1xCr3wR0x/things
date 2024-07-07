/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  CaptchaService,
  DocumentService,
  isNIN,
  LanguageToken,
  LookupService,
  LovList,
  OTPService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WizardItem,
  WorkflowService,
  startOfDay
} from '@gosi-ui/core';
import { BreadCrumbConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContractAuthConstant, ContributorConstants, ContributorRouteConstants } from '../../../../shared/constants';

import { EngagementBasicDetails, EngagementDetails } from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';
import moment from 'moment-timezone';

@Component({
  selector: 'modify-joining-leaving-date-sc',
  styleUrls: ['./modify-joining-leaving-date-sc.component.scss'],
  templateUrl: './modify-joining-leaving-date-sc.component.html'
})
export class ModifyJoiningLeavingDateScComponent implements OnInit {
  engagementWizardItems: WizardItem[] = [];
  currentTab = 0;
  isValid: boolean;
  referenceNo: string;
  uuid: string;
  Otp: string = null;
  errorRes: BilingualText;
  personIdentifier: number;
  captcha: string;
  captchaId: number;
  xCaptcha: string;
  nin: number;
  isNexttab = false;
  modifyEngagement: EngagementBasicDetails = new EngagementBasicDetails();
  EngagementType: string;
  joiningDate;
  leavingDate;
  isNin: boolean;
  validUuid = false;
  newEngagementDate;
  Engagementstatus: string;
  showError = false;
  showSuccess = false;
  engagementId: number;
  lang: string;
  otpError: BilingualText = new BilingualText();
  otpUnathorizedError: BilingualText = new BilingualText();
  engagementDetails: EngagementDetails;
  leavingReasonlist$: Observable<LovList>;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  engagementResponses;
  successMessage: BilingualText;
  @ViewChild('engagementWizard', { static: false })
  engagementWizard: ProgressWizardDcComponent;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly manageWageService: ManageWageService,
    readonly contributorService: ContributorService,
    readonly modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contractService: ContractAuthenticationService,
    readonly captchaService: CaptchaService,
    readonly otpService: OTPService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });

    this.nin = this.authTokenService.getIndividual();
    this.isNin = isNIN(this.nin.toString());
    this.leavingReasonlist$ = this.lookUpService.getReasonForLeavingList(this.isNin ? '1' : '2');
    this.initializeWizards();
    this.getContractReferenceID();
    this.alertService.clearAlerts();
    this.route.queryParams.subscribe(params => {
      this.EngagementType = params.EngagementType;
      this.joiningDate = params.joiningDate;
      this.leavingDate = params.leavingDate;
      this.engagementId = params.engagementId;
      this.Engagementstatus = params.status;
    });
    this.getEngagement();
  }
  ngAfterViewInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      if (this.EngagementType === 'JoiningDate') {
        this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.MODIFY_JOINNING_BREADCRUMB_VALUES;
      } else if (this.EngagementType === 'Cancelengagement') {
        this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.CANCEL_BREADCRUMB_VALUES;
      } else if (this.EngagementType === 'LeavingDate') {
        this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.MODIFY_LEAVING_BREADCRUMB_VALUES;
      } else if (this.EngagementType === 'Terminateengagement') {
        this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.TERMINATE_BREADCRUMB_VALUES;
      }
    }
  }
  /** Method to initialize the navigation wizard. */
  initializeWizards() {
    this.engagementWizardItems = this.getWizards();
    this.engagementWizardItems[0].isDisabled = false;
    this.engagementWizardItems[0].isActive = true;
  }
  /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ContributorConstants.ENGAGEMENT_DETAILS, 'briefcase'));
    wizardItems.push(new WizardItem(ContributorConstants.VERIFY, 'clipboard-check'));
    return wizardItems;
  }
  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  saveandNext(evnt) {
    //this.currentTab = 1;
    this.newEngagementDate = evnt?.value?.engagementDate?.gregorian;
    this.modifyEngagement.comments = null;
    this.modifyEngagement.leavingReason.english = evnt.value.leavingReason.english;
    this.modifyEngagement.leavingReason.arabic = evnt.value.leavingReason.arabic;
    this.modifyEngagement.leavingDate.gregorian = this.leavingDate;
    this.modifyEngagement.leavingDate.hijiri = null;
    this.modifyEngagement.joiningDate.gregorian = this.joiningDate;
    this.modifyEngagement.joiningDate.hijiri = null;
    this.modifyEngagement.violationSubType = null;
    this.modifyEngagement.violationType = null;
    this.submitEngagementDate();
  }
  submitEngagementDate() {
    if (this.EngagementType === 'JoiningDate') {
      this.modifyEngagement.violationSubType = 'Modify Joining Date';
      this.modifyEngagement.violationType = 'Modify Engagement';
      this.modifyEngagement.joiningDate.gregorian = startOfDay(this.newEngagementDate);
      // this.modifyEngagement.leavingDate = null;
    } else if (this.EngagementType === 'LeavingDate') {
      this.modifyEngagement.violationType = 'Modify Engagement';
      this.modifyEngagement.violationSubType = 'Modify Leaving Date';
      this.modifyEngagement.leavingDate.gregorian = startOfDay(this.newEngagementDate);
    } else if (this.EngagementType === 'Terminateengagement') {
      this.modifyEngagement.violationType = 'Terminate Engagement';
      this.modifyEngagement.violationSubType = null;
      this.modifyEngagement.leavingDate.gregorian = startOfDay(this.newEngagementDate);
    } else if (this.EngagementType === 'Cancelengagement') {
      this.modifyEngagement.violationType = 'Cancel Engagement';
      this.modifyEngagement.violationSubType = null;
    }

    if (this.modifyEngagement.violationType != 'Cancel Engagement' && this.Otp === null) {
      this.manageWageService.openEngagementDate(this.nin, this.engagementId, this.modifyEngagement).subscribe(
        res => {
          this.currentTab = 1;
          this.isNexttab = true;
          //console.log(this.Otp, this.uuid);
          this.manageWageService
            .submitEngagementDate(this.nin, this.engagementId, this.Otp, this.uuid, this.modifyEngagement)
            .subscribe(
              (res: any) => {
                this.isNexttab = true;
                // this.language.subscribe(language => {
                //   this.lang = language;
                // });
                // if (this.lang == 'en'){
                //   this.successMessage = res.message.english;
                // }
                // else if (this.lang == 'ar'){
                //   this.successMessage = res;
                // }
                this.showSuccess = true;
                this.successMessage = res.message;
                this.alertService.showSuccess(this.successMessage);
                this.navigateBackToHome();
              },
              error => {
                if (!this.uuid) {
                  this.uuid = error['error']['uuid'];
                }
                if (this.uuid) this.validUuid = true;
                if (error.status !== 422 && error.status !== 401) {
                  this.showError = true;
                  this.alertService.showError(error.error.message, error.error.details);
                } else if (error.status === 401) {
                  (this.otpUnathorizedError = error.error.message), error.error.details;
                } else {
                  this.otpUnathorizedError = new BilingualText();
                  (this.otpError = error.error.message), error.error.details;
                }
              }
            );
          this.nextTab();
        },
        error => {
          this.currentTab = 0;
          this.showError = true;
          this.isNexttab = false;
          if (error.error.details.length > 1) {
            error.error.message = null;
          }
          this.alertService.showError(error.error.message, error.error.details);
        }
      );
    } else {
      this.currentTab = 1;
      this.isNexttab = true;
      this.manageWageService
        .submitEngagementDate(this.nin, this.engagementId, this.Otp, this.uuid, this.modifyEngagement)
        .subscribe(
          (res: any) => {
            this.isNexttab = true;

            // this.language.subscribe(language => {
            //   this.lang = language;
            // });
            // if (this.lang == 'en'){
            //   this.successMessage = res.message.english;
            // }
            // else if (this.lang == 'ar'){
            //   this.successMessage = res;
            // }
            this.showSuccess = true;
            this.successMessage = res.message;
            this.alertService.showSuccess(this.successMessage);
            this.navigateBackToHome();
          },
          error => {
            if (!this.uuid) {
              this.uuid = error['error']['uuid'];
            }
            if (this.uuid) this.validUuid = true;
            if (error.status !== 422 && error.status !== 401) {
              this.showError = true;
              this.alertService.showError(error.error.message, error.error.details);
            } else if (error.status === 401) {
              (this.otpUnathorizedError = error.error.message), error.error.details;
            } else {
              this.otpUnathorizedError = new BilingualText();
              (this.otpError = error.error.message), error.error.details;
            }
          }
        );
      this.nextTab();
    }
  }

  /** Method to navigate back to home page */
  navigateBackToHome(): void {
    this.router.navigate(['/home/contributor/individual/contributions']);
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

  initialiseFromRoute() {
    return this.route.queryParams.pipe(
      tap(params => {
        if (params['reference_number']) {
          this.referenceNo = params['reference_number']?.toString()?.substr(0, 8);
          this.validateContractDetails();
        } else {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        }
      })
    );
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

  /* On continue click validate NIN and captcha. */
  sendOTP(captchaDetails) {
    this.alertService.clearAlerts();
    this.isValid = false;
    this.contractService.identifier = captchaDetails.identity;
    this.contractService.validateCaptchaContract(this.referenceNo, captchaDetails.identity).subscribe(
      data => {
        this.isValid = data ? true : false;
      },
      err => {
        if (err?.status === 401) {
          this.uuid = err['error']['uuid'];
          this.isValid = true;
        } else {
          this.errorRes = err['error']['message'];
        }
      }
    );
  }

  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.Otp = otpValue;
    this.submitEngagementDate();
  }

  /** Method to cancel login. */
  cancelLogin() {
    if (this.referenceNo) {
      this.validateContractDetails();
    } else {
      this.router.navigate(['/home/contributor/individual/contributions']);
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
  // reSendOTP() {
  //   this.otpService.reSendOTP(this.uuid, false).subscribe({
  //     error: err => (this.errorRes = err['error']['message'])
  //   });
  // }
  reSendOTP() {
    this.otpService.reSendOTP(this.uuid, false).subscribe(
      data => {
        this.otpUnathorizedError = data['message'];
        this.otpError = new BilingualText();
        // this.alertService.showInfo(data['message']);
      },
      err => {
        this.errorRes = err['error']['message'];
      }
    );
  }
  /**Method to fetch engagement */
  getEngagement() {
    this.contributorService.getEngagementDetails(this.nin, this.engagementId).subscribe(data => {
      this.engagementDetails = data;
    });
  }
  /** Method to navigate to next section of the screen. */
  nextTab() {
    this.alertService.clearAlerts();
    this.engagementWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
}
