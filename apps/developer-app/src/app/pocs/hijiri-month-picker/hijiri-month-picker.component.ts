import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dev-hijiri-month-picker',
  templateUrl: './hijiri-month-picker.component.html',
  styleUrls: ['./hijiri-month-picker.component.scss']
})
export class HijiriMonthPickerComponent implements OnInit {
  control = new FormControl(null, Validators.compose([Validators.required]));
  monthControl = new FormControl(null, Validators.compose([Validators.required]));
  constructor() {}

  ngOnInit(): void {}
}
