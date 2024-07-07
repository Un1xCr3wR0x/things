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
  selector: 'est-modify-admins-sc',
  templateUrl: './modify-admins-sc.component.html',
  styleUrls: ['./modify-admins-sc.component.scss']
})
export class ModifyAdminsScComponent extends TransactionsBaseScComponent implements OnInit {
  // adminNew: Admin[] = [];
  adminNew: Admin;
  adminOld: Admin;
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
    this.tnxId = EstablishmentTransEnum.MODIFY_ADMINS_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      //modify method call
      this.getModifyAdminDetailsOld();
      this.getModifyAdminDetailsNew();
      this.getModifyAdminDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getModifyAdminDetailsOld() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.OLD_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.adminOld = res[0];
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getModifyAdminDetailsNew() {
    this.establishmentService
      .getAdminsOfEstablishment(this.estRegNo, this.referenceNo, EstablishmentQueryKeysEnum.NEW_VALUE)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.adminNew = res[0];
        })
      )

      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.adminOld.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }

  getModifyAdminDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
