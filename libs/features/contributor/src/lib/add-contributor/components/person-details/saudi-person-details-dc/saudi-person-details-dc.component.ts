/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AfterViewInit, Component, Input, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LovList, markFormGroupTouched } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EngagementService, PersonTypesEnum } from '../../../../shared';
import { PersonDetailsBaseDc } from '../person-details-base-dc';
import { DataSharingService } from '@gosi-ui/features/contributor/lib/shared/services/data-sharing.service';

@Component({
  selector: 'cnt-saudi-person-details-dc',
  templateUrl: './saudi-person-details-dc.component.html',
  styleUrls: ['./saudi-person-details-dc.component.scss']
})
export class SaudiPersonDetailsDcComponent extends PersonDetailsBaseDc implements OnInit, AfterViewInit {
  /**
   * Variable declaration and initialization
   */
  saudiPersonDetailsForm: FormGroup;
  modalRef: BsModalRef;
  isPersonAddressNotPresent = true;
  /**
   * Input variables
   */
  @Input() booleanList: Observable<LovList>;
  @Input() isEstablishmentAddress = false;
  @Input() isApiTriggered = false;
  @Input() isNonSaudi = false;
  isUnclaimed: boolean = true;
  /**
   * Method to initialize SaudiPersonDetailsComponent class
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
    this.saudiPersonDetailsForm = super.createPersonDetailsForm(true);
    super.bindDataToForm(this.saudiPersonDetailsForm, this.personDetails);
    if (!this.isPersonAddressNotPresent) this.checkPersonAddress();
    this.setContactStatus();
    if (this.saudiPersonDetailsForm && this.parentForm) {
      this.parentForm.addControl('personDetails', this.saudiPersonDetailsForm);
    }
    this.getPersonApiTriggered();
    this.getAdminpool();
  }
  /**Method to check address validity */
  ngAfterViewInit(): void {
    if (!this.isPersonAddressNotPresent) this.checkPersonAddress();
    this.setContactStatus();
  }
  /**Method to check person address present */
  checkPersonAddress(): void {
    if (
      this.personDetails.contactDetail?.addresses?.length > 0 &&
      this.addressDetailsComponent &&
      this.contactDetailsComponent
    )
      this.isPersonAddressNotPresent =
        this.personDetails.contactDetail.addresses.length === 1 &&
        this.personDetails.contactDetail.addresses[0].type === 'OVERSEAS'
          ? true
          : !this.addressDetailsComponent.getAddressValidity() ||
            this.contactDetailsComponent.contactDetailsForm.invalid;
    this.setContactStatus();
  }

  getAdminpool(){
    this.dataSharingService.isUnclaimed$.subscribe((isUnclaimed: boolean) => {
      this.isUnclaimed = isUnclaimed;
      console.log('isUnclaimed in ngOnInit:', this.isUnclaimed);
    });
  }

  /** Method to set contact status to know whether contact is editable or not. */
  setContactStatus() {
    // This status is used in register contributor inorder to check whether second party section can be edited in contract preview screen for a saudi contributor.
    if (this.parentForm.get('contactStatus')) this.parentForm.removeControl('contactStatus');
    this.parentForm.addControl('contactStatus', this.fb.group({ canEdit: this.isPersonAddressNotPresent }));
  }

  /** Method to save contributor details. */
  saveSaudiContributorDetails() {
    let isAddressContactValid = true;
    markFormGroupTouched(this.saudiPersonDetailsForm);
    this.contributorDetails = this.saudiPersonDetailsForm.getRawValue();
    this.contributorDetails.identity = this.personDetails.identity;
    // if (this.isPersonAddressNotPresent || this.isEditMode || this.isEstablishmentAddress) {
    //   markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm);
    //   this.contributorDetails.contactDetail = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    //   this.contributorDetails.contactDetail.addresses = this.addressDetailsComponent.getAddressDetails();
    //   this.contributorDetails.contactDetail.currentMailingAddress = this.addressDetailsComponent.parentForm.get(
    //     'currentMailingAddress'
    //   ).value;
    //   isAddressContactValid =
    //     this.addressDetailsComponent.getAddressValidity() && !this.contactDetailsComponent.contactDetailsForm.invalid;
    // } else {
    //   this.contributorDetails.contactDetail = this.personDetails.contactDetail;
    //   this.contributorDetails.contactDetail.addresses = this.personDetails.contactDetail.addresses;
    //   this.contributorDetails.contactDetail.currentMailingAddress = this.personDetails.contactDetail.currentMailingAddress;
    // }
    this.contributorDetails.personType = PersonTypesEnum.SAUDI;
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
    this.saudiPersonDetailsForm.markAsUntouched();
    this.saudiPersonDetailsForm.markAsPristine();
    if (this.isPersonAddressNotPresent || this.isEditMode || this.isEstablishmentAddress) {
      this.contactDetailsComponent.contactDetailsForm.markAsUntouched();
      this.contactDetailsComponent.contactDetailsForm.markAsPristine();
    }
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
    this.engagementService.ispersonApiTriggered$.subscribe(isPersonApi => {
      this.isApiTriggered = isPersonApi;
    })
  }
}
