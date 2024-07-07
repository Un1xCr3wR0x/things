import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, Establishment, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-add-relationship-manager-sc',
  templateUrl: './add-relationship-manager-sc.component.html',
  styleUrls: ['./add-relationship-manager-sc.component.scss']
})
export class AddRelationshipManagerScComponent extends TransactionsBaseScComponent implements OnInit {
  establishment: Establishment;
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
    this.tnxId = EstablishmentTransEnum.ADD_RELATIONSHIP_MANAGER;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getRelationshipManagerData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getRelationshipManagerData() {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(this.estRegNo, this.referenceNo, null, EstablishmentQueryKeysEnum.NEW_VALUE)
      .subscribe(res => {
        this.establishment = res;
      });
  }
}
