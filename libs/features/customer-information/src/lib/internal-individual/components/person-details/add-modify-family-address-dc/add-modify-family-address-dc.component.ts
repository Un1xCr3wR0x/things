/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FamilyDetails, markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PersonDetailsBaseDc } from '../person-details-base-dc';

@Component({
  selector: 'cim-add-modify-family-address-dc',
  templateUrl: './add-modify-family-address-dc.component.html',
  styleUrls: ['./add-modify-family-address-dc.component.scss']
})
export class AddModifyFamilyAddressDcComponent extends PersonDetailsBaseDc implements OnInit, OnChanges {
  /**
   * variable declaration and initializations
   */
  familyDetailsForm: FormGroup;
  educationDetailsForm: FormGroup;
  modalRef: BsModalRef;
  @Input() familyDetails: FamilyDetails;
  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  /**
   * Method to initialize PersonDetailsComponent class
   * @param fb
   */
  constructor(readonly fb: FormBuilder, readonly modalService: BsModalService, readonly location: Location) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.familyDetails && changes.familyDetails.currentValue) {
      this.familyDetails = changes.familyDetails.currentValue;
    }
    this.familyDetailsForm = super.createFamilyDetailsForm();
    if (this.familyDetails) super.bindFamilyAddressDataToForm(this.familyDetailsForm, this.familyDetails);
    if (this.familyDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.familyDetailsForm);
    }
  }

  /**
   * Method to handle all initial tasks
   */
  ngOnInit() {
    // console.log("personDtls", this.personDtls);
    // this.familyDetailsForm = super.createfamilyDetailsForm(false);
    // super.bindDataToForm(this.familyDetailsForm, this.personDtls);
    // console.log("persondtls from", this.familyDetailsForm);
    // if (this.familyDetailsForm && this.parentForm) {
    //   this.parentForm.addControl('personDetails', this.familyDetailsForm);
    // }
    // super.checkForValues();
  }

  /**
   * Method to retrive identity form array control
   */
  // get identities() {
  //   return this.familyDetailsForm.get('identity') as FormArray;
  // }

  /**
   * Method to emit person details form data to parent component
   */
  saveContributorDetails() {
    //('familyAddressDetails', this.familyAddressDetails);
    let isAddressValid = true;
    let isContactValid = true;
    markFormGroupTouched(this.familyDetailsForm);
    this.familyAddressDetails = this.familyDetailsForm.getRawValue();
    this.familyAddressDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    //console.log('familyAddressDetailsssss', this.familyAddressDetails);
    //console.log('addressDetailsComponent', this.addressDetailsComponent.getAddressDetails());
    this.familyAddressDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    this.familyAddressDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
    //console.log('familyAddressDetail', this.familyAddressDetails);
    isAddressValid = this.addressDetailsComponent.getAddressValidity();
    isContactValid = this.checkContactValidity(this.familyAddressDetails);
    // this.contributorDetails.personType = PersonTypesEnum.GCC;
    if (isAddressValid && this.familyDetailsForm.valid && isContactValid) {
      //console.log('data1', this.familyAddressDetails);
      this.familyAddressSave.emit(this.familyAddressDetails);
    } else {
      //console.log('data2', this.familyAddressDetails);
      this.familyAddressSave.emit(null);
      this.showAlert.emit(true);
    }
  }

  checkContactValidity(familyAddressDetails: FamilyDetails) {
    if (familyAddressDetails.contactDetail.mobileNo.primary && familyAddressDetails.contactDetail.emailId.primary) {
      return true;
    } else {
      this.contactDetailsComponent.contactDetailsForm.markAllAsTouched();
      return false;
    }
  }

  /**
   * This method is to confirm cancellation of transaction
   * @memberof ContributorPersonalDetailsDcComponent
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
    this.location.back();
  }
  /**
   * This method is to decline cancellation of transaction
   * @memberof ContributorPersonalDetailsDcComponent
   */
  decline() {
    this.modalRef.hide();
    this.familyDetailsForm.markAsUntouched();
    this.familyDetailsForm.markAsPristine();
    this.contactDetailsComponent.contactDetailsForm.markAsUntouched();
    this.contactDetailsComponent.contactDetailsForm.markAsPristine();
  }
  /**
   * This method is to display the template on click of cancel button
   * @param  TemplateRef
   * @memberof ContributorPersonalDetailsDcComponent
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
}
