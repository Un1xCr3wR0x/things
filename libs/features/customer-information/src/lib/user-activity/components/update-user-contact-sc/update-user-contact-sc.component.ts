import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthTokenService, BilingualText, JWTPayload, LanguageToken, Lov, LovList, emailValidator } from '@gosi-ui/core';
import { ManagePersonService } from '../../../shared';
import { UpdateUserContactService } from '../../../shared/services/update-user-contact.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ContactResponse, PersonContact, VerifyContactResponse } from '../../../shared/models/person-contact';
import { ContactEstablishment } from '../../../shared/models/establishment';

@Component({
  selector: 'cim-update-user-contact-sc',
  templateUrl: './update-user-contact-sc.component.html',
  styleUrls: ['./update-user-contact-sc.component.scss']
})
export class UpdateUserContactScComponent implements OnInit {

  modalRef: BsModalRef;
  contactForm: FormGroup;
  token: JWTPayload = this.authService.decodeToken(this.authService.getAuthToken());
  mobileNo: string;
  isdCode: string;
  email: string;
  mobileUuid: string;
  emailUuid: string;
  mobileOpt: number;
  emailOtp: number;
  isValid: boolean = true;
  noOfEstablishments: number;
  establishmentsList: Lov[] = [];
  establishmentsDetailsList: Lov[] = [];
  selectedEstablishments: BilingualText[] = [];
  dropDownEstablishmentsList: LovList;
  selectedEstablishmentsList: any;
  selectedEstablishmentsToBeModified: BilingualText[] = [];
  contactDetailsList: ContactResponse[] = [];
  registrationNoList: string[] = [];
  lang = 'en';
  min: number;
  sec: number;
  currentContactId: number;
  selectedContactId: string;
  selectedContactMoblieNo: string;
  selectedContactEmail: string;
  selectedIsdCode: string;
  modifiedContactMoblieNo: string;
  modifiedContactEmail: string;
  modifiedIsdCode: string
  isResend: boolean = true;
  intervalId: number;
  contactEstablishments: ContactEstablishment[] = []
  isAddContactSuccess: boolean = false;
  isUpdateEstablishmentSuccess: boolean = false;
  isUpdateContactSuccess: boolean = false;
  isDeleteContactSuccess: boolean = false;
  isClose: boolean = false;

  @ViewChild('addMobileNumberPopUp', { static: true })
  addMobileNumberPopUp: TemplateRef<HTMLElement>;
  @ViewChild('addEmailPopUp', { static: true })
  addEmailPopUp: TemplateRef<HTMLElement>;
  @ViewChild('linkEstablishmentPopUp', { static: true })
  linkEstablishmentPopUp: TemplateRef<HTMLElement>;
  @ViewChild('deleteContactPopUp', { static: true })
  deleteContactPopUp: TemplateRef<HTMLElement>;
  @ViewChild('verifyMobilePopUp', { static: true })
  verifyMobilePopUp: TemplateRef<HTMLElement>;
  @ViewChild('verifyEmailPopUp', { static: true })
  verifyEmailPopUp: TemplateRef<HTMLElement>;
  @ViewChild('modifyEstablishmentPopUp', { static: true })
  modifyEstablishmentPopUp: TemplateRef<HTMLElement>;
  @ViewChild('modifyEmailPopUp', { static: true })
  modifyEmailPopUp: TemplateRef<HTMLElement>;
  @ViewChild('modifyMobileNumberPopUp', { static: true })
  modifyMobileNumberPopUp: TemplateRef<HTMLElement>;
  @ViewChild('verifyMobileModificationPopUp', { static: true })
  verifyMobileModificationPopUp: TemplateRef<HTMLElement>;
  @ViewChild('verifyEmailModificationPopUp', { static: true })
  verifyEmailModificationPopUp: TemplateRef<HTMLElement>;

  constructor(readonly fb: FormBuilder,
    readonly validatorService: ManagePersonService,
    readonly authService: AuthTokenService,
    readonly updateContactService: UpdateUserContactService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) { }


  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.contactForm = this.createContactForm();
    this.getEstablishmentList();
  }
  closePopUp() {
    this.isClose=false
    this.alertService.clearAlerts();
    this.stopResendOTP()
    this.modalService.hide();
  }
  showPopUp(template: TemplateRef<HTMLElement>) {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = this.modalService.show(template, { backdrop: "static", class: "modal-dialog-centered" });
    } else {
      this.modalRef = this.modalService.show(template, { backdrop: "static", class: "modal-dialog-centered" });
    }
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      mobileNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
          ]),
          updateOn: 'blur'
        }
      ],

      isdCode: ['sa', { updateOn: 'blur' }],
      email: [
        null,
        {
          validators: Validators.compose([
            Validators.maxLength(35),
            Validators.required,
            emailValidator
          ]),
          updateOn: 'blur'
        }
      ],
      otp: [
        null,
        {
          updateOn: 'blur'
        }
      ],
      establishmentList: this.fb.group({
        english: [null],
        arabic: [null]
      }),
    });
  }
  showHideEst(contactId: string) {
    const contactCard = document.getElementById(`estDiv${contactId}`) as HTMLElement;
    if (contactCard.style.display == "none") {
      contactCard.style.display = "";
    } else {
      contactCard.style.display = "none";
    }
  }
  addContacts() {
    this.contactForm.get('mobileNo').setValue(null);
    this.contactForm.get('isdCode').setValue('sa');
    this.contactForm.get('email').setValue(null);
    this.contactForm.get('otp').setValue(null)
    this.isAddContactSuccess = false;
    this.currentContactId = undefined;
    this.showPopUp(this.addMobileNumberPopUp);
  }
  addMobileNo() {
    this.alertService.clearAlerts();
    const personId = this.token.uid;
    this.mobileNo = this.contactForm.get('mobileNo').value;
    this.isdCode = this.mappingCountryCode(this.contactForm.get('isdCode').value);
    this.updateContactService.addMobileNo(personId, this.mobileNo
      , this.isdCode)
      .subscribe(() => { }, res => {
        if (res.status == 403) {
          this.mobileUuid = res.error.mobile_otp_transaction.uuid;
          this.alertService.showInfo({
            english: `OTP has been send to the registered number +${this.isdCode}${this.mobileNo}`,
            arabic: `تم ارسال رمز التحقق لرقم الجوال المسجل ${this.isdCode}${this.mobileNo}+`
          })
          this.startResendOTP();
          this.showPopUp(this.verifyMobilePopUp);
        }
      })
  }
  verifyMobileNo() {
    const personId = this.token.uid;
    this.mobileOpt = this.contactForm.get('otp').value;
    if (!this.mobileOpt) {
      this.isValid = false
    } else {
      this.updateContactService.verifyMobileNo(personId, this.mobileOpt, this.mobileNo, this.isdCode, this.mobileUuid)
        .subscribe(() => { }, res => {
          this.isValid = true
          if (res.status == 403) {
            if (res.error.mobile_otp_transaction.verified == true) {
              this.isValid = true;
              this.stopResendOTP();
              this.showPopUp(this.addEmailPopUp);
            } else if (res.error.mobile_otp_transaction.verified == false) {
              this.alertService.clearAllInfoAlerts();
              this.isValid = false;
              this.alertService.showErrorByKey('CUSTOMER-INFORMATION.INVALID-MOBILE-OTP-MSG', null, 10, null, true)
            } else if (res.error.mobile_otp_transaction.code == 'COM-ERR-1014') {
              this.stopResendOTP();
              this.isResend = false;
              this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
            }else if(res.error.mobile_otp_transaction.code == 'COM-ERR-1031'){
              this.isClose=true
              this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NUMBER-OF-ATTEMPS-ERROR',null,10,null,true)
            }else if(res.error.mobile_otp_transaction.code == 'COM-ERR-1029'){
              this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-ALREADY-VERIFIED',null,10,null,true)
            }else if(res.error.mobile_otp_transaction.code == 'COM-ERR-1014'){
              this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
            }else {
              this.alertService.showError(res.error.mobile_otp_transaction.message)
            }
          }
        })
    }

  }
  addEmail() {
    this.alertService.clearAlerts();
    const personId = this.token.uid;
    this.email = this.contactForm.get('email').value;
    this.updateContactService.addEmail(personId, this.email, this.mobileUuid, this.mobileOpt)
      .subscribe(() => { }, res => {
        if (res.status == 403) {
          this.emailUuid = res.error.email_otp_transaction.uuid;
          this.alertService.showInfo({
            english: `OTP has been send to the registered Email ${this.email}`,
            arabic: ` تم إرسال رمز التحقق للبريد الإلكتروني المسجل ${this.email}`
          })
          this.startResendOTP();
          this.showPopUp(this.verifyEmailPopUp);
        }
      })
  }
  verifyEmail() {
    const personId = this.token.uid;
    this.emailOtp = this.contactForm.get('otp').value;
    if (!this.emailOtp) {
      this.isValid = false
    } else {
      this.updateContactService.verifyEmail(personId, this.mobileOpt, this.mobileNo, this.isdCode, this.mobileUuid,
        this.emailOtp, this.email, this.emailUuid
      ).subscribe((res: VerifyContactResponse) => {
        this.currentContactId = res.contactId;
        this.alertService.clearAlerts();
        this.stopResendOTP()
        this.showPopUp(this.linkEstablishmentPopUp);
      }, error => {
        this.isValid = true
        if (error.status == 403) {
          if (error.error.email_otp_transaction.verified == false) {
            this.alertService.clearAllInfoAlerts();
            this.isValid = false;
            this.alertService.showErrorByKey('CUSTOMER-INFORMATION.INVALID-EMAIL-OTP-MSG', null, 10, null, true)
          } else if (error.error.email_otp_transaction.code == 'COM-ERR-1014') {
            this.stopResendOTP();
            this.isResend = false;
            this.alertService.showError(error.error.email_otp_transaction.message)
          } else if(error.error.email_otp_transaction.code == 'COM-ERR-1031'){
            this.isClose=true
            this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NUMBER-OF-ATTEMPS-ERROR',null,10,null,true)
          }else if(error.error.email_otp_transaction.code == 'COM-ERR-1029'){
            this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-ALREADY-VERIFIED',null,10,null,true)
          }else if(error.error.email_otp_transaction.code == 'COM-ERR-1014'){
            this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
          }else {
            this.alertService.showError(error.error.email_otp_transaction.message)
          }
        }
      })
    }
  }
  getEstablishmentList() {
    this.updateContactService.getNoOfEstablishments(this.token.uid).subscribe(res => {
      let dropdownListLabes = null;
      let establishmentsNames = null;
      res.listOfEstablishmentDetails.forEach(establishments => {
        if (!establishments.name.english) {
          dropdownListLabes = {
            english: `${establishments.name.arabic} ${establishments.registrationNo}`,
            arabic: `${establishments.name.arabic} ${establishments.registrationNo}`
          }
          establishmentsNames = {
            english: establishments.name.arabic,
            arabic: establishments.name.arabic
          }
        } else if (!establishments.name.arabic) {
          dropdownListLabes = {
            english: `${establishments.name.english} ${establishments.registrationNo}`,
            arabic: `${establishments.name.english} ${establishments.registrationNo}`
          }
          establishmentsNames = {
            english: establishments.name.english,
            arabic: establishments.name.english
          }
        } else {
          dropdownListLabes = {
            english: `${establishments.name.english} ${establishments.registrationNo}`,
            arabic: `${establishments.name.arabic} ${establishments.registrationNo}`
          }
          establishmentsNames = {
            english: establishments.name.english,
            arabic: establishments.name.arabic
          }
        }
        this.establishmentsList.push({ value: dropdownListLabes, sequence: establishments.registrationNo });
        this.establishmentsDetailsList.push({ value: establishmentsNames, sequence: establishments.registrationNo })
      })
      this.getContactDetailsList();
    });
    this.dropDownEstablishmentsList = new LovList(this.establishmentsList);
  }
  getContactDetailsList() {
    if (this.contactDetailsList.length > 0) this.contactDetailsList = []
    if (this.contactEstablishments.length > 0) this.contactEstablishments = []
    this.updateContactService.getContactList(this.token.uid).subscribe(res => {
      if (res.contactDetails) {
        this.contactDetailsList = res.contactDetails
      }
      this.contactDetailsList.forEach(contactDetails => {
        this.updateContactService.getContactEstablishment(this.token.uid, contactDetails.id).subscribe(res => {
          if (res.registrationNoList) {
            res.registrationNoList.forEach(regNo => {
              this.establishmentsDetailsList.forEach(establishment => {
                if (+regNo == establishment.sequence) {
                  this.contactEstablishments.push(
                    {
                      contactId: contactDetails.id,
                      establishmentName: establishment.value,
                      registrationNo: establishment.sequence.toString()
                    })
                }
              })
            })
          }
        })
      })
    })
  }
  linkContactToEstablishment() {
    if (this.registrationNoList.length > 0) this.registrationNoList = []
    if (this.selectedEstablishmentsList.length == 0) {
      this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NO-SELECTED-EST')
    } else {
      this.alertService.clearAlerts();
      this.selectedEstablishmentsList.forEach(establishment => {
        this.registrationNoList.push(establishment.sequence.toString())
      })
      this.updateContactService.linkContactToEstablishment(this.token.uid, this.currentContactId, this.registrationNoList)
        .subscribe(() => {
          this.isAddContactSuccess = true;
          this.isDeleteContactSuccess = false;
          this.isUpdateContactSuccess = false;
          this.isUpdateEstablishmentSuccess = false;
          this.getContactDetailsList();
          this.closePopUp();
        });
    }
  }
  modifyContactToEstablishment() {
    let registrationNoList: string[] = [];
    let selectedRegistrationNoList: string[] = [];
    this.contactEstablishments.forEach(contact => {
      if (contact.contactId == this.selectedContactId) {
        registrationNoList.push(contact.registrationNo)
      }
    })
    this.selectedEstablishmentsList.forEach(establishment => selectedRegistrationNoList.push(establishment.sequence.toString()));
    let deletedRegistrationNoList = registrationNoList.filter(regNo => !selectedRegistrationNoList.includes(regNo));
    let addedRegistrationNoList = selectedRegistrationNoList.filter(regNo => !registrationNoList.includes(regNo));
    if(deletedRegistrationNoList.length == 0 && addedRegistrationNoList.length ==0){
      this.alertService.showErrorByKey('CUSTOMER-INFORMATION.EST-NO-DATA-CHANGE',null,10,null,true)
    }else{
      if (deletedRegistrationNoList.length > 0 && addedRegistrationNoList.length > 0) {
        this.updateContactService.linkContactToEstablishment(this.token.uid, +this.selectedContactId, addedRegistrationNoList)
          .subscribe(() => {
            this.updateContactService.modifyContactToEstablishment(this.token.uid, +this.selectedContactId, deletedRegistrationNoList)
              .subscribe(() => {
                this.isUpdateEstablishmentSuccess = true;
                this.isDeleteContactSuccess = false;
                this.isAddContactSuccess = false;
                this.isUpdateContactSuccess = false;
                this.getContactDetailsList();
                this.closePopUp();
              });
          });
      } else if (addedRegistrationNoList.length > 0 && deletedRegistrationNoList.length == 0) {
        this.updateContactService.linkContactToEstablishment(this.token.uid, +this.selectedContactId, addedRegistrationNoList)
          .subscribe(() => {
            this.isUpdateEstablishmentSuccess = true;
            this.isDeleteContactSuccess = false;
            this.isAddContactSuccess = false;
            this.isUpdateContactSuccess = false;
            this.getContactDetailsList();
            this.closePopUp();
          });
      } else if (addedRegistrationNoList.length == 0 && deletedRegistrationNoList.length > 0) {
        this.updateContactService.modifyContactToEstablishment(this.token.uid, +this.selectedContactId, deletedRegistrationNoList)
          .subscribe(() => {
            this.isUpdateEstablishmentSuccess = true;
            this.isDeleteContactSuccess = false;
            this.isAddContactSuccess = false;
            this.isUpdateContactSuccess = false;
            this.getContactDetailsList();
            this.closePopUp();
          });
      }
    }
    
  }
  selectEstablishments(event) {
    this.selectedEstablishmentsList = event
  }
  showMobileNumberPopUp() {
    if (this.contactForm.get("mobileNo").valid) this.addMobileNo()
  }
  showEmailPopUp() {
    if (this.contactForm.get("email").valid) this.addEmail()
  }
  showModifyMobileNumberPopUp(contactId: string, mobileNo: string, isdCode: string): void {
    this.alertService.clearAlerts();
    this.contactForm.get("mobileNo").setValue(mobileNo);
    this.contactForm.get("isdCode").setValue(this.convertIsdCodeToLabels(+isdCode));
    this.selectedContactId = contactId;
    this.selectedContactMoblieNo = mobileNo;
    this.selectedIsdCode = isdCode;
    this.isUpdateContactSuccess = false;
    this.showPopUp(this.modifyMobileNumberPopUp);
    this.stopResendOTP();
  }
  showModifyEmailPopUp(contactId: string, email: string): void {
    this.alertService.clearAlerts();
    this.contactForm.get('email').setValue(email);
    this.selectedContactEmail = email;
    this.selectedContactId = contactId;
    this.isUpdateContactSuccess = false;
    this.showPopUp(this.modifyEmailPopUp);
    this.stopResendOTP();
  }
  showModifyEstablishmentPopUp(contactId: string): void {
    this.isUpdateEstablishmentSuccess = false;
    this.selectedContactId = contactId;
    if (this.selectedEstablishmentsToBeModified.length > 0) this.selectedEstablishmentsToBeModified = []
    this.alertService.clearAlerts();
    this.contactEstablishments.forEach(contact => {
      this.establishmentsList.forEach(establishment => {
        if (contact.contactId == contactId) {
          if (establishment.sequence.toString() == contact.registrationNo) {
            this.selectedEstablishmentsToBeModified.push(establishment.value)
          }
        }
      })
    })
    this.showPopUp(this.modifyEstablishmentPopUp)
  }
  showDeleteContactPopUp(contactId: string): void {
    this.selectedContactId = contactId;
    this.isDeleteContactSuccess = false
    this.alertService.clearAlerts();
    this.showPopUp(this.deleteContactPopUp);
  }
  validateModifyMobileNo() {
    if (`${this.contactForm.get("isdCode").value}${this.contactForm.get("mobileNo").value}` ==
      `${this.convertIsdCodeToLabels(+this.selectedIsdCode)}${this.selectedContactMoblieNo}`) {
      this.alertService.showErrorByKey('CUSTOMER-INFORMATION.MOBILE-NO-DATA-CHANGE')
    } else {
      if (this.contactForm.get("mobileNo").valid) {
        this.modifiedIsdCode = this.mappingCountryCode(this.modifiedIsdCode);
        this.modifiedContactMoblieNo = this.contactForm.get("mobileNo").value;
        this.alertService.clearAlerts()
        this.updateContactService.updateMobileNo(this.token.uid, this.selectedContactId,
          this.modifiedContactMoblieNo, this.mappingCountryCode(this.modifiedIsdCode).toString())
          .subscribe(() => { }, res => {
            if (res.status == 403) {
              this.mobileUuid = res.error.mobile_otp_transaction.uuid;
              this.alertService.showInfo({
                english: `OTP has been send to the registered number +${this.modifiedIsdCode}${this.modifiedContactMoblieNo}`,
                arabic: `تم ارسال رمز التحقق لرقم الجوال المسجل ${this.modifiedIsdCode}${this.modifiedContactMoblieNo}+`
              })
              this.startResendOTP()
              this.showPopUp(this.verifyMobileModificationPopUp)
            }
          })
      }
    }
  }
  verifyUpdatingMobileNo() {
    this.mobileOpt = this.contactForm.get('otp').value;
    if (!this.mobileOpt) {
      this.isValid = false;
    } else {
      this.updateContactService.verifyUpdateMobileOtp(this.token.uid, this.selectedContactId, this.modifiedContactMoblieNo
        , this.modifiedIsdCode, this.mobileOpt.toString(), this.mobileUuid).subscribe(
          () => {
            this.alertService.clearAllInfoAlerts();
            this.isValid = true;
            this.stopResendOTP();
            this.closePopUp();
            this.getContactDetailsList()
            this.isUpdateContactSuccess = true;
            this.isDeleteContactSuccess = false;
            this.isAddContactSuccess = false;
            this.isUpdateEstablishmentSuccess = false;
          },
          error => {
            this.isValid = true;
            if (error.status == 403) {
              if (error.error.mobile_otp_transaction.verified == false) {
                this.alertService.clearAllInfoAlerts();
                this.isValid = false;
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.INVALID-MOBILE-OTP-MSG',null,10,null,true)
              } else if (error.error.mobile_otp_transaction.code == 'COM-ERR-1014') {
                this.stopResendOTP();
                this.isResend = false;
                this.alertService.showError(error.error.mobile_otp_transaction.message)
              } else if(error.error.mobile_otp_transaction.code == 'COM-ERR-1031'){
                this.isClose=true
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NUMBER-OF-ATTEMPS-ERROR',null,10,null,true)
              }else if(error.error.mobile_otp_transaction.code == 'COM-ERR-1029'){
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-ALREADY-VERIFIED',null,10,null,true)
              }else if(error.error.mobile_otp_transaction.code == 'COM-ERR-1014'){
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
              }else if(error.error.mobile_otp_transaction.code == 'COM-ERR-1014'){
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
              }else {
                this.alertService.showError(error.error.mobile_otp_transaction.message)
              }
            }
          })
    }
  }
  validateModifyEmail() {
    if (this.contactForm.get("email").value == this.selectedContactEmail) {
      this.alertService.showErrorByKey('CUSTOMER-INFORMATION.EMAIL-NO-DATA-CHANGE')
    } else {
      if (this.contactForm.get("email").valid) {
        this.modifiedContactEmail = this.contactForm.get("email").value
        this.alertService.clearAlerts()
        this.updateContactService.updateEmail(this.token.uid, this.selectedContactId,
          this.modifiedContactEmail)
          .subscribe(() => { }, res => {
            if (res.status == 403) {
              this.emailUuid = res.error.email_otp_transaction.uuid;
              this.alertService.showInfo({
                english: `OTP has been send to the registered email ${this.modifiedContactEmail}`,
                arabic: `تم إرسال رمز التحقق للبريد الإلكتروني المسجل ${this.modifiedContactEmail}`
              })
              this.startResendOTP()
              this.showPopUp(this.verifyEmailModificationPopUp)
            }
          })
      }
    }
  }
  verifyUpdatingEmail() {
    this.emailOtp = this.contactForm.get('otp').value;
    if (!this.emailOtp) {
      this.isValid = false;
    } else {
      this.updateContactService.verifyUpdateEmailOtp(this.token.uid, this.selectedContactId,
        this.modifiedContactEmail, this.emailOtp.toString(), this.emailUuid).subscribe(
          () => {
            this.alertService.clearAllInfoAlerts();
            this.isValid = true;
            this.stopResendOTP();
            this.closePopUp();
            this.getContactDetailsList();
            this.isUpdateContactSuccess = true;
            this.isDeleteContactSuccess = false;
            this.isAddContactSuccess = false;
            this.isUpdateEstablishmentSuccess = false;
          },
          error => {
            this.isValid = true;
            if (error.status == 403) {
              if (error.error.email_otp_transaction.verified == false) {
                this.contactForm.get('otp').setValue(null)
                this.alertService.clearAllInfoAlerts();
                this.isValid = false;
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.INVALID-EMAIL-OTP-MSG',null,10,null,true)
              } else if (error.error.email_otp_transaction.code == 'COM-ERR-1014') {
                this.stopResendOTP();
                this.isResend = false;
                this.alertService.showError(error.error.email_otp_transaction.message)
              } else if(error.error.email_otp_transaction.code == 'COM-ERR-1031'){
                this.isClose=true
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NUMBER-OF-ATTEMPS-ERROR',null,10,null,true)
              }else if(error.error.email_otp_transaction.code == 'COM-ERR-1029'){
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-ALREADY-VERIFIED',null,10,null,true)
              }else if(error.error.email_otp_transaction.code == 'COM-ERR-1014'){
                this.alertService.showErrorByKey('CUSTOMER-INFORMATION.OTP-THREE-TIMES',null,10,null,true)
              }else {
                this.alertService.showError(error.error.email_otp_transaction.message)
              }
            }
          })
    }
  }
  startResendOTP() {
    this.min = 1;
    this.sec = 59;
    this.intervalId = setInterval(() => {
      this.isResend = false;
    }, (2 * 60 * 1000));
  }
  stopResendOTP() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isResend = true;
    }
  }
  resendOTP(uuid: string) {
    this.updateContactService.resendOTP(uuid).subscribe(() => {
      this.alertService.clearAllErrorAlerts()
      this.alertService.showWarningByKey('CUSTOMER-INFORMATION.OTP-RESENT',null,10,null,null)
      this.contactForm.get('otp').setValue(null)
      this.isResend = true;
      clearInterval(this.intervalId);
      this.startResendOTP();
    }, error => {
      this.alertService.showError(error.error.message)
    })
  }
  backToPopUp(template: TemplateRef<HTMLElement>){
    this.stopResendOTP();
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { backdrop: "static", class: "modal-dialog-centered" });
  }
  deleteContact() {
    this.updateContactService.deleteContact(this.token.uid, this.selectedContactId).subscribe(() => {
      this.isDeleteContactSuccess = true;
      this.isAddContactSuccess = false;
      this.isUpdateContactSuccess = false;
      this.isUpdateEstablishmentSuccess = false;
      this.getContactDetailsList();
      this.closePopUp()
    })
  }
  mappingCountryCode(isdCode: string) {
    switch (isdCode) {
      case 'sa':
        return '966'
      case 'kw':
        return '965'
      case 'qa':
        return '974'
      case 'bh':
        return '973'
      case 'ae':
        return '971'
      case 'om':
        return '968'
      default:
        return '966'
    }
  }
  convertIsdCodeToLabels(isdCode: number) {
    switch (isdCode) {
      case 966:
        return 'sa'
      case 965:
        return 'kw'
      case 974:
        return 'qa'
      case 973:
        return 'bh'
      case 971:
        return 'ae'
      case 968:
        return 'om'
      default:
        return 'sa'
    }
  }
}







