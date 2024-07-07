/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  MobileDetails,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';
export const ISD_PREFIX_MAPPING = {
  sa: '+966',
  kw: '+965',
  bh: '+973',
  om: '+968',
  qa: '+974',
  ae: '+971'
};
@Component({
  selector: 'est-validate-contact-details-sc',
  templateUrl: './validate-contact-details-sc.component.html',
  styleUrls: ['./validate-contact-details-sc.component.scss']
})
export class ValidateContactDetailsScComponent extends ValidatorScBaseComponent implements OnInit {
  contactDetailsValidatorForm: FormGroup;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
  ) {
    super(
      lookupService,
      changeEstablishmentService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
  }
  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseViewWithContact(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing establishment details and comments
   * @param referenceNumber
   */
  initialiseViewWithContact(referenceNumber: number) {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.contactDetailsValidatorForm = this.createForm();
    this.contactDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getISDCodePrefix(this.establishmentToValidate.contactDetails?.mobileNo);
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);
    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix(mobileNo: MobileDetails): string {
    let prefix;
    if (mobileNo === null || mobileNo.primary === null) {
      prefix = null;
    } else if (mobileNo.isdCodePrimary === null) {
      prefix = ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(ISD_PREFIX_MAPPING).forEach(key => {
        if (key === mobileNo.isdCodePrimary) {
          prefix = ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }
}
