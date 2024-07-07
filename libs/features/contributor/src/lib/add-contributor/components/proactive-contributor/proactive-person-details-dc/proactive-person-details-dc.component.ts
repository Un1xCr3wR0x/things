/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BaseComponent,
  bindToObject,
  BorderNumber,
  checkBilingualTextNull,
  ContactDetails,
  Contributor,
  getIdentityValue,
  IdentityTypeEnum,
  Iqama,
  LovList,
  markFormGroupTouched,
  Passport,
  setAddressFormToAddresses
} from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';

@Component({
  selector: 'cnt-proactive-person-details-dc',
  templateUrl: './proactive-person-details-dc.component.html',
  styleUrls: ['./proactive-person-details-dc.component.scss']
})
export class ProactivePersonDetailsDcComponent extends BaseComponent implements OnInit, OnChanges {
  /** Input Variables. */
  @Input() educationList: LovList;
  @Input() specializationList: LovList;
  @Input() countryList: LovList;
  @Input() cityList: LovList;
  @Input() contributor = new Contributor();
  @Input() isPersonAddress: boolean;

  /**Output event emitters */
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  /** Local Variables. */
  personalDetailsForm: FormGroup;
  iqama: Iqama = new Iqama();
  border: BorderNumber = new BorderNumber();
  passport: Passport = new Passport();

  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;

  /**
   * Method to initialize ProactivePersonDetailsDcComponent
   * @param fb
   * @param modalService
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.personalDetailsForm = this.createPersonForm();
    this.bindDetailsToForm();
    this.setIdentifiers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributor && changes.contributor.currentValue) {
      this.bindDetailsToForm();
      this.setIdentifiers();
    }
  }

  bindDetailsToForm() {
    setTimeout(() => {
      if (this.contributor.person && this.personalDetailsForm) {
        Object.keys(this.contributor.person).forEach(name => {
          if (name in this.personalDetailsForm.controls && this.contributor.person[name]) {
            if (
              (name === 'education' && this.contributor.person.education.english !== null) ||
              (name === 'specialization' && this.contributor.person.specialization.english !== null)
            ) {
              this.personalDetailsForm.get(name).setValue(this.contributor.person[name]);
              this.personalDetailsForm.get(name).updateValueAndValidity();
            }
          }
        });
      }
    }, 500);
  }

  /**
   * This method is to create PersonForm and initialize
   *
   * @memberof ContributorPersonalDetailsDcComponent
   */
  createPersonForm() {
    return this.fb.group({
      education: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null]
      }),
      specialization: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null]
      })
    });
  }
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  /**
   * This method is to save the personal details data
   * @memberof ContributorPersonalDetailsDcComponent
   */
  saveProactiveContributor() {
    markFormGroupTouched(this.personalDetailsForm);
    let isValid = false;
    if (this.isPersonAddress === true) {
      isValid = this.personalDetailsForm.valid;
    } else if (this.personalDetailsForm.valid && this.addressDcComponent) {
      isValid = this.addressDcComponent.getAddressValidity() && this.contactDcComponent.contactDetailsForm.valid;
    }
    if (isValid) {
      this.contributor.person.education = this.personalDetailsForm.get('education.english').value
        ? this.personalDetailsForm.get('education').value
        : null;
      this.contributor.person.specialization = this.personalDetailsForm.get('specialization.english').value
        ? this.personalDetailsForm.get('specialization').value
        : null;
      this.contributor.person.proactive = true;
      if (!this.contributor.person.contactDetail) this.contributor.person.contactDetail = new ContactDetails();
      this.contributor.person.contactDetail.addresses = setAddressFormToAddresses(this.addressDcComponent.parentForm);
      bindToObject(this.contributor.person.contactDetail, this.contactDcComponent.contactDetailsForm.getRawValue());
      this.contributor.person.contactDetail.currentMailingAddress = this.addressDcComponent.currentMailingAddress;
      this.submit.emit(this.contributor);
    } else {
      this.submit.emit(null);
    }
  }
  /**Method to emit cancel action */
  cancelTransaction(): void {
    this.cancel.emit();
  }
  /**Method is to fetch identifiers */
  setIdentifiers(): void {
    if (this.contributor?.person?.identity.length > 0) {
      this.iqama = <Iqama>getIdentityValue(this.contributor.person.identity, IdentityTypeEnum.IQAMA);
      this.border = <BorderNumber>getIdentityValue(this.contributor.person.identity, IdentityTypeEnum.BORDER);
      this.passport = <Passport>getIdentityValue(this.contributor.person.identity, IdentityTypeEnum.PASSPORT);
    }
  }
}
