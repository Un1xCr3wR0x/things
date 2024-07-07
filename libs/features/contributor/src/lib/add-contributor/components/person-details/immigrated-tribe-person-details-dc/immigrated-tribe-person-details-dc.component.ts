/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EngagementService, Nationalities, PersonTypesEnum } from '../../../../shared';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { DataSharingService } from '@gosi-ui/features/contributor/lib/shared/services/data-sharing.service';
@Component({
  selector: 'cnt-immigrated-tribe-person-details-dc',
  templateUrl: './immigrated-tribe-person-details-dc.component.html',
  styleUrls: ['./immigrated-tribe-person-details-dc.component.scss']
})
export class ImmigratedTribePersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**
   * variable declaration and initializations
   */
  immigratedTribePersonDetailsForm: FormGroup;
  modalRef: BsModalRef;
  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  @Input() isNonSaudi = false;
  isUnclaimed: boolean = true;

  /**
   * Method to initialize ImmigratedTribePersonDetailsComponent class
   * @param fb
   */
  constructor(
    readonly fb: FormBuilder,
     private modalService: BsModalService,
     private engagementService: EngagementService,
     private dataSharingService: DataSharingService) {
      super(fb);
  }

  /**
   * Method to handle all initial tasks
   */
  ngOnInit() {
    this.immigratedTribePersonDetailsForm = super.createPersonDetailsForm(false);
    if (this.immigratedTribePersonDetailsForm) {
      this.createIdentityTypesForImmigratedTribe();
    }
    /**
     * Bind identity data to immigrated tribe person details form
     */
    super.bindDataToForm(this.immigratedTribePersonDetailsForm, this.personDetails);
    this.personDetails.identity.forEach(identity => {
      this.identities.controls.forEach(item => {
        if (identity.idType === item.get('idType').value) {
          super.bindIdentityDataToForm(item as FormGroup, identity);
        }
      });
    });
    if (this.immigratedTribePersonDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.immigratedTribePersonDetailsForm);
    }
    this.setNationalityToImmigrated();
    super.checkForValues();
    this.getPersonApiTriggered();
    this.getAdminpool();
  }

  getAdminpool(){
    this.dataSharingService.isUnclaimed$.subscribe((isUnclaimed: boolean) => {
      this.isUnclaimed = isUnclaimed;
      console.log('isUnclaimed in ngOnInit:', this.isUnclaimed);
    });
  }

  /**Method to set nationality */
  setNationalityToImmigrated(): void {
    this.immigratedTribePersonDetailsForm.get('nationality.english').setValue(Nationalities.IMMIGRATED_TRIBE);
  }

  /**
   * Method to create identity types for createImmigratedTribePersonDetailsForm identity form array
   */
  createIdentityTypesForImmigratedTribe() {
    this.identities.push(super.getIqamaForm(true));
    this.identities.push(super.getPassportForm());
  }

  /**
   * Method to retrive identity form array control
   */
  get identities() {
    return this.immigratedTribePersonDetailsForm.get('identity') as FormArray;
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveImmigratedTribeContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.immigratedTribePersonDetailsForm);
    this.contributorDetails = this.immigratedTribePersonDetailsForm.getRawValue();

    // markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
    // this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    // this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    // this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
    // isAddressContactValid =
    //   this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;

    this.contributorDetails.personType = PersonTypesEnum.IMMIGRATED_TRIBE;
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
    // this.modalRef.hide();
    this.reset.emit();
  }
  /**
   * This method is to decline cancellation of transaction
   * @memberof ContributorPersonalDetailsDcComponent
   */
  decline() {
    this.modalRef.hide();
    this.immigratedTribePersonDetailsForm.markAsUntouched();
    this.immigratedTribePersonDetailsForm.markAsPristine();
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
  getPersonApiTriggered() {
    this.engagementService.ispersonApiTriggered$.subscribe((isPersonApi: boolean) => {
      this.isApiTriggered = isPersonApi;
    })
  }
}
