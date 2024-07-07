/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EngagementService, PersonTypesEnum } from '../../../../shared';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { markFormGroupTouched } from '@gosi-ui/core';
import { DataSharingService } from '@gosi-ui/features/contributor/lib/shared/services/data-sharing.service';
@Component({
  selector: 'cnt-spl-foreigner-person-details-dc',
  templateUrl: './spl-foreigner-person-details-dc.component.html',
  styleUrls: ['./spl-foreigner-person-details-dc.component.scss']
})
export class SplForeignerPersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**
   * variable declaration and initializations
   */
  splForeignerPersonDetailsForm: FormGroup;
  modalRef: BsModalRef;
  isSpecialResidents: boolean;
  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  @Input() isAppPrivate = false;
  @Input() isNonSaudi = false;
  isUnclaimed: boolean = true;

  /**
   * Method to initialize SplForeignerPersonDetailsComponent class
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
    this.splForeignerPersonDetailsForm = super.createPersonDetailsForm(false);
    if (this.splForeignerPersonDetailsForm) {
      this.createIdentityTypesForSplForeigner();
    }
    super.bindDataToForm(this.splForeignerPersonDetailsForm, this.personDetails);

    /**
     * Bind identity data to special foreigner person details form
     */
    this.personDetails.identity.forEach(identity => {
      this.identities.controls.forEach(item => {
        if (identity.idType === item.get('idType').value) {
          super.bindIdentityDataToForm(item as FormGroup, identity);
        }
      });
    });
    if (this.splForeignerPersonDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.splForeignerPersonDetailsForm);
    }
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
  /**
   * Method to create identity types for createSplForeignerPersonDetailsForm identity form array
   */
  createIdentityTypesForSplForeigner() {
    this.identities.push(super.getIqamaForm(true));
    this.identities.push(super.getPassportForm());
    if (!this.isAppPrivate && !this.isSpecialResidents) this.identities.push(super.getBorderForm(false));
  }

  /**
   * Method to retrive identity form array control
   */
  get identities() {
    return this.splForeignerPersonDetailsForm.get('identity') as FormArray;
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveSplForeignerContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.splForeignerPersonDetailsForm);
    this.contributorDetails = this.splForeignerPersonDetailsForm.getRawValue();
    // markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
    // this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    // this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    // this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;

    // isAddressContactValid =
    //   this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;
    if (!this.isSpecialResidents) this.contributorDetails.personType = PersonTypesEnum.SPECIAL_FOREIGNER;
    else this.contributorDetails.personType = PersonTypesEnum.PREMIUM_RESIDENTS;
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
    this.splForeignerPersonDetailsForm.markAsUntouched();
    this.splForeignerPersonDetailsForm.markAsPristine();
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
