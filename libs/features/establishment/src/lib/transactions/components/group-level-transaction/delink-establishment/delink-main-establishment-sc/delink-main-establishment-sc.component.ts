import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  TransactionService
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  Admin,
  AdminWrapper,
  BranchList,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  EstablishmentTypeEnum,
  QueryParam,
  getBranchRequest
} from '@gosi-ui/features/establishment/lib/shared';
import { Observable, forkJoin, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-delink-main-establishment-sc',
  templateUrl: './delink-main-establishment-sc.component.html',
  styleUrls: ['./delink-main-establishment-sc.component.scss']
})
export class DelinkMainEstablishmentScComponent extends TransactionsBaseScComponent implements OnInit {
  establishment = new Establishment();
  parentGroupPageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  newGroupPageDetails = {
    currentPage: 1,
    goToPage: 1
  };

  newGroupBranchCount = 0;
  newGroupMainRegistrationNo: number;
  pageSize = 5;
  parentGroupBranches: BranchList[];
  parentGroupBranchCount = 0;
  isNewGroup: boolean;
  newGroupBranches: BranchList[];
  paginationId = 'parentGrpBranches'; // Pagination id
  admin: Admin;
  delinkTnxId: number;
  linkTnxId: number;

  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.delinkTnxId = EstablishmentTransEnum.DELINK_TRANSACTION;
    this.linkTnxId = EstablishmentTransEnum.LINK_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.transaction.transactionId === EstablishmentTransEnum.DELINK_TRANSACTION) {
      this.documentTransactionKey = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
      this.documentTransactionType = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
    } else {
      this.documentTransactionKey = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
      this.documentTransactionType = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
    }
    this.isNewGroup =
      this.transaction.transactionId === EstablishmentTransEnum.DELINK_TRANSACTION ||
      this.transaction.transactionId === EstablishmentTransEnum.LINK_TRANSACTION;
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getDelinkDetails();
      this.getDelinkEstDocs();
      this.getParentGroupBranches();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getDelinkEstDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }

  getDelinkDetails() {
    if (!this.isTransactionCompleted) {
      this.getDelinkFromTransient();
    } else {
      this.getDelinkForCompletedData();
    }
  }

  getDelinkForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndNewDelinkDetails))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getDelinkFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndNewDelinkDetails))
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
  getCurrentAndNewDelinkDetails(estDelink: [Establishment, Establishment]) {
    const [estOldData, estNewData] = estDelink;
    this.establishment = estOldData;
    this.establishmentToValidate = estNewData;
    if (this.isNewGroup) {
      this.getAdminData();
      this.getAdminDetails(this.establishment);
      this.getNewGroupBranches(this.establishmentToValidate);
    } else {
      this.getNewGroupBranches(this.establishmentToValidate);
    }
  }

  getNewGroupBranches(establishment: Establishment) {
    this.newGroupMainRegistrationNo = establishment.mainEstablishmentRegNo;
    this.newGroupSelectedPage(1);
  }

  /**
   * method to fetch the parent group data based on page selection
   */
  parentGroupSelectedPage(pageIndex: number) {
    this.establishmentService
      .getBranchEstablishmentsWithStatus(this.estRegNo, getBranchRequest(this.pageSize, pageIndex - 1, [], false), [
        { queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER, queryValue: this.referenceNo }
      ])
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
      .getBranchEstablishmentsWithStatus(this.estRegNo, getBranchRequest(this.pageSize, pageIndex - 1, [], false), [
        { queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER, queryValue: this.referenceNo },
        { queryKey: EstablishmentQueryKeysEnum.NEW_MAIN_REG_NO, queryValue: this.newGroupMainRegistrationNo },
        { queryKey: EstablishmentQueryKeysEnum.IS_DELINK, queryValue: this.isNewGroup }
      ])
      .subscribe(res => {
        if (this.isNewGroup) {
          res.branchList.map(branch => (branch.establishmentType.english = EstablishmentTypeEnum.BRANCH));
        }
        this.newGroupBranches = res.branchList;
        this.newGroupBranchCount = res?.branchStatus?.totalBranches;
        this.newGroupPageDetails.currentPage = pageIndex;
      });
  }
  getAdminData() {
    if (!this.isTransactionCompleted) {
      this.getAdminFromTransient();
    } else {
      this.getAdminForCompletedData();
    }
  }

  getAdminForCompletedData() {
    this.getEstablishmentAdminDetailsForComplete(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedAdmin))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getAdminFromTransient() {
    this.getEstablishmentAdminDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedAdmin))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getEstablishmentAdminDetails(regNo, refNo): Observable<[AdminWrapper, AdminWrapper]> {
    return this.establishmentService.getAdminsOfEstablishment(regNo).pipe(
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      }),
      switchMap(res => {
        let queryParams: QueryParam[] = [];
        queryParams.push({
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: refNo
        });
        return forkJoin([of(res), this.establishmentService.getAdminsOfEstablishment(regNo, refNo)]);
      })
    );
  }
  getEstablishmentAdminDetailsForComplete(regNo, refNo): Observable<[AdminWrapper, AdminWrapper]> {
    return this.establishmentService.getAdminsOfEstablishment(regNo, refNo, EstablishmentQueryKeysEnum.OLD_VALUE).pipe(
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      }),
      switchMap(res => {
        let queryParams: QueryParam[] = [];
        queryParams.push({
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: refNo
        });
        return forkJoin([
          of(res),
          this.establishmentService.getAdminsOfEstablishment(regNo, refNo, EstablishmentQueryKeysEnum.NEW_VALUE)
        ]);
      })
    );
  }

  @Autobind
  getCurrentAndModifiedAdmin(adminResponse: [AdminWrapper, AdminWrapper]) {
    const [currentAdmin, admin] = adminResponse;
    this.oldAdmin = currentAdmin?.admins[0];
    this.newAdmin = admin?.admins[0];
  }
}
