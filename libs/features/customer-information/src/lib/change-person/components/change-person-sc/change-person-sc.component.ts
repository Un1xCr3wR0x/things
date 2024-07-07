/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  bindToForm,
  bindToObject,
  BorderNumber,
  DocumentService,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  Lov,
  NationalId,
  NIN,
  Passport,
  Person
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import {
  ChangePersonScBaseComponent,
  ChangePersonService,
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonService,
  PersonBankDetails
} from '../../../shared';
import { PersonConstants } from '../../../shared/constants/person-constants';
import { getEducationForm } from './change-person-form';

const MandatoryErrorKey = 'CORE.ERROR.MANDATORY-FIELDS';
const MaxEntriedReached = 'CUSTOMER-INFORMATION.ERROR.MAX-ENTRIES-OTP';
const MobileNotVerified = 'CUSTOMER-INFORMATION.ERROR.MOBILE-NOT-VERIFIED';

//This component is to set the profile details of the person
@Component({
  selector: 'cim-change-person-sc',
  templateUrl: './change-person-sc.component.html',
  styleUrls: ['./change-person-sc.component.scss']
})
export class ChangePersonScComponent extends ChangePersonScBaseComponent implements OnInit {
  showProfile = false; //Shows the profile if the person is valid only
  person: Person;
  label = 'MY-PROFILE';
  socialInsuranceNo: number;
  active: boolean;
  isContributor = false;
  isIdentity = false;
  isIbanVerified = true;

  // Form Variables
  educationForm: FormGroup;
  contactForm: FormGroup = new FormGroup({});
  bankParentForm: FormGroup = new FormGroup({});
  otpControl: FormControl = new FormControl();
  comments: FormControl = new FormControl();
  addressForms = new FormGroup({});

  //Check if the entered otp is valid
  showOtp = false; // Otp Screen View
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  noOfResend = ManagePersonConstants.NO_OF_OTP_RETRIES; // Maximum no of resend possible

  //Filed to check if the mobile number has been verified with abhser
  absherVerified = true;
  mobileVerifiedPage = false; // Mobile verified successfull
  bankDetails: PersonBankDetails = new PersonBankDetails();
  noOfIncorrectOtp = 0;

  otpErrorMessageKey: string;
  absherInfoMessageKey: string;
  bankNameList: Lov;

  constructor(
    public alertService: AlertService,
    readonly lookService: LookupService,
    public changePersonService: ChangePersonService,
    public modalService: BsModalService,
    public documentService: DocumentService,
    private manageService: ManagePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly manageRoutingService: ManagePersonRoutingService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      route
    );
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.educationForm = getEducationForm();
    this.initialiseLookups();
    this.alertService.clearAlerts();
    this.person = new Person();
    this.alertService.clearAlerts();
    this.absherInfoMessageKey = 'CUSTOMER-INFORMATION.INFO.ABHSER_VERIFIED_INFO';

    if (this.manageService.contributor$) {
      this.manageService.contributor$
        .pipe(
          filter(res => res !== null),
          tap(res => {
            this.person = res.person;
            if (this.person.personId) {
              this.manageService.setPersonId(this.person.personId);
            }
            this.isIdentity = false;
            this.person.identity.forEach((item: NIN | Iqama | NationalId | Passport | BorderNumber) => {
              if (item.idType === IdentityTypeEnum.NIN || item.idType === IdentityTypeEnum.IQAMA) {
                this.isIdentity = true;
              }
            });
          })
        )
        .subscribe(noop);
    }
  }

  /**
   * This method is to fetch contributor status if any and bank details of person
   */
  getActiveStatusAndBankDetails() {
    if (this.person.personId) {
      this.changePersonService.getActiveStatus(this.person.personId).subscribe(
        engagement => {
          if (engagement && engagement !== null) {
            this.socialInsuranceNo = engagement.socialInsuranceNo;
            this.active = engagement.active;
            this.isContributor = true;
          } else {
            this.isContributor = false;
          }
          // Show the profile view only if api is success
          this.showProfile = true;
          this.alertService.clearAlerts();
        },
        err => {
          this.showErrorMessage(err);
          this.isContributor = false;
        }
      );
    }

    this.changePersonService.getBankDetails(this.person.personId).subscribe(bankRes => {
      if (bankRes) {
        bindToObject(this.bankDetails, bankRes);
        if (this.bankDetails.isNonSaudiIBAN === false) {
          {
            if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
              this.isIbanVerified = false;
            }
            if (this.bankDetails.ibanBankAccountNo !== null) {
              this.getBank(this.bankDetails.ibanBankAccountNo.slice(4, 6));
            }
          }
        } else {
          if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
            this.isIbanVerified = false;
          }
        }
      }
    });
  }

  /**
   * Method to get reference the of the contact form from child
   * @param childForm
   */
  bindToContactForm(childForm: FormGroup) {
    this.contactForm = new FormGroup({});
    this.contactForm.addControl('contactDetail', childForm);
  }

  /**
   *Method to get reference the of the bank form from child
   * @param bankForm
   */
  bindToBankForm(bankForm) {
    this.bankParentForm = new FormGroup({});
    this.bankParentForm.addControl('bankForm', bankForm);
  }

  /** ------------------Functionalities----------------------- */

  /**
   * Method to save education data
   */
  saveEducation() {
    if (this.educationForm) {
      this.educationForm.markAllAsTouched();
      if (this.educationForm.valid) {
        this.educationForm.markAsUntouched();
        this.changePersonService
          .patchPersonEducationDetails(this.person.personId, this.educationForm.getRawValue())
          .subscribe(
            res => {
              if (res) {
                if (res.bilingualMessage) {
                  this.alertService.showSuccess(res.bilingualMessage);
                }
                bindToObject(this.person, this.educationForm.getRawValue());
              }
              this.commonModalRef.hide();
            },
            err => {
              this.showErrorMessage(err);
              bindToForm(this.educationForm, this.person);
              this.commonModalRef.hide();
            }
          );
      }
    }
  }

  /**
   * Method to save Contact Details
   */
  saveContact() {
    if (this.contactForm) {
      this.contactForm.markAllAsTouched();
      if ((<FormGroup>this.contactForm.get('contactDetail')).valid) {
        if (
          (this.contactForm.get('contactDetail') as FormGroup).getRawValue().mobileNo.primary !==
          this.person.contactDetail.mobileNo.primary
            ? this.absherVerified
            : true
        ) {
          this.changePersonService
            .patchPersonContactDetails(
              this.person.personId,
              (this.contactForm.get('contactDetail') as FormGroup).getRawValue()
            )
            .subscribe(
              res => {
                if (res.bilingualMessage) {
                  this.alertService.showSuccess(res.bilingualMessage);
                  this.person.contactDetail = bindToObject(
                    this.person.contactDetail,
                    (this.contactForm.get('contactDetail') as FormGroup).getRawValue()
                  );
                }
                this.commonModalRef.hide();
              },
              err => {
                this.showErrorMessage(err);
                this.commonModalRef.hide();
              }
            );
        } else {
          this.contactForm.get('contactDetail').get('mobileNo').get('primary').setErrors({ verify: true });
          this.setError(MobileNotVerified);
        }
      } else {
        this.contactForm.get('contactDetail').updateValueAndValidity();
        this.setError(MandatoryErrorKey);
      }
    }
  }
  /**
   * Method to check the identity of the person
   */
  checkIdentity() {
    this.person.identity.forEach((item: NIN | Iqama | NationalId | Passport | BorderNumber) => {
      if (item.idType === IdentityTypeEnum.NIN || item.idType === IdentityTypeEnum.IQAMA) {
        this.isIdentity = true;
      } else {
        this.isIdentity = false;
      }
    });
  }
  /**
   * Method to handle the show otp Screen
   */
  showOtpScreen() {
    this.clearAlert();
    if (this.noOfIncorrectOtp === ManagePersonConstants.NO_OF_OTP_RETRIES) {
      this.isResend = true;
      this.setError(MaxEntriedReached);
    } else {
      this.isResend = false;
    }
    if (this.contactForm && this.contactForm.get('contactDetail')) {
      const mobileControl = this.contactForm.get('contactDetail').get('mobileNo').get('primary');
      mobileControl.markAsTouched();
      mobileControl.updateValueAndValidity();
      if (mobileControl.valid) {
        this.showOtp = !this.showOtp;
        this.isOtpValid = true;
      } else {
        this.setError(MandatoryErrorKey);
      }
    }
  }

  /**
   * Method to verify the mobile number in abhser with an otp
   */
  verifyOtp() {
    this.clearAlert();
    if (this.otpControl.value) {
      this.showOtp = false;
      this.isOtpValid = true;
      this.contactForm.get('contactDetail').get('mobileNoVerified').setValue(true);
      this.absherVerified = true;
      this.mobileVerifiedPage = true;
    } else if (this.otpControl.value === null || this.otpControl.value === '') {
      this.setError('CUSTOMER-INFORMATION.ERROR.OTP_ERROR_NO_OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    } else {
      this.setError('CUSTOMER-INFORMATION.ERROR.OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    }
  }

  //After verifiying mobile number continue to saving the contact details
  showEditScreen() {
    this.showOtp = false;
    this.mobileVerifiedPage = false;
  }

  /**
   * Method to resend the otp after 2 minutes
   */
  reSendOtp() {
    if (this.isOtpValid === false) {
      this.isOtpValid = true;
    }
    this.clearAlert();
    if (this.noOfIncorrectOtp === ManagePersonConstants.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
    } else {
      this.noOfIncorrectOtp += 1;
      this.isResend = false;
    }
  }

  saveAddress() {}

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof AddEstablishmentSCBaseComponent
   */
  getBank(iBanCode) {
    this.lookService.getBank(iBanCode).subscribe(
      res => (this.bankNameList = res.items[0]),
      err => this.showErrorMessage(err)
    );
  }

  //Method to save the bank details
  saveBankDetails() {
    let isDocumentUploaded = true;
    this.bankParentForm.get('bankForm').markAllAsTouched();
    this.bankParentForm.get('bankForm').updateValueAndValidity();
    if (this.bankParentForm.get('bankForm').get('isNonSaudiIBAN').value === true) {
      isDocumentUploaded = this.documentService.checkMandatoryDocuments(this.personDocumentList);
    }
    if (this.bankParentForm.get('bankForm').valid && isDocumentUploaded) {
      this.changePersonService
        .patchPersonBankDetails(this.person.personId, (<FormGroup>this.bankParentForm.get('bankForm')).getRawValue())
        .subscribe(
          res => {
            this.isIbanVerified = false;
            if (res.bilingualMessage) {
              this.hideBankModal();
              this.commonModalRef.content = 'BANK';
              this.alertService.showSuccess(res.bilingualMessage);
              bindToObject(this.bankDetails, (this.bankParentForm.get('bankForm') as FormGroup).getRawValue());
            }
          },
          err => {
            this.showErrorMessage(err);
            this.modalScroll();
          }
        );
    } else {
      if (!this.bankParentForm.get('bankForm').valid) {
        this.alertService.showMandatoryErrorMessage();
      } else {
        this.alertService.showMandatoryDocumentsError();
      }
      this.modalScroll();
    }
  }

  //Check if the resend has exceeded the defined limit
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === ManagePersonConstants.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
    }
  }

  /*---------------------------- Modal Utilities--------------------- */

  /**
   * Method to change the value of button click
   */
  back() {
    this.clearAlert();
    this.showOtp = false;
    this.isResend = true;
  }

  /**
   * This method is used to show the education modal
   * @param modalRef
   */
  showEducationModal(modalRef: TemplateRef<HTMLElement>) {
    bindToForm(this.educationForm, this.person);
    this.showModal(modalRef);
  }

  /**
   * This method is used to show the contact modal
   * @param modalRef
   */
  showContactModal(modalRef: TemplateRef<HTMLElement>) {
    this.isResend = true;
    this.mobileVerifiedPage = false;
    this.showModal(modalRef, 'xl');
  }
  /**
   * This method is used to show the bank details modal
   * @param modalRef
   */
  showBankDetailsModal(modalRef: TemplateRef<HTMLElement>) {
    this.changePersonService.getBeneficiaryDetails(this.person.personId).subscribe(
      res => {
        if (res) {
          if (res.isEditable === true) {
            this.alertService.clearAlerts();
            this.showModal(modalRef);
          } else {
            this.showErrorMessage({ error: { message: res.errorMessage } });
          }
          this.getDocumentList();
        }
      },
      err => this.showErrorMessage(err)
    );
  }

  navigateToAddress() {
    this.manageRoutingService.navigateToUpdateAddress();
  }

  //Method to hide the contact modal
  hideContactModal() {
    this.isResend = true;
    this.noOfIncorrectOtp = 0;
    this.hideModal();
  }

  //Method to hide the bank modal
  hideBankModal() {
    this.hideModal();
  }

  /**
   * This method is to set error messages.
   */

  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }
}
