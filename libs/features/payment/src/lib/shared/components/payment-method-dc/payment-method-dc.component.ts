/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { LovList, CommonIdentity, BilingualText, GosiCalendar, AddressTypeEnum, ContactDetails } from '@gosi-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttorneyDetailsWrapper } from '@gosi-ui/features/benefits/lib/shared/models/attorney-details-wrapper';
import { Observable } from 'rxjs';
import { BenefitValues, BenefitType } from '@gosi-ui/features/benefits/lib/shared/enum';
import { ManageBenefitService } from '@gosi-ui/features/benefits/lib/shared/services/manage-benefit.service';
import {
  SearchPerson,
  PersonalInformation,
  DependentDetails,
  PersonBankDetails,
  PatchPersonBankDetails,
  BankAccountList,
  AnnuityResponseDto
} from '@gosi-ui/features/benefits/lib/shared/models';
import { BenefitPropertyService } from '@gosi-ui/features/benefits/lib/shared/services';
import { MiscellaneousPayment } from '../../models';
import { map } from 'rxjs/operators';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
@Component({
  selector: 'pmt-payment-method-dc',
  templateUrl: './payment-method-dc.component.html',
  styleUrls: ['./payment-method-dc.component.scss']
})
export class PaymentMethodDcComponent implements OnInit, OnChanges {
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
  newPaymentForm: FormGroup;
  BenefitValues = BenefitValues;

  @ViewChild('addressComponent', { static: false })
  addressComponent: AddressDcComponent;
  // savedBankDetails: PersonBankDetails;

  //Input variables
  @Input()
  public set attorneyDetailsWrapper(v: AttorneyDetailsWrapper[]) {
    this.attorneyList = v || [];
    this.authPersonId = this.attorneyList[0]?.personId;
  }
  @Input() payDetails: MiscellaneousPayment;
  @Input() paymentIndex = 0;
  @Input() payeeList: LovList;
  @Input() newBankForm = false;
  @Input() personStatus: PersonalInformation;
  @Input() agentId: number;
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
  @Input() guardianDetails: PersonalInformation;
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
  @Input() savedAddress: ContactDetails;
  @Input() valNonsaudiBankDetails: PersonBankDetails;

  //for address
  @Input() isAddressReadOnly = false;
  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;
  //Output variables

  //  to be removed
  // @Output() showAddContactWizard: EventEmitter<Object> = new EventEmitter();
  // @Output() getContactDetailsForAuthPerson: EventEmitter<number> = new EventEmitter();
  //  to be removed
  @Output() loadBankInfoForId = new EventEmitter();
  @Output() clearSuccessMessage = new EventEmitter();
  @Output() searchForGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() getBankName: EventEmitter<string> = new EventEmitter();
  // @Output() navigateToAuthorizedPerson: EventEmitter<null> = new EventEmitter();
  /**
   * Output variables
   */
  @Output() saveBank: EventEmitter<PatchPersonBankDetails> = new EventEmitter(); //Not used for heir

  constructor(
    readonly manageBenefitService: ManageBenefitService,
    readonly fb: FormBuilder,
    readonly benefitPropertyService: BenefitPropertyService
  ) {}
  /*
   * This methid is for initialization tasks
   */
  ngOnInit(): void {
    this.initializeForm();
    if (!this.newPaymentForm) this.newPaymentForm = this.createPaymentForm();
    //this.payeeForm.get('personId').patchValue(this.personId);
    this.payeeForm.get('personId').patchValue(this.agentId);
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
      if (changes.isPaymentOptional && changes.isPaymentOptional.currentValue) {
        if (!this.newPaymentForm) this.newPaymentForm = this.createPaymentForm();
        this.newPaymentForm.get('isNewPayment').setValue(!this.isPaymentOptional);
        this.newPaymentForm.get('isNewPayment').disable();
      }
      if (changes.bankAccountList?.currentValue) {
        this.bankAccountList = changes.bankAccountList?.currentValue;
        if (this.payDetails?.bankAccountList?.length) {
          this.bankAccountList?.bankAccountList?.map(bank => {
            if (bank.ibanBankAccountNo === this.payDetails?.bankAccountList[0]?.ibanBankAccountNo)
              bank.savedAccount = true;
          });
        }
      }
    }
  }

  setAuthPersonDetail(payeeType: BilingualText) {
    if (payeeType?.english === BenefitValues.authorizedPerson) {
      this.authPersonId = this.agentId;
      this.payeeForm?.get('authorizedPersonId')?.setValue(this.authPersonId);
    }
    if (payeeType?.english === BenefitValues.guardian) {
      this.guardianPersonId = this.agentId;
      this.payeeForm?.get('guardianPersonId')?.setValue(this.authPersonId);
    }
  }
  setAdressRelatedValues() {
    const contactDetails = new ContactDetails();
    if (this.isAddressReadOnly) {
      //contactDetails = this.heirDetail?.contactDetail;
      contactDetails.addresses = this.addressComponent?.getAddressDetails();
      contactDetails.currentMailingAddress =
        this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;   
    } else {
      contactDetails.addresses = this.addressComponent?.getAddressDetails();
      contactDetails.currentMailingAddress =
        this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
      this.addressComponent?.parentForm?.get('foreignAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('poBoxAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('saudiAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.updateValueAndValidity();
    }
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
  createPaymentForm(): FormGroup {
    return this.fb.group({
      isNewPayment: [true, { validators: Validators.required, updateOn: 'blur' }]
    });
  }

  initializeForm() {
    if (!this.payeeForm) {
      this.payeeForm = this.createPayeeForm();
      if (this.parentForm) {
        if (this.parentForm.get('payeeForm')) this.parentForm.removeControl('payeeForm');
        this.parentForm.addControl('payeeForm', this.payeeForm);
      }
    }
  }

  //set auth person details
  setAuthPersonDetails() {
    this.payeeForm.get('authorizedPersonId').setValue(this.preselctdAttorney[0].personId);
    this.payeeForm
      .get('authorizationDetailsId')
      .setValue(this.preselctdAttorney[0].attorneyDetails['authorizationDetailsId']);
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
      guardianPersonId: [null],
      guardianSource: [null]
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
        // this.manageBenefitService.personId = this.personId;
      } else if (type === BenefitValues.authorizedPerson) {
        this.payeeForm.get('payeeType').get('english').setValue(BenefitValues.authorizedPerson);
        this.payeeForm.get('paymentMode.english').setValue('');
        this.payee = 2;
      } else {
        this.payeeForm.get('payeeType').get('english').setValue(BenefitValues.guardian);
        this.payee = 3;
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
    this.clearSuccessMessage.emit();
    this.authPersonId = this.attorneyList[id].personId;
    this.manageBenefitService.authPersonId = this.authPersonId;
    this.manageBenefitService.setCertificateExpiryDate(this.attorneyList[id].attorneyDetails.certificateExpiryDate);
    // this.manageBenefitService.personId = this.authPersonId;
    this.payeeForm.get('authorizedPersonId').setValue(this.attorneyList[id].personId);
    this.payeeForm
      .get('authorizationDetailsId')
      .setValue(this.attorneyList[id].attorneyDetails['authorizationDetailsId']);
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
    if (this.savedPayeType || this.savedPayMethod) {
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
    this.selectPayeeType(type.english);
    this.selectPaymentMethod(method.english);
    this.setAuthPersonDetail(type);
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
  // new requirement -- contact details to be shown for all benefits even if bank transfer is selected
  // Defect 482679
  /*
   * This method is to show contact details wizard
   */
  // contactDetailsWizard() {
  //   let showCont = false;
  //   if (this.payeeForm) {
  //     if (this.payeeForm.get('paymentMode.english').value === BenefitValues.cheque) {
  //       if (this.payeeForm.get('payeeType.english').value === BenefitValues.contributor) {
  //         if (this.addHeir) {
  //           showCont = false;
  //         } else {
  //           showCont = true;
  //         }
  //       } else if (this.authPersonId) {
  //         showCont = true;

  //         this.getContactDetailsForAuthPerson.emit(this.authPersonId);
  //       }
  //     }
  //   }
  //   this.showAddContactWizard.emit(showCont);
  // }

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
      // this.payeeListToShow.items.forEach((payeeType, index) => {
      //   if (payeeType.value.english === BenefitValues.contributor) this.payeeListToShow.items.splice(index, 1);
      // });
      this.payeeListToShow.items = this.payeeList?.items?.filter(
        item => item?.value?.english !== BenefitValues.contributor
      );
    }
    if (this.showSelfOnly) {
      this.payeeListToShow.items = this.payeeList?.items?.filter(
        item => item?.value?.english === BenefitValues.contributor
      );
    }
    // else {
    //   this.payeeList.items.forEach(p => {
    //     if (p.value.english === BenefitValues.contributor) {
    //       this.payeeListToShow.items.unshift(p);
    //     }
    //   });
    //   this.payeeListToShow.items = [...new Set(this.payeeListToShow.items)];
    // }
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
}
