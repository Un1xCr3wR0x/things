/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addYears, GosiCalendar } from '@gosi-ui/core';
import moment from 'moment';
import { AnnuityResponseDto, PersonalInformation } from '../../models';
import { BenefitConstants } from '../../constants';

@Component({
  selector: 'bnt-extend-annual-notification-dc',
  templateUrl: './extend-annual-notification-dc.component.html',
  styleUrls: ['./extend-annual-notification-dc.component.scss']
})
export class ExtendAnnualNotificationDcComponent implements OnInit, OnChanges {
  @Input() showCard = true;
  @Input() parentForm: FormGroup;
  @Input() currentDate: GosiCalendar;
  @Input() annualNotificationDate: GosiCalendar;
  @Input() requestDate: GosiCalendar;
  @Input() isValidator = false;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() benefitStartDate: GosiCalendar;
  @Input() personDetails: PersonalInformation;
  @Input() isHeir = false;
  @Output() downloadPdf: EventEmitter<Object> = new EventEmitter<Object>();

  notificationForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  notificationDate = new GosiCalendar();
  checkBoxSelected = false;
  maxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.notificationForm = this.getForm();
    // if (!this.isValidator) {
    //   this.notificationForm.get('date.gregorian').patchValue(addYears(moment(this.annualNotificationDate?.gregorian).toDate(), 1));
    // }
    // this.notificationDate.gregorian =
    //   this.annuityResponse?.notificationDate?.gregorian ?
    //   moment(this.annuityResponse?.notificationDate?.gregorian).toDate() :
    //   moment(this.annualNotificationDate?.gregorian).toDate();
    // if (
    //   this.annuityResponse?.annualNotificationDetails &&
    //   this.annuityResponse?.annualNotificationDetails?.notificationDate?.gregorian
    // ) {
    //   this.notificationForm
    //     .get('currentDate.gregorian')
    //     ?.patchValue(this.annuityResponse.annualNotificationDetails.notificationDate.gregorian);
    // }

    if (this.parentForm) {
      if (this.parentForm.get('extendAnnualNotification') && this.parentForm.get('extendAnnualNotification').value) {
        this.notificationForm.patchValue(this.parentForm.get('extendAnnualNotification').value);
        this.parentForm.removeControl('extendAnnualNotification');
        this.parentForm.addControl('extendAnnualNotification', this.notificationForm);
      }
      //  else {             // notification details need not be passed in API if checkbox unselected
      //   this.parentForm.addControl('extendAnnualNotification', this.notificationForm);
      // }
      this.parentForm.updateValueAndValidity();
    }
  }

  getForm(): FormGroup {
    if (this.notificationForm) {
      return this.notificationForm;
    } else {
      return this.fb.group({
        currentDate: this.fb.group({
          gregorian: [new Date(), { validators: Validators.required, updateOn: 'blur' }],
          hijiri: [null]
        }),
        date: this.fb.group({
          gregorian: [new Date(), { validators: Validators.required, updateOn: 'blur' }],
          hijiri: [null]
        }),
        comments: [null, Validators.required],
        selected: [false]
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.notificationForm = this.getForm();
      if (
        (changes.annualNotificationDate?.currentValue || changes.requestDate?.currentValue) &&
        !this.isValidator &&
        this.isHeir
      ) {
        if (this.annualNotificationDate) {
          this.notificationForm
            .get('currentDate.gregorian')
            ?.patchValue(moment(this.annualNotificationDate.gregorian).toDate());
        }
        if (this.requestDate) {
          this.notificationForm
            .get('date.gregorian')
            .patchValue(addYears(moment(this.requestDate?.gregorian).toDate(), 1));
        }

      }
      if (changes.annuityResponse?.currentValue) {
        if (this.isValidator && this.annuityResponse?.annualNotificationDetails) {
          this.notificationForm
            .get('currentDate.gregorian')
            ?.patchValue(moment(this.annuityResponse?.annualNotificationDetails.notificationDate.gregorian).toDate());
          this.notificationForm
            .get('date.gregorian')
            ?.patchValue(
              moment(this.annuityResponse?.annualNotificationDetails?.nextNotificationDate?.gregorian).toDate()
            );
          this.notificationForm?.get('selected').patchValue(true);
          this.clickCheckBox();
          this.notificationForm.get('comments').patchValue(this.annuityResponse?.annualNotificationDetails?.notes);
        } else if (!this.isHeir) {
          this.notificationDate.gregorian = moment(this.annuityResponse?.notificationDate?.gregorian).toDate();
          this.notificationForm.get('currentDate.gregorian')?.patchValue(moment(this.notificationDate.gregorian));
          this.notificationForm
            .get('date.gregorian')
            .patchValue(moment(this.annuityResponse?.notificationDate?.gregorian).toDate());
          this.notificationForm.get('comments').patchValue(this.annuityResponse?.notes);
        }
      }
    }
  }

  clickCheckBox() {
    if (this.notificationForm.get('selected').value === true) {
      this.checkBoxSelected = true;
      this.parentForm.addControl('extendAnnualNotification', this.notificationForm);
    } else {
      this.checkBoxSelected = false;
      this.parentForm.removeControl('extendAnnualNotification');
    }
  }

  download() {
    this.downloadPdf.emit(this.notificationForm.getRawValue());
  }
}
