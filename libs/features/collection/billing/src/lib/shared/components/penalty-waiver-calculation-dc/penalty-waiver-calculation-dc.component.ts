/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Input,
  Inject
} from '@angular/core';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LanguageToken, subtractMonths, endOfMonth, BilingualText, lessThanValidator } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import moment from 'moment-timezone';
import { EventDate, PenalityWavier, PenaltyWaiverEventDate, PenaltyWaiverSegmentRequest } from '../../models';

@Component({
  selector: 'blg-penalty-waiver-calculation-dc',
  templateUrl: './penalty-waiver-calculation-dc.component.html',
  styleUrls: ['./penalty-waiver-calculation-dc.component.scss']
})
export class PenaltyWaiverCalculationDcComponent implements OnInit, OnChanges {
  /** Input variables */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;

  @Input() waiverPeriodPenaltyAmount;
  @Input() penaltyWaiverReason: BilingualText = new BilingualText();
  @Input() penaltyWaiverOtherReason;
  @Input() parentForm: FormGroup;
  @Input() monthRangeControl: FormControl;
  @Input() wavierDetails: PenalityWavier;
  @Input() searchOption: string;
  @Input() eventDateList: EventDate;
  @Input() isEventDateFlag = false;
  @Input() isGdicEdit = false; // all entity GDIC edit flag
  @Input() validatorFlag: boolean;
  @Input() waiverDetailsOnEdit: PenalityWavier;
  @Input() dataOnEditMode: PenaltyWaiverSegmentRequest; // data submited while creating transaction
  @Input() penaltyType: String;

  /** Output variables */
  @Output() waiverPeriod: EventEmitter<string> = new EventEmitter();
  @Output() eligiblePenaltyAmount: EventEmitter<object> = new EventEmitter();
  @Output() onMonthChange: EventEmitter<object> = new EventEmitter();
  @Output() newEventDateList: EventEmitter<object> = new EventEmitter();

  reason: string;
  maximumDate: Date;
  minimumDate: Date;

  eligiblePenaltyAmt = 0;
  waiveOffEligible: number;
  lang = 'en';
  waiverOtherReason = false;
  isVic = false;

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.addParentFormControl();
    if (this.isEventDateFlag) {
      this.maximumDate = moment(new Date()).subtract(2, 'month').endOf('month').toDate();
      this.minimumDate = moment(this.maximumDate).subtract(12, 'month').startOf('month').toDate();
    } else {
      this.maximumDate = moment(new Date()).subtract(1, 'month').endOf('month').toDate();
      this.minimumDate = moment(this.maximumDate).subtract(11, 'month').startOf('month').toDate();
    }
    this.detectDateRangeChange();
    this.setExceptiionalGracePeriod();
  }

  setExceptiionalGracePeriod() {
    if (this.parentForm.get('selectedPeriod')) {
      this.parentForm.get('selectedPeriod').valueChanges.subscribe(value => {
        if (value) this.waiverPeriod.emit(value);
        else {
          this.waiverPeriod.emit(null);
          this.parentForm?.get('waiveOffEligible').patchValue(null);
        }
      });
    }
    if (this.parentForm.get('waiveOffEligible')) {
      this.parentForm.get('waiveOffEligible').valueChanges.subscribe(value => {
        this.waiveOffEligible = value;
        this.waiveOffCalculation();
      });
    }
  }

  addParentFormControl() {
    if (this.parentForm && !this.parentForm.get('waiveOffEligible') && !this.isEventDateFlag) {
      this.parentForm.addControl(
        'waiveOffEligible',
        this.fb.control(this.validatorFlag ? this.waiverDetailsOnEdit?.waivedPenaltyPercentage : '', [
          Validators.min(1),
          lessThanValidator(100),
          Validators.required
        ])
      );
    } else if (this.isEventDateFlag && this.parentForm.get('waiveOffEligible')) {
      this.parentForm.removeControl('waiveOffEligible');
    }
    if (this.parentForm && !this.parentForm.get('selectedPeriod')) {
      this.parentForm.addControl('selectedPeriod', this.fb.control('', [Validators.required]));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isEventDateFlag?.currentValue) {
      this.isEventDateFlag = changes?.isEventDateFlag?.currentValue;
    }
    if (changes && changes.wavierDetails && changes.wavierDetails.currentValue) {
      this.minimumDate = moment(changes.wavierDetails.currentValue.minWaiverStartDate.gregorian).toDate();
      this.waiverPeriodPenaltyAmount = this.wavierDetails.waiverPeriodPenaltyAmount;
      this.waiveOffCalculation();
      if (!this.validatorFlag) this.getValues(this.isEventDateFlag);
    }
    if (changes?.dataOnEditMode?.currentValue) {
      this.dataOnEditMode = changes?.dataOnEditMode?.currentValue;
      this.allEntityOnEditMode();
    }
    if (changes && changes.waiverDetailsOnEdit && changes.waiverDetailsOnEdit.currentValue) {
      this.setWaiverDetailsOnEdit();
    }
    if (changes?.penaltyWaiverReason?.currentValue) {
      this.penaltyWaiverReason = changes.penaltyWaiverReason.currentValue;
    }
    this.checkForChanges(changes);
  }
  checkForChanges(changes: SimpleChanges) {
    if (changes && changes.penaltyWaiverOtherReason && changes.penaltyWaiverOtherReason.currentValue) {
      this.penaltyWaiverOtherReason = changes.penaltyWaiverOtherReason.currentValue;
      this.waiverOtherReason = this.penaltyWaiverOtherReason === undefined ? false : true;
    }
    if (changes && changes.searchOption && changes.searchOption.currentValue) {
      this.setMaxDate(changes);
    }
    if (changes?.eventDateList?.currentValue) {
      this.eventDateList = changes?.eventDateList?.currentValue;
    }
    if (changes?.isEventDateFlag?.currentValue) {
      this.isEventDateFlag = changes.isEventDateFlag.currentValue;
      this.addParentFormControl();
    }
    if (changes?.penaltyType?.currentValue) {
      this.penaltyType = changes.penaltyType.currentValue;
      this.isVic = this.penaltyType === 'VIC' ? true : false;
    }
  }
  //set field values on GDIC edit the all entity transaction returned from GDISO
  allEntityOnEditMode() {
    this.penaltyWaiverReason = this.dataOnEditMode?.reason;
    if (
      this.dataOnEditMode?.waiverStartDate?.gregorian === undefined ||
      this.dataOnEditMode?.waiverEndDate?.gregorian === undefined
    ) {
      this.parentForm.get('selectedPeriod')?.patchValue([null]);
    } else if (this.isEventDateFlag) {
      this.seperateEventDate(this.dataOnEditMode.eventDate);
    } else {
      this.parentForm
        .get('selectedPeriod')
        ?.patchValue([
          moment(this.dataOnEditMode?.waiverStartDate?.gregorian).toDate(),
          moment(this.dataOnEditMode?.waiverEndDate?.gregorian).toDate()
        ]);
      this.parentForm.get('selectedPeriod').setValidators([Validators.required]);
    }
    if (this.parentForm && this.parentForm.get('waiveOffEligible'))
      this.parentForm.get('waiveOffEligible').patchValue(this.dataOnEditMode?.waivedPenaltyPercentage);
  }
  //set Waiver of details on data change
  setWaiverDetailsOnEdit() {
    if (this.validatorFlag) {
      if (this.waiverDetailsOnEdit.waivedPenaltyPercentage !== undefined) {
        this.addParentFormControl();
        this.setExceptiionalGracePeriod();
      }
      this.parentForm.get('waiveOffEligible').patchValue(this.waiverDetailsOnEdit.waivedPenaltyPercentage);
      this.parentForm
        .get('selectedPeriod')
        .patchValue([
          moment(this.waiverDetailsOnEdit?.waiverStartDate?.gregorian).toDate(),
          moment(this.waiverDetailsOnEdit?.waiverEndDate?.gregorian).toDate()
        ]);
      this.waiverPeriodPenaltyAmount = this.waiverDetailsOnEdit.waiverPeriodPenaltyAmount;
      this.waiveOffEligible = this.waiverDetailsOnEdit.waivedPenaltyPercentage;
      this.waiveOffCalculation();
    }
  }
  getValues(isEventDateFlag) {
    if (isEventDateFlag) {
      this.maximumDate = moment(new Date()).subtract(2, 'month').endOf('month').toDate();
      this.minimumDate = moment(this.maximumDate).subtract(12, 'month').startOf('month').toDate();
    }
    this.setExceptiionalGracePeriod();
  }
  setMaxDate(changes) {
    if (
      changes.searchOption.currentValue !== 'SIN' ||
      changes.searchOption.currentValue !== 'registration' ||
      changes.searchOption.currentValue === 'entityType'
    )
      this.maximumDate = endOfMonth(subtractMonths(new Date(), 1));
  }

  waiveOffCalculation() {
    if (this.waiverPeriodPenaltyAmount !== null && this.waiveOffEligible <= 100) {
      this.eligiblePenaltyAmt = this.waiverPeriodPenaltyAmount * (this.waiveOffEligible / 100);
      this.eligiblePenaltyAmount.emit({
        eligiblePenlaityAmt: this.eligiblePenaltyAmt,
        wavieOffPercentage: this.waiveOffEligible
      });
    } else if (this.waiverPeriodPenaltyAmount !== null && this.waiveOffEligible > 100) {
      this.eligiblePenaltyAmt = 0;
      this.waiveOffEligible = 0;
      this.eligiblePenaltyAmount.emit({
        eligiblePenlaityAmt: this.eligiblePenaltyAmt,
        wavieOffPercentage: this.waiveOffEligible
      });
    } else {
      this.eligiblePenaltyAmt = this.waiverPeriodPenaltyAmount * (this.waiveOffEligible / 100);
      this.eligiblePenaltyAmount.emit({
        eligiblePenlaityAmt: null,
        wavieOffPercentage: this.waiveOffEligible
      });
    }
  }

  detectDateRangeChange() {
    this.parentForm.get('selectedPeriod').valueChanges.subscribe(daterange => {
      if (daterange) {
        daterange[1] = endOfMonth(daterange[1]);
        this.onMonthChange.emit(daterange);
      }
    });
  }
  eventDateDetails(eventDetails) {
    this.newEventDateList.emit(eventDetails);
  }
  seperateEventDate(eventDate: PenaltyWaiverEventDate[]) {
    const endDate = moment(eventDate[0]?.actualEventDate?.gregorian).subtract(1, 'month').startOf('month').toDate();
    const startDate = moment(eventDate[eventDate.length - 1]?.actualEventDate?.gregorian)
      .subtract(1, 'month')
      .startOf('month')
      .toDate();
    this.parentForm.get('selectedPeriod').patchValue([startDate, endDate]);
    eventDate.forEach(item => {
      this.eventDateList.eventDateInfo.push({
        eventDate: item.actualEventDate,
        year: item.year,
        month: item.month
      });
    });
  }
}
