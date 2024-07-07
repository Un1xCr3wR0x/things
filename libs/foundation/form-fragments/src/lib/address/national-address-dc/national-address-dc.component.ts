/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressDetails, AddressTypeEnum, LanguageToken, Lov, LovList, lengthValidator } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { SAUDI_ADDRESS } from '../address-dc/address-dc.component';

@Component({
  selector: 'frm-national-address-dc',
  templateUrl: './national-address-dc.component.html',
  styleUrls: ['./national-address-dc.component.scss']
})
export class NationalAddressDcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idValue = '';
  @Input() cityList: LovList = null;
  @Input() addressDetails: AddressDetails = null;
  @Input() readOnlyAll = false;
  @Input() parentForm: FormGroup;
  @Input() establishmentWaselAddress: AddressDetails;
  // @Input() parentForm : FormGroup = this.fb.group({});

  /**
   * Declaring local variables
   */
  nationalAddressForm: FormGroup;
  /**
   * Declaring constants
   */
  districtMaxLength = 30;
  StreetMaxLength = 30;
  zipLength = 5;
  buildingNoLength = 4;
  additionalNoLength = 4;
  additionalNoMaxLength = 30;
  showCityDistrict = false;
  cityDistrictList: LovList = null;
  @Input() isWaselAddress: boolean;
  lang = 'en';

  /**
   * Creates an instance of NationalAddressDcComponent
   * @param fb
   * @memberof  NationalAddressDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, readonly fb: FormBuilder) {
    this.nationalAddressForm = this.createNationalAddressForm();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnInit() {
    if (this.parentForm) {
      if (this.parentForm.get(SAUDI_ADDRESS)) {
        this.parentForm.removeControl(SAUDI_ADDRESS);
      }
      this.parentForm.addControl(SAUDI_ADDRESS, this.nationalAddressForm);
    }
    if (this.addressDetails && this.nationalAddressForm && this.addressDetails.type === AddressTypeEnum.NATIONAL) {
      this.bindToNationalForm(this.addressDetails, this.nationalAddressForm);
    }
    if (this.establishmentWaselAddress && this.nationalAddressForm) {
      this.bindToNationalForm(this.establishmentWaselAddress, this.nationalAddressForm);
    }
  }

  /**
   * Method to bind address details to national form
   * @param addressDetails
   * @param form
   */
  bindToNationalForm(addressDetails: AddressDetails, form: FormGroup) {
    Object.keys(addressDetails).forEach(name => {
      if (form && form.get(name) && addressDetails[name]) {
        form.get(name).patchValue(addressDetails[name]);
        form.updateValueAndValidity();
        if (name === 'city') {
          const cityLov = this.cityList?.items.find(item => item.value.english === this.addressDetails.city?.english);
          if (cityLov?.items?.length > 1) {
            this.showCityDistrict = true;
            this.cityDistrictList = new LovList(cityLov.items);
            form
              .get('cityDistrict')
              .get('english')
              .setValidators([Validators.required, Validators.maxLength(50)]);
          } else {
            this.showCityDistrict = false;
            this.cityDistrictList = null;
          }
        }
        if (this.isWaselAddress) {
          if (name === 'waselDistrict') {
            form.get('district').patchValue(addressDetails[name].english);
          }
          if (name === 'waselStreetName') {
            form.get('streetName').patchValue(addressDetails[name].english);
          }
        }
      }
    });
  }

  /** Method to check whether waesel city is present in city lov. */
  checkWaeselCity() {
    //Add waesel city to city list if not already present.
    if (this.addressDetails?.city?.english) {
      if (!this.cityList.items.some(item => item.value.english === this.addressDetails?.city?.english)) {
        const lov = new Lov();
        lov.items = undefined;
        lov.value = this.addressDetails.city;
        this.cityList.items.push(lov);
      }
    }
  }

  /**
   * Returns national address form controls with default value
   * @param fb
   * @memberof  NationalAddressDcComponent
   */
  createNationalAddressForm() {
    return this.fb.group({
      type: [AddressTypeEnum.NATIONAL],
      city: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      cityDistrict: this.fb.group({
        english: [null],
        arabic: []
      }),
      additionalNo: [
        '',
        {
          validators: Validators.compose([Validators.required, lengthValidator(this.additionalNoLength)]),
          updateOn: 'blur'
        }
      ],
      unitNo: [
        '',
        {
          validators: Validators.compose([Validators.maxLength(this.additionalNoLength)]),
          updateOn: 'blur'
        }
      ],
      buildingNo: [
        '',
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.buildingNoLength),
            Validators.pattern('[0-9]+')
          ]),
          updateOn: 'blur'
        }
      ],
      district: [
        '',
        {
          validators: Validators.compose([Validators.required, Validators.maxLength(this.districtMaxLength)]),
          updateOn: 'blur'
        }
      ],
      waselDistrict: this.fb.group({
        english: [null],
        arabic: []
      }),
      streetName: [
        '',
        {
          validators: Validators.compose([Validators.required, Validators.maxLength(this.StreetMaxLength)]),
          updateOn: 'blur'
        }
      ],
      waselStreetName: this.fb.group({
        english: [null],
        arabic: []
      }),
      postalCode: [
        '',
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.zipLength),
            Validators.pattern('[0-9]+')
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Reset national address form controls with default value
   * @param fb
   * @memberof  NationalAddressDcComponent
   */
  resetNationalAddressForm() {
    this.nationalAddressForm.reset(this.createNationalAddressForm().getRawValue());
  }

  /**
   * This method is to detect input changes and bind to the form
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishmentWaselAddress) {
      if (changes.establishmentWaselAddress && changes.establishmentWaselAddress.currentValue) {
        this.bindToNationalForm(this.establishmentWaselAddress, this.nationalAddressForm);
      }
    } else {
      if (
        changes.addressDetails &&
        changes.addressDetails.currentValue &&
        this.addressDetails.type === AddressTypeEnum.NATIONAL
      ) {
        this.bindToNationalForm(this.addressDetails, this.nationalAddressForm);
        if (this.cityList && this.cityList.items.length > 0 && this.addressDetails.city) {
          this.cityList.items.forEach(res => {
            if (res?.items.some(item => item.value.english === this.addressDetails?.city?.english))
              this.checkWaeselCity();
          });
        }
      }
    }
  }

  selectCity(city: Lov) {
    if (city != null && city.items != null && city.items.length > 0) {
      this.showCityDistrict = true;
      this.cityDistrictList = new LovList(city.items);
      if (city.items.length === 1) {
        this.showCityDistrict = false;
        this.nationalAddressForm.get('cityDistrict').get('english').setValue(city.items[0].value.english);
      } else {
        this.nationalAddressForm.get('cityDistrict').get('english').setValue(null);
        this.nationalAddressForm
          .get('cityDistrict')
          .get('english')
          .setValidators([Validators.required, Validators.maxLength(50)]);
        this.nationalAddressForm.get('cityDistrict').get('english').markAsUntouched();
      }
    } else {
      this.showCityDistrict = false;
      this.nationalAddressForm.get('cityDistrict').get('english').setValidators(null);
      this.nationalAddressForm.get('cityDistrict').get('english').setValue(null);
    }
    this.nationalAddressForm.get('cityDistrict').get('english').updateValueAndValidity();
  }

  /**
   * To destroy national address form
   */
  ngOnDestroy() {
    this.parentForm.removeControl(SAUDI_ADDRESS);
  }
}
