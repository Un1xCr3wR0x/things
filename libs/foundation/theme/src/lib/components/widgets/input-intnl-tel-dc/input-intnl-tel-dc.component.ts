import { Component, OnInit, Input, Inject } from '@angular/core';
import { InputBaseComponent, getErrorMsg, LanguageToken, LanguageEnum } from '@gosi-ui/core';
import { FormControl, AbstractControl, Validators } from '@angular/forms';
import { CountryCode } from './constants/country-code';
import { CountryISO } from './enums/country-iso';
import { getExampleNumber, CountryCode as PhoneCountryCode } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/examples.mobile.json';
import { mobileNumberValidator } from './validators/mobile-number-validator';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CountryItem } from './models/country-item';

@Component({
  selector: 'gosi-input-intnl-tel-dc',
  templateUrl: './input-intnl-tel-dc.component.html',
  styleUrls: ['./input-intnl-tel-dc.component.scss'],
  providers: [CountryCode]
})
export class InputIntnlTelDcComponent extends InputBaseComponent implements OnInit {
  @Input() isdControl: FormControl | AbstractControl;
  @Input() onlyGccCounties: boolean;
  @Input() defaultOnly = false;
  @Input() preferredCountries: CountryISO[] = [
    CountryISO.SaudiArabia,
    CountryISO.Kuwait,
    CountryISO.Bahrain,
    CountryISO.Oman,
    CountryISO.Qatar,
    CountryISO.UnitedArabEmirates
  ];
  selectedCountry: CountryItem;
  currentCountryList: CountryItem[] = [];
  allCountryList: CountryItem[] = [];
  selectedLanguage = LanguageEnum.ENGLISH;
  searchControl = new FormControl(null);
  constructor(
    readonly countryCodeData: CountryCode,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.language.pipe(takeUntil(this.destroy$)).subscribe((res: LanguageEnum) => {
      this.selectedLanguage = res;
      this.setErrorMsgs();
    });
    const countryList = [];
    const preferredCountryList = [];
    Object.values(this.countryCodeData.allCountries).forEach(item => {
      if (this.preferredCountries.includes(<CountryISO>item.iso2)) preferredCountryList.push(item);
      else countryList.push(item);
    });
    this.allCountryList = this.onlyGccCounties
      ? [
          ...preferredCountryList.sort(
            (v1, v2) => this.preferredCountries.indexOf(v1.iso2) - this.preferredCountries.indexOf(v2.iso2)
          )
        ]
      : [
          ...preferredCountryList.sort(
            (v1, v2) => this.preferredCountries.indexOf(v1.iso2) - this.preferredCountries.indexOf(v2.iso2)
          ),
          ...countryList
        ];
    this.currentCountryList = [...this.allCountryList];
    this.selectedCountry = this.allCountryList[0];
    // this.isdControl.valueChanges.subscribe(value => {
    //   console.log(value);
    // })
    if (this.isdControl.value) {
      const currentCountry = this.allCountryList.find(item => item.iso2 === this.isdControl.value);
      if (currentCountry) {
        this.selectedCountry = currentCountry;
        this.setControlValidators();
      }
    }
    this.setControlValidators();
    this.isdControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentCountry = this.allCountryList.find(item => item.iso2 === this.isdControl.value);
      if (currentCountry) {
        this.selectedCountry = currentCountry;
        this.setControlValidators();
      }
    });
  }
  /**
   * Method to set validations to control
   */
  private setControlValidators() {
    this.getFormat();
    let validator = null;
    if (this.control.validator) validator = this.control.validator({} as AbstractControl);
    this.control.setValidators([
      validator && validator.required ? Validators.required : Validators.nullValidator,
      mobileNumberValidator(this.selectedCountry)
    ]);
    this.control.markAsPristine();
    this.control.updateValueAndValidity();
    this.control.markAsUntouched();
  }
  /**
   * Method to get the format and example number of selected country
   */
  private getFormat() {
    const exampleNumber = getExampleNumber(<PhoneCountryCode>this.selectedCountry.iso2.toUpperCase(), examples);
    const numberFormat = exampleNumber
      .format('INTERNATIONAL')
      .replace(`+${this.selectedCountry.dialCode}`, '')
      .replace(/[0-9]/g, '0')
      .trim();
    this.selectedCountry.placeholder = numberFormat;
    this.selectedCountry.exampleNumberEn = exampleNumber.formatInternational();
    const exampleNumberArr: string[] = exampleNumber.formatInternational().split(' ');
    if (exampleNumberArr[0] && exampleNumberArr[0].includes('+')) {
      exampleNumberArr[0] = `${exampleNumberArr[0].replace('+', '')}+`;
    }
    this.selectedCountry.exampleNumberAr = exampleNumberArr.reverse().join(' ');
  }
  /**
   * Method to get the details of selected country
   * @param country
   */
  selectCountry(country: CountryItem) {
    this.currentCountryList = [...this.allCountryList];
    this.control.setValue(null);
    this.selectedCountry = country;
    if (this.isdControl && this.selectedCountry) {
      if (this.selectedCountry.iso2) {
        this.isdControl.setValue(this.selectedCountry.iso2);
      }
    }
    this.setControlValidators();
    this.errorMsg.next(null);
    this.blur.emit(null);
  }
  /**
   * Method to set error messages for validations
   */
  setErrorMsgs() {
    if (this.control['errors'] && this.selectedCountry) {
      const error = getErrorMsg(
        this.control,
        this.invalidSelection,
        null,
        this.selectedCountry.placeholder,
        this.selectedLanguage === LanguageEnum.ENGLISH
          ? this.selectedCountry.exampleNumberEn
          : this.selectedCountry.exampleNumberAr
      );
      this.errorMsg.next(error);
    }
  }
  /**
   * Method to check whether the country is preferred one.
   * @param country
   */
  isPreferredList(country) {
    return this.preferredCountries[this.preferredCountries.length - 1] === country.iso2;
  }
  /**
   * Method to search country in country list
   * @param event
   */
  onSearch(event) {
    const searchKey: string = event.target.value;
    if (searchKey) {
      this.currentCountryList = this.allCountryList.filter(
        item =>
          (item.name.english.toLowerCase() as string).startsWith(searchKey.toLowerCase()) ||
          (item.name.arabic.toLowerCase() as string).startsWith(searchKey.toLowerCase()) ||
          (item.iso2.toLowerCase() as string).startsWith(searchKey.toLowerCase()) ||
          `+${item.dialCode.toLowerCase().replace(/\s/g, '') as string}`.startsWith(`${searchKey.toLowerCase()}`)
      );
    } else {
      this.currentCountryList = [...this.allCountryList];
    }
  }
  /**
   * Method to clear country list
   */
  onCountryListFocus() {
    this.currentCountryList = [...this.allCountryList];
    this.searchControl.setValue(null);
  }
}
