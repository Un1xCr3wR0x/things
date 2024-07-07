/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InputBaseComponent, LovList, ContactDetails } from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { Person } from '../../models';
import { markFormGroupTouched } from '../../utils/benefitUtil';

@Component({
  selector: 'bnt-contact-details-dc',
  templateUrl: './contact-details-dc.component.html',
  styleUrls: ['./contact-details-dc.component.scss']
})
export class ContactDetailsDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  /**
   * @param fb
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  /**
   * Local Variables
   */
  isSmallScreen: boolean;
  contactNumberDetailsForm: FormGroup;
  control: FormControl;
  idType = '';
  mobileMaxLength = 15;
  emergencyValidators = {
    validators: Validators.compose([Validators.required]),
    updateOn: 'blur'
  };

  /**
   * Input Variables
   */
  @Input() contactDetails: ContactDetails;
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
  @Input() disableSaveAndNext: boolean;
  @Input() showSubmitButton = false;
  /**
   * Output
   */
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>(null);
  @Output() contactNumberDetails: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter<null>(null);
  @Output() save: EventEmitter<Object> = new EventEmitter<null>(null);
  @Output() confirm: EventEmitter<null> = new EventEmitter();
  @Output() decline: EventEmitter<null> = new EventEmitter();

  @ViewChild('addressForm', { static: false })
  addressForm: AddressDcComponent;

  @ViewChild('contactForm', { static: false })
  contactDcComponent: ContactDcComponent;

  /**
   * Initialization
   */
  ngOnInit() {
    this.contactNumberDetailsForm = this.createPersonForm();
    this.getScreenSize();
  }
  /**
   * Updating contact details
   */
  ngOnChanges() {
    this.contactNumberDetailsForm = this.createPersonForm();
    if (this.contactNumberDetailsForm) {
      this.contactNumberDetailsForm.get('mobileNo').get('primary').setValue(this.control);
      if (this.isdControl) {
        this.contactNumberDetailsForm.get('mobileNo').get('isdCodePrimary').setValue(this.isdControl);
      } else {
        this.contactNumberDetailsForm.get('mobileNo').get('isdCodePrimary').setValue('sa');
      }
      this.contactNumberDetailsForm.updateValueAndValidity();
    }
  }
  /**
   * This method is to create ContactDetailsForm and initialize
   * @memberof ContactNoDcComponent
   */
  createPersonForm() {
    return this.fb.group({
      mobileNo: this.fb.group({
        primary: [null, this.emergencyValidators],
        isdCodePrimary: [null, { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
      }),
      phoneNo: this.fb.group({
        primary: [null, { updateOn: 'blur' }]
      }),
      extension: this.fb.group({
        primary: [null],
        isdCodePrimary: [null, { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
      }),
      emailId: this.fb.group({
        primary: [
          '',
          {
            updateOn: 'blur'
          }
        ]
      }),
      isMobileNoVerified: [false]
    });
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
   * This method is to save contact details
   */
  saveContactDetails() {
    if (!this.contactDcComponent.contactDetailsForm.valid) {
      markFormGroupTouched(this.contactDcComponent.contactDetailsForm);
      this.contactNumberDetails.emit();
    } else {
      if (!this.isAddressavailable) {
        if (this.addressForm?.getAddressValidity() === false) {
          this.contactNumberDetails.emit();
        } else {
          if (this.addressForm) {
            if (!this.personalDetails?.contactDetail) {
              this.personalDetails.contactDetail = new ContactDetails();
            }
            this.personalDetails.contactDetail = this.contactDcComponent.contactDetailsForm.getRawValue();
            this.personalDetails.contactDetail.addresses = this.addressForm.getAddressDetails();
            this.personalDetails.contactDetail.currentMailingAddress =
              this.addressForm?.parentForm?.get('currentMailingAddress').value;
            if (this.isAddressOptional) {
              this.addressForm.parentForm.get('currentMailingAddress')?.markAsUntouched();
              this.addressForm.parentForm.get('foreignAddress')?.markAsUntouched();
              this.addressForm.parentForm.get('poBoxAddress')?.markAsUntouched();
              this.addressForm.parentForm.get('saudiAddress')?.markAsUntouched();
            }
            this.save.emit(this.personalDetails);
          }
        }
      }
    }
    if (this.contactDcComponent.contactDetailsForm.valid && this.isAddressavailable)
      this.save.emit({
        personDetails: this.personalDetails,
        contactDetail: this.contactDcComponent.contactDetailsForm.getRawValue()
      });
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   */
  showCancelTemplate() {
    this.cancel.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }
  confirmCancel() {
    this.confirm.emit();
  }

  declineCancel() {
    this.decline.emit();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }
}
