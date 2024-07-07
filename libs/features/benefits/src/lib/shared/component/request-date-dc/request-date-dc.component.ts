/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment-timezone';
import { maxDateValidator, minDateValidator, startOfDay } from '@gosi-ui/core';
import { GosiCalendar } from '@gosi-ui/core';

@Component({
  selector: 'bnt-request-date-dc',
  templateUrl: './request-date-dc.component.html',
  styleUrls: ['./request-date-dc.component.scss']
})
export class RequestDateDcComponent implements OnInit, OnChanges {
  isSmallScreen: boolean;
  /**
   * Input
   */
  @Input() hideOptionalLabel = true;
  @Input() parentForm: FormGroup;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() lessPadding = true;
  @Input() showCard = true;
  @Input() showConfirmButton = true;
  //461745 Not used anymore
  @Input() disableDate = false;
  @Input() preSelectDate = true;
  @Input() systemRunDate: GosiCalendar;
  @Input() isModifyBackdated: boolean;
  @Input() emitOnLoad: boolean;
  @Input() newRequestDate: GosiCalendar;
  /**
   * Output
   */
  @Output() dateChanged: EventEmitter<GosiCalendar> = new EventEmitter();
  @Output() confirm = new EventEmitter();

  requestDateForm: FormGroup;
  dateEmitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.requestDateForm = this.createForm();
    // this.requestDateForm = this.fb.group({
    //   gregorian: [this.preSelectDate ? new Date() : '', { validators: Validators.required, updateOn: 'blur' }],
    //   hijiri: [null]
    // });
    if (this.parentForm) {
      if (this.parentForm.get('requestDate') && this.parentForm.get('requestDate').value) {
        this.requestDateForm.patchValue({
          gregorian: this.parentForm.get('requestDate.gregorian').value
            ? moment(this.parentForm.get('requestDate.gregorian').value).toDate()
            : null,
          hijiri: this.parentForm.get('requestDate.hijiri').value
        });
        this.parentForm.removeControl('requestDate');
        this.parentForm.addControl('requestDate', this.requestDateForm);
      } else {
        this.parentForm.addControl('requestDate', this.requestDateForm);
      }
      this.parentForm.updateValueAndValidity();
    }
    // if (!this.maxDate) {
    //   this.maxDate = moment(new Date()).toDate();
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.requestDateForm = this.createForm();
    if (changes?.minDate?.currentValue) {
      this.minDate = moment(this.minDate).toDate();
      // this.setMinDateValidator(this.minDate);
    }
    if (changes?.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      // this.setMaxDateValidator(this.maxDate);
    }
    if (changes?.newRequestDate?.currentValue) {
      if (this.newRequestDate.gregorian) {
        this.requestDateForm.get('gregorian').patchValue(moment(this.newRequestDate.gregorian).toDate());
      }
    }
    if (changes?.systemRunDate?.currentValue) {
      if (this.preSelectDate && !this.parentForm.get('requestDate.gregorian')?.value) {
        this.requestDateForm.get('gregorian').patchValue(moment(this.systemRunDate.gregorian).toDate());
      }
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
      // this.setMaxDateValidator(this.maxDate);
    }
  }

  valueChanged(value) {
    if (this.requestDateForm?.get('gregorian')?.value) {
      this.requestDateForm
        ?.get('gregorian')
        ?.setValidators([maxDateValidator(this.maxDate), minDateValidator(this.minDate)]);
      // this.setMinDateValidator(this.minDate);
      // this.setMaxDateValidator(this.maxDate);
      this.requestDateForm
        .get('gregorian')
        .patchValue(startOfDay(moment(this.requestDateForm.get('gregorian').value).toDate()));
      this.parentForm
        .get('requestDate.gregorian')
        ?.patchValue(startOfDay(moment(this.requestDateForm.get('gregorian').value).toDate()));
      this.parentForm.updateValueAndValidity();
      this.requestDateForm.updateValueAndValidity();
      if (!this.showConfirmButton) {
        this.dateChanged.emit(this.requestDateForm.getRawValue());
      } else if (this.emitOnLoad && !this.dateEmitted) {
        this.dateEmitted = true;
        this.confirm.emit(this.requestDateForm.getRawValue());
      }
    }
  }

  // setMaxDateValidator(date: Date) {
  //   // this.requestDateForm?.get('gregorian')?.addValidators;
  //   this.parentForm
  //     ?.get('requestDate')
  //     ?.get('gregorian')
  //     ?.setValidators([maxDateValidator(date)]);
  // }

  // setMinDateValidator(date: Date) {
  //   this.requestDateForm?.get('gregorian')?.setValidators([minDateValidator(date)]);
  //   this.parentForm
  //     ?.get('requestDate')
  //     ?.get('gregorian')
  //     ?.setValidators([minDateValidator(date)]);
  // }

  confirmButtonClick() {
    this.requestDateForm.markAllAsTouched();
    if (this.requestDateForm?.invalid) return;
    this.confirm.emit(this.requestDateForm.getRawValue());
    if (this.isModifyBackdated) {
      this.showConfirmButton = false;
      this.disableDate = true;
    } else {
      this.showConfirmButton = true;
      this.disableDate = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 768 ? true : false;
  }

  private createForm() {
    if (this.requestDateForm) {
      return this.requestDateForm;
    } else {
      return this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null]
      });
    }
  }
}
