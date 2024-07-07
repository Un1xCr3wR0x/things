/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AddressTypeEnum,
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService,
  isGccEstablishment
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-address-details-sc',
  templateUrl: './validate-address-details-sc.component.html',
  styleUrls: ['./validate-address-details-sc.component.scss']
})
export class ValidateAddressDetailsScComponent extends ValidatorScBaseComponent implements OnInit {
  addressDetailsValidatorForm: FormGroup;
  isGcc: boolean;
  isNationalAddressChanged = false;
  isPoxAddressChanged = false;
  isOverseasAddressChanged = false;

  constructor(
    readonly lookUpService: LookupService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
  ) {
    super(
      lookUpService,
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseViewWithAddress(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }
  /**
   *  Method to initialise the view for showing establishment details and comments
   * @param referenceNumber
   */
  initialiseViewWithAddress(referenceNumber: number) {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.addressDetailsValidatorForm = this.createForm();
    this.addressDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });

    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);
    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
    this.getRejectReasonList();
    this.getReturnReasonList();
  }

  /**
   * // method to get the establishment address details to validate
   * @param referenceNumber
   */
  getValidatingEstablishmentDetails(registrationNo: number, referenceNumber: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(registrationNo, referenceNumber)
      .pipe(
        tap(res => (this.establishmentToValidate = res)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.isNationalAddressChanged = this.establishmentToValidate.contactDetails?.addresses.some(
            e => e.type === AddressTypeEnum.NATIONAL
          );
          this.isPoxAddressChanged = this.establishmentToValidate.contactDetails?.addresses.some(
            e => e.type === AddressTypeEnum.POBOX
          );
          this.isOverseasAddressChanged = this.establishmentToValidate.contactDetails?.addresses.some(
            e => e.type === AddressTypeEnum.OVERSEAS
          );
          if (isGccEstablishment(this.establishmentToValidate)) {
            this.isGcc = true;
            this.isOverseasAddressChanged = true;
          }
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.establishmentToValidate.registrationNo,
            this.estRouterData.referenceNo
          );
          this.getEstablishmentDetails(this.establishmentToValidate.registrationNo);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }
}
