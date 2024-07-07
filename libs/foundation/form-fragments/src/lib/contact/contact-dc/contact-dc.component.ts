import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ContactDetails, emailValidator, lengthValidator } from '@gosi-ui/core';

@Component({
  selector: 'frm-contact-dc',
  templateUrl: './contact-dc.component.html',
  styleUrls: ['./contact-dc.component.scss']
})
export class ContactDcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contactDetails: ContactDetails = null;
  @Input() applyCountryValidation = true;
  @Input() idValue = '';
  @Input() readOnlyAll: boolean;
  @Input() reimbTransaction: boolean;
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;
  @Input() isHeadingRequired = true;
  @Input() isVerifyRequired = false;
  @Input() parentForm: FormGroup;
  @Input() showTelephone = true;
  @Input() emailMandatory = false;
  @Input() enableEmail = false;
  @Input() isOnlyGcc = true;
  @Input() isNonSaudi = true;
  // Local Variables
  contactDetailsForm: FormGroup;

  @Output() mobileNoChanged: EventEmitter<null> = new EventEmitter();
  @Output() verifyEvent: EventEmitter<string> = new EventEmitter();
  @Output() emitForm: EventEmitter<FormGroup> = new EventEmitter();

  isdControl = new FormControl(null);
  mobileMinLength = 5;
  mobileMaxLength = 15;
  extensionMinLength = 0;
  extensionMaxLength = 5;
  emailMaxLength = 35;
  disableExtension = true;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit() {
    this.contactDetailsForm = this.createContactDetailsForm();
    if (this.showTelephone) {
      this.contactDetailsForm.addControl('telephoneNo', this.createTelephoneNumberForm());
    }
    if (this.parentForm) {
      this.parentForm.addControl('contactDetail', this.contactDetailsForm);
    }
    if (this.contactDetails && this.contactDetailsForm) {
      Object.keys(this.contactDetails).forEach(name => {
        if (this.contactDetailsForm && this.contactDetailsForm.get(name) && this.contactDetails[name]) {
          this.contactDetailsForm.get(name).patchValue(this.contactDetails[name]);
          this.contactDetailsForm.get(name).updateValueAndValidity();
        }
      });
    }
    if (this.contactDetailsForm) {
      this.emitForm.emit(this.contactDetailsForm);
    }
    if (this.showTelephone) this.checkValue();
  }

  /**
   * Updating contact details  object
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactDetails && changes.contactDetails.currentValue) {
      Object.keys(this.contactDetails).forEach(name => {
        if (this.contactDetailsForm && this.contactDetailsForm.get(name) && this.contactDetails[name]) {
          this.contactDetailsForm.get(name).patchValue(this.contactDetails[name]);
          this.contactDetailsForm.get(name).updateValueAndValidity();
        }
      });
      if (this.contactDetails.telephoneNo?.primary && this.showTelephone) {
        this.disableExtension = false;
      }
    }
  }

  /**
   * Creating contact details form with default values
   */
  createContactDetailsForm() {
    const emailValidators = this.isNonSaudi
      ? [Validators.required, Validators.maxLength(this.emailMaxLength), emailValidator]
      : [];
    const mobileValidators = this.isNonSaudi ? [Validators.required, Validators.pattern('[0-9]+')] : [];
    return this.fb.group({
      emailId: this.fb.group({
        primary: [
          '',
          emailValidators
          // {
          //   validators: Validators.compose([
          //     this.setEmailRequired(),
          //     emailValidator,
          //     Validators.maxLength(this.emailMaxLength)
          //   ]),
          //   updateOn: 'blur'
          // }
        ]
      }),
      mobileNo: this.fb.group({
        primary: [
          null,
          mobileValidators
          // {
          //   validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
          //   updateOn: 'blur'
          // }
        ],
        isdCodePrimary: [null, { updateOn: 'blur' }]
      }),
      mobileNoVerified: [false]
    });
  }

  /**
   * This method is to enable and disable extension on telephone umber keyup.
   */
  checkValue() {
    this.contactDetailsForm
      .get('telephoneNo')
      .get('primary')
      .valueChanges.subscribe(() => {
        if (!this.contactDetailsForm.get('telephoneNo').get('primary').value) {
          this.contactDetailsForm.get('telephoneNo').get('extensionPrimary').reset();
          this.contactDetailsForm.get('telephoneNo').get('extensionPrimary').markAsUntouched();
          this.contactDetailsForm.get('telephoneNo').get('extensionPrimary').updateValueAndValidity();
          this.disableExtension = true;
        } else if (this.contactDetailsForm.get('telephoneNo').get('primary').value.length === this.mobileMaxLength) {
          this.disableExtension = false;
        } else {
          this.disableExtension = true;
        }
      });
  }
  /**
   * Resetting contact details form with default values
   */
  resetContactForm() {
    this.contactDetailsForm.reset(this.createContactDetailsForm().getRawValue());
  }

  //Method to handle mobile no changes
  mobileNoBlur() {
    if (this.contactDetailsForm.get('mobileNo').get('primary').value !== this.contactDetails?.mobileNo?.primary) {
      if (this.reimbTransaction) {
        this.contactDetailsForm.get('mobileNo').get('primary').reset();
        this.contactDetailsForm.get('mobileNo').get('primary').setErrors({ verify: true });
        this.contactDetailsForm.get('mobileNo').get('primary').clearValidators();
      } else {
        this.contactDetailsForm.get('mobileNoVerified').setValue(false);
        this.mobileNoChanged.emit();
      }
    } else {
      this.contactDetailsForm.get('mobileNoVerified').setValue(true);
    }
  }

  //Method to handle the verify mobile number with absher
  verifyMobile() {
    this.verifyEvent.emit(this.contactDetailsForm.get('mobileNo').get('primary').value);
  }

  ngOnDestroy() {
    if (this.parentForm && this.parentForm.get('contactDetail')) {
      this.parentForm.removeControl('contactDetail');
    }
  }
  /**
   * Method to set email required
   */
  setEmailRequired() {
    if (this.emailMandatory) return Validators.required;
  }
  /**
   * Method to create telephone number form
   */
  createTelephoneNumberForm() {
    return this.fb.group({
      primary: [
        '',
        {
          validators: Validators.compose([Validators.maxLength(this.mobileMaxLength), Validators.pattern('[0-9]+')]),
          updateOn: 'blur'
        }
      ],
      extensionPrimary: [
        '',
        {
          validators: Validators.compose([
            lengthValidator(this.extensionMinLength, this.extensionMaxLength),
            Validators.pattern('[0-9]+')
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }
}
