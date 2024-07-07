/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LanguageToken, Lov, LovList, maxDateValidator, minDateValidator, startOfDay } from '@gosi-ui/core';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment-timezone';
import { ContributorConstants, EngagementPeriod } from '../../../shared';
import { EEngagementPeriod } from '../../../shared/models/e-engagement-period';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-e-wage-add-dc',
  templateUrl: './e-wage-add-dc.component.html',
  styleUrls: ['./e-wage-add-dc.component.scss']
})
export class EWageAddDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  engagementWageAddForm: FormGroup;
  mandatoryAlert = false;
  isEngagementWageAddFormVisible = true;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  lang = 'en';

  /**
   * Input Variables
   */
  @Input() joiningDate: Date = null;
  @Input() occupationList: LovList;
  @Input() engagementWageDetails: EEngagementPeriod[] = [];
  @Input() isEditMode = false;
  @Input() disableAll = false;
  @Input() disableJoining = false;
  @Input() disableOccupation = false;
  @Input() minWageAddDate: Date;
  @Input() maxWageAddDate: Date;
  @Input() isUpdate = false;
  @Input() engagementWageEntryEditDetails;
  @Input() eWageDetails: EEngagementPeriod[] = [];

  /**
   * output Variables
   */
  @Output() addWageEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelWageEvent: EventEmitter<null> = new EventEmitter();
  @Output() wageUpdateEvent: EventEmitter<Object> = new EventEmitter(); // emit value period edit in validator screen
  @Output() cancelWageEditEvent: EventEmitter<null> = new EventEmitter();

  /**
   * Method to initialize EngagementWageAddDcComponent
   * @param fb
   */
  constructor(public fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super(fb);
    this.language.subscribe(res => (this.lang = res));
  }

  ngOnInit() {
    if (!this.engagementWageAddForm) {
      // on period edit form with edit data will be cleared without this check.
      this.engagementWageAddForm = this.createWageDetailsItem();
      if (this.disableOccupation) {
        this.engagementWageAddForm.get('occupation').disable();
      }
    }
  }

  saveCancellationDetails(){
    //console.log('formmm ', this.engagementWageAddForm.getRawValue());
  }

  /**Method to handle tasks when input variable changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.joiningDate && changes.joiningDate.currentValue) {
      this.setWageDate(this.joiningDate);
    }
    if (changes.engagementWageEntryEditDetails && changes.engagementWageEntryEditDetails.currentValue) {
      this.bindToWageEntryForm(changes.engagementWageEntryEditDetails.currentValue.wage);
    }
    if (changes.occupationList && changes.occupationList.currentValue) {
      if (
        (this.engagementWageAddForm?.get('occupation') as FormGroup)?.getRawValue()?.english &&
        this.occupationList?.items
      ) {
        const item = new Lov();
        item.value = (this.engagementWageAddForm.get('occupation') as FormGroup).getRawValue();
        if (
          !this.occupationList.items.find(
            item1 => item1.value.arabic === item?.value?.arabic && item1.value.english === item?.value?.english
          )
        ) {
          item.disabled = true;
          this.occupationList.items.push(item);
        }
      }
    }
  }

  /**Method to set start date */
  setWageDate(joiningDate: Date) {
    if (joiningDate && this.engagementWageAddForm) {
      const formatJoiningDate = startOfDay(joiningDate);
      this.engagementWageAddForm.get('startDate.gregorian').setValue(formatJoiningDate);
    }
  }

  /**
   * This method is to createwage details form
   * @memberof EngagementWageAddDcComponent
   */
  createWageDetailsItem() {
    return super.createWageDetailsForm();
  }

  /**
   * This method is to calculate total wage onblur
   * @memberof EngagementWageAddDcComponent
   */
  onBlur(wageDetail: FormGroup) {
    super.calculateTotalWage(wageDetail);
  }

  /**
   * This method is to add wage period
   * @memberof EngagementWageAddDcComponent
   */
  addWagePeriod() {
    if (this.engagementWageAddForm.valid) {
      this.mandatoryAlert = false;
      this.isEngagementWageAddFormVisible = false;
      this.addWageEvent.emit(this.engagementWageAddForm.getRawValue());
    } else {
      this.mandatoryAlert = true;
      this.engagementWageAddForm.markAllAsTouched();
    }
  }

  /**
   * This method is to cancel wage period and close the form
   * @memberof EngagementWageAddDcComponent
   */
  cancelAddWagePeriod() {
    this.engagementWageAddForm.markAsUntouched();
    this.engagementWageAddForm.markAsPristine();
    this.engagementWageAddForm.reset();
    this.isEngagementWageAddFormVisible = false;
    this.cancelWageEvent.emit();
  }
  /**
   * This method is to clear wage entry form
   * @memberof EmploymentWageDetailsDcComponent
   */
  resetWageEntryForm() {
    this.engagementWageAddForm.reset(this.createWageDetailsItem().getRawValue());
  }

  /**Method to update wage on edit */
  updateWageDetails() {
    if (this.engagementWageAddForm.valid) {
      this.mandatoryAlert = false;
      const getFormData = this.engagementWageAddForm.getRawValue();
      this.wageUpdateEvent.emit({
        wage: getFormData,
        index: this.engagementWageEntryEditDetails.index
      });
    } else {
      this.engagementWageAddForm.markAllAsTouched();
      this.mandatoryAlert = true;
    }
  }

  /**Method to emit cancel action */
  cancelWageEdit() {
    this.cancelWageEditEvent.emit();
  }

  /**
   * This method is to bind values to wageentryform
   */
  bindToWageEntryForm(wageDetails: EngagementPeriod) {
    this.engagementWageAddForm = this.createWageDetailsItem();
    if (this.disableOccupation) {
      this.engagementWageAddForm.get('occupation').disable();
    }
    Object.keys(wageDetails).forEach(key => {
      if (key === 'startDate') {
        this.engagementWageAddForm.get('startDate').get('gregorian').setValue(new Date(wageDetails[key].gregorian));
      } else if (key === 'endDate' && wageDetails?.endDate?.gregorian) {
        this.engagementWageAddForm.get('endDate').get('gregorian').setValue(new Date(wageDetails[key].gregorian));
      } else if (key === 'occupation') {
        this.engagementWageAddForm.get('occupation').setValue(wageDetails[key]);
      } else if (key === 'wage') {
        this.engagementWageAddForm.get('wage').patchValue(wageDetails[key]);
        this.engagementWageAddForm.controls['wage'].get('basicWage').updateValueAndValidity();
        this.engagementWageAddForm.controls['wage'].get('basicWage').markAsTouched();
      }
    });
    this.minWageAddDate = wageDetails.startDate.gregorian
      ? moment(wageDetails.startDate.gregorian).startOf('month').toDate()
      : new Date();
    this.maxWageAddDate = wageDetails.endDate?.gregorian
      ? moment(wageDetails.endDate.gregorian).endOf('month').toDate()
      : new Date();
    this.startDateFormControl.setValidators([
      Validators.required,
      minDateValidator(this.minWageAddDate),
      maxDateValidator(this.maxWageAddDate)
    ]);
    this.engagementWageAddForm.updateValueAndValidity();
  }

  /**Getter for start date form control */
  private get startDateFormControl(): FormControl {
    return this.engagementWageAddForm.get('startDate').get('gregorian') as FormControl;
  }
}
