/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { getErrorMsg, InputBaseComponent, IsdCode, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { GCCDetails } from './gcc-details';

@Component({
  selector: 'gosi-input-mobile-dc',
  templateUrl: './input-mobile-dc.component.html',
  styleUrls: ['./input-mobile-dc.component.scss']
})
export class InputMobileDcComponent extends InputBaseComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;
  @Input() applyCountryValidation = true;
  @Input() isdControl: FormControl | AbstractControl;
  @Input() isOptional: boolean;

  gccList = GCCDetails.GCC_LIST;
  selectedCountry: IsdCode = this.gccList[0];
  selectedLang = 'en';
  control: AbstractControl;

  /**
   * Constructor
   * @param language
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  /**
   * Init method
   */
  ngOnInit() {
    super.ngOnInit();
    this.language.subscribe(lang => {
      this.selectedLang = lang;
      if (this.validationError) {
        this.validationError.requiredFormat =
          this.selectedLang === 'en' ? this.selectedCountry?.exampleEn : this.selectedCountry?.exampleAr;
      }
    });
    if (this.isdControl.value) {
      this.setDefaultValue(this.isdControl.value);
    } else {
      this.setDefaultValue(this.defaultValue);
    }
  }

  /**
   * Method to catch the changes in @input
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.setDefaultValue(this.isdControl.value);
  }

  /**
   * Method to set default value for country dropdown
   */
  setDefaultValue(countryCode) {
    if (countryCode) {
      this.selectedCountry = this.gccList.filter(val => val.key === countryCode)[0];
      if (this.selectedCountry?.key) {
        this.isdControl.setValue(this.selectedCountry?.key);
      }
      this.isdControl.markAsPristine();
      this.isdControl.updateValueAndValidity();
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputMobileDcComponent
   */

  setErrorMsgs(control) {
    this.control = control;
    this.ngAfterViewChecked();
  }

  selectCountry(gccCountry) {
    this.control.setValue(null);
    this.selectedCountry = gccCountry;
    if (this.isdControl && this.selectedCountry) {
      if (this.selectedCountry?.key) {
        this.isdControl.setValue(this.selectedCountry?.key);
      }
    }
    this.errorMsg.next(null);
    this.blur.emit(null);
  }

  ngAfterViewChecked(): void {
    this.setDefaultValue(this.isdControl?.value);
    if (this.control && this.selectCountry && this.applyCountryValidation) {
      const egMobileNo = this.selectedLang === 'en' ? this.selectedCountry.exampleEn : this.selectedCountry.exampleAr;
      if (
        !this.isOptional &&
        (this.control?.value === undefined || this.control?.value === '' || this.control?.value === null)
      ) {
        this.control.setErrors({ inCorrectValue: { invalid: true } });
        const error = getErrorMsg(this.control, this.invalidSelection, null, this.selectedCountry.format);
        this.errorMsg.next(error);
      } else if (
        this.selectedCountry.key === GCCDetails.SAUDI_MOBILE_CODE.key &&
        this.control?.value?.length === 9 &&
        this.control?.value[0] !== '5'
      ) {
        this.control.setErrors({ mask: { invalid: true } });
        const error = getErrorMsg(this.control, this.invalidSelection, null, this.selectedCountry.format, egMobileNo);
        this.errorMsg.next(error);
      } else if (this.selectedCountry.key === GCCDetails.SAUDI_MOBILE_CODE.key && this.control?.value?.length !== 9) {
        this.control.setErrors({ mask: { invalid: true } });
        const error = getErrorMsg(this.control, this.invalidSelection, null, this.selectedCountry.format, egMobileNo);
        this.errorMsg.next(error);
      } else {
        const error = getErrorMsg(this.control, this.invalidSelection, null, this.selectedCountry.format, egMobileNo);
        this.errorMsg.next(error);
      }
      this.changeDetectorRef.detectChanges();
    }
  }
  /**
   * Method to get active mask for text input
   */
  getMask() {
    return this.selectedCountry.altFormats && this.selectedCountry.altFormats.length > 0
      ? `${this.selectedCountry.format}||${this.selectedCountry.altFormats.join('||')}`
      : this.selectedCountry.format;
  }
}
