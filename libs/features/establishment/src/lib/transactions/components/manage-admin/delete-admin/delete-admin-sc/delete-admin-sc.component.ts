import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, BilingualText, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
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
  selector: 'est-delete-admin-sc',
  templateUrl: './delete-admin-sc.component.html',
  styleUrls: ['./delete-admin-sc.component.scss']
})
export class DeleteAdminScComponent extends TransactionsBaseScComponent implements OnInit {
  name: '';
  admins: Admin[] = [];
  oldAdmin: Admin;
  oldAdminHeading = '';
  admin: Admin;
  branchAdmin: boolean;
  roleAdmins: Array<BilingualText> = [];
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
    this.tnxId = EstablishmentTransEnum.DELETE_ADMINS_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getAddAdminTransientDetails();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getAddAdminTransientDetails() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.OLD_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.oldAdmin = this.admins[0];
          this.oldAdmin.roles.forEach(value => this.roleAdmins.push(value));
          this.noOfRecords = this.admins?.length;
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.oldAdmin.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }

  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }
}
