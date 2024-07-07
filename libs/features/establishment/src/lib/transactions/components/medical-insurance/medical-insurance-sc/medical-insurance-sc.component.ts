import { Component, OnInit } from '@angular/core';
import {
  TransactionsBaseScComponent
} from "@gosi-ui/features/establishment/lib/transactions/base/transactions-base-sc.component";
import {AddEstablishmentService, EstablishmentService, EstablishmentTransEnum} from "@gosi-ui/features/establishment";
import {AlertService, DocumentService, RouterConstants, TransactionService} from "@gosi-ui/core";
import {Router} from "@angular/router";

@Component({
  selector: 'est-medical-insurance-sc',
  templateUrl: './medical-insurance-sc.component.html',
  styleUrls: ['./medical-insurance-sc.component.scss']
})
export class MedicalInsuranceScComponent extends TransactionsBaseScComponent implements OnInit {

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly addEstService: AddEstablishmentService,
    readonly documentService: DocumentService,
    readonly router: Router
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
  }

  ngOnInit(): void {
    this.tnxId = EstablishmentTransEnum.MEDICAL_INSURANCE_ESTABLISHMENT_ENROLLMENT;
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

}
