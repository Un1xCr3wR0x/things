import {
  Component,
  OnInit,
  Inject,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  AlertService,
  ContactDetails,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  checkNull,
  BilingualText,
  scrollToTop
} from '@gosi-ui/core';
import { ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { noop } from 'rxjs';
import { MbRouteConstants, MbProfile, ContractData, SamaStatusConstants } from '../../../shared';
import { DoctorService } from '../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { clearAlerts } from '../../../shared/utils/medicalboard';
const MaxEntriedReached = 'MEDICAL-BOARD.OTP-EXCEED-INFO';

@Component({
  selector: 'mb-doctor-contact-sc',
  templateUrl: './doctor-contact-sc.component.html',
  styleUrls: ['./doctor-contact-sc.component.scss']
})
export class DoctorContactScComponent implements OnInit, OnDestroy {
  person: MbProfile;
  memberperson: ContractData;
  modalRef: BsModalRef;
  identificationNo: number;
  isGccPerson = false;
  otpContract = false;
  isValid: boolean;
  errorRes: BilingualText;
  uuid: string;
  mob: string;
  Otpres: BilingualText;
  xOtp: string;
  contactDetailsForm: FormGroup;

  /** Input Variables. */
  @Input() canEdit: boolean;
  @Input() editContact: boolean;
  @Input() contactDetail: ContactDetails;
  @Input() parentForm: FormGroup;
  /** Output Variables. */
  @Output() cancel = new EventEmitter<null>();
  @Output() error = new EventEmitter<null>();

  /**
   * OTP related variables
   */
  noOfIncorrectOtp = 0;
  inCorrectOtp = 0;
  displayAlert = false;
  showOtpError: boolean;
  otpErrorMessageKey: string;
  isResend = false; // Timer finished
  isInValid = false;
  isNullOtp = false;
  isOtpValid: boolean; // Check the validity
  disabledOTP = false;
  minutes = 4;
  errorMsg = false;
  mobileVerifiedPage = false; // Mobile verified successfull
  verifyOtpForm: FormGroup = new FormGroup({});
  absherVerified = true; //Field to check if the mobile number has been verified with abhser
  noOfResend = SamaStatusConstants.NO_OF_OTP_RETRIES; // Maximum no of resend possible

  /** Child components. */
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;
  professionalId: number;

  /** OTP CANCEL TEMPLATE */
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  /** Creates an instance of CancelVicScComponent. */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly doctorService: DoctorService,
    private location: Location,
    readonly router: Router,
    readonly route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.getPersonContractInAPP(this.identificationNo);
    } else {
      this.getPersonDetails(this.identificationNo);
      this.getPersonContract(this.identificationNo);
    }
    this.verifyOtpForm = this.fb.group({
      identity: [null, Validators.required],
      otp: [null, Validators.required]
    });
  }

  getPersonContract(identificationNo) {
    this.doctorService.getContractDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
        this.doctorService.setmbProfessionalId(this.memberperson?.contracts[0].mbProfessionalId);
      },
      err => this.showErrorMessage(err)
    );
  }
  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
        this.mob = res?.contactDetail?.mobileNo?.primary;
      },
      err => this.showErrorMessage(err)
    );
  }
  getPersonContractInAPP(identificationNo) {
    this.doctorService.getContractMemberDetail(identificationNo).subscribe(
      res => {
        this.person = res;
      },
      err => this.showErrorMessage(err)
    );
  }

  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  navigatetosaveContractContact(contactDetail) {
    this.alertService.clearAlerts();
    if(!this.memberperson) this.memberperson = new ContractData()
    this.memberperson.contactDetail = contactDetail;
    this.professionalId = this.memberperson?.contracts[0]?.mbProfessionalId;
    this.doctorService
      .saveContactDetailsContrcat(this.memberperson, this.identificationNo)
      .pipe(
        tap(res => {
          this.doctorService.responseMessage = res.bilingualMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showErrorMessage(err);
      });
  }
  saveContact(contactDetail) {
    this.alertService.clearAlerts();
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.memberperson.contactDetail = contactDetail;
      this.professionalId = this.memberperson?.contracts[0].mbProfessionalId;
    }
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.person.contactDetail = contactDetail;
      this.professionalId = this.person?.contracts[0].mbProfessionalId;
      this.otpContract = true;
      this.doctorService.getOTPForContact(this.identificationNo).subscribe(
        res => {
          this.Otpres = res;
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
    } else {
      this.doctorService
        .saveContactDetails(this.memberperson, this.professionalId)
        .pipe(
          tap(res => {
            this.doctorService.responseMessage = res.bilingualMessage;
            this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
          })
        )
        .subscribe(noop, err => {
          this.showErrorMessage(err);
        });
    }
  }
  showError() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }

  /** Method to handle cancellation of contact detail. */
  popUpCancel(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }

  /** Method to confirm cancellation. */
  confirmCancel() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }

  decline() {
    this.modalRef.hide();
  }
  saveContactDetaisContract() {
    let contact = new ContactDetails();
    contact = this.contactDcComponent.contactDetailsForm.getRawValue();
    if (!this.contactDcComponent.contactDetailsForm.invalid) this.navigatetosaveContractContact(contact);
    else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to save contact details. */
  saveContactDetais() {
    let contact = new ContactDetails();
    contact = this.contactDcComponent.contactDetailsForm.getRawValue();
    if (!this.contactDcComponent.contactDetailsForm.invalid) this.saveContact(contact);
    else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  //OTP check for contact
  /** Method to verify the mobile number in abhser with an otp. */
  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.xOtp = this.uuid + ':' + otpValue;
    this.doctorService.verifyOTP(this.identificationNo, this.xOtp).subscribe(
      data => {
        //this.contributorService.authorization = data.headers.get('Authorization');
        this.alertService.clearAlerts();
        this.saveContactDetaisContract();
      },
      err => this.showAlertDetails(err)
    );
  }
  showAlertDetails(err): void {
    if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
    else this.showErrorOTP(err);
  }
  showErrorOTP(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  /** Method to resend otp. */
  reSendOTP() {
    this.doctorService.reSendOTP(this.uuid, false).subscribe({
      error: err => (this.errorRes = err['error']['message'])
    });
  }
  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpError = false;
    this.errorMsg = false;
  }
  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === SamaStatusConstants.NO_OF_OTP_RETRIES) {
      this.displayAlert = true;
      this.setError(MaxEntriedReached);
    }
    this.isResend = true;
    this.isInValid = false;
    this.isNullOtp = false;
  }
  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }
  /* on verify click verify OTP.
  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.showModal(this.cancelTemplate);
  }
  /** This method is to show the modal reference */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.modalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  confirm() {
    this.modalRef.hide();
    this.routeBack();
    this.alertService.clearAlerts();
  }
  /** Method to router back to previous page */
  routeBack() {
    this.location.back();
  }
  /** Method to handle clearing alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
