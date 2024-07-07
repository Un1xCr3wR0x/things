import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-register-establishment-transactions-sc',
  templateUrl: './register-establishment-transactions-sc.component.html',
  styleUrls: ['./register-establishment-transactions-sc.component.scss']
})
export class RegisterEstablishmentTransactionsScComponent extends TransactionsBaseScComponent implements OnInit {
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
    this.tnxId = EstablishmentTransEnum.REGISTER_ESTABLISHMENT_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.intialiseView(this.estRegNo);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
}
