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
  Autobind,
  Channel,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  getArabicName,
  LookupService,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService,
  isGccEstablishment,
  LegalEntityEnum,
  Owner
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-legal-entity-sc',
  templateUrl: './validate-legal-entity-sc.component.html',
  styleUrls: ['./validate-legal-entity-sc.component.scss']
})
export class ValidateLegalEntityScComponent extends ValidatorScBaseComponent implements OnInit {
  legalEntityDetailsValidatorForm: FormGroup;
  addedOwners: Owner[] = [];
  currentOwners: Owner[] = [];
  governmetLegalEntity = LegalEntityEnum.GOVERNMENT;
  semiGovernmetLegalEntity = LegalEntityEnum.SEMI_GOV;
  isFieldOfficeTransaction = false;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_LEGAL_ENTITY;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_LEGAL_ENTITY;
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseView(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing legalEntity details and comments
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.legalEntityDetailsValidatorForm = this.createForm();
    this.legalEntityDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getModifiedEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);
    this.getComments(this.estRouterData);
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.isFieldOfficeTransaction = this.estRouterData.channel === Channel.FIELD_OFFICE;
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }
  /**
   * // method to get the establishment details to validate
   * @param referenceNumber
   */
  getModifiedEstablishmentDetails(regNo: number, referenceNumber: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(regNo, referenceNumber)
      .pipe(
        tap(res => (this.establishmentToValidate = res)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.isGcc = isGccEstablishment(this.establishmentToValidate);
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.establishmentToValidate.registrationNo,
            referenceNumber
          );
          this.getEstablishmentValidatingOwnerDetails(this.establishmentToValidate.registrationNo, referenceNumber)
            .pipe(tap(this.getAllOwners))
            .subscribe();
          this.getEstablishmentDetails(this.establishmentToValidate.registrationNo);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }

  @Autobind
  getAllOwners(ownerResponse: [Owner[], Owner[]]) {
    const [currentOwners, owners] = ownerResponse;
    this.addedOwners = owners.length > 0 ? owners.filter(owner => owner.recordAction === ActionTypeEnum.ADD) : [];

    const removedOwners = owners.length > 0 ? owners.filter(owner => owner.recordAction === ActionTypeEnum.REMOVE) : [];
    this.currentOwners = currentOwners.map(owner => {
      if (this.establishmentToValidate.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
        owner.startDate = { ...this.establishmentToValidate.startDate };
      }

      /* to get the record action of owners who removed from curent owners list */
      return removedOwners.some(removedOwner => removedOwner.ownerId === owner.ownerId)
        ? removedOwners.find(removedOwner => removedOwner.ownerId === owner.ownerId)
        : owner;
    });
  }

  /**
   * Get the owner name in arabic
   * @param index
   */
  getOwnerName(index: number) {
    let ownerName = null;
    if (this.addedOwners[index] && this.addedOwners[index].person.name.arabic.firstName) {
      ownerName = getArabicName(this.addedOwners[index].person.name.arabic);
    }

    return ownerName;
  }

  navigateToEditLegalEntity(tabIndex: number) {
    this.estRouterData.tabIndicator = tabIndex;
    this.changeEstablishmentService.navigateToEditLegalEntity();
  }
}
