import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  CommonIdentity,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  statusBadgeType,
  TransactionService
} from '@gosi-ui/core';
import {
  ChangeViolationContributors,
  ChangeViolationValidator,
  TransactionsBaseScComponent,
  ViolationsValidatorService
} from '@gosi-ui/features/violations/lib/shared';
import { DocumentTransactionType, ViolationStatusEnum, ViolationTypeEnum } from '../../../../shared/enums';

@Component({
  selector: 'vol-modify-violation-sc',
  templateUrl: './modify-violation-sc.component.html',
  styleUrls: ['./modify-violation-sc.component.scss']
})
export class ModifyViolationScComponent extends TransactionsBaseScComponent implements OnInit {
  violationDetail: ChangeViolationValidator = new ChangeViolationValidator();
  itemPerPage = 7;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'member-board-list';
  noOfRecords = 0;
  currentPage = 1;
  isOtherViolation:Boolean=false;

  @Input() violationConDetails: ChangeViolationValidator = new ChangeViolationValidator();

  constructor(
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      transactionService,
      alertService,
      documentService,
      routerDataToken,
      router,
      validatorService,
      location,
      appToken
    );

    this.documentTransactionKey = DocumentTransactionType.MODIFY_VIOLATION_TYPE;
    this.documentTransactionType = DocumentTransactionType.MODIFY_VIOLATION_TYPE;
  }

  ngOnInit(): void {
    super.getTransactionData();
    if (this.estRegNo && this.violationId) {
      this.transactionDetailsFetch();
      this.getViolationDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  transactionDetailsFetch() {
    this.validatorService.getValidatorViewDetails(this.violationId, this.transactionId).subscribe(res => {
      this.violationDetail = res;
      this.violationDetail?.contributors.forEach(item => {
        if (item.currentPenaltyAmount !== item.newPenaltyAmount) {
          item.modified = true;
        } else {
          item.modified = false;
        }
      });
      this.isOtherViolation= this.violationDetail?.violationType?.english.toUpperCase() === ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS ? true : false;
      this.noOfRecords = this.violationDetail?.contributors?.length;
    });
  }

  getViolationDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.violationId,
      this.transactionId
    );
  }

  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }

  /**
   * This method is used to style the status badge based on the received status
   */

  statusBadgeType(contributor: ChangeViolationContributors) {
    let status = '';
    if (contributor.isExcluded) {
      status = ViolationStatusEnum.EXCLUDED;
    } else if (contributor.modified) {
      status = ViolationStatusEnum.MODIFIED;
    }
    return statusBadgeType(status);
  }

  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  checkForSIN(identity: Array<CommonIdentity>) {
    const idTypeValue = ['NIN', 'IQAMA', 'GCCID'];
    let isSinCheck = false;
    if (identity.length > 0) {
      for (const item of identity) {
        isSinCheck = idTypeValue.includes(item.idType);
        if (isSinCheck === true) break;
      }
      if (isSinCheck) return 1;
      else return 0;
    } else return 0;
  }
}
