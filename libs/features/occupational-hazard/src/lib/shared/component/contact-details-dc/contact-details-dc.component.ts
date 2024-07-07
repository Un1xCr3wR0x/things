/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, InputBaseComponent, ContactDetails } from '@gosi-ui/core';

@Component({
  selector: 'oh-contact-details-dc',
  templateUrl: './contact-details-dc.component.html',
  styleUrls: ['./contact-details-dc.component.scss']
})
export class ContactDetailsDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  /**
   * This method is used to initialise the component*
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  /**
   * Local Variables
   */
  contactNumberDetailsForm: FormGroup;
  idType = '';
  mobileMaxLength = 15;
  emergencyValidators = {
    validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
    updateOn: 'blur'
  };

  /**
   * Input Variables
   */
  @Input() idValue = '';
  @Input() control;
  @Input() readOnlyAll: boolean;
  @Input() defaultOnly = false;
  @Input() parentForm : FormGroup;
  @Input() isHeadingRequired = true;
  @Input() isVerifyRequired = false;
  @Input() isdControl;
  @Input() contactDetails: ContactDetails = null;
  @Input() isGroupInjuryScreen = false;

  /**
   * Initialization
   */
  ngOnInit() {
    this.contactNumberDetailsForm = this.createPersonForm();
    this.updateContact();
  }
  updateContact() {
    if (this.control && this.contactNumberDetailsForm) {
      this.control = this.control.toString();
      this.contactNumberDetailsForm.get('mobileNo').get('primary').setValue(this.control);
      if (this.isdControl) {
        this.contactNumberDetailsForm.get('mobileNo').get('isdCodePrimary').setValue(this.isdControl);
      } else {
        this.contactNumberDetailsForm.get('mobileNo').get('isdCodePrimary').setValue('sa');
      }
      if (this.isdControl !== 'sa' && this.control.length < 9) {
        this.contactNumberDetailsForm.get('mobileNo').get('primary').setValidators(null);
        this.contactNumberDetailsForm.get('mobileNo').get('primary').clearValidators();
        this.contactNumberDetailsForm.get('mobileNo').get('primary').updateValueAndValidity();
      }
      this.contactNumberDetailsForm.markAllAsTouched();
      this.contactNumberDetailsForm.updateValueAndValidity();
    }
    if(this.isGroupInjuryScreen && this.parentForm && this.contactNumberDetailsForm){
      this.parentForm.addControl('contactForm', this.contactNumberDetailsForm);
    } 
  }
  /**
   * Updating contact details
   */
  ngOnChanges(changes: SimpleChanges) {
    if(changes.parentForm && changes.parentForm.currentValue){
      this.parentForm = changes.parentForm.currentValue; 
    }     
    if(changes.isGroupInjuryScreen && changes.isGroupInjuryScreen.currentValue){
      this.isGroupInjuryScreen = changes.isGroupInjuryScreen.currentValue;          
    }
    if (this.contactNumberDetailsForm && changes) {
      this.updateContact();        
    }    
  }
  /**
   * This method is to create ContactDetailsForm and initialize
   * @memberof ContactNoDcComponent
   */
  createPersonForm() {
    return this.fb.group({
      mobileNo: this.fb.group({
        primary: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: [null, { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
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

  //
  setErrorMsgs() {}
}

