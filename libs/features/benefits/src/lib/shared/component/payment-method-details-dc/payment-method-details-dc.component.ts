/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  AlertService,
  LovList,
  iBanValidator,
  lengthValidator,
  Lov,
  BilingualText,
  SamaVerificationStatus,
  ContactDetails,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  markFormGroupUntouched,
  nonSaudiiBanValidator,
  CoreActiveBenefits,
  GosiCalendar
} from '@gosi-ui/core';
import { BenefitType, BenefitValues } from '../../enum';
import { PatchPersonBankDetails, HeirsDetails, PersonBankDetails, AttorneyDetailsWrapper } from '../../models';
import { PaymentMethodDetailsHelper } from './payment-method-details-helper';
import { BankTransfer } from '@gosi-ui/features/payment/lib/shared/enums/benefit-values';

@Component({
  selector: 'bnt-payment-method-details-dc',
  templateUrl: './payment-method-details-dc.component.html',
  styleUrls: ['./payment-method-details-dc.component.scss']
})
export class PaymentMethodDetailsDcComponent extends PaymentMethodDetailsHelper implements OnInit, OnChanges {
  isDisableSelectIban = false;
  guardianPersonChanged = true; //To detect if anyone selected guardian person from the list
  /** Input Values */
  @Input() personId: number;
  @Input() isValidatorEdit: boolean;
  @Input() isAddressRequired = true;
  @Input() isModifybank: boolean;
  @Input() isHeir: boolean;
  @Input() isRestart = false;
  @Input() lang = 'en';
  @Input() paymentModeList: LovList;
  @Input() listYesNo: LovList;
  @Input() isAddressReadOnly = false;
  @Input() isIndividualApp: boolean;

  //Authorized Person Related Variables
  @Input() attorneyList: AttorneyDetailsWrapper[];
  @Input() guardianList: AttorneyDetailsWrapper[];
  //Address Related Input Variables
  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;
  @Input() bankAccountList: PersonBankDetails[];
  @Input() newBankName: BilingualText;
  @Input() newNonSaudiBankName: BilingualText;
  @Input() activeBenefit: CoreActiveBenefits;
  @Input() showBankTransferOnly = true;
  /** Output Variables */
  //IBAN Related Output Variables
  @Output() getBankDetailsEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() onIbanTypeChange = new EventEmitter();
  @Output() payeeDetailEvent = new EventEmitter();
  @Output() getAuthorizedPersonEvent = new EventEmitter();
  @Output() existingIbanEvent: EventEmitter<boolean> = new EventEmitter();
  bankTransfer: BankTransfer;

  constructor(private fb: FormBuilder, readonly alertService: AlertService) {
    super();
  }
  ngOnInit(): void {
    this.initializeForm();
    if (this.heirDetail) {
      this.heirDetail.id = this.getHeirDetailId(this.heirDetail.identity);
      this.setPayeeType();
      this.setPaymentMode();
      this.getBankIbanDetails();
      this.getAuthorizedPersonEvent.emit(this.heirDetail?.id);
    }
    if (
      this.activeBenefit &&
      this.activeBenefit.benefitType &&
      this.activeBenefit.benefitType.english &&
      this.activeBenefit.benefitType.english.includes(BenefitType.ui) &&
      this.payeeForm &&
      this.payeeForm.get('payee')
    ) {
      this.payeeForm.get('payee').disable();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.payeeList && changes.payeeList.currentValue && changes.payeeList.currentValue.items.length) {
      this.initializePaymentDetails();
    }
    if (changes && changes.attorneyList && changes.attorneyList.currentValue) {
      if (this.payeeForm) {
        this.setAuthorizedPerson();
        if (this.isModifybank && this.payee === 2) this.getPerson(0);
        this.showOrHideBankDetails();
      }
      this.initializePaymentDetails();
    }
    if (changes && changes.guardianList && changes.guardianList.currentValue) {
      if (this.payeeForm) {
        this.setGuardianPerson();
        if (this.isModifybank && this.payee === 3) this.getGuardianPerson(0);
        this.showOrHideBankDetails();
      }
    }
    if (changes && changes.bankAccountList && changes.bankAccountList.currentValue) {
      this.getBankIbanDetails();
    }
    if (changes?.paymentModeList?.currentValue?.items?.length) {
      this.paymentModeList = changes?.paymentModeList?.currentValue;
      this.setPaymentMethodList(this.paymentModeList);
    }
  }

  initializeForm() {
    this.payeeForm = this.createPayeeForm();
    this.selectIbanForm = this.createSelectIbanForm();
    this.bankEditForm = this.createEditBankDetailsForm();
  }

  getBankDetails(personId: number) {
    this.bankAccountList = [];
    if (personId) {
      this.getBankDetailsEvent.emit({ personId: personId, heirIdentifier: this.personId });
    } else {
      this.getBankIbanDetails();
    }
  }

  getHeirDetailId(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    if (identity) {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(identity);
      if (idObj) {
        return idObj.id;
      }
    }
  }
  setPaymentMethodList(paymentModeList) {
    this.paymentModeList.items = this.showBankTransferOnly
      ? paymentModeList.items.filter(paymentMethod => paymentMethod.value.english === BenefitValues.BANK)
      : paymentModeList.items;
  }
  setPayeeDetails() {
    this.payeeDetail = new HeirsDetails();
    this.payeeDetail.personId = this.personId;
    this.payeeDetail.payeeType = this.payeeForm?.get('payee')?.value;
    // As asked by BE, passing payment mode as "bank transfer" in payload (No more cheque option in annuity)
    this.payeeDetail.paymentMode = { arabic: 'تحويل للبنك', english: 'Bank Transfer' };

    if (this.selectIbanForm) {
      this.payeeDetail.bankAccount.ibanBankAccountNo = this.selectIbanForm?.get('selectIbanMode.english')?.value;
      this.payeeDetail.bankAccount.bankName = this.selectIbanForm?.get('bankName')?.value;
      this.payeeDetail.bankAccount.bankCode = this.bankCode;
      this.payeeDetail.bankAccount.isNonSaudiIBAN = new RegExp('^([S]{1})([A]{1})(?!00)(?!01)(?!99)([0-9]{2})([0-9]{2})([A-Za-z0-9]{18})$').test(this.payeeDetail.bankAccount.ibanBankAccountNo) ? false : true;
    }
    if (this.bankEditForm) {
      this.payeeDetail.bankAccount.ibanBankAccountNo = this.showSaudiAddnewIban
        ? this.bankEditForm?.get('ibanBankAccountNo').value
        : this.bankEditForm?.get('nonSaudiIbanAccNo').value;
      this.payeeDetail.bankAccount.bankName = this.showSaudiAddnewIban
        ? this.newBankName
        : this.bankEditForm.get('nonSaudiBankName')?.value;
      this.payeeDetail.bankAccount.isNonSaudiIBAN = !this.showSaudiAddnewIban ? true : false;
      this.payeeDetail.bankAccount.swiftCode = this.bankEditForm?.get('swiftCode').value;
      this.payeeDetail.bankAccount.bankCode = this.bankCode;
      this.payeeDetail.bankAccount.isNewlyAdded = true;
      this.payeeDetail.bankAccount.isIbanVerified = false;
    }
    if (this.payeeDetail.paymentMode.english === BenefitValues.cheque) {
      this.payeeDetail.bankAccount = null;
    }
    this.setAuthorizedGuardianDetails();
    //this.setGuardianDetails();
    this.setAdressRelatedValues();
    this.payeeDetailEvent.emit(this.payeeDetail);
  }

  setAuthorizedGuardianDetails() {
    const payeeType = this.payeeForm?.get('payee.english')?.value;
    if (payeeType === BenefitValues.authorizedPerson || payeeType === BenefitValues.attorney) {
      this.payeeDetail.authorizedPersonId = this.payeeForm?.get('authorizedPersonId')?.value;
      this.payeeDetail.authorizationDetailsId = this.payeeForm?.get('authorizationDetailsId')?.value;
      this.payeeDetail.authorizationId = this.payeeForm?.get('authorizationId')?.value;
    } else if (payeeType === BenefitValues.guardian || payeeType === BenefitValues.custodian) {
      this.payeeDetail.guardianPersonId = this.payeeForm?.get('guardianPersonId')?.value;
      this.payeeDetail.guardianPersonIdentity = this.payeeForm?.get('guardianPersonIdentity')?.value;
      this.payeeDetail.guardianPersonName = this.payeeForm?.get('guardianPersonName')?.value;
      this.payeeDetail.authorizationId = this.payeeForm?.get('authorizationId')?.value;
    } else {
      //05/11/23 not required for self type
      // if(this.heirDetail?.authorizedPersonId) this.payeeDetail.authorizedPersonId = this.heirDetail?.authorizedPersonId;
      // if(this.heirDetail?.authorizationDetailsId) this.payeeDetail.authorizationDetailsId = this.heirDetail?.authorizationDetailsId;
      // if(this.heirDetail?.guardianPersonId) this.payeeDetail.guardianPersonId = this.heirDetail?.guardianPersonId;
      // if(this.heirDetail?.guardianPersonIdentity) this.payeeDetail.guardianPersonIdentity = this.heirDetail?.guardianPersonIdentity;
      // if(this.heirDetail?.guardianPersonName) this.payeeDetail.guardianPersonName = this.heirDetail?.guardianPersonName;
      // if(this.heirDetail?.authorizationId) this.payeeDetail.authorizationId = this.heirDetail?.authorizationId;
    }
  }
  
  // setGuardianDetails() {
  //   const payeeType = this.payeeForm?.get('payee.english')?.value;
  //   if (payeeType === BenefitValues.guardian || payeeType === BenefitValues.custodian) {
  //     this.payeeDetail.guardianPersonId = this.payeeForm?.get('guardianPersonId')?.value;
  //     this.payeeDetail.guardianPersonIdentity = this.payeeForm?.get('guardianPersonIdentity')?.value;
  //     this.payeeDetail.guardianPersonName = this.payeeForm?.get('guardianPersonName')?.value;
  //     this.payeeDetail.authorizationId = this.payeeForm?.get('authorizationId')?.value;
  //   } else {
  //     this.payeeDetail.guardianPersonId = this.heirDetail.guardianPersonId;
  //     this.payeeDetail.guardianPersonIdentity = this.heirDetail.guardianPersonIdentity;
  //     this.payeeDetail.guardianPersonName = this.heirDetail.guardianPersonName;
  //     this.payeeDetail.authorizationId = this.heirDetail?.authorizationId;
  //   }
  // }

  setPaymentMode() {
    // setting payment mode as 'Bank Transfer' (No more cheque option in annuity)
    this.paymentMode = 'Bank Transfer';
  }

  markFormsAsTouched() {
    this.payeeForm?.markAllAsTouched();
    this.selectIbanForm?.markAllAsTouched();
    this.bankEditForm?.markAllAsTouched();
  }
  /** *********************** Payee Type Related Functions ********************* */

  setPayeeType() {
    if (this.heirDetail?.payeeType) {
      this.payeeForm?.get('payee')?.setValue(this.heirDetail.payeeType);
    }
    if (!this.heirDetail?.payeeType || this.heirDetail?.payeeType?.english === BenefitValues.contributor) {
      this.payee = 1;
      this.getAuthorizedPersonEvent.emit(this.heirDetail?.id);
      if (this.attorneyList?.length > 0) {
        this.showGuardian = false;
      }
      if (this.heirDetail.guardianPersonId && this.heirDetail.guardianPersonId !== 0) {
        this.showGuardian = true;
      }

      this.getBankDetails(this.heirDetail?.personId);
      this.setAuthorizedPerson();
    }
    if (
      this.heirDetail?.payeeType?.english === BenefitValues.authorizedPerson ||
      this.heirDetail?.payeeType?.english === BenefitValues.attorney
    ) {
      this.payee = 2;
      this.getAuthorizedPersonEvent.emit(this.heirDetail.id);
      this.getBankDetails(this.heirDetail?.authorizedPersonId);
      this.setAuthorizedPerson();
    }
    if (
      this.heirDetail?.payeeType?.english === BenefitValues.guardian ||
      this.heirDetail?.payeeType?.english === BenefitValues.custodian
    ) {
      this.payee = 3;
      this.showGuardian = true;
      this.getAuthorizedPersonEvent.emit(this.heirDetail.id);
      this.getBankDetails(this.heirDetail?.guardianPersonId);
      this.setGuardianPerson();
    }
    this.showOrHideGuardian(this.showGuardian);
    this.showOrHideBankDetails();
    if (this.heirDetail?.paymentMode?.english) {
      this.selectPaymentMethod(this.heirDetail?.paymentMode.english);
    }
  }

  showOrHideBankDetails() {
    const payeeType = this.payeeForm?.get('payee.english').value;
    if (payeeType === BenefitValues.contributor) {
      this.showBankDetails = true;
    }
    if (payeeType === BenefitValues.authorizedPerson || payeeType === BenefitValues.attorney) {
      if (!this.attorneyList || this.attorneyList?.length <= 0) {
        this.showBankDetails = false;
      } else {
        this.showBankDetails = true;
      }
    }
    if (payeeType === BenefitValues.guardian || payeeType === BenefitValues.custodian) {
      if (!this.guardianList || this.guardianList?.length <= 0 || !this.payeeForm?.get('guardianPersonId')?.value) {
        this.showBankDetails = false;
      } else {
        this.showBankDetails = true;
      }
    }
    if (this.payeeForm?.get('paymentMode.english').value === BenefitValues.cheque) {
      this.showBankDetails = false;
      this.selectIbanForm?.get('selectIbanMode')?.clearValidators();
      this.selectIbanForm?.get('bankName')?.get('english')?.clearValidators();
      this.bankEditForm?.get('ibanBankAccountNo')?.clearValidators();
      this.selectIbanForm?.get('bankName')?.get('english')?.updateValueAndValidity();
      this.selectIbanForm?.get('selectIbanMode')?.updateValueAndValidity();
      this.bankEditForm?.get('ibanBankAccountNo')?.updateValueAndValidity();
    }
  }

  selectPayeeType(type: string) {
    this.payeeForm.get('payee').markAsDirty();
    this.selectPaymentMethod(BenefitValues.BANK);
    if (type === BenefitValues.contributor) {
      this.payee = 1;
      this.payeeForm.get('authorizedPersonId').reset();
      this.payeeForm.get('guardianPersonId').reset();
      this.getBankDetails(this.heirDetail?.personId);
    }
    if (type === BenefitValues.authorizedPerson || type === BenefitValues.custodian) {
      this.payee = 2;
      this.setAuthorizedPerson();
      this.getBankDetails(this.heirDetail?.authorizedPersonId);
    }
    if (type === BenefitValues.guardian || type === BenefitValues.custodian) {
      this.payee = 3;
      this.setGuardianPerson();
      this.getBankDetails(this.heirDetail?.guardianPersonId);
    }
    this.showOrHideBankDetails();
  }

  /*********************** Payment Method Related Functions *******************/

  selectPaymentMethod(paymentMode: string) {
    if (this.selectIbanForm) markFormGroupUntouched(this.selectIbanForm);
    if (this.bankEditForm) markFormGroupUntouched(this.bankEditForm);
    this.setPaymentMode();
    if (paymentMode === BenefitValues.BANK) {
      this.payeeForm.get('paymentMode.english').setValue(BenefitValues.BANK);
      this.showBankDetails = true;
      this.showOrHideBankDetails();
      // Defect 482378 default nationality value set to yes after chnging payment method
      this.payeeForm?.get('nationality').get('english').setValue(BenefitValues.yes);
    } else if (paymentMode === BenefitValues.cheque) {
      this.payeeForm.get('paymentMode.english').setValue(BenefitValues.cheque);
      this.showBankDetails = false;
    }
    if (this.bankAccountList && this.bankAccountList?.length > 0) {
      // workitem 398229 Select IBAN in auto selected with No items in the drop down fix
      //this.bankTypeChange('selectIban');
      this.getBankIbanDetails();
    }
    if (paymentMode === BenefitValues.BANK) {
      this.selectIbanForm?.get('selectIbanMode')?.setValidators([Validators.required]);
      this.selectIbanForm?.get('bankName')?.get('english')?.setValidators([Validators.required]);
      this.bankEditForm?.get('ibanBankAccountNo')?.setValidators([Validators.required]);
      this.bankEditForm?.get('nonSaudiIbanAccNo')?.setValidators([Validators.required]);
      this.bankEditForm?.get('nonSaudiBankName')?.get('english').setValidators([Validators.required]);
      this.bankEditForm?.get('swiftCode')?.setValidators([Validators.required]);
    } else {
      this.selectIbanForm?.get('selectIbanMode')?.clearValidators();
      this.selectIbanForm?.get('bankName')?.get('english')?.clearValidators();
      this.bankEditForm?.get('ibanBankAccountNo')?.clearValidators();
      this.bankEditForm?.get('nonSaudiIbanAccNo')?.clearValidators();
      this.bankEditForm?.get('nonSaudiBankName')?.get('english')?.clearValidators();
      this.bankEditForm?.get('swiftCode')?.clearValidators();
    }
    this.selectIbanForm?.get('bankName')?.get('english')?.updateValueAndValidity();
    this.selectIbanForm?.get('selectIbanMode')?.updateValueAndValidity();
    this.bankEditForm?.get('ibanBankAccountNo')?.updateValueAndValidity();
    this.bankEditForm?.get('nonSaudiIbanAccNo')?.updateValueAndValidity();
    this.bankEditForm?.get('nonSaudiBankName')?.get('english')?.updateValueAndValidity();
    this.bankEditForm?.get('swiftCode')?.updateValueAndValidity();
    this.selectIbanForm?.updateValueAndValidity();
  }
  selectNationality(type: string) {
    if (type === BenefitValues.yes) {
      this.showSaudiAddnewIban = true;
      // Defect 482378 simultaneous nationality option click resetting
      if (!this.isValidatorEdit) {
        this.bankEditForm?.get('nonSaudiIbanAccNo')?.reset();
        this.bankEditForm?.get('nonSaudiBankName')?.reset();
        this.bankEditForm?.get('swiftCode')?.reset();
      }
    } else {
      this.showSaudiAddnewIban = false;
      if (!this.isValidatorEdit) {
        this.bankEditForm?.get('ibanBankAccountNo')?.reset();
        this.newBankName = null;
      }
    }
  }
  /**
   * ************************* IBAN Related Functions **************************
   */
  bankTypeChange(bankType: string) {
    //Select IBAN Tab is selected
    if (bankType === 'selectIban') {
      this.bankType = 'selectIban';
      this.newBankName = null;
      this.bankCode = null;
      this.newIban = false;
      this.selectIbanForm = this.createSelectIbanForm();
      if (!this.existingIbanLovList) this.existingIbanLovList = new LovList([]);
      this.bankEditForm = undefined;
    }
    // Add New IBAN tab is selected
    else if (bankType === 'addNewIban') {
      this.bankType = 'addNewIban';
      this.newIban = true;
      this.selectIbanForm = undefined;
      if (this.bankEditForm === undefined) {
        this.bankEditForm = this.createEditBankDetailsForm();
      }
      if (this.bankEditForm && this.bankEditForm.get('ibanBankAccountNo').valid) {
        this.getName();
      }
    }
    this.onIbanTypeChange.emit(true);
  }

  resetBankForm() {
    this.selectIbanForm?.reset();
    this.bankEditForm?.reset();
    this.newBankName = null;
    this.bankCode = null;
    this.existingIbanList = [];
    this.existingIbanLovList = new LovList([]);
  }

  // Method to create selectIBAN Form
  createSelectIbanForm() {
    return this.fb.group({
      selectIbanMode: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      bankName: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  // Method to create edit bank details form
  createEditBankDetailsForm() {
    return this.fb.group({
      ibanBankAccountNo: [
        '',
        {
          validators: Validators.compose([Validators.required, iBanValidator, lengthValidator(24)])
        }
      ],
      nonSaudiIbanAccNo: [
        '',
        {
          validators: Validators.compose([Validators.required, nonSaudiiBanValidator, lengthValidator(0, 30)])
        }
      ],
      nonSaudiBankName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      swiftCode: [null, { validators: Validators.required }, { updateOn: 'blur' }]
    });
  }

  getBankIbanDetails() {
    this.resetBankForm();
    const initialState = !this.payeeForm.dirty || !this.authPersonChanged || this.guardianPersonChanged;
    const samaVerifiedBankList: PersonBankDetails[] = this.bankAccountList?.filter(
      list =>
        list.verificationStatus === SamaVerificationStatus.VERIFIED ||
        list.verificationStatus === SamaVerificationStatus.PENDING ||
        list.verificationStatus === SamaVerificationStatus.NOT_VERIFIED
    );
    const isBankAvailable =
      this.isValidatorEdit && initialState ? this.checkIfBankAvailable(samaVerifiedBankList) : true;
    this.selectIfSingleValueAvailable(samaVerifiedBankList);
    if (this.isValidatorEdit && samaVerifiedBankList && samaVerifiedBankList.length > 0) {
      this.generateIbanLovList(samaVerifiedBankList);
    }
    if (isBankAvailable && samaVerifiedBankList && samaVerifiedBankList.length > 0) {
      this.bankType = 'selectIban';
      this.selectIbanForm = this.createSelectIbanForm();
      this.newIban = false;
      this.generateIbanLovList(samaVerifiedBankList);
      this.bankEditForm = undefined;
      this.setBankDetails(samaVerifiedBankList);
    }
    // if user does not have bank details saved
    else {
      this.bankType = 'addNewIban';
      this.showSaudiAddnewIban = true;
      this.newIban = true;
      this.selectIbanForm = undefined;
      this.bankEditForm = this.createEditBankDetailsForm();
      if (this.isValidatorEdit) {
        // Defect 482423 same iban shown evenif we change the payeetype to self and other from authorized fix
        const isSamePayeeType =
          this.heirDetail?.payeeType?.english === this.payeeForm?.get('payee')?.get('english').value ? true : false;
        if (this.heirDetail?.bankAccount?.isNonSaudiIBAN) {
          this.payeeForm?.get('nationality').get('english').setValue(BenefitValues.no);
        } else {
          this.payeeForm?.get('nationality').get('english').setValue(BenefitValues.yes);
        }
        if (this.heirDetail?.bankAccount?.ibanBankAccountNo && isSamePayeeType) {
          if (this.heirDetail?.bankAccount?.isNonSaudiIBAN) {
            this.showSaudiAddnewIban = false;
            this.bankEditForm?.get('nonSaudiIbanAccNo').setValue(this.heirDetail.bankAccount.ibanBankAccountNo);
          } else {
            this.bankEditForm?.get('ibanBankAccountNo').setValue(this.heirDetail.bankAccount.ibanBankAccountNo);
          }
        }
        if (isSamePayeeType) {
          if (this.heirDetail?.bankAccount?.isNonSaudiIBAN) {
            this.bankEditForm
              .get('nonSaudiBankName')
              ?.get('english')
              ?.setValue(this.heirDetail?.bankAccount?.bankName?.english);
            // this.bankEditForm
            //   .get('nonSaudiBankName?.arabic')
            //   ?.patchValue(this.heirDetail?.bankAccount?.bankName?.arabic);
            this.bankEditForm.get('swiftCode').setValue(this.heirDetail?.bankAccount?.swiftCode);
          } else {
            this.newBankName = this.heirDetail?.bankAccount?.bankName;
          }
        }
        this.bankCode = this.heirDetail?.bankAccount?.bankCode;
      }
    }
  }
  selectIfSingleValueAvailable(samaVerifiedBankList: PersonBankDetails[]) {
    if (samaVerifiedBankList?.length === 0) {
      this.isDisableSelectIban = true;
      this.bankTypeChange('addNewIBAN');
    } else {
      this.isDisableSelectIban = false;
    }
  }
  // This Method will check if heir bank detail available in bank account list
  checkIfBankAvailable(samaVerifiedBankList) {
    let isBankAvailable = false;
    if (samaVerifiedBankList && samaVerifiedBankList.length > 0) {
      samaVerifiedBankList.forEach(bankDetail => {
        if (bankDetail?.ibanBankAccountNo === this.heirDetail?.bankAccount?.ibanBankAccountNo) {
          isBankAvailable = true;
        }
      });
    }
    return isBankAvailable;
  }

  showPaymentMethod() {
    if (this.payee === 1) {
      return true;
    }
    if (this.payee === 2 && this.attorneyList && this.attorneyList?.length > 0) {
      return true;
    }
    if (this.payee === 3 && this.guardianList && this.guardianList?.length > 0) {
      return true;
    }
    return false;
  }

  setBankDetails(bankList) {
    if (bankList && bankList.length > 0) {
      bankList.forEach(bankDetail => {
        if (bankDetail.ibanBankAccountNo === this.heirDetail?.bankAccount?.ibanBankAccountNo) {
          this.bankCode = this.heirDetail?.bankAccount?.bankCode;
          const bankName = this.heirDetail?.bankAccount?.bankName;
          const ibanNumber = { english: bankDetail?.ibanBankAccountNo, arabic: bankDetail?.ibanBankAccountNo };
          this.selectIbanForm?.get('selectIbanMode').setValue(ibanNumber);
          this.selectIbanForm?.get('bankName').setValue(bankName);
        }
      });
    }
  }

  /*** this function generate lov list for the saved IBAN values */
  generateIbanLovList(bankAccountList: PersonBankDetails[]) {
    this.existingIbanList = [];
    bankAccountList?.forEach((bank, index) => {
      const lov = new Lov();
      lov.sequence = index;
      lov.value.english = bank.ibanBankAccountNo;
      lov.value.arabic = bank.ibanBankAccountNo;
      lov.code = bank.bankCode;
      this.existingIbanList.push(lov);
    });
    this.existingIbanLovList = new LovList(this.existingIbanList);
  }

  /** this method is triggered when user select one IBAN from the dropdown */
  IBANSelcted(lovValue: Lov) {
    if (lovValue && lovValue.code !== null) {
      this.bankAccountList?.forEach(bank => {
        if (bank.bankCode === lovValue.code) {
          this.bankCode = bank?.bankCode;
          this.bankAccountId = bank?.ibanBankAccountNo;
          this.selectIbanForm.get('bankName').setValue(bank.bankName);
          this.selectIbanForm.updateValueAndValidity();
          this.onIbanTypeChange.emit(false);
        }
      });
    } else {
      this.onIbanTypeChange.emit(true);
    }
  }

  getName(isNonSaudi?: boolean) {
    if (!isNonSaudi) {
      this.ibanValue = this.bankEditForm.get('ibanBankAccountNo').value;
    } else {
      this.ibanValue = this.bankEditForm.get('nonSaudiIbanAccNo').value;
    }
    if (
      this.ibanValue !== '' &&
      this.newIban &&
      (this.bankEditForm.get('ibanBankAccountNo').valid || this.bankEditForm.get('nonSaudiIbanAccNo').valid)
    ) {
      if (this.bankAccountList.find(({ ibanBankAccountNo }) => ibanBankAccountNo === this.ibanValue)) {
        this.isExistingIban = true;
      } else {
        this.isExistingIban = false;
      }
      this.existingIbanEvent.emit(this.isExistingIban);
      this.bankCode = parseInt(this.ibanValue.slice(4, 6), 10);
      const requestData = new PatchPersonBankDetails();
      requestData.bankCode = this.bankCode > 9 ? this.bankCode : 0 + this.bankCode;
      requestData.bankName = this.bankEditForm.get('ibanBankAccountNo').value
        ? this.newBankName
        : this.newNonSaudiBankName;
      requestData.ibanBankAccountNo = this.ibanValue;
      requestData.isNonSaudiIBAN = isNonSaudi;
      this.editEvent.emit({ newBankAccount: requestData, newIban: this.newIban, personId: this.personId });
    } else {
      this.newBankName = null;
      this.newNonSaudiBankName = null;
      this.bankCode = null;
      this.onIbanTypeChange.emit(true);
    }
  }

  get bankname() {
    return this.selectIbanForm?.get('bankName').value;
  }
  setNonSaudibankName() {
    if (this.bankEditForm.get('nonSaudiIbanAccNo').valid && this.newNonSaudiBankName) {
      this.bankEditForm.get('nonSaudiBankName.english')?.patchValue(this.newNonSaudiBankName?.english);
      this.bankEditForm.get('nonSaudiBankName.arabic')?.patchValue(this.newNonSaudiBankName?.arabic);
      this.bankEditForm.get('nonSaudiBankName').updateValueAndValidity();
    }
  }
  /**
   ********************* Authorized Person Details Related Functions *************************
   */

  setAuthorizedPerson() {
    this.attorneyList?.forEach(attorney => {
      if (this.heirDetail?.authorizedPersonId === attorney?.personId) {
        this.payeeForm?.get('authorizedPersonId')?.setValue(attorney.personId);
        this.payeeForm?.get('authorizationId')?.setValue(attorney.attorneyDetails.authorizationId);
      }
    });
  }

  setGuardianPerson() {
    this.guardianList?.forEach(guardian => {
      if (this.heirDetail?.guardianPersonId === guardian?.personId) {
        this.payeeForm?.get('guardianPersonId')?.setValue(guardian.personId);
        this.payeeForm?.get('authorizationId')?.setValue(guardian?.attorneyDetails?.authorizationId);
      }
    });
  }
  /**
   * Method to get corresponding selected personid
   * @param id
   */
  getPerson(id: number) {
    this.authPersonChanged = true;
    const authPersonId = this.attorneyList[id]?.personId;
    this.payeeForm?.get('authorizedPersonId')?.setValue(this.attorneyList[id]?.personId);
    this.payeeForm
      ?.get('authorizationDetailsId')
      ?.setValue(this.attorneyList[id]?.attorneyDetails?.authorizationDetailsId);
    this.payeeForm?.get('authorizationId')?.setValue(this.attorneyList[id]?.attorneyDetails?.authorizationId);
    this.getBankDetails(authPersonId);
  }

  getGuardianPerson(id: number) {
    this.guardianPersonChanged = true;
    const guardianPersonId = this.guardianList[id]?.personId;
    this.payeeForm?.get('guardianPersonId')?.setValue(this.guardianList[id]?.personId);
    this.payeeForm?.get('guardianPersonIdentity')?.setValue(this.guardianList[id]?.identity);
    this.payeeForm?.get('guardianPersonName')?.setValue(this.guardianList[id]?.name);
    this.payeeForm?.get('authorizationId')?.setValue(this.guardianList[id]?.attorneyDetails?.authorizationId);
    this.getBankDetails(guardianPersonId);
    this.showOrHideBankDetails();
  }

  createPayeeForm() {
    return this.fb.group({
      payee: this.fb.group({
        english: [BenefitValues.contributor, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      paymentMode: this.fb.group({
        english: [BenefitValues.BANK, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      nationality: this.fb.group({
        english: [BenefitValues.yes, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      guardianPersonId: [null],
      guardianPersonIdentity: [null],
      guardianPersonName: [null],
      authorizedPersonId: [null],
      authorizationDetailsId: [''],
      authorizationId: [null]
    });
  }
  /*
   * This method is to initiallize payee type
   */
  initializePaymentDetails() {
    if (this.isDead) {
      this.payeeList.items = this.payeeList?.items?.filter(item => item.value.english !== BenefitValues.contributor);
    }
    if (
      this.payeesListWithOutGuardian &&
      this.payeesListWithOutGuardian.items.length === 0 &&
      this.payeesListWithGuardian &&
      this.payeesListWithGuardian.items.length === 0
    ) {
      this.payeeList?.items?.forEach(p => {
        if (p?.value?.english !== BenefitValues.guardian && p?.value?.english !== BenefitValues.custodian) {
          this.payeesListWithOutGuardian?.items?.push(p);
        }
        if (p?.value?.english !== BenefitValues.authorizedPerson && p?.value?.english !== BenefitValues.attorney) {
          this.payeesListWithGuardian?.items?.push(p);
        }
      });
    }
    this.showOrHideGuardian(this.showGuardian);
  }
  showOrHideGuardian(show: boolean) {
    if (show) {
      this.payeeListToShow = this.payeesListWithGuardian;
    } else {
      this.payeeListToShow = this.payeesListWithOutGuardian;
    }
  }

  // This method true if all forms are valid. Need to access using viewchild or viewchildren
  checkFormValidity() {
    let formValid;
    let formModified;
    let isBankFormValid;
    const isPayeeFormValid = this.payeeForm ? this.payeeForm?.valid : true;
    if (this.bankEditForm && this.showSaudiAddnewIban) {
      isBankFormValid = this.bankEditForm?.get('ibanBankAccountNo')?.valid
        ? this.bankEditForm?.get('ibanBankAccountNo')?.valid
        : false;
    } else if (this.bankEditForm && !this.showSaudiAddnewIban) {
      isBankFormValid = this.isValidSwiftCode() ? this.isValidSwiftCode() : false;
    } else {
      isBankFormValid = this.bankEditForm ? this.bankEditForm.valid : true;
    }
    let isSelectIbanFormValid = this.selectIbanForm ? this.selectIbanForm.valid : true;
    const isPayeeFormModified = this.payeeForm ? this.payeeForm.dirty : false;
    const isBankFormModified = this.bankEditForm ? this.bankEditForm.dirty : false;
    const isSelectIbanFormModified = this.selectIbanForm ? this.selectIbanForm.dirty : false;
    // if (this.isIndividualApp) {
    //   isPayeeFormValid = isPayeeFormModified = true;
    // }
    if (this.payeeDetail?.paymentMode?.english === BenefitValues.cheque) {
      isBankFormValid = isSelectIbanFormValid = true;
    }
    if (isPayeeFormValid && isBankFormValid && isSelectIbanFormValid) {
      formValid = true;
    } else {
      formValid = false;
    }
    if (!this.isValidatorEdit && this.isHeir) {
      if (
        this.heirDetail?.payeeType?.english === this.payeeDetail?.payeeType?.english &&
        this.heirDetail?.paymentMode?.english === this.payeeDetail.paymentMode.english &&
        this.payeeDetail.paymentMode?.english === BenefitValues.BANK &&
        this.selectIbanForm?.value
      ) {
        formValid = true;
      } else if (
        this.heirDetail?.payeeType?.english === this.payeeDetail?.payeeType?.english &&
        this.heirDetail?.paymentMode?.english === this.payeeDetail.paymentMode.english &&
        this.payeeDetail.paymentMode?.english === BenefitValues.BANK &&
        !this.bankEditForm?.get('ibanBankAccountNo').value &&
        !this.bankEditForm?.get('nonSaudiIbanAccNo').value
      ) {
        formValid = false;
      } else if (
        this.heirDetail?.payeeType?.english === this.payeeDetail?.payeeType?.english &&
        this.heirDetail?.paymentMode?.english === this.payeeDetail.paymentMode.english &&
        this.payeeDetail.paymentMode?.english === BenefitValues.cheque
      ) {
        formValid = false;
      } else if (isPayeeFormValid && isBankFormValid && isSelectIbanFormValid) {
        formValid = true;
      } else {
        formValid = false;
      }
    }
    // Defect 598509
    if (this.isModifybank && !this.isValidatorEdit && this.heirDetail?.bankAccount) {
      if (
        this.heirDetail?.payeeType?.english === this.payeeDetail?.payeeType?.english &&
        this.heirDetail?.paymentMode?.english === this.payeeDetail.paymentMode.english &&
        this.payeeDetail.paymentMode?.english === BenefitValues.BANK &&
        this.selectIbanForm?.get('selectIbanMode').get('english').value ===
          this.heirDetail?.bankAccount?.ibanBankAccountNo
      ) {
        formValid = false;
      }
    }
    if (isPayeeFormModified || isBankFormModified || isSelectIbanFormModified) {
      formModified = true;
    } else {
      formModified = false;
    }
    return { formValid: formValid, formModified: formModified };
  }
  isValidSwiftCode() {
    return (
      this.bankEditForm?.get('nonSaudiIbanAccNo')?.valid &&
      this.bankEditForm?.get('nonSaudiBankName')?.valid &&
      this.bankEditForm?.get('swiftCode')?.valid
    );
  }
  /** Address Related Functions */
  setAdressRelatedValues() {
    // if (this.addressComponent && this.addressComponent.getAddressValidity()) {
    if (this.isAddressReadOnly) {
      this.payeeDetail.contactDetail = this.heirDetail?.contactDetail;
      this.payeeDetail.contactDetail.addresses = this.addressComponent?.getAddressDetails();
      this.payeeDetail.contactDetail.currentMailingAddress =
        this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
    } else {
      if (!this.payeeDetail.contactDetail) this.payeeDetail.contactDetail = new ContactDetails();
      this.payeeDetail.contactDetail.addresses = this.addressComponent?.getAddressDetails();
      this.payeeDetail.contactDetail.currentMailingAddress =
        this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
      this.addressComponent?.parentForm?.get('foreignAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('poBoxAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('saudiAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.updateValueAndValidity();
    }
    // }
  }

  // checkForAddresstype() {
  //   if (this.heirDetail?.contactDetail.currentMailingAddress === AddressTypeEnum.POBOX) {
  //     this.hasPOAddress = true;
  //   }
  //   if (this.heirDetail?.contactDetail.currentMailingAddress === AddressTypeEnum.NATIONAL) {
  //     this.hasNationalAddress = true;
  //   }
  //   if (this.heirDetail?.contactDetail.currentMailingAddress === AddressTypeEnum.OVERSEAS) {
  //     this.hasOverseasAddress = true;
  //   }
  // }
  nonSaudiBankName() {
    this.bankEditForm
      .get('nonSaudiBankName')
      ?.get('arabic')
      ?.patchValue(this.bankEditForm.get('nonSaudiBankName').get('english').value);
  }
}
