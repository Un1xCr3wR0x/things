/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressDetails, AddressTypeEnum, lengthValidator, Lov, LovList } from '@gosi-ui/core';
import { POBOX_ADDRESS } from '../address-dc/address-dc.component';

@Component({
  selector: 'frm-po-address-dc',
  templateUrl: './po-address-dc.component.html',
  styleUrls: ['./po-address-dc.component.scss']
})
export class PoAddressDcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cityList: LovList = null;
  @Input() addressDetails: AddressDetails = null;
  @Input() idValue = '';
  @Input() readOnlyAll = false;
  @Input() parentForm: FormGroup;

  poBoxAddressForm: FormGroup;
  zipLength = 5;
  poBoxMaxLength = 10;
  showCityDistrict = false;
  cityDistrictList: LovList = null;

  /**
   * Creates an instance of PoAddressDcComponent
   * @param fb
   * @memberof  PoAddressDcComponent
   */
  constructor(readonly fb: FormBuilder) {
    this.poBoxAddressForm = this.createPoAddressForm();
  }

  ngOnInit() {
    if (this.parentForm) {
      if (this.parentForm.get(POBOX_ADDRESS)) {
        this.parentForm.removeControl(POBOX_ADDRESS);
      }
      this.parentForm.addControl(POBOX_ADDRESS, this.poBoxAddressForm);
    }
    if (this.addressDetails && this.poBoxAddressForm && this.addressDetails.type === AddressTypeEnum.POBOX) {
      Object.keys(this.addressDetails).forEach(name => {
        if (this.poBoxAddressForm && this.poBoxAddressForm.get(name) && this.addressDetails[name]) {
          this.poBoxAddressForm.get(name).patchValue(this.addressDetails[name]);
          this.poBoxAddressForm.updateValueAndValidity();
        }
      });
    }
  }

  /**
   * Returns PO Box address form controls with default values
   * @param fb
   * @memberof  PoAddressDcComponent
   */
  createPoAddressForm() {
    return this.fb.group({
      type: [AddressTypeEnum.POBOX],
      city: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      cityDistrict: this.fb.group({
        english: [null],
        arabic: []
      }),
      postBox: [
        '',
        {
          validators: Validators.compose([
            Validators.required,
            Validators.pattern('[0-9]+'),
            Validators.maxLength(this.poBoxMaxLength)
          ]),
          updateOn: 'blur'
        }
      ],
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
   * Reset PO Box address form controls with default values
   * @param fb
   * @memberof  PoAddressDcComponent
   */
  resetPoAddressForm() {
    this.poBoxAddressForm.reset(this.createPoAddressForm().getRawValue());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.addressDetails &&
      changes.addressDetails.currentValue &&
      this.addressDetails.type === AddressTypeEnum.POBOX
    ) {
      if (this.cityList && this.cityList.items) {
        this.cityList.items.forEach((name: Lov) => {
          if (this.addressDetails && this.addressDetails.city) {
            if (this.addressDetails.city.english === name.value.english) {
              this.selectCity(name);
            }
          }
        });
      }
      Object.keys(this.addressDetails).forEach(name => {
        if (this.poBoxAddressForm && this.poBoxAddressForm.get(name) && this.addressDetails[name]) {
          this.poBoxAddressForm.get(name).patchValue(this.addressDetails[name]);
          this.poBoxAddressForm.updateValueAndValidity();
        }
      });
    }
  }

  selectCity(city: Lov) {
    if (city != null && city.items != null && city.items.length > 0) {
      this.showCityDistrict = true;
      this.cityDistrictList = new LovList(city.items);
      if (city.items.length === 1) {
        this.showCityDistrict = false;
        this.poBoxAddressForm.get('cityDistrict').get('english').setValue(city.items[0].value.english);
      } else {
        this.poBoxAddressForm.get('cityDistrict').get('english').setValue(null);
        this.poBoxAddressForm
          .get('cityDistrict')
          .get('english')
          .setValidators([Validators.required, Validators.maxLength(50)]);
        this.poBoxAddressForm.get('cityDistrict').get('english').markAsUntouched();
      }
    } else {
      this.showCityDistrict = false;
      this.poBoxAddressForm.get('cityDistrict').get('english').setValidators(null);
      this.poBoxAddressForm.get('cityDistrict').get('english').setValue(null);
    }
    this.poBoxAddressForm.get('cityDistrict').get('english').updateValueAndValidity();
  }

  /**
   * To destroy pobox address form
   */
  ngOnDestroy() {
    this.parentForm.removeControl(POBOX_ADDRESS);
  }
}
