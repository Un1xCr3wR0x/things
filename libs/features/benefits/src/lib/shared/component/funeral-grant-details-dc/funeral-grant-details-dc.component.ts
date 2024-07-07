/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  HostListener,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import moment from 'moment';
import { BenefitValues } from '../../enum/benefit-values';
import { LovList, GosiCalendar, BilingualText } from '@gosi-ui/core';
import { BenefitConstants } from '../../constants/benefit-constants';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { Observable } from 'rxjs';
import { SearchPerson } from '../../models/person';
import { PersonalInformation } from '../../models/personal-information';
import { BenefitType } from '../../enum';
import {
  AttorneyDetailsWrapper,
  DependentDetails,
  HeirPersonIds,
  PersonBankDetails,
  BankAccountList
} from '../../models';
import { PaymentDetailsDcComponent } from '../payment-details-dc/payment-details-dc.component';
import { FuneralGrantBeneficiaryResponse } from '../../models/funeral-grant-beneficiary-response';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments/lib/address/address-dc/address-dc.component';
import { HeirContactDetailsDcComponent } from '../heir-contact-details-dc/heir-contact-details-dc.component';

@Component({
  selector: 'bnt-funeral-grant-details-dc',
  templateUrl: './funeral-grant-details-dc.component.html',
  styleUrls: ['./funeral-grant-details-dc.component.scss']
})
export class FuneralGrantDetailsDcComponent implements OnInit, OnChanges {
  funeralDetailsForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  beneficiaryTypeList: LovList;
  benefitConstants = BenefitConstants;
  maxLength: number;
  benefitType: string;
  @Input() listYesNo$: Observable<LovList>;

  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;

  /**
   * Input
   */
  @Input() parentForm: FormGroup;
  @Input() isAppPrivate: boolean;
  // @Input() isFuneral: boolean;
  @Input() deathDate: GosiCalendar;
  @Input() birthDate: GosiCalendar;
  @Input() requestDate: GosiCalendar;
  @Input() systemRunDate: GosiCalendar;
  @Input() systemParameter: SystemParameter;
  @Input() nationalityList$: Observable<LovList>;
  // @Input() listOfDependents: DependentDetails[];
  @Input() heirs: DependentDetails[];
  @Input() searchResult: DependentDetails;
  @Input() payeeList: LovList;
  @Input() paymentMethodList: Observable<LovList>;
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  @Input() listOfGuardians: AttorneyDetailsWrapper[];
  @Input() isValidator: boolean;
  // @Input() dependentDetails: DependentDetails;
  @Input() showPaymentMethod = false;
  @Input() lang = 'en';
  @Input() bankName: BilingualText;
  @Input() bankDetails: BankAccountList;
  @Input() guardianDetails: PersonalInformation;
  @Input() validatorFlowBeneficiary: FuneralGrantBeneficiaryResponse;
  @Input() contactForm: FormGroup;
  @Input() isDraft = false;
  /**
   * Output
   */
  @Output() deathDateChanged: EventEmitter<string> = new EventEmitter();
  @Output() searchPerson: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() getHeirs: EventEmitter<null> = new EventEmitter();
  @Output() getAuthPeronContactDetails: EventEmitter<HeirPersonIds> = new EventEmitter();
  @Output() selectType = new EventEmitter();
  @Output() getBankName: EventEmitter<number> = new EventEmitter();
  @Output() getHeirAttorneyGuardianList: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getBankDetailsFromApi: EventEmitter<number> = new EventEmitter();

  @ViewChild('paymentDetails', { static: false })
  paymentDetailsComponent: PaymentDetailsDcComponent;
  @ViewChild('addressAndConactForm', { static: false })
  addressAndConactForm: HeirContactDetailsDcComponent;
  selectedHeir: DependentDetails;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.beneficiaryTypeList = new LovList([
      { value: this.benefitConstants.HEIR_BILINGUAL_TEXT, sequence: 1 },
      { value: this.benefitConstants.OTHER_BILINGUAL_TEXT, sequence: 2 }
    ]);
    this.benefitType = BenefitType.funeralGrant;
    this.maxDate = moment(new Date()).toDate();
    this.maxLength = BenefitValues.maxlength1500;
    this.funeralDetailsForm = this.createFuneralDetailsForm();
    if (this.parentForm) {
      if (this.parentForm.get('funeralGrant')) {
        this.funeralDetailsForm.patchValue(this.parentForm.get('funeralGrant').value);
        this.parentForm.removeControl('funeralGrant');
        this.parentForm.addControl('funeralGrant', this.funeralDetailsForm);
      } else {
        this.parentForm.addControl('funeralGrant', this.funeralDetailsForm);
      }
      this.parentForm.updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.funeralDetailsForm = this.createFuneralDetailsForm();
      //TODO: chck logic in death date changing
      if (changes.deathDate && changes.deathDate.currentValue) {
        this.funeralDetailsForm
          .get('eventDate')
          .get('gregorian')
          .patchValue(moment(this.deathDate?.gregorian).toDate());
        this.funeralDetailsForm.get('eventDate').get('hijiri').patchValue(this.deathDate?.hijiri);
        this.funeralDetailsForm.get('eventDate').get('entryFormat').patchValue(this.deathDate?.entryFormat);
        this.checkForLateRequest();
      }
      if (changes.birthDate && changes.birthDate.currentValue) {
        this.minDate = moment(this.birthDate?.gregorian).toDate();
      }
      if (changes.requestDate && changes.requestDate.currentValue) {
        this.checkForLateRequest();
      }
      if (changes.validatorFlowBeneficiary && changes.validatorFlowBeneficiary.currentValue) {
        this.funeralDetailsForm.get('beneficiaryType').patchValue(this.validatorFlowBeneficiary.beneficiaryType);
        this.funeralDetailsForm.get('notes').patchValue(this.validatorFlowBeneficiary.notes);
        if (this.validatorFlowBeneficiary.lateRequestReason) {
          if (this.funeralDetailsForm.get('lateRequestReason')) {
            this.funeralDetailsForm
              .get('lateRequestReason')
              .patchValue(this.validatorFlowBeneficiary.lateRequestReason);
          } else {
            this.funeralDetailsForm.addControl(
              'lateRequestReason',
              new FormControl(this.validatorFlowBeneficiary.lateRequestReason)
            );
          }
        }
        this.funeralDetailsForm.get('personId').patchValue(this.validatorFlowBeneficiary.beneficiaryDetails?.personId);
        if (this.validatorFlowBeneficiary.beneficiaryType.english === BenefitConstants.HEIR_BILINGUAL_TEXT.english) {
          this.parentForm.addControl(
            'selectedHeir',
            new FormControl(this.validatorFlowBeneficiary.beneficiaryDetails.personId)
          );
          this.selectedHeir = this.validatorFlowBeneficiary.beneficiaryDetails;
          this.selectBeneficiaryType(BenefitConstants.HEIR_BILINGUAL_TEXT.english);
          this.getHeirAttorneyGuardianList.emit(this.validatorFlowBeneficiary.beneficiaryDetails);
        } else {
          this.searchResult = this.validatorFlowBeneficiary.beneficiaryDetails;
        }
      }
      if (changes.searchResult?.currentValue) {
        this.funeralDetailsForm.get('personId').patchValue(this.searchResult.personId);
      }
    }
  }

  deathDateChange(date: string) {
    if (date) {
      this.deathDateChanged.emit(date);
      this.checkForLateRequest();
    }
  }

  checkForLateRequest() {
    let difference: number;
    if (this.deathDate && this.requestDate) {
      difference = moment(this.requestDate.gregorian).diff(moment(this.deathDate?.gregorian), 'days');
    } else if (this.requestDate && this.funeralDetailsForm.get('eventDate.gregorian')) {
      const deathDate = this.funeralDetailsForm.get('eventDate.gregorian')?.value;
      difference = moment(this.requestDate.gregorian).diff(moment(deathDate), 'days');
    }
    if (difference > BenefitValues.year) {
      if (!this.funeralDetailsForm.get('lateRequestReason')) {
        this.funeralDetailsForm.addControl('lateRequestReason', new FormControl('', Validators.required));
      }
    } else {
      this.funeralDetailsForm.removeControl('lateRequestReason');
    }
  }

  createFuneralDetailsForm() {
    if (this.funeralDetailsForm) {
      return this.funeralDetailsForm;
    } else {
      return this.fb.group({
        beneficiaryType: this.fb.group({
          english: [null, { validators: Validators.required, updateOn: 'blur' }],
          arabic: null
        }),
        eventDate: this.fb.group({
          gregorian: ['', { validators: Validators.required, updateOn: 'blur' }],
          hijiri: [null],
          entryFormat: [null]
        }),
        notes: [null],
        personId: [null]
      });
    }
  }

  heirSelected(index: number) {
    this.selectedHeir = this.heirs[index];
    //get auth person and guardian details
    // @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
    // @Input() listOfGuardians: DependentDetails[];
    // this.parentForm.addControl('selectedHeir', new FormControl(this.heirs[index].personId));
    this.funeralDetailsForm.get('personId').patchValue(this.selectedHeir.personId);
    this.getHeirAttorneyGuardianList.emit(this.heirs[index]);
  }

  search(event: SearchPerson) {
    this.selectedHeir = null;
    this.searchPerson.emit(event);
  }

  selectBeneficiaryType(type: string) {
    if (type === this.benefitConstants.HEIR_BILINGUAL_TEXT.english) {
      this.searchResult = null;
      this.parentForm.removeControl('search');
      this.heirs = [];
      this.getHeirs.emit();
    } else {
      this.selectedHeir = null;
      this.parentForm.removeControl('selectedHeir');
      this.funeralDetailsForm.get('personId').patchValue(null);
    }
  }

  /**
   *
   * method to get preselected authperson
   */
  getPreselectedAuthPerson(data: AttorneyDetailsWrapper) {
    return data ? [data] : null;
  }

  getBankDetails(personId: number) {
    //Calls only for payment type heir
    this.getBankDetailsFromApi.emit(personId);
  }

  resetBeneficiary() {
    this.searchResult = null;
    this.parentForm.get('payeeForm')?.reset();
    this.parentForm.get('search')?.reset();
  }

  getBank(iban: number) {
    this.getBankName.emit(iban);
  }
}
