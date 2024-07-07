/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BorderNumber, getIdentityValue, IdentityTypeEnum, Iqama, markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EngagementService, PersonTypesEnum } from '../../../../shared';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { DataSharingService } from '@gosi-ui/features/contributor/lib/shared/services/data-sharing.service';
@Component({
  selector: 'cnt-non-saudi-person-details-dc',
  templateUrl: './non-saudi-person-details-dc.component.html',
  styleUrls: ['./non-saudi-person-details-dc.component.scss']
})
export class NonSaudiPersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit {
  /**Local variables */
  nonSaudiPersonDetailsForm: FormGroup;
  modalRef: BsModalRef;
  /**
   * Input variables
   */

  @Input() isApiTriggered = false;
  @Input() isNonSaudi = false;
  isUnclaimed: boolean = true;

  /**
  /**
   * Method to initialize NonSaudiPersonDetailsComponent class
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
    this.nonSaudiPersonDetailsForm = super.createPersonDetailsForm(false);
    if (this.nonSaudiPersonDetailsForm) {
      this.createIdentityTypesForNonSaudi();
    }
    super.bindDataToForm(this.nonSaudiPersonDetailsForm, this.personDetails);
    /**
     * Bind identity data to non saudi person details form
     */
    this.personDetails.identity.forEach(identity => {
      this.identities.controls.forEach(item => {
        if (identity.idType === item.get('idType').value) {
          super.bindIdentityDataToForm(item as FormGroup, identity);
        }
      });
    });
    if (this.nonSaudiPersonDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.nonSaudiPersonDetailsForm);
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
   * Method to create identity types for createNonSaudiPersonDetailsForm identity form array
   */
  createIdentityTypesForNonSaudi() {
    const isBorderPresent = (<BorderNumber>getIdentityValue(this.personDetails.identity, IdentityTypeEnum.BORDER))?.id
      ? true
      : false;
    const isIqamaPresent = (<Iqama>getIdentityValue(this.personDetails.identity, IdentityTypeEnum.IQAMA))?.iqamaNo
      ? true
      : false;
    this.identities.push(super.getBorderForm(isBorderPresent));
    this.identities.push(super.getIqamaForm(isIqamaPresent)), this.identities.push(super.getPassportForm());
  }

  /**
   * Method to retrive identity form array control
   */
  get identities() {
    if (this.nonSaudiPersonDetailsForm) {
      return this.nonSaudiPersonDetailsForm.get('identity') as FormArray;
    }
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveNonSaudiContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.nonSaudiPersonDetailsForm);
    this.contributorDetails = this.nonSaudiPersonDetailsForm.getRawValue();
    // markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
    // this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    // this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    // this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
    // isAddressContactValid =
    //   this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;

    this.contributorDetails.personType = PersonTypesEnum.NON_SAUDI;
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
    this.nonSaudiPersonDetailsForm.markAsUntouched();
    this.nonSaudiPersonDetailsForm.markAsPristine();
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
