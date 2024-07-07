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
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  getArabicName,
  LookupService,
  Person,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentOwnersWrapper,
  EstablishmentService,
  Owner
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-owner-sc',
  templateUrl: './validate-owner-sc.component.html',
  styleUrls: ['./validate-owner-sc.component.scss']
})
export class ValidateOwnerScComponent extends ValidatorScBaseComponent implements OnInit {
  canEdit: boolean;
  ownerDetailsValidatorForm: FormGroup;
  canReturn = false;
  isReturn: boolean;
  transactionNumber = null;
  isReturnToAdmin = false;
  owners: EstablishmentOwnersWrapper = new EstablishmentOwnersWrapper();
  ownersToValidate: Person[] = [];
  OwnerDetailsValidatorForm: FormGroup;
  currentOwnerList: Owner[];
  newOwners: Owner[] = [];
  currentOwners: Owner[] = [];
  modifiedOwners: Owner[] = [];
  showModifiedLegend = false;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_OWNER;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_OWNER;
  }

  ngOnInit() {
    this.newOwners = [];
    this.currentOwners = [];
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseView(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing Owner details and comments
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.OwnerDetailsValidatorForm = this.createForm();
    this.OwnerDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getDocumentDetails(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRouterData.registrationNo,
      this.estRouterData.referenceNo
    );
    this.getEstablishmentValidatingOwnerDetails(this.estRouterData.registrationNo, referenceNumber)
      .pipe(tap(this.getCurrentAndModifiedOwners))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
    this.getEstablishmentDetails(this.estRouterData.registrationNo);
    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }

  @Autobind
  getCurrentAndModifiedOwners(ownerResponse: [Owner[], Owner[]]) {
    const [currentOwners, owners] = ownerResponse;
    this.currentOwnerList = currentOwners;
    this.newOwners = owners.length > 0 ? owners.filter(owner => owner.recordAction === ActionTypeEnum.ADD) : [];

    this.modifiedOwners =
      owners.length > 0
        ? owners.filter(
            owner => owner.recordAction === ActionTypeEnum.REMOVE || owner.recordAction === ActionTypeEnum.MODIFY
          )
        : [];
    if (this.modifiedOwners?.filter(owner => owner.recordAction === ActionTypeEnum.MODIFY)?.length > 0) {
      this.showModifiedLegend = true;
    }
    this.currentOwners = currentOwners.map(owner => {
      /* to get the record action of owners who removed or modified from curent owners list */
      return this.modifiedOwners.some(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        ? this.modifiedOwners.find(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        : owner;
    });
  }
  /**
   * Get the owner name in arabic
   * @param index
   */
  getOwnerName(index: number) {
    let ownerName = null;
    if (this.newOwners[index] && this.newOwners[index].person.name.arabic.firstName) {
      ownerName = getArabicName(this.newOwners[index].person.name.arabic);
    }

    return ownerName;
  }

  navigateToEditOwnerDetails(tabIndex: number) {
    this.estRouterData.tabIndicator = tabIndex;
    this.changeEstablishmentService.navigateToEditOwnerDetails();
  }
}
