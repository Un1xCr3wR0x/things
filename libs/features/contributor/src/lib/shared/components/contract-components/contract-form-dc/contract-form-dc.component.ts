/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BankAccount,
  convertToStringDDMMYYYY,
  equaltozeroValidator,
  GosiCalendar,
  hijiriToJSON,
  LanguageToken,
  lessThanValidator,
  LovList,
  markFormGroupTouched,
  maxDateValidator,
  minDateValidator,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContractAuthConstant, ContributorConstants } from '../../../constants';
import { ContributorTypesEnum } from '../../../enums';
import { ContractDetails, ContractRequest, EngagementDetails } from '../../../models';
import { ContactFormDcHelper } from './contract-form-dc-helper';
@Component({
  selector: 'cnt-contract-form-dc',
  templateUrl: './contract-form-dc.component.html',
  styleUrls: ['./contract-form-dc.component.scss']
})
export class ContractFormDcComponent extends ContactFormDcHelper implements OnInit, OnChanges {
  /** Local variables. */
  _contractAtDraft: ContractDetails;
  _pendingAtValContract: ContractDetails;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  calenderList: LovList;
  minDate = new Date();
  daysOfWeek = ContractAuthConstant.WORKING_DAYS;
  lang = 'en';
  minMaxLengthAccountNo = 24;
  tempMonthList: LovList = new LovList([]);
  tempYearList: LovList = new LovList([]);
  systemDate: Date = new Date();
  contractDetails: ContractRequest;
  isBankEdit: boolean; //Flag  to check whether bank edit section is open

  /** Input variables. */
  @Input() activeEngagement: EngagementDetails;
  @Input() bankAccount: BankAccount = new BankAccount();
  @Input() contributorType: string;
  @Input() isContributorAbroad: boolean;
  @Input() internationalCountryList: LovList = new LovList([]);
  @Input() cityList: LovList = new LovList([]);
  @Input() bankNameList$: Observable<LovList>;
  @Input() religionList: LovList;
  @Input() showPreviousButton: boolean;
  @Input() parentForm: FormGroup;
  @Input() isEditMode: boolean;
  @Input() isBankDetailsPending: boolean;
  @Input() minStartDate: GosiCalendar;
  @Input() isApiTriggered: boolean;
  @Input() public get contractAtValidator() {
    return this._pendingAtValContract;
  }
  public set contractAtValidator(pendingAtValContract) {
    this._pendingAtValContract = pendingAtValContract;
    if (this.contractDetailsForm && this._pendingAtValContract) {
      this.updateContractDetailsForm(pendingAtValContract);
    }
  }
  @Input() public get contractAtDraft() {
    return this._contractAtDraft;
  }
  public set contractAtDraft(pendingContract) {
    this._contractAtDraft = pendingContract;
    if (this.contractDetailsForm && this._contractAtDraft) {
      this.updateContractDetailsForm(pendingContract);
    }
  }

  /** Output variables. */
  @Output() saveContractClicked: EventEmitter<object> = new EventEmitter();
  @Output() previousContractClicked: EventEmitter<null> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();

  /** Creates an instance of ContractFormDcComponent. */
  constructor(fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super(fb);
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
    this.tempList = new LovList(this.items);
    this.annualLeaveList = new LovList(this.annualLeaveItems);
    const item = [
      {
        value: { english: 'Gregorian', arabic: 'ميلادي' },
        sequence: 1
      },
      {
        value: { english: 'Hijiri', arabic: 'هجري' },
        sequence: 2
      }
    ];
    this.calenderList = new LovList(item);
    if (this.contributorType === ContributorTypesEnum.SAUDI) {
      this.contractTypeList.items.push({ value: { english: 'Limited', arabic: 'محدد المدة' }, sequence: 1 });
      this.contractTypeList.items.push({ value: { english: 'Unlimited', arabic: 'غير محدد المدة' }, sequence: 2 });
      this.contractTypeList.items.push({
        value: { english: 'Contract related to the completion of work', arabic: 'عقد عمل لإنجاز عمل معين' },
        sequence: 3
      });
    } else {
      this.contractTypeList.items.push({ value: { english: 'Limited', arabic: 'محدد المدة' }, sequence: 1 });
      this.contractTypeList.items.push({
        value: { english: 'Contract related to the completion of work', arabic: 'عقد عمل لإنجاز عمل معين' },
        sequence: 3
      });
    }
    if (this.contributorType === ContributorTypesEnum.SAUDI) {
      this.contractDetailsForm.get('contractType').enable();
      this.contractDetailsForm
        .get('workDetails')
        .get('noticePeriod')
        .setValidators(Validators.compose([Validators.min(0), Validators.max(120)]));
      this.contractDetailsForm.get('workDetails').get('noticePeriod').updateValueAndValidity();
      this.contractDetailsForm.get('workDetails.noticePeriod').setValue(null);
    } else {
      this.contractDetailsForm.get('contractType').enable();
      this.addReligion();
      this.addNoticePeriod();
    }
    this.loadContractPeriodList();
    this.tempMonthList = this.monthList;
    this.tempYearList = this.yearList;
    if (this._contractAtDraft) {
      this.updateContractDetailsForm(this._contractAtDraft);
    }
    if (this._pendingAtValContract) {
      this.updateContractDetailsForm(this._pendingAtValContract);
    }
    if (this.parentForm) {
      this.parentForm.addControl('contractDetailsForm', this.contractDetailsForm);
    }
  }

  /** This method is used to handle the changes in the input variables. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.minStartDate && changes.minStartDate.currentValue) this.setContractStartDateValidators();
  }

  /** Method to set contract startdate validations. */
  setContractStartDateValidators() {
    this.minStartDate.gregorian = new Date(this.minStartDate.gregorian);
    this.minStartDate.hijiri = convertToStringDDMMYYYY(this.minStartDate.hijiri);
    this.contractDetailsForm
      .get('startDate.gregorian')
      .setValidators([
        Validators.required,
        minDateValidator(this.minStartDate.gregorian),
        maxDateValidator(this.systemDate)
      ]);
    this.contractDetailsForm.get('startDate.gregorian').updateValueAndValidity();
    this.contractDetailsForm
      .get('startDate.hijiri')
      .setValidators([minDateValidator(moment(this.minStartDate.hijiri).toDate()), maxDateValidator(this.systemDate)]);
    this.contractDetailsForm.get('startDate.hijiri').updateValueAndValidity();
  }

  /** Method to set transportation allowance validator */
  setTransportValidator() {
    this.contractDetailsForm
      .get('workDetails.transportationAllowance')
      .setValidators(
        Number(this.activeEngagement?.engagementPeriod[0]?.wage?.otherAllowance) === 0
          ? equaltozeroValidator(0)
          : lessThanValidator(Number(this.activeEngagement?.engagementPeriod[0]?.wage?.otherAllowance))
      );
    this.contractDetailsForm.get('workDetails.transportationAllowance').updateValueAndValidity();
  }

  /** Method to add religion */
  addReligion() {
    this.contractDetailsForm.addControl(
      'religion',
      this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    );
  }

  /** Method to add noticePeriod */
  addNoticePeriod() {
    this.contractDetailsForm
      .get('workDetails.noticePeriod')
      .setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(120)]));
    this.contractDetailsForm.get('workDetails.noticePeriod').updateValueAndValidity();
  }

  /** Method to toggle bank edit mode. */
  toggleBankEditMode(flag: boolean) {
    this.isBankEdit = flag;
  }

  /** Method to save contract details */
  saveContractDetails() {
    this.contractDetailsForm.markAllAsTouched();
    if (!this.isEditMode && this.parentForm.get('bankDetailsForm'))
      markFormGroupTouched(this.parentForm.get('bankDetailsForm') as FormGroup);
    if (
      this.contractDetailsForm.valid &&
      this.checkBankFormValidity(this.parentForm.get('bankDetailsForm') as FormGroup) &&
      !this.isBankEdit
    )
      this.saveDetails();
    else if (this.contractDetailsForm.valid && this.isBankEdit) this.showError.emit('CONTRIBUTOR.UNSAVED-BANK-ERROR');
    else this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
  }

  /** Method to check bank form validity. */
  checkBankFormValidity(bankForm: FormGroup) {
    return this.isEditMode ? true : bankForm ? bankForm.valid : true;
  }

  /** Method to save details. */
  saveDetails() {
    this.contractDetails = {
      ...this.contractDetailsForm.value,
      contractType: this.contractDetailsForm.getRawValue()['contractType'],
      workDetails: {
        ...(<FormGroup>this.contractDetailsForm.get('workDetails')).value,
        annualLeaveInDays: parseInt(this.contractDetailsForm.get('workDetails').value['annualLeaveInDays'], 10),
        probationPeriodInDays: parseInt(this.contractDetailsForm.get('workDetails').value['probationPeriodInDays'], 10),
        workingDays: parseInt(this.contractDetailsForm.get('workDetails').value['workingDays'], 10),
        workingHrs: parseInt(this.contractDetailsForm.get('workDetails').value['workingHrs'], 10)
      },
      dateFormat:
        this.contractDetailsForm.value['dateFormat']['english'] === this.typeGregorian
          ? this.typeGregorian
          : this.typeHijira,
      bankAccount: this.assembleBankDetails(this.parentForm.get('bankDetailsForm') as FormGroup)
    };
    if (this.contractDetailsForm.get('contractType.english').value === 'Limited') {
      this.contractDetails = {
        ...this.contractDetails,
        contractPeriod: {
          years: parseInt(this.contractDetailsForm.get('contractPeriod').value['years']['english'], 10),
          months: parseInt(this.contractDetailsForm.get('contractPeriod').value['months']['english'], 10)
        }
      };
    }
    if (
      this.contractDetailsForm.get('startDate.hijiri').value !== null &&
      this.contractDetailsForm.get('dateFormat.english').value === this.typeHijira
    ) {
      this.contractDetails = {
        ...this.contractDetails,
        startDate: {
          gregorian: null,
          hijiri: hijiriToJSON(this.contractDetailsForm.get('startDate.hijiri').value)
        }
      };
    } else if (
      this.contractDetailsForm.get('startDate.gregorian').value !== null &&
      this.contractDetailsForm.get('dateFormat.english').value === this.typeGregorian
    ) {
      this.contractDetails = {
        ...this.contractDetails,
        startDate: {
          gregorian: startOfDay(this.contractDetailsForm.get('startDate.gregorian').value),
          hijiri: null
        }
      };
    }
    if (this.contractDetailsForm.get('workDetails').value['transportationAllowance']) {
      this.contractDetails = {
        ...this.contractDetails,
        workDetails: {
          ...this.contractDetails.workDetails,
          transportationAllowance: Number(
            parseFloat(this.contractDetailsForm.get('workDetails').value['transportationAllowance']).toFixed(2)
          )
        }
      };
    }
    if (this.contributorType === ContributorTypesEnum.SAUDI) {
      this.contractDetails = {
        ...this.contractDetails,
        workDetails: {
          ...this.contractDetails.workDetails,
          noticePeriod: null
        }
      };
    }
    this.saveContractClicked.emit(this.contractDetails);
  }

  /** Method to assemble bank details. */
  assembleBankDetails(bankDetailsForm: FormGroup): BankAccount {
    if (
      bankDetailsForm &&
      (this.bankAccount ? this.bankAccount.ibanAccountNo : '') !== bankDetailsForm.get('ibanAccountNo').value
    ) {
      return <BankAccount>bankDetailsForm.getRawValue();
    } else return this.bankAccount;
  }

  /** Method to switch calendar type */
  switchCalendarType(type) {
    this.contractDetailsForm.get('dateFormat.english').setValue(type);
  }

  /** Method to get month list */
  getMonthList(years) {
    if (this.contractDetailsForm && this.contractDetailsForm.get('contractType.english').value === 'Limited') {
      if (parseInt(years, 10) === 0) {
        const items = this.monthList.items.filter(res => parseInt(res.value.english, 10) > 0);
        this.tempMonthList = new LovList(items);
      } else {
        this.tempMonthList = this.monthList;
      }
    }
  }

  /** Method to get year list */
  getYearList(month) {
    if (this.contractDetailsForm && this.contractDetailsForm.get('contractType.english').value === 'Limited') {
      if (parseInt(month, 10) === 0) {
        const items = this.yearList.items.filter(res => parseInt(res.value.english, 10) > 0);
        this.tempYearList = new LovList(items);
      } else {
        this.tempYearList = this.yearList;
      }
    }
  }

  /** Method to set rest days */
  setRestDays(days) {
    if (days) {
      this.contractDetailsForm.get('workDetails.restDaysPerWeek').setValue(this.daysOfWeek[6 - days]);
      this.contractDetailsForm.get('workDetails.restDaysPerWeek').disable();
    } else {
      this.contractDetailsForm.get('workDetails.restDaysPerWeek').setValue(null);
    }
  }

  /** Method to navigate to previous section. */
  navigateToPreviousSection() {
    this.previousContractClicked.emit();
  }
}
