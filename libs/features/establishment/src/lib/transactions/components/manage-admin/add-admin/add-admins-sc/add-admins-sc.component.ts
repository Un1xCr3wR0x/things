import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, BilingualText, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import { AddEstablishmentService, EstablishmentService } from '@gosi-ui/features/establishment';
import {
  Admin,
  AdminRoleEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentKeyEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-add-admins-sc',
  templateUrl: './add-admins-sc.component.html',
  styleUrls: ['./add-admins-sc.component.scss']
})
export class AddAdminsScComponent extends TransactionsBaseScComponent implements OnInit {
  name: '';
  admins: Admin[] = [];
  newAdmin: Admin;
  newAdminHeading = '';
  admin: Admin;
  branchAdmin: boolean;
  roleAdmins: Array<BilingualText> = [];
  SuperAddTnxId: number;
  GccAddTnxId: number;
  OtherAddTnxId: number;

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
    this.SuperAddTnxId = EstablishmentTransEnum.SUPER_ADMIN_ADD_TRANSACTION;
    this.GccAddTnxId = EstablishmentTransEnum.GCC_ADMIN_ADD_TRANSACTION;
    this.OtherAddTnxId = EstablishmentTransEnum.OTHER_ADMINS_ADD_TRANSACTION;
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
      this.getNotAddAdminDetails();
    } else {
      this.getAddAdminTransientDetails();
    }
  }

  getAddAdminTransientDetails() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.NEW_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.newAdmin = this.admins[0];
          this.newAdmin.roles.forEach(value => this.roleAdmins.push(value));
          if (this.newAdmin.roles[0].english === AdminRoleEnum.SUPER_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_SUPER_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
          }
          if (this.newAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_GCC_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
          }
          if (
            this.newAdmin.roles[0].english === AdminRoleEnum.REG_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.OH_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.CNT_ADMIN
          ) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_ROLE_ADMIN;
          }
          if (this.newAdmin.roles[0].english === AdminRoleEnum.BRANCH_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.ADD_BRANCH_ADMIN;
            this.branchAdmin = true;
          }
          if (
            this.newAdmin.roles[0].english === AdminRoleEnum.SUPER_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN
          ) {
            this.getUploadedDocuments(
              this.documentTransactionKey,
              this.documentTransactionType,
              this.estRegNo,
              this.referenceNo
            );
          }
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getNotAddAdminDetails() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.newAdmin = this.admins[0];
          if (this.newAdmin.roles[0].english === AdminRoleEnum.SUPER_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_SUPER_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
          }
          if (this.newAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_GCC_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
          }
          if (
            this.newAdmin.roles[0].english === AdminRoleEnum.REG_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.OH_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.CNT_ADMIN
          ) {
            this.newAdminHeading = EstablishmentKeyEnum.NEW_ROLE_ADMIN;
          }
          if (this.newAdmin.roles[0].english === AdminRoleEnum.BRANCH_ADMIN) {
            this.newAdminHeading = EstablishmentKeyEnum.ADD_BRANCH_ADMIN;
          }
          if (
            this.newAdmin.roles[0].english === AdminRoleEnum.SUPER_ADMIN ||
            this.newAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN
          ) {
            this.getUploadedDocuments(
              this.documentTransactionKey,
              this.documentTransactionType,
              this.estRegNo,
              this.referenceNo
            );
          }
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
