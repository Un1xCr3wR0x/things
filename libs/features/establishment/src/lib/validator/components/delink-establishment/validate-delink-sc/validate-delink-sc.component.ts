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
  LookupService,
  Role,
  RouterConstants,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Admin,
  BranchList,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  Establishment,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  getBranchRequest
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-delink-sc',
  templateUrl: './validate-delink-sc.component.html',
  styleUrls: ['./validate-delink-sc.component.scss']
})
export class ValidateDelinkScComponent extends ValidatorScBaseComponent implements OnInit {
  /**
   * Local Variables
   */
  delinkEstForm: FormGroup;
  transactionNumber: number;
  regNo: number;
  pageSize = 5;
  parentGroupBranches: BranchList[];
  parentGroupPageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  parentGroupBranchCount = 0;
  parentGroupMainRegistrationNo: number;
  newGroupBranches: BranchList[];
  newGroupPageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  newGroupBranchCount = 0;
  newGroupMainRegistrationNo: number;
  pageIndex = 0;
  paginationId = 'parentGrpBranches'; // Pagination id
  delinkedBranches: BranchList[];
  isNewGroup: boolean;
  isLinkToOtherEst: boolean;
  admin: Admin;

  /**
   * @param lookupService
   * @param workflowService
   * @param establishmentService
   * @param fb
   * @param documentService
   * @param modalService
   * @param changeEstablishmentService
   * @param alertService
   * @param estRouterData
   */
  constructor(
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
  }

  ngOnInit(): void {
    if (this.estRouterData.referenceNo) {
      this.initialiseView(this.estRouterData.referenceNo);
    } else {
      this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
    }
  }

  /**
   *  Method to initialise the view for delink
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.parentGroupMainRegistrationNo = Number(this.estRouterData.registrationNo);
    this.isNewGroup = this.estRouterData.resourceType === RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT;
    this.isLinkToOtherEst = this.estRouterData.resourceType === RouterConstants.TRANSACTION_LINK_ESTABLISHMENT;
    this.canReturn = this.estRouterData.assignedRole === Role.VALIDATOR_2;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.delinkEstForm = this.createForm();
    this.delinkEstForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    if (this.isNewGroup) {
      this.documentTransactionKey = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
      this.documentTransactionType = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
      this.getAdminDetails(+this.estRouterData.registrationNo, this.estRouterData.referenceNo);
    }
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getDocumentDetails(
      this.documentTransactionKey,
      this.documentTransactionType,
      +this.estRouterData.registrationNo,
      this.estRouterData.referenceNo
    );
    this.getEstablishmentDetails(+this.estRouterData.registrationNo);
    this.getParentGroupBranches();
    this.getValidatingEstablishmentDetails(
      this.estRouterData.registrationNo,
      referenceNumber,
      false,
      this.getNewGroupBranches
    );
    this.getComments(this.estRouterData);
  }

  onEditDelinkGroup() {
    if (this.isNewGroup) {
      this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_MODIFY_DELINK_NEW]);
    } else {
      this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_MODIFY_DELINK]);
    }
  }

  /**
   * Method to get admin details
   */
  getAdminDetails(registrationNo: number, referenceNo: number) {
    this.establishmentService
      .getAdminsOfEstablishment(registrationNo, referenceNo)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admin = res[0];
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  /**
   * To fetch the parent group details
   * @param registrationNo
   */
  getParentGroupBranches() {
    this.parentGroupSelectedPage(1);
  }

  /**
   *
   * @param establishment
   */
  @Autobind
  getNewGroupBranches(establishment: Establishment) {
    this.newGroupMainRegistrationNo = establishment.mainEstablishmentRegNo;
    this.newGroupSelectedPage(1);
  }

  /**
   * method to fetch the parent group data based on page selection
   */
  parentGroupSelectedPage(pageIndex: number) {
    this.establishmentService
      .getBranchEstablishmentsWithStatus(
        this.parentGroupMainRegistrationNo,
        getBranchRequest(this.pageSize, pageIndex - 1, [], false),
        [{ queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER, queryValue: this.transactionNumber }]
      )
      .subscribe(res => {
        this.parentGroupBranches = res.branchList;
        this.parentGroupBranchCount = res?.branchStatus?.totalBranches;
        this.parentGroupPageDetails.currentPage = pageIndex;
      });
  }

  /**
   * method to fetch the new group data based on page selection
   */
  newGroupSelectedPage(pageIndex: number) {
    this.establishmentService
      .getBranchEstablishmentsWithStatus(
        this.parentGroupMainRegistrationNo,
        getBranchRequest(this.pageSize, pageIndex - 1, [], false),
        [
          { queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER, queryValue: this.transactionNumber },
          { queryKey: EstablishmentQueryKeysEnum.NEW_MAIN_REG_NO, queryValue: this.newGroupMainRegistrationNo },
          { queryKey: EstablishmentQueryKeysEnum.IS_DELINK, queryValue: this.isNewGroup }
        ]
      )
      .subscribe(res => {
        if (this.isNewGroup) {
          res.branchList.map(branch => (branch.establishmentType.english = EstablishmentTypeEnum.BRANCH));
        }
        this.newGroupBranches = res.branchList;
        this.newGroupBranchCount = res?.branchStatus?.totalBranches;
        this.newGroupPageDetails.currentPage = pageIndex;
      });
  }
}
