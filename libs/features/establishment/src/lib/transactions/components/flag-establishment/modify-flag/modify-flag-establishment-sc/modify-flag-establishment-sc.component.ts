import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'est-modify-flag-establishment-sc',
  templateUrl: './modify-flag-establishment-sc.component.html',
  styleUrls: ['./modify-flag-establishment-sc.component.scss']
})
export class ModifyFlagEstablishmentScComponent extends TransactionsBaseScComponent implements OnInit {
  currentflagDetails: FlagDetails;
  flagDetails: FlagDetails;
  flagId: number;
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_FLAG_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
    this.tnxId = EstablishmentTransEnum.MODIFY_FLAG_TRANSACTION;
  }

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
    flagQuery.isFlagTracking = true;
    flagQuery.getTransient = true;
    this.flagService.getFlagDetails(this.estRegNo, flagQuery).subscribe(
      response => {
        this.flagDetails = response[0];
        this.checkForFlagDetails(response[0].flagId);
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  checkForFlagDetails(flagId: number) {
    const query = new FlagQueryParam();
    query.flagId = flagId;
    this.flagService.getFlagDetails(this.estRegNo, query).subscribe(
      res => {
        this.currentflagDetails = res[0];
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
