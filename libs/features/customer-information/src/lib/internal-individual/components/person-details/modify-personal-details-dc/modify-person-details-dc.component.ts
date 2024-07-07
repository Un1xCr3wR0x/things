/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { markFormGroupTouched, startOfDay } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PersonDetailsBaseDc } from '../person-details-base-dc';

@Component({
  selector: 'cim-modify-person-details-dc',
  templateUrl: './modify-person-details-dc.component.html',
  styleUrls: ['./modify-person-details-dc.component.scss']
})
export class ModifyPersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**
   * variable declaration and initializations
   */
  personDetailsForm: FormGroup;
  educationDetailsForm: FormGroup;
  modalRef: BsModalRef;
  @Output() changePassport: EventEmitter<string> = new EventEmitter();
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

  /**
   * Method to handle all initial tasks
   */
  ngOnInit() {
    this.personDetailsForm = super.createPersonDetailsForm(false);
    this.educationDetailsForm = super.createEducationForm();
    if (this.personDetailsForm) {
      this.createIdentityTypesForCont();
    }
    super.bindDataToForm(this.personDetailsForm, this.personDtls);
    // super.bindDataToForm(this.educationDetailsForm, this.educationDetails);
    /**
     * Bind identity data to person details form
     */
    this.personDtls.identity.forEach(identity => {
      this.identities.controls.forEach(item => {
        if (identity.idType === item.get('idType').value) {
          super.bindIdentityDataToForm(item as FormGroup, identity);
        }
      });
    });
    if (this.personDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.personDetailsForm);
    }
    super.checkForValues();
  }

  /**
   * Method to create identity types for createpersonDetailsForm identity form array
   */
  createIdentityTypesForCont() {
    if (this.personDtls.identity.find(x => x.idType == 'NIN')) {
      this.identities.push(super.getNINForm(false));
    }
    this.personDtls.identity.find(x => x.idType == 'GCCID')
      ? this.identities.push(super.getNationalIDForm(false))
      : null;
    this.personDtls.identity.find(x => x.idType == 'IQAMA') ? this.identities.push(super.getIqamaForm(false)) : null;
    this.personDtls.identity.find(x => x.idType == 'BORDERNO')
      ? this.identities.push(super.getBorderForm(false))
      : null;
    (this.isSaudiPerson && this.personDtls.identity.find(x => x.idType == 'PASSPORT')) || !this.isSaudiPerson
      ? this.identities.push(super.getPassportForm())
      : null;
  }

  /**
   * Method to retrive identity form array control
   */
  get identities() {
    return this.personDetailsForm.get('identity') as FormArray;
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.personDetailsForm);
    this.contributorDetails = this.personDetailsForm.getRawValue();
    markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
    this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
    this.contributorDetails.birthDate.gregorian = startOfDay(this.contributorDetails.birthDate.gregorian);
    for (let i = 0; i < this.contributorDetails.identity.length; i++) {
      if (this.contributorDetails.identity[i].idType == 'PASSPORT') {
        this.contributorDetails.identity[i].expiryDate.gregorian = startOfDay(
          this.contributorDetails.identity[i].expiryDate.gregorian
        );
        this.contributorDetails.identity[i].issueDate.gregorian = startOfDay(
          this.contributorDetails.identity[i].issueDate.gregorian
        );
      }
    }
    isAddressContactValid =
      this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;
    // console.log('111', this.addressDetailsComponent.getAddressValidity());
    // console.log('222', this.contactDetailsComponent.contactDetailsForm.invalid);
    // console.log('333', this.personDetailsForm);
    // this.contributorDetails.personType = PersonTypesEnum.GCC;
    if (isAddressContactValid && this.personDetailsForm.valid) {
      this.contributorSave.emit(this.contributorDetails);
    } else {
      this.contributorSave.emit(null);
      this.showAlert.emit(true);
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
    this.personDetailsForm.markAsUntouched();
    this.personDetailsForm.markAsPristine();
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
