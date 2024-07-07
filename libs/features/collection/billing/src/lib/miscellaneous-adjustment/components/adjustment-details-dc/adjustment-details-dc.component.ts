import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, lengthValidator } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-adjustment-details-dc',
  templateUrl: './adjustment-details-dc.component.html',
  styleUrls: ['./adjustment-details-dc.component.scss']
})
export class AdjustmentDetailsDcComponent implements OnInit, OnChanges {
  // Local Variables
  adjustmentReasonsList: LovList;
  adjustmentForList: LovList;
  adjustmentTypeList: LovList;
  adjustmentReasonlistTemp: LovList;
  adjustmentDetailsForm: FormGroup;
  adjustmentReason: string;
  maxDate: Date;
  minDate: Date;
  private fb: FormBuilder = new FormBuilder();
  // Input Variables
  @Input() parentForm: FormGroup;
  @Input() establishmentStartDate;
  @Input() adjustmentReasonlist: LovList;
  @Input() lang;
  @Input() previousTab;
  @Input() miscellanousDetails;
  @Input() isEstablishmentClosed;

  // Output Variables
  @Output() selectedReasonItem = new EventEmitter();
  @Output() selectedLevelAdj = new EventEmitter();

  constructor() {}

  ngOnInit() {
    // initialize adjustment reason List
    this.adjustmentReasonlistTemp = { items: [] };
    this.adjustmentReasonlistTemp.items.push({
      value: { english: 'Others', arabic: 'أخرى' },
      sequence: 1
    });

    // initialize adjustment For List
    this.adjustmentForList = { items: [] };
    this.adjustmentForList.items.push({
      value: { english: 'Establishment Level', arabic: 'على مستوى المنشأة' },
      sequence: 1
    });
    // initialize adjustment Type List
    this.adjustmentTypeList = { items: [] };
    this.adjustmentTypeList.items.push({ value: { english: 'Credit', arabic: 'دائن' }, sequence: 1 });
    this.adjustmentTypeList.items.push({ value: { english: 'Debit', arabic: 'مدين' }, sequence: 2 });

    this.maxDate = moment(new Date()).toDate();

    // creating adjustment details form
    this.adjustmentDetailsForm = this.createAdjustmentDetailsForm();
    if (this.parentForm) {
      this.parentForm.addControl('adjustmentdetailsForm', this.adjustmentDetailsForm);
    }
    if (this.previousTab) {
      this.setPrevVales(this.parentForm.value, false);
    }
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentStartDate && changes.establishmentStartDate.currentValue) {
      this.establishmentStartDate = changes.establishmentStartDate.currentValue;
      this.minDate = moment(new Date(this.establishmentStartDate)).toDate();
    }
    if (changes && changes.miscellanousDetails && changes.miscellanousDetails.currentValue) {
      this.miscellanousDetails = changes.miscellanousDetails.currentValue;
      this.setPrevVales(this.miscellanousDetails, true);
    }
  }
  /** Method to create Adjustment Details Form */
  createAdjustmentDetailsForm() {
    return this.fb.group({
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      adjustmentReasonText: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(40),
            Validators.pattern('^(?=.*[a-zA-Z0-9]).{0,}$')
          ]),
          updateOn: 'blur'
        }
      ],
      adjustmentDecriptionText: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z0-9]).{0,}$'),
          Validators.maxLength(500)
        ])
      ],
      adjustmentFor: this.fb.group({
        english: [this.adjustmentForList.items[0].value.english, { validators: Validators.required }],
        arabic: [this.adjustmentForList.items[0].value.arabic, { validators: Validators.required }]
      }),
      adjustmentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      transactionDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      periodEndDate: this.fb.group({
        gregorian: [null],
        hijiri: [null],
        entryFormat: 'GREGORIAN'
      }),
      periodStartDate: this.fb.group({
        gregorian: [null],
        hijiri: [null],
        entryFormat: 'GREGORIAN'
      })
    });
  }

  // Method to select reason when the item from list is selected.
  selectedReason(selectedItem) {
    if (selectedItem === 'Write Off Debit') {
      this.adjustmentReason = 'Write Off Debit';
      this.selectedReasonItem.emit(selectedItem);
    } else if (selectedItem === 'Write Off Credit') {
      this.adjustmentReason = 'Write Off Credit';
      this.selectedReasonItem.emit(selectedItem);
    } else if (selectedItem === 'Others') {
      this.adjustmentReason = 'Others';
      // set default value for adjustment type
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('english')
        .setValue(this.adjustmentTypeList.items[0].value.english);
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('arabic')
        .setValue(this.adjustmentTypeList.items[0].value.arabic);
      this.selectedReasonItem.emit(selectedItem);
      this.selectedLevelAdj.emit(this.adjustmentForList.items[0].value);
    } else {
      this.adjustmentReason = undefined;
      this.selectedReasonItem.emit(undefined);
    }
  }
  selectedLevel(level) {
    if (this.adjustmentReason === 'Others') {
      this.selectedLevelAdj.emit(level);
    }
  }

  /** Method to set adjustmentDetailsForm form previous btn */
  setPrevVales(value, isEdit) {
    this.adjustmentReason = isEdit
      ? value.adjustmentReason.english
      : value.adjustmentdetailsForm.adjustmentReason.english;
    this.adjustmentDetailsForm
      .get('adjustmentReason')
      .get('english')
      .setValue(isEdit ? value.adjustmentReason.english : value.adjustmentdetailsForm.adjustmentReason.english);
    this.adjustmentDetailsForm
      .get('adjustmentReason')
      .get('arabic')
      .setValue(isEdit ? value.adjustmentReason.arabic : value.adjustmentdetailsForm.adjustmentReason.arabic);
    this.adjustmentDetailsForm
      .get('adjustmentReasonText')
      .setValue(isEdit ? value.reason : value.adjustmentdetailsForm.adjustmentReasonText);
    this.adjustmentDetailsForm
      .get('adjustmentDecriptionText')
      .setValue(isEdit ? value.description : value.adjustmentdetailsForm.adjustmentDecriptionText);
    this.adjustmentDetailsForm
      .get('adjustmentFor')
      .get('english')
      .setValue(this.adjustmentForList.items[0].value.english);
    this.adjustmentDetailsForm
      .get('adjustmentFor')
      .get('arabic')
      .setValue(this.adjustmentForList.items[0].value.arabic);

    if (isEdit) {
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('english')
        .setValue(
          value.adjustmentType === 'MISC_CREDIT'
            ? this.adjustmentTypeList.items[0].value.english
            : this.adjustmentTypeList.items[1].value.english
        );
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('arabic')
        .setValue(
          value.adjustmentType === 'MISC_CREDIT'
            ? this.adjustmentTypeList.items[0].value.arabic
            : this.adjustmentTypeList.items[1].value.arabic
        );
      this.adjustmentDetailsForm
        .get('transactionDate')
        .get('gregorian')
        .patchValue([new Date(value.periodStartDate.gregorian), new Date(value.periodEndDate.gregorian)]);
    } else {
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('english')
        .setValue(value.adjustmentdetailsForm.adjustmentType.english);
      this.adjustmentDetailsForm
        .get('adjustmentType')
        .get('arabic')
        .setValue(value.adjustmentdetailsForm.adjustmentType.arabic);

      this.adjustmentDetailsForm
        .get('transactionDate')
        .get('gregorian')
        .setValue(value.adjustmentdetailsForm.transactionDate.gregorian);
      this.adjustmentDetailsForm
        .get('transactionDate')
        .get('hijiri')
        .setValue(value.adjustmentdetailsForm.transactionDate.hijiri);
    }

    this.parentForm.removeControl('adjustmentdetailsForm');
    if (this.parentForm) {
      this.parentForm.addControl('adjustmentdetailsForm', this.adjustmentDetailsForm);
    }
  }
}
