/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { LovList, CommonIdentity, BilingualText, GosiCalendar, ContactDetails, AddressTypeEnum, CoreAdjustmentService } from '@gosi-ui/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AttorneyDetailsWrapper } from '../../models/attorney-details-wrapper';
import { Observable } from 'rxjs';
import { BenefitValues, BenefitType } from '../../enum';
import { ManageBenefitService } from '../../services/manage-benefit.service';
import {
  SearchPerson,
  PersonalInformation,
  DependentDetails,
  PersonBankDetails,
  PatchPersonBankDetails,
  BankAccountList,
  AnnuityResponseDto
} from '../../models';

import { BenefitPropertyService } from '../../services';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bnt-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */

  id: number;
  payee: number;
  payeeForm: FormGroup;
  personName: string;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  attorneyList = <AttorneyDetailsWrapper[]>[];
  preSlctdAtrney: AttorneyDetailsWrapper;
  payeeNationality: string;
  readOnly = false;
  showContactWizard = false;

  typeSelected: string;
  savedAuthPersonId: number;
  payeesListWithGuardian = new LovList([]);
  payeeListToShow = new LovList([]);
  payeesListWithOutGuardian = new LovList([]);
  showBankDetail = false;
  authPersonId: number;
  // guardianPersonId: number;
  // newPaymentForm: FormGroup;
  BenefitValues = BenefitValues;

  @ViewChild('addressComponent', { static: false })
  addressComponent: AddressDcComponent;
  // savedBankDetails: PersonBankDetails;

  //Input variables
  @Input()
  public set attorneyDetailsWrapper(v: AttorneyDetailsWrapper[]) {
    this.attorneyList = v || [];
    // this.authPersonId = this.attorneyList[0]?.personId;
    if (this.preselctdAttorney && this.preselctdAttorney.length) {
      this.initializeForm();
      this.setAuthPersonDetails();
    } else if (this.authorizedPersonId) {
      this.initializeForm();
      const index = this.attorneyList.findIndex(item => item.personId === this.authorizedPersonId);
      if (index > -1) {
        this.setAuthPerson(this.attorneyList.findIndex(item => item.personId === this.authorizedPersonId));
      }
    }
  }
  @Input() activeBenefit;
  @Input() authorizedPersonId: number;
  @Input() paymentIndex = 0;
  @Input() payeeList: LovList;
  @Input() newBankForm = false;
  @Input() personStatus: PersonalInformation;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() paymentMethodList: LovList;
  @Input() isHeirDisabled = false;
  @Input() showPaymentMethod = false;
  @Input() isJailed: boolean;
  @Input() hidePayeeType = false;
  @Input() parentForm: FormGroup;
  @Input() dependentForm: FormGroup;
  @Input() savedPayeType: BilingualText;
  @Input() savedPayMethod: BilingualText;
  @Input() personId: string;
  @Input() isValidator = false;
  @Input() isDraft: boolean;
  @Input() preselctdAttorney = <AttorneyDetailsWrapper[]>[];
  @Input() addHeir = false;
  @Input() showGuardian = false;
  @Input() heirNationality: string;
  @Input() guardianSource: string;
  @Input() nationalityList$: Observable<LovList>;
  @Input() systemRunDate: GosiCalendar;
  @Input() guardianDetails: PersonalInformation; //Not used anymore
  @Input() guardianPersonId: number;
  @Input() listOfGuardians: AttorneyDetailsWrapper[];
  @Input() showCard = true;
  @Input() isRestartHeir = false;
  @Input() isIndividualApp: boolean;
  @Input() isPaymentOptional = false;
  @Input() isHeirAlive = true;
  @Input() hideChooseGuardian = false;
  @Input() showSelfOnly = false;
  //For banks
  @Input() bankDetails: PersonBankDetails; //BankAccountList
  @Input() bankAccountList: BankAccountList;
  @Input() showCardForBank = false;
  @Input() showInfo = true;
  @Input() hideSaveButton = false;
  @Input() showAccountInfo = true;
  @Input() saveApiResp: BilingualText;
  @Input() lang = 'en';
  @Input() bankName: BilingualText;
  @Input() showBankTransferOnly = true;
  @Input() heading = 'BENEFITS.PAYMENT-DETAILS';
  @Input() nonSaudiHeir = false;
  @Input() listYesNo: LovList;
  @Input() ibanBankAccountNo;
  @Input() showInternationalBank = true;
  @Input() savedAddress: ContactDetails;
  @Input() valNonsaudiBankDetails: PersonBankDetails;

  //for address
  @Input() isAddressReadOnly = false;
  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;
  @Input() isBankAccountRequired = true;
  //Output variables

  //  to be removed
  // @Output() showAddContactWizard: EventEmitter<Object> = new EventEmitter();
  // @Output() getContactDetailsForAuthPerson: EventEmitter<number> = new EventEmitter();
  //  to be removed
  @Output() loadBankInfoForId = new EventEmitter();
  @Output() clearSuccessMessage = new EventEmitter();
  @Output() searchForGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() getBankName: EventEmitter<string> = new EventEmitter();
  @Output() getAuthPerson: EventEmitter<string> = new EventEmitter();
  @Output() getGuardian: EventEmitter<string> = new EventEmitter();
  // @Output() navigateToAuthorizedPerson: EventEmitter<null> = new EventEmitter();
  /**
   * Output variables
   */
  @Output() saveBank: EventEmitter<PatchPersonBankDetails> = new EventEmitter(); //Not used for heir

  constructor(
    readonly manageBenefitService: ManageBenefitService,
    readonly fb: FormBuilder,
    readonly benefitPropertyService: BenefitPropertyService,
    
  ) {}
  /*
   * This methid is for initialization tasks
   */
  ngOnInit(): void {
    console.log(this.activeBenefit)
    this.initializeForm();
    if (this.parentForm) {
      if (this.parentForm.get('payeeForm')) this.parentForm.removeControl('payeeForm');
      this.parentForm.addControl('payeeForm', this.payeeForm);
    }
    if (!this.isRestartHeir) {
      this.payeeForm.removeControl('paymentDetailsUpdated');
    } else if (this.isPaymentOptional) {
      this.toggleSelected(false);
      this.payeeForm.get('paymentDetailsUpdated').disable();
    }
    // if (!this.newPaymentForm) this.newPaymentForm = this.createPaymentForm();
    //this.payeeForm.get('personId').patchValue(this.personId);
    this.payeeForm.get('personId').patchValue(this.annuityResponse?.agentId);
    if (this.benefitPropertyService.getPayeeNationality()) {
      this.payeeNationality = this.benefitPropertyService.getPayeeNationality();
    }
    if (this.heirNationality) {
      this.payeeNationality = this.heirNationality;
    }
        // this.initializePaymentDetails();
  }

  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.initializeForm();
      // if (changes.savedPayMethod && changes.savedPayeType.currentValue) {
      //   this.setPreSelectedValues();
      // }
      if (changes.payeeList && changes.payeeList.currentValue && changes.payeeList.currentValue.items.length) {
        this.initializePaymentDetails();
      }
      if (changes?.paymentMethodList?.currentValue?.items?.length) {
        this.paymentMethodList = changes?.paymentMethodList?.currentValue;
        this.setPaymentMethodList(this.paymentMethodList);
      }
      if (
        changes.preselctdAttorney &&
        changes.preselctdAttorney.currentValue &&
        changes.preselctdAttorney.currentValue.length
      ) {
        this.setPreselctdAttorneyAuthDetails(changes);
      }
      if (
        changes.showGuardian?.currentValue ||
        changes.isHeirAlive?.currentValue === false ||
        changes.isHeirAlive?.currentValue === true ||
        changes.isHeirDisabled?.currentValue === false ||
        changes.isHeirDisabled?.currentValue === true
      ) {
        this.showOrHideGuardian(this.showGuardian);
      }
      if (changes.guardianSource && changes.guardianSource.currentValue) {
        this.payeeForm.get('guardianSource').patchValue(changes.guardianSource.currentValue);
      }
      if (this.payeeForm.get('paymentMode.english').value === BenefitValues.cheque) {
        this.showBankDetail = false;
      }
      if (changes?.listOfGuardians?.currentValue) {
        this.setGuardianPerson();
      }
      // if (changes.isPaymentOptional && changes.isPaymentOptional.currentValue) {
      //   if (!this.newPaymentForm) this.newPaymentForm = this.createPaymentForm();
      //   this.newPaymentForm.get('isNewPayment').setValue(!this.isPaymentOptional);
      //   this.newPaymentForm.get('isNewPayment').disable();
      // }
    }
  }

  setAdressRelatedValues() {
    const contactDetails = new ContactDetails();
    if (this.isAddressReadOnly) {
      //contactDetails = this.heirDetail?.contactDetail;
      contactDetails.addresses = this.addressComponent?.getAddressDetails();
      contactDetails.currentMailingAddress = this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
    } else {
      contactDetails.addresses = this.addressComponent?.getAddressDetails();
      contactDetails.currentMailingAddress = this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
      this.addressComponent?.parentForm?.get('foreignAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('poBoxAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('saudiAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.updateValueAndValidity();
    }
    const formValidity = this.addressComponent?.getAddressValidity();
    const formValidator = formValidity ? null : Validators.required;
    if(this.payeeForm?.get('contactDetails')) {
      this.payeeForm?.removeControl('contactDetails');
      this.payeeForm?.get('contactDetails')?.updateValueAndValidity();
    }
    this.payeeForm?.addControl('contactDetails', new FormControl(contactDetails, formValidator));
    return contactDetails;
  }
  addressTypeChanged(type) {
    if (type === AddressTypeEnum.OVERSEAS) {
      this.countryList$ = this.countryList$.pipe(
        map(countryList => {
          return new LovList(countryList.items.filter(country => country.value.english !== 'Saudi Arabia'));
        })
      );
    }
  }
  getGuardianPerson(index: number) {
    if (!this.showPaymentMethod) this.payeeForm.get('paymentMode.english').setValue(BenefitValues.BANK);
    this.guardianPersonId = this.listOfGuardians[index].personId;
    this.payeeForm.get('guardianPersonId').setValue(this.listOfGuardians[index].personId);
    this.canEditBankDetails();
  }
  setGuardianPerson() {
    this.listOfGuardians?.forEach(guardian => {
      if (this.guardianPersonId === guardian?.personId) {
        this.payeeForm?.get('guardianPersonId')?.setValue(guardian.personId);
      }
    });
  }

  // createPaymentForm(): FormGroup {
  //   return this.fb.group({
  //     isNewPayment: [true, { validators: Validators.required, updateOn: 'blur' }]
  //   });
  // }

  initializeForm() {
    if (!this.payeeForm) {
      this.payeeForm = this.createPayeeForm();
      // if (this.parentForm) {
      //   if (this.parentForm.get('payeeForm')) this.parentForm.removeControl('payeeForm');
      //   this.parentForm.addControl('payeeForm', this.payeeForm);
      // }
    }
  }

  //set auth person details
  setAuthPersonDetails() {
    this.payeeForm.get('authorizedPersonId').setValue(this.preselctdAttorney[0].personId);
    this.payeeForm
      .get('authorizationDetailsId')
      .setValue(this.preselctdAttorney[0].attorneyDetails['authorizationDetailsId']);
    this.payeeForm.get('authorizationId').setValue(this.preselctdAttorney[0].attorneyDetails['authorizationId']);
    this.authPersonId = this.preselctdAttorney[0].personId || this.attorneyList[0].personId;
    this.savedAuthPersonId = this.preselctdAttorney[0].personId;
    this.manageBenefitService.authPersonId = this.authPersonId;
    this.manageBenefitService.setCertificateExpiryDate(this.attorneyList[0].attorneyDetails.certificateExpiryDate);
    // this.manageBenefitService.personId = this.authPersonId;
    // this.setPreselectedValuesForValidatorEditFlow(this.savedPayMethod, this.savedPayeType);
  }

  setPaymentMethodList(paymentMethodList) {
    this.paymentMethodList.items = this.showBankTransferOnly
      ? paymentMethodList.items.filter(paymentMethod => paymentMethod.value.english === BenefitValues.BANK)
      : paymentMethodList.items;
  }

  setPreselctdAttorneyAuthDetails(changes: SimpleChanges) {
    if (
      changes.preselctdAttorney.currentValue &&
      changes.preselctdAttorney.currentValue[0] &&
      changes.preselctdAttorney.currentValue[0].personId &&
      (!changes.preselctdAttorney.previousValue ||
        (changes.preselctdAttorney.previousValue[0] &&
          changes.preselctdAttorney.previousValue[0].personId !== changes.preselctdAttorney.currentValue[0].personId))
    ) {
      this.setAuthPersonDetails();
    }
  }

  /*
   * This method is to create payee form
   */
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: [BenefitValues.contributor, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      paymentMode: this.fb.group({
        english: [BenefitValues.BANK, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      authorizedPersonId: [null],
      personId: [null],
      authorizationDetailsId: [''],
      authorizationId: [''],
      guardianPersonId: [null],
      guardianSource: [null],
      paymentDetailsUpdated: [true]
    });
  }
  /*
   * This method is to set payee type
   * @param id
   */
  // 487276 val 1 cannot edit payment method
  selectPayeeType(type: string) {
    if (type) {
      this.typeSelected = type;
      this.clearSuccessMessage.emit();
      if (type === BenefitValues.contributor) {
        this.payeeForm?.get('payeeType').get('english').setValue(BenefitValues.contributor);
        this.payee = 1;
        if (!this.showPaymentMethod) this.payeeForm.get('paymentMode.english').setValue(BenefitValues.BANK);
        // this.manageBenefitService.personId = this.personId;
      } else if (type === BenefitValues.authorizedPerson) {
        this.payeeForm.get('payeeType').get('english').setValue(BenefitValues.authorizedPerson);
        this.payeeForm.get('paymentMode.english').setValue('');
        this.payee = 2;
        this.getAuthPerson.emit(this.personId);
      } else {
        this.payeeForm.get('payeeType').get('english').setValue(BenefitValues.guardian);
        this.payee = 3;
       // this.payeeForm.get('guardianPersonId').setValue(this.agentIdentifier);
        this.getGuardian.emit(this.personId);
      }
      if (this.manageBenefitService?.getPayeeNationality()) {
        this.payeeNationality = this.manageBenefitService?.getPayeeNationality();
      }
      if (this.heirNationality) {
        this.payeeNationality = this.heirNationality;
      }
      this.enableOrDisabelPaymentMethod(type);
      this.canEditBankDetails();
      // this.contactDetailsWizard();
    }
  }
  /**
   * This method is used to reset authorized person details
   *
   */
  resetAuthPersonDetails() {
    this.authPersonId = null;
    this.payeeForm.get('authorizedPersonId').setValue(null);
    this.loadBankInfoForId.emit();
  }

  // method to disable/enable payment method
  enableOrDisabelPaymentMethod(type: string) {
    this.readOnly = false;
    if (this.payeeNationality && this.isValidator) {
      if (this.payeeNationality === BenefitValues.SaudiArabia) {
        // if (this.addHeir) {
        if (this.savedPayMethod && this.savedPayeType) {
          if (this.savedPayeType.english === type) {
            if (type === BenefitValues.authorizedPerson) {
              if (this.authPersonId) {
                if (this.savedAuthPersonId === this.authPersonId) {
                  this.readOnly = this.savedPayMethod.english !== BenefitValues.cheque;
                  this.selectPaymentMethod(this.savedPayMethod.english);
                } else {
                  this.readOnly = false;
                }
              } else {
                this.readOnly = false;
              }
            } else {
              this.selectPaymentMethod(this.savedPayMethod.english);
              this.readOnly = this.savedPayMethod.english !== BenefitValues.cheque;
            }
          }
        }
      }
    }
  }

  /**
   * Method to get corresponding selected personid
   * @param id
   */
  setAuthPerson(id: number) {
    if (!this.showPaymentMethod) this.payeeForm.get('paymentMode.english').setValue(BenefitValues.BANK);
    this.clearSuccessMessage.emit();
    this.authPersonId = this.attorneyList[id].personId;
    this.manageBenefitService.authPersonId = this.authPersonId;
    this.manageBenefitService.setCertificateExpiryDate(this.attorneyList[id].attorneyDetails.certificateExpiryDate);
    // this.manageBenefitService.personId = this.authPersonId;
    this.payeeForm.get('authorizedPersonId').setValue(this.attorneyList[id].personId);
    this.payeeForm
      .get('authorizationDetailsId')
      .setValue(this.attorneyList[id].attorneyDetails['authorizationDetailsId']);
    this.payeeForm.get('authorizationId').setValue(this.attorneyList[id].attorneyDetails['authorizationId']);
    this.canEditBankDetails();
    // this.contactDetailsWizard();
    this.enableOrDisabelPaymentMethod(BenefitValues.authorizedPerson);
  }

  /*
   * This method is to set payee type
   */
  selectPaymentMethod(type: string) {
    this.clearSuccessMessage.emit();
    if (type === BenefitValues.BANK) {
      this.payeeForm.get('paymentMode.english').setValue(BenefitValues.BANK);
    } else if (type === BenefitValues.cheque) {
      this.payeeForm.get('paymentMode.english').setValue(BenefitValues.cheque);
      this.payeeForm.removeControl('bankAccount');
      // For old bank account dc form
      this.parentForm.removeControl('bankAccount');
    }
    this.canEditBankDetails();
    // this.contactDetailsWizard();
  }

  /*
   * This method is to set preselected values
   */
  setPreSelectedValues() {
    if (this.savedPayeType && this.savedPayMethod) {
      this.setPreselectedValuesForValidatorEditFlow(this.savedPayMethod, this.savedPayeType);
    } else if (this.payeeListToShow.items.length === 1) {
      this.selectPayeeType(this.payeeListToShow.items[0].value.english);
    } else if (this.isHeirAlive) {
      this.payee = 1;
      this.payeeForm?.get('payeeType').get('english').setValue(BenefitValues.contributor);
      this.payeeForm?.get('paymentMode.english').setValue(BenefitValues.BANK);
      this.canEditBankDetails();
      // this.contactDetailsWizard();
    }
  }

  /*
   * This method is to set preselected values for isValidator edit flow
   */
  setPreselectedValuesForValidatorEditFlow(method: BilingualText, type: BilingualText) {
    this.selectPayeeType(type?.english);
    this.selectPaymentMethod(method?.english);
    this.canEditBankDetails();
    // this.contactDetailsWizard();
  }

  /*
   * This method is to check bank details can be editted
   */
  canEditBankDetails() {
    this.showBankDetail = false;
    if (this.payeeForm && this.payeeForm.get('paymentMode.english').value === BenefitValues.BANK) {
      if (
        this.payeeForm.get('payeeType.english').value === BenefitValues.contributor &&
        (this.personId || this.nonSaudiHeir)
      ) {
        this.loadBankInfoForId.emit(this.personId);
        this.showBankDetail = true;
      } else if (
        this.payeeForm.get('payeeType.english').value === BenefitValues.authorizedPerson &&
        this.authPersonId
      ) {
        this.loadBankInfoForId.emit(this.authPersonId);
        this.showBankDetail = true;
      } else if (this.payeeForm.get('payeeType.english').value === BenefitValues.guardian && this.guardianPersonId) {
        this.loadBankInfoForId.emit(this.guardianPersonId);
        this.showBankDetail = true;
      }
    }
  }

  getBankForGuardian(persionId: number) {
    this.loadBankInfoForId.emit(persionId);
  }

  /*
   * This method is to initiallize payee type
   */
  initializePaymentDetails() {
    if (this.payeesListWithOutGuardian?.items?.length === 0 && this.payeesListWithGuardian?.items?.length === 0) {
      this.payeeList?.items?.forEach(p => {
        if (p?.value?.english !== BenefitValues.guardian) {
          this.payeesListWithOutGuardian?.items?.push(p);
        }
        if (p?.value?.english !== BenefitValues.authorizedPerson) {
          this.payeesListWithGuardian?.items?.push(p);
        }
      });
    }
    this.showOrHideGuardian(this.showGuardian);
  }

  showOrHideGuardian(show: boolean) {
    //TODO: called multiple times fix it
    // if (this.addHeir && (show || this.isHeirDisabled)) {
    //   this.payeeListToShow = this.payeesListWithGuardian;
    // } else {
    //   this.payeeListToShow = this.payeesListWithOutGuardian;
    // }
    this.payeeListToShow.items = this.payeeList?.items;
    if (!this.isHeirAlive) {
      this.payeeListToShow.items = this.payeeList?.items?.filter(
        item => item.value.english !== BenefitValues.contributor
      );
      // For dead heir, payee type "self" is not there...so preselect authorizedPerson
      this.selectPayeeType(BenefitValues.authorizedPerson);
    }
    if (this.showSelfOnly) {
      this.payeeListToShow.items = this.payeeList?.items?.filter(
        item => item.value.english === BenefitValues.contributor
      );
    }
    this.setPreSelectedValues();
  }

  searchGuardian(data: SearchPerson) {
    this.searchForGuardian.emit(data);
  }

  saveBankDetails(event: PatchPersonBankDetails) {
    this.saveBank.emit(event);
  }

  getBankNameFor(iban: string) {
    this.getBankName.emit(iban);
  }
  // navigateToAuthPerson(){
  //   this.navigateToAuthorizedPerson.emit()
  // }
  toggleSelected(value: boolean) {
    if (value === true) {
      this.parentForm.addControl('payeeForm', this.payeeForm);
    } else {
      this.parentForm.removeControl('payeeForm');
    }
  }
 
}
