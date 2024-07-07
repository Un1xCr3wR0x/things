import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-manage-owner-change-sc',
  templateUrl: './manage-owner-change-sc.component.html',
  styleUrls: ['./manage-owner-change-sc.component.scss']
})
export class ManageOwnerChangeScComponent extends TransactionsBaseScComponent implements OnInit {
  isUpperArrowOpen: boolean = false;
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_OWNER;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_OWNER;
    this.tnxId = EstablishmentTransEnum.OWNER_UPDATE_TRANSACTION;
  }
  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getOwnerData();
      this.getManageOwnerDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getManageOwnerDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
  isUpperArrow() {
    this.isUpperArrowOpen = !this.isUpperArrowOpen;
  }
}
