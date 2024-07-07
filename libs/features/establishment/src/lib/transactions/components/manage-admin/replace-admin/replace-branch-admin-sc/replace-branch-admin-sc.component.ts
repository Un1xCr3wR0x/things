import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  Admin,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';

import { noop } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';
@Component({
  selector: 'est-replace-branch-admin-sc',
  templateUrl: './replace-branch-admin-sc.component.html',
  styleUrls: ['./replace-branch-admin-sc.component.scss']
})
export class ReplaceBranchAdminScComponent extends TransactionsBaseScComponent implements OnInit {
  admins: Admin[] = [];
  currentAdmin: Admin;
  newAdmin: Admin;
  currentAdminHeading = '';
  newAdminHeading = '';
  itemPerPage = 6;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  paginationId = 'member-board-list';
  noOfRecords = 0;
  currentPage = 1;
  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.tnxId = EstablishmentTransEnum.REPLACE_BRANCH_ROLE_ADMIN_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getAdminData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getAdminData() {
    if (!this.isTransactionCompleted) {
      this.getReplaceAdminDetails();
    } else {
      this.getReplaceAdminTransientDetailsOld();
      this.getReplaceAdminTransientDetailsNew();
    }
  }
  getReplaceAdminDetails() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.currentAdmin = this.admins[0];
          this.newAdmin = this.admins[1];
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getReplaceAdminTransientDetailsOld() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.OLD_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.currentAdmin = this.admins[0];
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getReplaceAdminTransientDetailsNew() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.NEW_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.newAdmin = this.admins[0];
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.newAdmin.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }
}
