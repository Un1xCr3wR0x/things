import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  Admin,
  AdminRoleEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentKeyEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-replace-admins-sc',
  templateUrl: './replace-admins-sc.component.html',
  styleUrls: ['./replace-admins-sc.component.scss']
})
export class ReplaceAdminsScComponent extends TransactionsBaseScComponent implements OnInit {
  admins: Admin[] = [];
  currentAdmin: Admin;
  newAdmin: Admin;
  transactionHeading = EstablishmentKeyEnum.REPLACE_SUPER_ADMIN;
  currentAdminHeading = '';
  newAdminHeading = '';
  SuperReplaceTnxId: number;
  GccReplacetnxId: number;

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
    this.SuperReplaceTnxId = EstablishmentTransEnum.REPLACE_SUPER_ADMIN_TRANSACTION;
    this.GccReplacetnxId = EstablishmentTransEnum.REPLACE_GCC_ADMIN_TRANSACTION;
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
          if (this.currentAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN) {
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_GCC_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_GCC_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_GCC_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
          } else {
            if (this.channel === EstablishmentQueryKeysEnum.FIELD_OFFICE) {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_FO_TYPE;
            } else {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            }
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_SUPER_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_SUPER_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_SUPER_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_KEY;
          }
          this.getUploadedDocuments(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.estRegNo,
            this.referenceNo
          );
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
          if (this.currentAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN) {
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_GCC_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_GCC_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_GCC_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
          } else {
            if (this.channel === EstablishmentQueryKeysEnum.FIELD_OFFICE) {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_FO_TYPE;
            } else {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            }
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_SUPER_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_SUPER_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_SUPER_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_KEY;
          }
          this.getUploadedDocuments(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.estRegNo,
            this.referenceNo
          );
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
}
