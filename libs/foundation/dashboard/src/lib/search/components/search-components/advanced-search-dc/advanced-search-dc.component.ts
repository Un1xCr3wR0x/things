/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, Inject  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchRequest, RequestFilter } from '../../../../shared';
import { InputDateDcComponent } from '@gosi-ui/foundation-theme/src';
import { LovList, Lov, BilingualText, addMonths, startOfDay, minDateValidator, maxDateValidator, ChannelConstants, Channel, LanguageToken } from '@gosi-ui/core';
import moment from 'moment';
import { TransactionTypeConstants } from 'libs/core/src/lib/constants/transaction-type-constants';
import { TransactionsFilterConstants } from '../../../constants';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'dsb-advanced-search-dc',
  templateUrl: './advanced-search-dc.component.html',
  styleUrls: ['./advanced-search-dc.component.scss']
})
export class AdvancedSearchDcComponent implements OnInit, OnChanges {
  maxDate = new Date();
  unifiedEstablishmentIdValidate: boolean;
  unifiedEstablishmentIdPrefixValidate: boolean;
  establishmentIdPrefixValidate: boolean;
  establishmentIdValidate: boolean;

  minStartDate = new Date();
  maxStartDate = new Date();
  minEndDate = new Date();
  maxEndDate = new Date();
  currentDate = new Date();
  lang = 'en';
  txnStatusList: LovList;
  selectedStatusOptions: BilingualText[] = [];
  selectedChannelOptions: BilingualText[] = [];
  channelList: LovList;
  transactionFilter: RequestFilter = new RequestFilter();
  txnTypesList: LovList;
  selectedTransactionTypesOptions: BilingualText[] = [];
  /**
   * input variables
   */
  @Input() isTransaction = false;
  @Input() isIndividual = false;
  @Input() isEstablishment = false;
  @Input() searchRequest: SearchRequest = new SearchRequest();
  @Input() parentForm = new FormGroup({});
  @Input() nationalityList: LovList;
  @Input() registrationStatusList: LovList;
  @Input() gccCountryList: LovList;
  selectedRegistrationStatus: BilingualText[] = [];
  selectedGccCountry: BilingualText[] = [];
  /**
   * output variables
   */
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() filter: EventEmitter<RequestFilter> = new EventEmitter();
  @ViewChild('datePicker') datePicker: InputDateDcComponent;
  constructor(readonly formBuilder: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {}
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.parentForm && changes.parentForm.currentValue) {
        this.parentForm = changes.parentForm.currentValue;
        if (this.parentForm) {
          if (this.isTransaction) {
            this.txnStatusList = new LovList(TransactionsFilterConstants.FILTER_FOR_TRANSACTIONS);
            this.channelList = new LovList(ChannelConstants.CHANNELS_ADVANCED_SEARCH_TRANSACTIONS
              .filter(
                item => item.channelType !== Channel.THIRD_PARTY && item.display !== false
            ));
            this.txnTypesList = new LovList(TransactionTypeConstants.TRANSACTION_TYPE_FILTER_TRANSACTIONS);
            this.parentForm.addControl('advancedSearchForm', this.createTransactionAdvancedSearchForm);
          }
          if (this.isEstablishment) {
            this.parentForm.addControl('advancedSearchForm', this.createEstablishmentAdvancedSearchForm);
            this.selectedRegistrationStatus = this.searchRequest.searchParam.registrationStatus;
          }
          if (this.isIndividual) {
            this.parentForm.addControl('advancedSearchForm', this.createIndividualAdvancedSearchForm);
          }
        }
      }
      if (changes.nationalityList && changes.nationalityList.currentValue)
        this.nationalityList = changes.nationalityList.currentValue;
      if (changes.gccCountryList && changes.gccCountryList.currentValue)
        this.gccCountryList = changes.gccCountryList.currentValue;
      if (changes.registrationStatusList && changes.registrationStatusList.currentValue)
        this.registrationStatusList = changes.registrationStatusList.currentValue;
    }
  }
  /**
   * method to create transaction advanced search form
   */
  get createTransactionAdvancedSearchForm() {
    this.maxStartDate = this.currentDate;
    this.maxEndDate = moment().subtract(1, 'days').toDate();

    this.minStartDate = new Date();
    this.minEndDate = this.minStartDate;
    return this.formBuilder.group({
      status: this.formBuilder.group({
        english: [null],
        arabic: [null]
      }),
      channel: this.formBuilder.group({
        english: [null],
        arabic: [null]
      }),
      transactionId: this.formBuilder.group({
        english: [null],
        arabic: [null]
      }),
      personIdentifier: [this.searchRequest?.searchParam?.personIdentifier],
      registrationNo: [this.searchRequest?.searchParam?.registrationNo],
      startDate: this.formBuilder.group({
        gregorian: [
          this.searchRequest?.searchParam?.startDate?.gregorian,
          {
            validators: Validators.compose([maxDateValidator(this.maxStartDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      endDate: this.formBuilder.group({
        gregorian: [
          this.searchRequest?.searchParam?.endDate?.gregorian,
          {
            validators: Validators.compose([maxDateValidator(this.maxEndDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      })
    });
  }
  /**
   * method to create establishment advanced search form
   */
  get createEstablishmentAdvancedSearchForm() {
    this.selectedGccCountry = this.searchRequest?.searchParam?.gccCountryList;
    return this.formBuilder.group({
      personIdentifier: [this.searchRequest?.searchParam?.personIdentifier],
      phoneNumber: [
        this.searchRequest?.searchParam?.phoneNumber,
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]
      ],
      licenceNo: [this.searchRequest?.searchParam?.licenceNo],
      commercialRegistrationNo: [this.searchRequest?.searchParam?.commercialRegistrationNo],
      recruitmentNo: [this.searchRequest?.searchParam?.recruitmentNo],
      unifiedIdentificationNo: [this.searchRequest?.searchParam?.unifiedIdentificationNo],
      gccId: [this.searchRequest?.searchParam?.gccId],
      gccCountry: this.formBuilder.group({
        english: [null],
        arabic: [null]
      }),
      registrationStatus: this.formBuilder.group({
        english: [null],
        arabic: [null]
      }),
      registrationStatusValue: [],
      gccCountryCode: [],
      gccCountryList: [],
      establishmentId: [this.searchRequest?.searchParam?.establishmentId],
      establishmentIdPrefix: [this.searchRequest?.searchParam?.establishmentIdPrefix],
      unifiedEstablishmentIdPrefix: [this.searchRequest?.searchParam?.unifiedEstablishmentIdPrefix],
      unifiedEstablishmentId: [this.searchRequest?.searchParam?.unifiedEstablishmentId]
    });
  }
  /**
   * method to create person search form
   */
  get createIndividualAdvancedSearchForm() {
    return this.formBuilder.group({
      firstName: [this.searchRequest?.searchParam?.firstName],
      secondName: [this.searchRequest?.searchParam?.secondName],
      thirdName: [this.searchRequest?.searchParam?.thirdName],
      familyName: [this.searchRequest?.searchParam?.familyName],
      englishName: [this.searchRequest?.searchParam?.englishName],
      nationalityCode: [null],
      phoneNumber: [
        this.searchRequest?.searchParam?.phoneNumber,
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]
      ],
      oldNationalId: [this.searchRequest?.searchParam?.oldNationalId],
      birthDate: [this.searchRequest?.searchParam?.birthDate],
      nationality: this.formBuilder.group({
        english: [this.searchRequest?.searchParam?.nationality?.english],
        arabic: [this.searchRequest?.searchParam?.nationality?.arabic]
      }),
      passportNo: [this.searchRequest?.searchParam?.passportNo],
      borderNo: [this.searchRequest?.searchParam?.borderNo],
      gccId: [this.searchRequest?.searchParam?.gccId]
      // sin: [this.searchRequest?.searchParam?.sin]
    });
  }
  validate(param: string) {
    if (param == 'unifiedEstablishmentId') {
      if (this.parentForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').value) {
        this.parentForm.get('advancedSearchForm.unifiedEstablishmentId').setValidators(Validators.required);
        this.unifiedEstablishmentIdValidate = true;
      } else {
        this.parentForm.get('advancedSearchForm.unifiedEstablishmentId').clearValidators();
        this.unifiedEstablishmentIdValidate = false;
      }
      this.parentForm.get('advancedSearchForm.unifiedEstablishmentId').updateValueAndValidity();
    } else if (param == 'unifiedEstablishmentIdPrefix') {
      if (this.parentForm.get('advancedSearchForm.unifiedEstablishmentId').value) {
        this.parentForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').setValidators(Validators.required);
        this.unifiedEstablishmentIdPrefixValidate = true;
      } else {
        this.parentForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').clearValidators();
        this.unifiedEstablishmentIdPrefixValidate = false;
      }
      this.parentForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').updateValueAndValidity();
    } else if (param == 'establishmentId') {
      if (this.parentForm.get('advancedSearchForm.establishmentIdPrefix').value) {
        this.parentForm.get('advancedSearchForm.establishmentId').setValidators(Validators.required);
        this.establishmentIdValidate = true;
      } else {
        this.parentForm.get('advancedSearchForm.establishmentId').clearValidators();
        this.establishmentIdValidate = false;
      }
      this.parentForm.get('advancedSearchForm.establishmentId').updateValueAndValidity();
    } else if (param == 'establishmentIdPrefix') {
      if (this.parentForm.get('advancedSearchForm.establishmentId').value) {
        this.parentForm.get('advancedSearchForm.establishmentIdPrefix').setValidators(Validators.required);
        this.establishmentIdPrefixValidate = true;
      } else {
        this.parentForm.get('advancedSearchForm.establishmentIdPrefix').clearValidators();
        this.establishmentIdPrefixValidate = false;
      }
      this.parentForm.get('advancedSearchForm.establishmentIdPrefix').updateValueAndValidity();
    }
    // this.parentForm.get('advancedSearchForm').markAllAsTouched();
  }

  /**
   * method to emit search event
   */
  onSearch() {
    this.parentForm.get('advancedSearchForm').markAllAsTouched();
    this.search.emit();
  }
  /**
   * method to emit close event
   */
  onClose() {
    this.parentForm.get('advancedSearchForm').reset();
    this.close.emit();
  }
  /**
   * method to check search form validation
   */
  checkAdvancedSearchStatus(): boolean {
    if (this.parentForm && this.parentForm.get('advancedSearchForm')) {
      const advancedSearchForm: FormGroup = this.parentForm.get('advancedSearchForm') as FormGroup;
      const controls = Object.values(advancedSearchForm.controls);
      for (const control of controls) {
        if (control.value && control.value.trim() !== '' && control.value.trim().length > 3) return false;
      }
      return true;
    } else return true;
  }
  onNationalitySelect(nationality: Lov) {
    if (nationality) {
      this.parentForm.get('advancedSearchForm').get('nationalityCode').setValue(nationality.code);
    } else {
      this.parentForm.get('advancedSearchForm').get('nationalityCode').setValue(null);
    }
  }

  onRegistrationStatusSelect(items: BilingualText[]) {
    this.selectedRegistrationStatus = items;
    if (this.parentForm.get('advancedSearchForm').get('registrationStatusValue')) {
      this.parentForm.get('advancedSearchForm').get('registrationStatusValue').setValue(items);
    }
  }
  onGccCountrySelect(items: BilingualText[]) {
    this.selectedGccCountry = items;
    if (
      this.parentForm.get('advancedSearchForm').get('gccCountryCode') &&
      this.parentForm.get('advancedSearchForm').get('gccCountryList') &&
      this.gccCountryList?.items
    ) {
      this.parentForm.get('advancedSearchForm').get('gccCountryList').setValue(items);
      this.parentForm
        .get('advancedSearchForm')
        .get('gccCountryCode')
        .setValue(
          this.gccCountryList.items
            .filter(item => items.map(country => country.english).includes(item.value.english))
            .map(item => item.code)
        );
    }
  }
}
