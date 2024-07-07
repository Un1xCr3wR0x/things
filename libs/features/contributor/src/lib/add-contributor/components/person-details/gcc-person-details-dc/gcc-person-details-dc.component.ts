/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EngagementService, PersonTypesEnum } from '../../../../shared';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { DataSharingService } from '@gosi-ui/features/contributor/lib/shared/services/data-sharing.service';
@Component({
  selector: 'cnt-gcc-person-details-dc',
  templateUrl: './gcc-person-details-dc.component.html',
  styleUrls: ['./gcc-person-details-dc.component.scss']
})
export class GccPersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**
   * variable declaration and initializations
   */
  gccPersonDetailsForm: FormGroup;
  modalRef: BsModalRef;

  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  @Input() isNonSaudi = false;
  isUnclaimed: boolean = true;

  /**
   * Method to initialize GccPersonDetailsComponent class
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
    this.gccPersonDetailsForm = super.createPersonDetailsForm(false);
    if (this.gccPersonDetailsForm) {
      this.createIdentityTypesForGcc();
    }
    super.bindDataToForm(this.gccPersonDetailsForm, this.personDetails);
    /**
     * Bind identity data to gcc person details form
     */
    this.personDetails.identity.forEach(identity => {
      this.identities.controls.forEach(item => {
        if (identity.idType === item.get('idType').value) {
          super.bindIdentityDataToForm(item as FormGroup, identity);
        }
      });
    });
    if (this.gccPersonDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.gccPersonDetailsForm);
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
   * Method to create identity types for createGccPersonDetailsForm identity form array
   */
  createIdentityTypesForGcc() {
    this.identities.push(super.getNationalIDForm());
    this.identities.push(super.getIqamaForm());
    this.identities.push(super.getPassportForm());
  }

  /**
   * Method to retrive identity form array control
   */
  get identities() {
    return this.gccPersonDetailsForm.get('identity') as FormArray;
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveGccContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.gccPersonDetailsForm);
    this.contributorDetails = this.gccPersonDetailsForm.getRawValue();
    if(this.isNonSaudi) {
      markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
      this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
      this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
      this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
      isAddressContactValid =
        this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;
    }

    this.contributorDetails.personType = PersonTypesEnum.GCC;
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
    this.gccPersonDetailsForm.markAsUntouched();
    this.gccPersonDetailsForm.markAsPristine();
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
