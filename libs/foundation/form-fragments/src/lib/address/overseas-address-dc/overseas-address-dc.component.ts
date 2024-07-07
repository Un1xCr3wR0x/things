/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressDetails, LovList, AddressTypeEnum } from '@gosi-ui/core';
import { FOREIGN_ADDRESS } from '../address-dc/address-dc.component';
@Component({
  selector: 'frm-overseas-address-dc',
  templateUrl: './overseas-address-dc.component.html',
  styleUrls: ['./overseas-address-dc.component.scss']
})
export class OverseasAddressDcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mandatoryOverseasAddress = false;
  @Input() countryList: LovList = null;
  @Input() idValue = '';
  @Input() addressDetails: AddressDetails = null;
  @Input() readOnlyAll = false;
  @Input() countryReadOnly = false;
  @Input() parentForm: FormGroup;

  overseasAddressForm: FormGroup;

  /**Local variables */
  addressMaxLength = 100;
  cityMaxLength = 20;

  /**
   * Creates an instance of OverseasAddressDcComponent
   * @param fb
   * @memberof  OverseasAddressDcComponent
   */
  constructor(readonly fb: FormBuilder) {}

  ngOnInit() {
    this.overseasAddressForm = this.setOverseasForm();
    if (this.parentForm) {
      if (this.parentForm.get(FOREIGN_ADDRESS)) {
        this.parentForm.removeControl(FOREIGN_ADDRESS);
      } else {
        this.parentForm.addControl(FOREIGN_ADDRESS, this.overseasAddressForm);
      }
    }

    if (this.addressDetails && this.overseasAddressForm && this.addressDetails.type === AddressTypeEnum.OVERSEAS) {
      Object.keys(this.addressDetails).forEach(name => {
        if (this.overseasAddressForm && this.overseasAddressForm.get(name) && this.addressDetails[name]) {
          this.overseasAddressForm.get(name).patchValue(this.addressDetails[name]);
          this.overseasAddressForm.get(name).updateValueAndValidity();
        }
      });
    }
  }

  /**
   * This method is to detect input changes and bind to the form
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.mandatoryOverseasAddress) {
      if (!this.overseasAddressForm) {
        this.overseasAddressForm = this.setOverseasForm();
      }
      if (changes.mandatoryOverseasAddress.currentValue) {
        this.setFormMandatory();
      } else {
        this.overseasAddressForm = this.setOverseasForm();
      }
    }
    if (
      changes.addressDetails &&
      changes.addressDetails.currentValue &&
      this.addressDetails.type === AddressTypeEnum.OVERSEAS
    ) {
      Object.keys(this.addressDetails).forEach(name => {
        if (this.overseasAddressForm && this.overseasAddressForm.get(name) && this.addressDetails[name]) {
          this.overseasAddressForm.get(name).patchValue(this.addressDetails[name]);
          this.overseasAddressForm.get(name).updateValueAndValidity();
        }
      });
    }
  }

  setOverseasForm(): FormGroup {
    return this.fb.group({
      type: [AddressTypeEnum.OVERSEAS],
      country: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      city: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      detailedAddress: [null, { validators: Validators.required, updateOn: 'blur' }]
    });
  }

  /**
   * Method to make form as mandatory if it is mandatory
   */
  setFormMandatory() {
    this.overseasAddressForm.get('country').get('english').setValidators(Validators.required);
    this.overseasAddressForm.get('city').get('english').setValidators([Validators.required]);
    this.overseasAddressForm.get('detailedAddress').setValidators([Validators.required]);
  }

  /**
   * Reset overseas address form controls with default value
   * @param fb
   * @memberof  NationalAddressDcComponent
   */
  resetOverseasAddressForm() {
    this.overseasAddressForm.reset(this.setOverseasForm().getRawValue());
  }

  /**
   * To destroy foreign address form
   */
  ngOnDestroy() {
    this.parentForm?.removeControl(FOREIGN_ADDRESS);
  }

  cityChanged() {
    this.overseasAddressForm
      .get('city')
      ?.get('arabic')
      ?.patchValue(this.overseasAddressForm.get('city').get('english').value);
  }
}
