/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  Contributor,
  DocumentService,
  GosiCalendar,
  LookupService,
  OTPService,
  OtpResponse,
  UuidGeneratorService,
  convertToYYYYMMDD,
  markFormGroupTouched,
  removeEscapeChar,
  scrollToTop,
  getArabicName,
  DocumentItem,
  DocumentClassificationEnum
} from '@gosi-ui/core';
import { Location } from '@angular/common';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ContactBaseHelperScComponent } from '../../../shared/components';
import { IdentityEnum } from '../../../shared/enums';
import { ComplaintRequest, ComplaintResponse } from '../../../shared/models';
import { ContactService, ValidatorService } from '../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ContributorService, PersonalInformation } from '@gosi-ui/features/contributor';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'ces-report-general-complaints-sc',
  templateUrl: './report-general-complaints-sc.component.html',
  styleUrls: ['./report-general-complaints-sc.component.scss']
})
export class ReportGeneralComplaintsScComponent extends ContactBaseHelperScComponent implements OnInit {
  /**
   * local variables
   *
   */
  otpForm: FormGroup = new FormGroup({});
  otpParentForm: FormGroup = new FormGroup({});
  verifyForm = new FormGroup({ vicSubmitCheck: new FormControl(false, { validators: Validators.requiredTrue }) });
  request: ComplaintRequest = new ComplaintRequest();
  isOtpValid: boolean;
  otpUuid = null;
  otp = null;
  otpCount = 0;
  isDanger = true;
  currentAlert: BilingualText[] = [];
  isResend = false;
  enableResend = false;
  cardSelected: any = false;
  showSuccess: boolean = false;
  showCustomerSpan: boolean = false;
  customerNin: any;
  customerDateofBirth: any;
  isFromSideMenu: boolean = true;
  nin: any;
  person: PersonalInformation;
  isVerify: boolean = false;
  isShowCustomerDetails: boolean = false;
  personInfo: any;
  isAdmin: boolean = false;
  iqamaNo: any;
  isShowNewEmployeeDetails: boolean = false;
  identity: any;
  dateofbirth: any;
  transactionIds: any;

  cardItems = [
    {
      name: {
        english: 'Complaint',
        arabic: 'شكوى'
      },
      url: 'assets/images/complaint.svg',
      newUrl: 'assets/images/Complaint-White.svg'
    },
    {
      name: {
        english: 'Suggestion',
        arabic: 'اقتراح'
      },
      url: 'assets/images/Suggestion.svg',
      newUrl: 'assets/images/Suggestion-White.svg'
    },
    {
      name: {
        english: 'Enquiry',
        arabic: 'استفسار'
      },
      url: 'assets/images/Enquiry.svg',
      newUrl: 'assets/images/Enquiry-White.svg'
    }
  ];
  /**
   *
   * @param formBuilder
   * @param alertService
   * @param lookUpService
   * @param documentService
   * @param appToken
   * @param uuidService
   * @param modalService
   * @param validatorService
   * @param contactService
   * @param otpService
   */
  constructor(
    readonly authTokenService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly documentService: DocumentService,
     readonly router: Router,
     readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidService: UuidGeneratorService,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly contactService: ContactService,
    readonly otpService: OTPService,
    readonly contributorService: ContributorService,
    readonly route: ActivatedRoute
  ) {
    super(
      formBuilder,
      validatorService,
      documentService,
      uuidService,
      alertService,
      lookUpService,
      modalService,
      appToken
    );
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {

    const personId = this.route.snapshot.paramMap.get('personId');
    const transactionId = this.route.snapshot.paramMap.get('transactionId');
    if(transactionId){
      this.transactionIds = transactionId;
    }
    if(personId){
      let sin: any;
      let i = this.changePersonService.getSocialInsuranceNo().subscribe(res=>{
        sin = res;
      });
      if(sin){
      this.changePersonService.getPersonRoles(sin).subscribe(res=>{
        
        let admin: any = res.personRoles;
        let isAdmin = admin.filter(item => item.role.english == 'Establishment Admin' && item.activ == true);
        if(isAdmin.length > 0){
          this.isAdmin = true;
        }
      })
    }
    }
    if(personId){
      this.isFromSideMenu = false;
      this.isShowCustomerDetails = true;
      this.contactService.getPersonById(personId).subscribe(data => {
        this.personInfo = data;
        let identity: any = data.identity;
        let iqamaDetails = identity.filter(item => item.idType == 'IQAMA');
        let ninDetails = identity.filter(item => item.idType == 'NIN');
        if(iqamaDetails.length > 0){
        this.iqamaNo = iqamaDetails[0].iqamaNo;
        this.contactTypeForm.get('contactTypeForm.idNumber').setValue(this.iqamaNo);
        this.contactTypeForm.get('contactTypeForm.idType.english').setValue(IdentityEnum.IQAMA_NUMBER);
        }
        if(ninDetails.length > 0){
        this.nin = ninDetails[0].newNin;
        this.customerNin = ninDetails[0].newNin;
        this.contactTypeForm.get('contactTypeForm.idNumber').setValue(this.nin);
        this.contactTypeForm.get('contactTypeForm.idType.english').setValue(IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER);
        }
        this.contactTypeForm.get('contactTypeForm.name').setValue(getArabicName(data.name.arabic));
        this.contactTypeForm.get('contactTypeForm.birthDate.hijiri').setValue(data.birthDate.hijiri);
        this.contactTypeForm.get('contactTypeForm.birthDate.gregorian').setValue(data.birthDate.gregorian);
        this.contactTypeForm.get('contactTypeForm.email').setValue(data.contactDetail?.emailId?.primary);
        this.contactTypeForm.get('contactTypeForm.mobileNo.isdCodePrimary').setValue(data.contactDetail?.mobileNo?.isdCodePrimary);
        this.contactTypeForm.get('contactTypeForm.mobileNo.primary').setValue(data.contactDetail?.mobileNo?.primary);
      });
    }

    super.ngOnInit();
    this.alertService.clearAlerts();
  }
  /**
   * method for back button
   */
  onBack() {}
  categoryClicked(category) {}
  isCardSelected(event) {
    this.cardSelected = event;
  }
  onRouteback() {
    this.location.back();
  }
  /**
   * method for otp time exceeds
   */
  hasTimeExceeded() {}
  /**
   * method to verify otp
   */
  onVerify() {
    if (this.otpForm?.valid) {
      this.isOtpValid = true;
      this.otp = `${this.otpUuid}:${this.otpForm?.value?.otpForm?.otp}`;
      this.onSubmitComplaint(null, true);
    }
  }
  /**
   * method to resend otp
   */
  reSendOtp() {
    this.otpService.reSendOTP(this.otpUuid).subscribe(
      (response: OtpResponse) => {
        this.isResend = response.resend;
        if (response?.resend) {
          this.isOtpValid = true;
          this.enableResend = false;
        }
        this.currentAlert = [];
        this.currentAlert.push(response.message);
      },
      error => {
        this.resetOTP();
        this.showAlerts(error);
      }
    );
  }
  /**
   * method to submit txn
   */
  onClicking(event){
    this.commentForm.get('checkBoxForUpload').clearValidators();
    if(this.commentForm.get('checkBoxForUpload').value){
      this.commentForm.get('csrComment').setValidators(Validators.required);
    }else {
      this.commentForm.get('csrComment').clearValidators();
    }
    this.commentForm.get('csrComment').markAsUntouched();
    this.commentForm.get('csrComment').markAsPristine();
    this.commentForm.get('csrComment').updateValueAndValidity();
  }
  onSubmitComplaint(template: TemplateRef<HTMLElement>, isVerify = false) {
    this.alertService.clearAlerts();
    this.verifyForm.get('vicSubmitCheck').markAsTouched();
    this.contactForm.get('categoryForm')?.get('message').markAsTouched();
    this.verifyForm.updateValueAndValidity();
    this.contactForm.updateValueAndValidity();
    this.commentForm.updateValueAndValidity();
    this.contactTypeForm.updateValueAndValidity();
    if (
      this.contactForm?.get('categoryForm')?.get('type')?.get('english')?.value &&
      this.contactForm?.get('categoryForm')?.get('category')?.get('english')?.value &&
      this.commentForm.valid &&
      this.contactTypeForm.valid && this.contactForm?.get('categoryForm')?.get('message').value
    ) {
      this.request = {
        category: this.transactionIds ? 'Complaint' : this.contactForm?.value?.categoryForm?.category?.english,
        type: this.transactionIds ? 'Follow up Request' :this.contactForm?.value?.categoryForm?.type?.english,
        subType: this.contactForm?.value?.categoryForm?.subType?.english,
        description: removeEscapeChar(this.contactForm?.value?.categoryForm?.message),
        complainant: null,
        registrationNo: null,
        registrationNos: null,

        transactionRefNo: this.transactionIds ? this.transactionIds: this.contactForm?.value?.categoryForm?.complaintSubType?.english,
        uuid: this.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? this.uuid : null,
        complainantDetails: {
          name: this.contactTypeForm?.value?.contactTypeForm?.name,
          birthDate: {
            gregorian: convertToYYYYMMDD(
              moment(this.contactTypeForm?.value?.contactTypeForm?.birthDate.gregorian).toString()
            ),
            hijiri: '1415-01-01'
          },
          identity: {
            idType:
              this.contactTypeForm?.value?.contactTypeForm?.idType?.english ===
              IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
                ? IdentityEnum.NIN
                : this.contactTypeForm?.value?.contactTypeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
                ? IdentityEnum.IQAMA
                : '',
            iqamaNo:
              this.contactTypeForm?.value?.contactTypeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
                ? this.contactTypeForm?.value?.contactTypeForm?.idNumber?.toString()
                : '',
            newNin:
              this.contactTypeForm?.value?.contactTypeForm?.idType?.english ===
              IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
                ? this.contactTypeForm?.value?.contactTypeForm?.idNumber?.toString()
                : ''
          },
          contactDetail: {
            email: this.contactTypeForm?.value?.contactTypeForm?.email,
            phoneNo: this.contactTypeForm?.value?.contactTypeForm?.mobileNo?.primary 
            ? this.contactTypeForm?.value?.contactTypeForm?.mobileNo?.primary 
            : (this.person ? this.person?.contactDetail?.mobileNo?.primary : this.personInfo?.contactDetail?.mobileNo?.primary)
          }
        },
        csrComment: removeEscapeChar(this.commentForm?.value?.csrComment),
        isReturned: this.commentForm?.value.checkBoxForUpload,
        isEstAdminOrOwner: this.isAdmin,
      };
      this.contactService.submitRequest(this.request, this.otp).subscribe(
        (complaintResponse: ComplaintResponse) => {
           this.modalRef.hide();
           if(!this.route.snapshot.paramMap.get('personId')){
            this.router.navigate([`/home/complaints/register/general`]);
            this.resetPage();
           }
           else{
          if(this.nin != undefined){
            this.router.navigate([`/home/profile/individual/internal/${this.nin}/overview`]);
            }else if(this.iqamaNo != undefined){
             this.router.navigate([`/home/profile/individual/internal/${this.iqamaNo}/overview`]);
            }
          }
          this.alertService.showSuccess(complaintResponse.message);
          // this.resetPage();
        },
        error => {
          let showPopup = false;
          if (error?.error?.uuid) {
            this.otpUuid = error.error.uuid;
            if (template) {
              showPopup = true;
              this.openPopupWindow(template);
            }
          } else if (error?.error?.verified === false) {
            this.isOtpValid = false;
          } else if (
            error.status === 422 &&
            (error.error.code === 'COM-ERR-1014' || error.error.code === 'COM-ERR-1029')
          ) {
            this.resetOTP();
            showPopup = true;
          } else if (error.status === 400) {
            this.resetOTP();
            showPopup = true;
          }
          if (isVerify && showPopup) {
            this.showAlerts(error);
          } else if (isVerify) {
            this.isOtpValid = false;
            this.currentAlert = [];
            this.currentAlert.push(error?.error?.message);
            this.isResend = false;
          } else if (!showPopup) {
            this.otp = null;
            this.isOtpValid = true;
            this.otpUuid = null;
            this.otpParentForm.reset();
            this.otpForm.reset();
            this.currentAlert = [];
            this.showAlerts(error);
          }
        }
      );
    } else {
      markFormGroupTouched(this.contactForm);
      markFormGroupTouched(this.commentForm);
      markFormGroupTouched(this.contactTypeForm);
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   *
   * @param error method to show alerts
   */
  showAlerts(error) {
    this.alertService.showError(error?.error?.message);
  }
  /**
   * method to cancel otp form
   */
  onCancelOTP() {
    this.modalRef?.hide();
    this.otp = null;
    this.otpUuid = null;
    this.isOtpValid = null;
    this.currentAlert = [];
    this.otpParentForm.reset();
    this.otpForm.reset();
  }
  /**
   * method to reset otp form
   */
  resetOTP() {
    this.modalRef?.hide();
    this.otp = null;
    this.otpUuid = null;
    this.isOtpValid = true;
    this.currentAlert = [];
    this.otpParentForm.reset();
    this.otpForm.reset();
  }
  /**
   * method to confirm cancel
   */
  confirmGeneralCancel() {
    this.alertService.clearAlerts();
    this.resetPage();
    this.modalRef?.hide();
    this.onRouteback();
  }
  /**
   * method to reset all forms and page
   */
  resetPage() {
    if(!this.route.snapshot.paramMap.get('personId')){
      this.isFromSideMenu = true;
      this.isVerify = false;
      this.isShowCustomerDetails = false;
     }else if(this.route.snapshot.paramMap.get('transactionId')){
      if(this.nin != undefined){
        this.router.navigate([`/home/profile/individual/internal/${this.nin}/transaction-history`]);
        }else if(this.iqamaNo != undefined){
         this.router.navigate([`/home/profile/individual/internal/${this.iqamaNo}/transaction-history`]);
        }
     }
     else{
      this.router.navigate([`/dashboard/search/individual`]);
     }
    // this.isFromSideMenu = true;
    // this.isVerify = false;
    // this.isShowCustomerDetails = false;
    this.contactForm.reset();
    this.otpParentForm.reset();
    this.otpForm.reset();
    this.contactTypeForm.reset();
    this.commentForm.reset();
    this.generateUuid();
    this.otp = null;
    this.otpUuid = null;
    this.isOtpValid = true;
    this.isTypeSelected = false;
    this.isSubTypeSelected = false;
    this.isCategorySelected = false;
    this.uploadDocuments = [];
    this.currentAlert = [];
    this.category = null;
  }

  /** Method to search vic person. */
  searchSaudiPerson(queryParam: string, personDetails: any): void {
    this.alertService.clearAlerts();
    this.dateofbirth = personDetails.birthDate;
    this.identity = personDetails.identity;
    if(personDetails.identity[0].idType == 'NIN'){
    this.nin = personDetails.identity[0].newNin;
    }
    else if(personDetails.identity[0].idType == 'IQAMA'){
      this.nin = personDetails.identity[0].iqamaNo;
    }
    this.contributorService
      .getPersonDetails(queryParam, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          let contributor = new Contributor();
          if (res) {
            this.person = contributor.person = res;
            this.isVerify = true;
            this.isShowCustomerDetails = true;
            //this.getSpecilationLovList();
          }
        }),
        switchMap(res => {
          if (res.personId)
            //To check sin for existing contributor
            return this.contributorService.setSin(this.person.personId).pipe(
              tap(response => {
                if (response) {
                  //this.socialInsuranceNo = response.socialInsuranceNo;
                  //this.checkPreviousVicEngagementInCurrentYear().subscribe();
                }
              })
            );
        })
      )
      .subscribe({
        next: () => {
         // this.activeTab++;
          this.alertService.clearAllErrorAlerts();
        },
        error: err => {
          
          if(err.status == 400){
            this.isVerify = true;
            this.isShowNewEmployeeDetails = true;
            this.isShowCustomerDetails = true;
            if(this.identity[0].newNin){
              this.nin = personDetails.identity[0].newNin;
              }
              else if(this.identity[0].iqamaNo){
                this.nin = personDetails.identity[0].iqamaNo;
              }
            
          }
        }//this.showError(err)
      });
  }

  /**Method to reset saudi search */
  resetSaudiSearch(): void {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.hideModal();
    if (this.verifyForm.get('saudiSearch')) {
      this.verifyForm.get('saudiSearch').reset();
      this.verifyForm.get('saudiSearch.calenderType.english').reset('Gregorian');
    }
  }

  isAdminorNot(evnt) {
    this.cardSelected = false;
    this.isTypeSelected = false;
    this.isSubTypeSelected = false;
    this.isCategorySelected = false;
    this.uploadDocuments = [];
    this.currentAlert = [];
    this.category = null;
    if(evnt == 'Establishment Admin' || evnt == 'Establishment Owner'){
      this.isAdmin = true;
    }
    else{
      this.isAdmin = false;
    }
  }
  getRequiredDocuments() {
    this.getDocumentDetails().subscribe((documentResponse: DocumentItem[]) => {
      if (this.customerIdentity) {
        documentResponse = documentResponse.filter(
          item => item.documentClassification === DocumentClassificationEnum.EXTERNAL
        );
      }
      documentResponse.forEach(item => {
        item.uuid = this.uuid;
        item.sequenceNumber = this.sequenceNumber;

        if (this.customerIdentity) item.userAccessList.push(`${this.customerIdentity}`);
        else{
          item.userAccessList.push(`${this.contactTypeForm.get('contactTypeForm.idNumber').value}`);
          
        }
        
        
        this.uploadDocuments.push(item);
      });
      this.sequenceNumber++;
    });
  }
}
