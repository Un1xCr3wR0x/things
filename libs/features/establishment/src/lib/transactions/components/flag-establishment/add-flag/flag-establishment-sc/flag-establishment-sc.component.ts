import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  FlagDetails,
  FlagEstablishmentService,
  FlagQueryParam
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-flag-establishment-sc',
  templateUrl: './flag-establishment-sc.component.html',
  styleUrls: ['./flag-establishment-sc.component.scss']
})
export class FlagEstablishmentScComponent extends TransactionsBaseScComponent implements OnInit {
  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly flagService: FlagEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
    this.tnxId = EstablishmentTransEnum.ADD_FLAG_TRANSACTION;
  }

  @Input() flagDetails: FlagDetails;

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getFlagDetails();
      this.getFlagDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getFlagDetails() {
    const flagQuery = new FlagQueryParam();
    flagQuery.transactionTraceId = this.referenceNo;
    this.flagService.getFlagDetails(this.estRegNo, flagQuery).subscribe(
      response => {
        this.flagDetails = response[0];
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }
  getFlagDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
