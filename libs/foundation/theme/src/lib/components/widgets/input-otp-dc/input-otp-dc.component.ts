import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@gosi-ui/core';

@Component({
  selector: 'gosi-input-otp-dc',
  templateUrl: './input-otp-dc.component.html',
  styleUrls: ['./input-otp-dc.component.scss']
})
export class InputOtpDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() componentId = 'common';
  @Input() otpLength = 6;
  @Input() control: FormControl;
  @Input() parentForm: FormGroup;
  @Input() isValid: boolean;
  @Input() disabledOTP = false;
  otpForm: FormArray;
  constructor() {
    super();
  }

  ngOnInit() {
    this.otpForm = new FormArray([]);
    for (let i = 0; i < this.otpLength; i++) {
      this.otpForm.push(new FormControl(null, Validators.required));
    }
    if (this.parentForm) {
      this.parentForm.addControl('otpForm', this.otpForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isValid && changes.isValid) {
      if (this.otpForm) {
        for (let i = 0; i < this.otpLength; i++) {
          this.otpForm.controls[i].setValue(null);
        }
        this.rebuildValue();
      }
    }
    if (changes.disabledOTP && changes.disabledOTP.currentValue) {
      if (this.otpForm) {
        for (let i = 0; i < this.otpLength; i++) {
          this.otpForm.controls[i].disable();
        }
        this.rebuildValue();
      }
    } else {
      if (this.otpForm) {
        for (let i = 0; i < this.otpLength; i++) {
          this.otpForm.controls[i].enable();
        }
        this.rebuildValue();
      }
    }
  }

  ngAfterViewInit() {
    this.focusElement(document.getElementById(this.getElementId(0)));
  }

  rebuildValue() {
    let value = '';
    for (let i = 0; i < this.otpForm.controls.length; i++) {
      if (this.otpForm.controls[i].value !== null) {
        value += this.otpForm.controls[i].value;
      }
    }
    if (this.control) {
      this.control.setValue(value);
    }
  }

  // Method to validate the number character
  isValidEntry(event) {
    return (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) ? true : false;
  }

  /**
   * Method to handle keyup event
   * @param event
   * @param i
   */
  onKeyUp(event, i) {
    const previousElement = document.getElementById(this.getElementId(i - 1));
    const nextElement = document.getElementById(this.getElementId(i + 1));

    //Delete
    if (event.keyCode === 46) {
      this.otpForm.controls[i].setValue(null);
      this.rebuildValue();
      /* this.focusElement(previousElement); */
    }

    //Backspace
    else if (event.keyCode === 8) {
      if (this.otpForm.controls[i].value !== null) {
        this.otpForm.controls[i].setValue(null);
      } else {
        if (this.otpForm.controls[i - 1]) {
          this.otpForm.controls[i - 1].setValue(null);
          this.focusElement(previousElement);
        }
      }
      this.rebuildValue();
    }

    //Other keys
    if (!this.isValidEntry(event)) {
      return false;
    } else {
      if (this.otpForm.controls[i].value !== null) {
        if (i < this.otpForm.controls.length - 1) {
          if (this.otpForm.controls[i + 1] && this.otpForm.controls[i + 1].value === null) {
            this.otpForm.controls[i + 1].setValue(event.key);
            this.focusElement(nextElement); // Focus element on keyup trigger
          }
        }
      }
      this.rebuildValue();
    }
  }

  //To focus the next element on input event
  focusNext(event, index) {
    if (event.data !== null && !isNaN(Number(event.data))) {
      if (this.otpForm.controls[index + 1] && this.otpForm.controls[index + 1].value === null) {
        const nextElement = document.getElementById(this.getElementId(index + 1));
        this.focusElement(nextElement);
      }
      this.rebuildValue();
    }
  }

  focusElement(element: HTMLElement) {
    if (element) {
      element.focus();
      this.isValid = true;
    }
  }

  getElementId(index) {
    return `otp_${index}_${this.componentId}`;
  }

  /**
   * Method returns true if form control is valid
   * @param index
   */
  getValidity(index) {
    if (this.otpForm.controls[index].touched && this.otpForm.controls[index].dirty) {
      return this.otpForm.controls[index].invalid ? false : true;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.control?.setValue(null);
  }
}
