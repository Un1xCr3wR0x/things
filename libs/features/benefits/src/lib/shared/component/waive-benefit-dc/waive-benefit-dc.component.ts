/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { BenefitConstants } from '../../constants';
import { HeirStatus } from '../../enum';

@Component({
  selector: 'bnt-waive-benefit-dc',
  templateUrl: './waive-benefit-dc.component.html',
  styleUrls: ['./waive-benefit-dc.component.scss']
})
export class WaiveBenefitDcComponent implements OnInit, OnChanges {
  @Input() action: string; // STOP, START
  @Input() parentForm: FormGroup;
  @Input() maxDate: Date;
  @Input() lessPadding = true;
  @Input() showCard = true;
  @Input() waiveTowardsList: LovList;
  @Input() hideHeading = false;
  waiveForm: FormGroup;
  notesMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  heirStatusEnums = HeirStatus;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.parentForm) {
      if (this.parentForm.get('waiveBenefit')) {
        this.waiveForm.patchValue((this.parentForm.get('waiveBenefit') as FormGroup).getRawValue());
        this.parentForm.removeControl('waiveBenefit');
        this.parentForm.addControl('waiveBenefit', this.waiveForm);
      } else {
        this.parentForm.addControl('waiveBenefit', this.waiveForm);
      }
      this.parentForm.get('waiveBenefit').updateValueAndValidity();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!this.waiveForm) this.waiveForm = this.createForm(this.action);
    if (
      changes.waiveTowardsList &&
      changes.waiveTowardsList.currentValue &&
      changes.waiveTowardsList.currentValue.items.length === 1 &&
      this.waiveForm.get('benefitWaivedTowards')
    ) {
      this.waiveForm.get('benefitWaivedTowards').patchValue(this.waiveTowardsList.items[0].value);
      this.waiveForm.get('benefitWaivedTowards').disable();
    }
  }
  createForm(action: string): FormGroup {
    const formGroup = this.fb.group({
      action: action,
      // stopDate: this.fb.group({
      //   gregorian: [new Date(), Validators.required],
      //   hijiri: [null]
      // }),
      // startDate: this.fb.group({
      //   gregorian: [new Date(), Validators.required],
      //   hijiri: [null]
      // }),
      notes: [null, Validators.required]
      // benefitWaivedTowards: this.fb.group({
      //   english: [null],
      //   arabic: [null]
      // })
    });
    if (action === this.heirStatusEnums.STOP_WAIVE) {
      const stopDate = this.fb.group({
        gregorian: [new Date(), Validators.required],
        hijiri: [null]
      });
      formGroup.addControl('stopDate', stopDate);
    } else {
      const startDate = this.fb.group({
        gregorian: [new Date(), Validators.required],
        hijiri: [null]
      });
      const benefitWaivedTowards = this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      });
      formGroup.addControl('startDate', startDate);
      formGroup.addControl('benefitWaivedTowards', benefitWaivedTowards);
    }
    return formGroup;
  }
  waiveDate() {
    if (this.waiveForm.get('startDate')?.get('gregorian')) {
      const startdate = this.waiveForm.get('startDate')?.get('gregorian').value;
      const waivestartDate = this.fb.group({
        gregorian: [startdate, Validators.required],
        hijiri: [null]
      });
      this.waiveForm.removeControl('startDate');
      this.waiveForm.addControl('startDate', waivestartDate);
    }

    if (this.waiveForm.get('stopDate')?.get('gregorian')) {
      const stopdate = this.waiveForm.get('stopDate')?.get('gregorian').value;
      const waivestopDate = this.fb.group({
        gregorian: [stopdate, Validators.required],
        hijiri: [null]
      });
      this.waiveForm.removeControl('stopDate');
      this.waiveForm.addControl('stopDate', waivestopDate);
    }
  }
}
