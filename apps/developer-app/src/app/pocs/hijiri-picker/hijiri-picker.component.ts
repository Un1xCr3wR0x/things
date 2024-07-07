import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CalendarTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'dev-hijiri-picker',
  templateUrl: './hijiri-picker.component.html',
  styleUrls: ['./hijiri-picker.component.scss']
})
export class HijiriPickerComponent implements OnInit {
  pickerForm: FormGroup;
  pickerForm1: FormGroup;
  type = CalendarTypeEnum.HIJRI;
  calendarPickerForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  Gregorian: string = CalendarTypeEnum.GREGORIAN;
  Hijri: string = CalendarTypeEnum.HIJRI;
  ngOnInit(): void {
    this.pickerForm = this.createNinSearchForm();
    this.calendarPickerForm = this.createCalendarPickerForm();
  }

  createCalendarPickerForm() {
    return this.fb.group({
      date: this.fb.group({
        gregorian: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijri: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        updateOn: 'blur'
      })
    });
  }

  createNinSearchForm() {
    return this.fb.group({
      birthDate: this.fb.group({
        gregorian: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri1: [''],
        updateOn: 'blur'
      }),
      birthDate2: this.fb.group({
        gregorian: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri2: [''],
        updateOn: 'blur'
      })
    });
  }
}
