/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  iBanValidator,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  lengthValidator,
  Lov,
  LovList,
  markFormGroupTouched,
  NationalityTypeEnum,
  scrollToTop,
  setAddressFormToAddresses,
  Iqama,
  NationalId,
  Passport,
  NIN,
  BilingualText,
  Name,
  LookupService,
  GosiCalendar
} from '@gosi-ui/core';
import { NationalityCategoryEnum } from '@gosi-ui/features/establishment/lib/shared/enums';
import { AddressDcComponent, BankDetailsDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { noop, Observable } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { MBConstants, SamaStatusConstants } from '../../../shared/constants';
import { MemberData, MbProfile, MemberDetails } from '../../../shared/models';
import { MedicalBoardService, SamaStatusEnum } from '../../../shared';
import { PersonBankDetails } from '@gosi-ui/features/benefits/lib/shared/models/person-bank-details';

@Component({
  selector: 'mb-personal-details-dc',
  templateUrl: './mb-personal-details-dc.component.html',
  styleUrls: ['./mb-personal-details-dc.component.scss']
})
export class MbPersonalDetailsDcComponent extends BaseComponent implements OnInit, OnChanges {
  /** Input Variables */
  @Input() bankNameList: Observable<LovList>;
  @Input() gccCountryList: Observable<LovList>;
  @Input() cityList: Observable<LovList>;
  @Input() genderList: LovList;
  @Input() isAccountSaved: boolean;
  @Input() yesOrNoList: LovList;
  @Input() isInternational = false;
  @Input() verified: boolean;
  @Input() person: MemberData;
  @Input() editMode: boolean;
  @Input() members: MbProfile;
  @Input() bankDetails: PersonBankDetails;
  @Input() personBirthDate: GosiCalendar;

  /** Output Variables */
  @Output() next: EventEmitter<Object> = new EventEmitter();
  @Output() IBAN: EventEmitter<Object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<boolean> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();
  //Local Variables
  data: MemberData = new MemberData();
  personType: string;
  nationality: BilingualText;
  birthDate: string;
  addressForm = new FormGroup({});
  BankDetailsForm: FormGroup;
  idType: string;
  bankName: Lov = new Lov();
  paymentDetailsForm: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  showMOF = true;
  personForm: FormGroup;
  isGccPerson = true;
  personDetails: string;
  readOnly: boolean;
  list: LovList = new LovList([]);
  //Constants
  typeNIN = IdentityTypeEnum.NIN;
  typeIQAMA = IdentityTypeEnum.IQAMA;
  typeNATIONALID = IdentityTypeEnum.NATIONALID;
  typePASSPORT = IdentityTypeEnum.PASSPORT;
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  passportNoMax = IdentifierLengthEnum.PASSPORT;
  arabicNameMax = MBConstants.ARABIC_NAME_MAX_LENGTH;
  nameMinLength = MBConstants.NAME_MIN_LENGTH;
  englishNameMax = MBConstants.ENGLISH_NAME_MAX_LENGTH;
  gccIdMaxLength = MBConstants.DEFAULT_GCCID_LENGTH;
  minMaxLengthAccountNo: number = MBConstants.MIN_MAX_LENGTH_ACCOUNT_NUMBER;

  /** Observables */
  @ViewChild('BankDetailsDcComponent', { static: false })
  bankDetailsDcComponent: BankDetailsDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  //TODO Try to handle popups from sc component

  constructor(private fb: FormBuilder, readonly lookUpService: LookupService, readonly mbService: MedicalBoardService) {
    super();
  }
  ngOnInit() {
    this.verified = true;
    this.personForm = this.createPersonDetailsForm();
    this.BankDetailsForm = this.createBankDetailsForm();
    this.populateValue();
    this.person.isReturn = false;
    this.BankDetailsForm.get('ibanAccountNo').valueChanges.subscribe(() => {
      if (!this.BankDetailsForm.get('ibanAccountNo').valid) {
        this.list = new LovList([]);
        this.BankDetailsForm.get('bankName').reset();
      } else if (!this.bankDetails) {
        this.getBranchList();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.BankDetailsForm && changes.BankDetailsForm.currentValue) {
      this.BankDetailsForm.get('ibanAccountNo').patchValue(this.BankDetailsForm.value.ibanAccountNo);
    }
    if (changes.bankNameList && changes.bankNameList.currentValue && this.BankDetailsForm) {
      this.bankNameList
        .pipe(take(1))
        .pipe(
          tap(res => (this.list = res)),
          delay(100),
          tap(res => {
            //TODO Use camal case for variables
            this.BankDetailsForm.get('bankName').patchValue(res.items[0].value);
            this.BankDetailsForm.get('bankName').updateValueAndValidity();
          })
        )
        .subscribe(noop);
    }
    if (changes.members && changes.members.currentValue && this.editMode) {
      this.person.isReturn = true;
      if (!this.members.name?.arabic && !this.members.name?.english) {
        this.members.name = new Name();
        this.members.name.arabic.thirdName = '';
      }
      this.person.contractId = this.members.contracts[0].contractId;
      this.bindDataToForm();
    }
    if (this.person?.nationality?.english) {
      this.identifyNationality();
    }
    //To set Values for  Draft scenario (this.member api is not called)
    if (this.person?.name) {
      this.getDraftDetails();
    }
  }
  /**Method to bind data to form */
  bindDataToForm(): void {
    if (this.members.bankAccount) {
      this.BankDetailsForm.get('ibanAccountNo').patchValue(this.members.bankAccount.ibanBankAccountNo);
      let samaStatus: BilingualText;
      switch (this.members?.bankAccount?.verificationStatus) {
        case SamaStatusEnum.SamaNotVerified:
        case SamaStatusEnum.SamaVerificationPending: {
          samaStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
          break;
        }
        case SamaStatusEnum.NotApplicable:
        case SamaStatusEnum.SamaVerified: {
          samaStatus = SamaStatusConstants.VERIFIED;
          break;
        }
        case SamaStatusEnum.SamaVerificationFailed:
        case SamaStatusEnum.SamaIbanNotVerifiable: {
          samaStatus = SamaStatusConstants.VERIFICATION_FAILED;
          break;
        }
        case SamaStatusEnum.SamaExpired: {
          samaStatus = SamaStatusConstants.EXPIRED;
          break;
        }
        default: {
          samaStatus = null;
        }
      }
      this.BankDetailsForm.patchValue({ status: samaStatus });
      this.BankDetailsForm.updateValueAndValidity();
      if (!this.bankDetails) {
        this.getBranchList();
      }
    }
    this.person.transactionTraceId = this.members?.contracts[0]?.transactionTraceId;
    Object.keys(this?.members).forEach(key => (this.person[key] = this.members[key]));
    Object.keys(this.members).forEach(name => {
      if (this.personForm.get(name) && this.members) {
        if (name === 'birthDate') {
          if (this.members.birthDate?.gregorian) {
            this.birthDate = moment(this.members.birthDate?.gregorian).format('DD/MM/YYYY');
            this.personForm.get(name).patchValue(this.members[name]);
            this.personForm.get('birthDate.gregorian').setValue(this.birthDate);
            this.personForm.get('birthDate').updateValueAndValidity();
          }
        }
        if (name === 'nationality') {
          this.personForm.get(name).patchValue(this.members[name]);
          this.personForm.get('nationality.english').setValue(this.members.nationality.english);
          this.personForm.get('nationality').updateValueAndValidity();
          this.nationality = this.personForm?.get('nationality')?.value;
        }
        if (name === 'name') {
          this.personForm.get(name).patchValue(this.members[name]);
          if (this.members.name.arabic) {
            this.members.name.arabic.firstName
              ? this.personForm.get('name.arabic.firstName').setValue(this.members.name?.arabic.firstName)
              : this.members.name.arabic.secondName
              ? this.personForm.get('name.arabic.secondName').setValue(this.members.name?.arabic.secondName)
              : this.members.name.arabic.thirdName
              ? this.personForm.get('name.arabic.thirdName').setValue(this.members.name?.arabic.thirdName)
              : this.members.name.arabic.familyName
              ? this.personForm.get('name.arabic.familyName').setValue(this.members.name?.arabic.familyName)
              : '';
          }
          if (this.members.name.english.name) {
            this.personForm.get('name.english').setValue(this.members.name?.english);
          }
          this.personForm.get('name').updateValueAndValidity();
        }
        if (name === 'sex') {
          this.personForm.get(name).patchValue(this.members[name]);
          this.personForm.get('sex.english').setValue(this.members.sex.english);
          this.personForm.get('sex').updateValueAndValidity();
        }
      }
    });
  }
  getDraftDetails() {
    if (this.person.name) {
      // this.personForm.get(name).setValue(this.person.name);
      if (this.person.name.arabic) {
        this.person.name.arabic.firstName
          ? this.personForm.get('name.arabic.firstName').setValue(this.person.name?.arabic.firstName)
          : this.person.name.arabic.secondName
          ? this.personForm.get('name.arabic.secondName').setValue(this.person.name?.arabic.secondName)
          : this.person.name.arabic.thirdName
          ? this.personForm.get('name.arabic.thirdName').setValue(this.person.name?.arabic.thirdName)
          : this.person.name.arabic.familyName
          ? this.personForm.get('name.arabic.familyName').setValue(this.person.name?.arabic.familyName)
          : '';
      }
      if (this.person.name.english.name) {
        this.personForm.get('name.english').setValue(this.person.name?.english);
      }
      this.personForm?.get('name')?.updateValueAndValidity();
    }
    if (this.person.sex.english) {
      // this.personForm.get(name).patchValue(this.members[name]);
      this.personForm?.get('sex.english').setValue(this.person.sex.english);
      this.personForm?.get('sex').updateValueAndValidity();
    }
    if (this.person.birthDate) {
      this.birthDate = moment(this.members?.birthDate?.gregorian).format('DD/MM/YYYY');
      // this.personForm.get(name).patchValue(this.members[name]);
      this.personForm?.get('birthDate.gregorian').setValue(this.person.birthDate);
      this.personForm?.get('birthDate').updateValueAndValidity();
    }

    if (this.person.nationality) {
      // this.personForm.get(name).patchValue(this.members[name]);
      this.personForm?.get('nationality.english').setValue(this.person.nationality.english);
      this.personForm?.get('nationality').updateValueAndValidity();
      this.nationality = this.personForm?.get('nationality')?.value;
    }
    if (this.mbService?.getNewIBAN() && this.bankDetails) {
      this.bankDetails.ibanBankAccountNo = this.mbService?.getNewIBAN();
    }
    if (this.bankDetails?.ibanBankAccountNo) {
      this.BankDetailsForm.get('ibanAccountNo').setValue(this.bankDetails?.ibanBankAccountNo);
      // const iBanCode = String(this.BankDetailsForm?.get('ibanAccountNo').value).slice(4, 6);
      const iBanCode = String(this.bankDetails.bankCode);
      this.lookUpService.getBank(iBanCode).subscribe(res => {
        this.list = res;
        this.BankDetailsForm.get('bankName.english').patchValue(this.list.items[0]?.value.english);
        this.BankDetailsForm.get('bankName.arabic').patchValue(this.list.items[0]?.value.arabic);
        // this.BankDetailsForm?.get('bankName').patchValue(this.list.items[0].value);
        this.BankDetailsForm?.get('bankName').updateValueAndValidity();
      });
      let samaStatus: BilingualText;
      switch (this.bankDetails.verificationStatus) {
        case SamaStatusEnum.SamaNotVerified:
        case SamaStatusEnum.SamaVerificationPending: {
          samaStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
          break;
        }
        case SamaStatusEnum.NotApplicable:
        case SamaStatusEnum.SamaVerified: {
          samaStatus = SamaStatusConstants.VERIFIED;
          break;
        }
        case SamaStatusEnum.SamaVerificationFailed:
        case SamaStatusEnum.SamaIbanNotVerifiable: {
          samaStatus = SamaStatusConstants.VERIFICATION_FAILED;
          break;
        }
        case SamaStatusEnum.SamaExpired: {
          samaStatus = SamaStatusConstants.EXPIRED;
          break;
        }
        default: {
          samaStatus = null;
        }
      }
      // .get('english')
      this.BankDetailsForm.get('bankName.english').setValue(this.bankDetails?.bankName?.english);
      this.BankDetailsForm.get('bankName.arabic').setValue(this.bankDetails?.bankName?.arabic);
      this.BankDetailsForm.patchValue({ status: samaStatus });
      this.BankDetailsForm.updateValueAndValidity();
      if (!this.bankDetails) {
        this.getBranchList();
      }
    }
  }
  identifyNationality() {
    this.nationality = this.person.nationality;
    this.personForm.patchValue({ nationality: this.nationality });
    if (this.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
      this.personType = NationalityCategoryEnum.SAUDI_PERSON;

      this.readOnly = true;
      this.personForm.patchValue({ idType: 'NIN' });
    } else if (MBConstants.GCC_NATIONAL.indexOf(this.nationality.english) !== -1) {
      this.readOnly = false;
      this.personForm.patchValue({ idType: 'GCC' });
    } else {
      this.readOnly = false;
      this.personForm.patchValue({ idType: 'IQAMA' });
    }
    this.person.identity.forEach(val => {
      Object.keys(val).forEach(name => {
        if (name !== 'idType') {
          if (name in this.personForm.controls) {
            if (val.idType === IdentityTypeEnum.IQAMA) {
              val = <Iqama>val;
              this.personForm.get('iqamaNo').setValue(val.iqamaNo);
              this.personForm.get('iqamaNo').updateValueAndValidity();
            } else if (val.idType === IdentityTypeEnum.NATIONALID) {
              val = <NationalId>val;
              this.personForm.get('id').setValue(val.id);
              this.personForm.get('id').updateValueAndValidity();
            } else if (val.idType === IdentityTypeEnum.PASSPORT) {
              val = <Passport>val;
              this.personForm.get('passportNo').setValue(val.passportNo);
              this.personForm.get('passportNo').updateValueAndValidity();
            } else {
              val = <NIN>val;
              this.personForm.get('newNin').setValue(val.newNin);
              this.personForm.get('newNin').updateValueAndValidity();
            }
          }
        }
      });
    });
  }
  populateValue() {
    if (this.personForm) {
      Object.keys(this.person).forEach(name => {
        if (name in this.personForm.controls) {
          this.personForm.get(name).patchValue(this.person[name]);
          this.personForm.updateValueAndValidity();
        }
      });
    }
    if (this.person.birthDate?.gregorian) {
      this.birthDate = moment(this.person.birthDate?.gregorian).format('DD/MM/YYYY');
    } else if (this.personBirthDate) {
      this.birthDate = moment(this.personBirthDate?.gregorian).format('DD/MM/YYYY');
      this.personForm.get('birthDate.gregorian').setValue(this.personBirthDate?.gregorian);
    }
    this.BankDetailsForm.patchValue({
      ibanAccountNo: this.person?.bankAccount?.bankAccountList[0]?.ibanBankAccountNo
    });
    this.BankDetailsForm.patchValue({ bankName: this.list.items[0]?.value });
    let status: BilingualText;
    switch (this.person?.bankAccount?.bankAccountList[0]?.verificationStatus) {
      case SamaStatusEnum.NotApplicable:
      case SamaStatusEnum.SamaVerified: {
        status = SamaStatusConstants.VERIFIED;
        break;
      }
      case SamaStatusEnum.SamaNotVerified:
      case SamaStatusEnum.SamaVerificationPending: {
        status = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
        break;
      }
      case SamaStatusEnum.SamaVerificationFailed:
      case SamaStatusEnum.SamaIbanNotVerifiable: {
        status = SamaStatusConstants.VERIFICATION_FAILED;
        break;
      }
      case SamaStatusEnum.SamaExpired: {
        status = SamaStatusConstants.EXPIRED;
        break;
      }
      default: {
        status = null;
      }
    }
    this.BankDetailsForm.patchValue({ status: status });
    this.BankDetailsForm.updateValueAndValidity();
    if (!this.bankDetails) {
      this.getBranchList();
    } else if (this.bankDetails?.bankName) {
      this.BankDetailsForm.get('bankName.english').setValue(this.bankDetails?.bankName?.english);
      this.BankDetailsForm.get('bankName.arabic').setValue(this.bankDetails?.bankName?.arabic);
    }
    this.personForm.updateValueAndValidity();
  }
  resetInfo() {
    this.verified = false;
    this.reset.emit(this.verified);
  }
  createBankDetailsForm() {
    return this.fb.group({
      ibanAccountNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.minMaxLengthAccountNo),
            iBanValidator
          ])
        }
      ],
      bankName: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      }),
      status: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      })
    });
  }
  createPersonDetailsForm() {
    return this.fb.group({
      personId: [null],
      iqamaNo: [null],
      newNin: [null],
      id: [null],
      passportNo: [null],
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ''
      }),
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      idType: IdentityTypeEnum.NIN,
      name: this.fb.group({
        arabic: this.fb.group({
          firstName: [
            null,
            {
              validators: Validators.compose([
                Validators.minLength(this.nameMinLength),
                Validators.maxLength(this.arabicNameMax),
                Validators.required
              ]),
              updateOn: 'blur'
            }
          ],
          secondName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ],
          familyName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax), Validators.required]),
              updateOn: 'blur'
            }
          ],
          thirdName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.arabicNameMax)]),
              updateOn: 'blur'
            }
          ]
        }),
        english: this.fb.group({
          name: [
            null,
            {
              validators: Validators.compose([
                Validators.maxLength(this.englishNameMax),
                Validators.minLength(this.nameMinLength)
              ]),
              updateOn: 'blur'
            }
          ]
        })
      }),
      sex: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  getBranchList() {
    if (this.BankDetailsForm.get('ibanAccountNo').value === '') {
      this.list = new LovList([]);
      this.BankDetailsForm.get('bankName').reset();
    } else if (this.BankDetailsForm.get('ibanAccountNo').value && this.BankDetailsForm.get('ibanAccountNo').valid) {
      const iBanCode = String(this.BankDetailsForm.get('ibanAccountNo').value).slice(4, 6);
      this.mbService.setNewIBAN(this.BankDetailsForm.get('ibanAccountNo').value);
      this.IBAN.emit(iBanCode);
    }
  }
  savePersonDetails() {
    scrollToTop();
    let valid = true;
    let personvalid: boolean;
    if (this.personType === 'Saudi_Person') {
      personvalid = true;
    } else {
      personvalid = !this.personForm.invalid;
    }
    markFormGroupTouched(this.BankDetailsForm);
    markFormGroupTouched(this.personForm);
    markFormGroupTouched(this.contactDcComponent.contactDetailsForm);
    markFormGroupTouched(this.addressDetailsComponent?.parentForm);
    valid =
      this.addressDetailsComponent.getAddressValidity() &&
      !this.contactDcComponent.contactDetailsForm.invalid &&
      !this.BankDetailsForm.invalid &&
      personvalid;

    if (valid) {
      this.submitted = true;
      this.getFormValues();
      this.person = this.data;
      //Defect 545748
      // this.person.contactDetail.addresses.forEach(eachAddress => (eachAddress.cityDistrict = null));
      if (!this.isGccPerson) {
        //If not an gcc establishment set the default value to saudi
        if (!this.person.contactDetail?.mobileNo?.isdCodePrimary) {
          this.contactDcComponent.contactDetailsForm.get('mobileNo')?.get('isdCodePrimary')?.setValue('sa');
        }
      }
      this.submit.emit(this.person);
    } else {
      this.invalidForm.emit();
    }
  }
  getFormValues() {
    this.data.personId = this.person.personId ? this.person.personId : null;
    this.data.nationality = this.person.nationality;
    this.data.birthDate = this.person.birthDate;
    this.data.identity = this.person.identity;
    this.data.name = this.personForm.get('name').value;
    this.data.sex = this.personForm.get('sex').value;
    this.data.bankAccount = this.BankDetailsForm.value;
    this.data.contactDetail = this.contactDcComponent.contactDetailsForm.getRawValue();
    this.data.contactDetail.emailId.secondary = null;
    this.data.contactDetail.telephoneNo.secondary = null;
    this.data.contactDetail.telephoneNo.extensionSecondary = null;
    this.data.contactDetail.mobileNo.secondary = null;
    this.data.contactDetail.mobileNo.isdCodeSecondary = null;
    const addresses = setAddressFormToAddresses(this.addressForm);
    const currentMailingAddress = this.addressForm.get('currentMailingAddress').value;
    this.data.contactDetail.addresses = addresses;
    this.data.contactDetail.currentMailingAddress = currentMailingAddress;
  }

  resetPersonDetailsForm() {
    scrollToTop();
    this.submitted = false;
    this.personForm.reset(this.createPersonDetailsForm().getRawValue());
    this.contactDcComponent.resetContactForm();
    this.addressDetailsComponent.resetAddressForm();
    this.personForm.updateValueAndValidity();
    this.personForm.markAsPristine();
    this.personForm.markAsUntouched();
  }
}
