import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  RequestCertificateService
} from '@gosi-ui/features/establishment/lib/shared';
import { CertificateTrackingResponse } from '@gosi-ui/features/establishment/lib/shared/models/certificate-tracking';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-generate-certificate-sc',
  templateUrl: './generate-certificate-sc.component.html',
  styleUrls: ['./generate-certificate-sc.component.scss']
})
export class GenerateCertificateScComponent extends TransactionsBaseScComponent implements OnInit {
  certificateDetails: CertificateTrackingResponse;
  zakatTnxId: number;
  goodTnxId: number;
  ohTnxId: number;

  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly certificateService: RequestCertificateService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
  }

  ngOnInit(): void {
    this.getTransactionData();
    this.zakatTnxId = EstablishmentTransEnum.ZAKAT_CERTIFICATE;
    this.goodTnxId = EstablishmentTransEnum.GOOD_PAYMENT_CERTIFCATE;
    this.ohTnxId = EstablishmentTransEnum.OH_CERTIFICATE;
    if (this.estRegNo) {
      this.getCertificateDetails();
      this.getCertificateDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  // Method to get the certificate details

  getCertificateDetails() {
    this.certificateService.getCertificateDetail(this.estRegNo, this.certificateId).subscribe(
      response => {
        this.certificateDetails = response;
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  // Method to get the certificate uploaded to generate

  getCertificateDocs() {
    const docType =
      this.transaction.transactionId === EstablishmentTransEnum.GOOD_PAYMENT_CERTIFCATE
        ? DocumentTransactionTypeEnum.GOSI_CERTIFICATE
        : DocumentTransactionTypeEnum.ZAKAT_CERTIFICATE;
    this.getUploadedDocuments(docType, docType, this.estRegNo, this.referenceNo);
  }
}
