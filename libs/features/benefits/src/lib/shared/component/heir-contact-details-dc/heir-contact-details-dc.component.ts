/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { InputBaseComponent, LovList, ContactDetails, Lov, AddressTypeEnum } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { Person, DependentDetails } from '../../models';
import { markFormGroupTouched } from '../../utils/benefitUtil';

@Component({
  selector: 'bnt-heir-contact-details-dc',
  templateUrl: './heir-contact-details-dc.component.html',
  styleUrls: ['./heir-contact-details-dc.component.scss']
})
export class HeirContactDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  contactNumberDetailsForm: FormGroup;
  control: FormControl;
  hasPOAddress = false;
  hasNationalAddress = false;
  hasOverseasAddress = false;
  idType = '';
  mobileMaxLength = 15;
  emergencyValidators = {
    validators: Validators.compose([Validators.required]),
    updateOn: 'blur'
  };

  /**
   * Input Variables
   */
  @Input() parentForm: FormGroup;
  @Input() contactDetails: ContactDetails;
  @Input() heirList: LovList;
  @Input() listOfDependents: DependentDetails[];
  @Input() cityList: LovList = null;
  @Input() countryList: LovList = null;
  @Input() currentTab: number;
  @Input() defaultOnly = false;
  @Input() idValue = '';
  @Input() isAddressOptional = true;
  @Input() isAddressavailable = true;
  @Input() isHeadingRequired = true;
  @Input() isVerifyRequired = false;
  @Input() isdControl;
  @Input() personalDetails = new Person();
  @Input() readOnlyAll: boolean;
  @Output() previous: EventEmitter<null> = new EventEmitter<null>(null);
  @Output() save: EventEmitter<Object> = new EventEmitter<null>(null);
  @Output() confirm: EventEmitter<null> = new EventEmitter();
  @Output() decline: EventEmitter<null> = new EventEmitter();

  @ViewChild('addressForm', { static: false })
  addressForm: AddressDcComponent;
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.form = this.fb.group({
      heirList: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      })
    });
  }
  /**
   * Updating contact details
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.contactDetails && changes.contactDetails.currentValue) {
        this.contactDetails = changes.contactDetails.currentValue;
        this.checkForAddresstype();
      }
    }
  }
  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.contactNumberDetailsForm);
    if (this.contactNumberDetailsForm.valid) {
      return true;
    }
    return false;
  }

  setErrorMsgs() {}

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }
  confirmCancel() {
    this.confirm.emit();
  }
  checkForAddresstype() {
    if (this.contactDetails.currentMailingAddress === AddressTypeEnum.POBOX) {
      this.hasPOAddress = true;
    }
    if (this.contactDetails.currentMailingAddress === AddressTypeEnum.NATIONAL) {
      this.hasNationalAddress = true;
    }
    if (this.contactDetails.currentMailingAddress === AddressTypeEnum.OVERSEAS) {
      this.hasOverseasAddress = true;
    }
  }
  declineCancel() {
    this.decline.emit();
  }
  selectHeirAddress(value: Lov) {
    if (value) {
      const personId = value.code;
      this.listOfDependents.forEach(heir => {
        if (heir.personId === personId) {
          this.contactDetails = heir.contactDetail;
        }
      });
    }
  }
}
