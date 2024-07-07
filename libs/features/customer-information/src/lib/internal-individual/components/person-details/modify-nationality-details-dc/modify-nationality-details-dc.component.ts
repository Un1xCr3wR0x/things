/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { PersonTypesEnum } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cim-modify-nationality-details-dc',
  templateUrl: './modify-nationality-details-dc.component.html',
  styleUrls: ['./modify-nationality-details-dc.component.scss']
})
export class ModifyNationalityDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**
   * variable declaration and initializations
   */
  personDetailsForm: FormGroup;
  educationDetailsForm: FormGroup;
  modalRef: BsModalRef;
  isSaudi: boolean;
  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  /**
   * Method to initialize PersonDetailsComponent class
   * @param fb
   */
  constructor(readonly fb: FormBuilder, readonly modalService: BsModalService) {
    super(fb);
  }

  /**
   * Method to handle all initial tasks
   */
  ngOnInit() {
    if (this.personDtls.nationality.english == 'Saudi Arabia') this.isSaudi = true;
    this.personDetailsForm = super.createPersonDetailsForm(false);
    this.educationDetailsForm = super.createEducationForm();
    if (this.personDetailsForm) {
      this.createIdentityTypesForCont();
    }
    super.bindDataToForm(this.personDetailsForm, this.personDtls);
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
    if (this.personDtls.identity.find(x => x.idType == 'GCCID')) {
      this.isSaudi
        ? this.identities.push(super.getNationalIDForm(true))
        : this.identities.push(super.getNationalIDForm(false));
    }
    if (this.personDtls.identity.find(x => x.idType == 'IQAMA')) {
      this.isSaudi ? this.identities.push(super.getIqamaForm(false)) : this.identities.push(super.getIqamaForm(true));
    }
    if (this.personDtls.identity.find(x => x.idType == 'PASSPORT')) {
      this.identities.push(super.getPassportForm());
    }
    // this.isSaudi ? this.identities.push(super.getNationalIDForm(true)) : this.identities.push(super.getNationalIDForm(false));
    // this.isSaudi ? this.identities.push(super.getIqamaForm(false)) : this.identities.push(super.getIqamaForm(true));
    // this.identities.push(super.getPassportForm());
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
    isAddressContactValid =
      this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;

    // this.contributorDetails.personType = PersonTypesEnum.GCC;
    if (isAddressContactValid) {
      this.contributorSave.emit(this.contributorDetails);
    } else {
      this.contributorSave.emit(null);
    }
  }
  /**
   * This method is to confirm cancellation of transaction
   * @memberof ContributorPersonalDetailsDcComponent
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
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
