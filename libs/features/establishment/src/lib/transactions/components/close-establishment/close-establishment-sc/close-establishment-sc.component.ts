import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  StorageService,
  TransactionService,
  TransactionStatus
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  TerminateEstablishmentService,
  TerminatePaymentMethodEnum,
  TerminateResponse
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-close-establishment-sc',
  templateUrl: './close-establishment-sc.component.html',
  styleUrls: ['./close-establishment-sc.component.scss']
})
export class CloseEstablishmentScComponent extends TransactionsBaseScComponent implements OnInit {
  estToValidate: Establishment = new Establishment();
  closeEstDetails: TerminateResponse;

  isIbanAccountNo: boolean;
  isBankName: boolean;
  bankPaymentMethod = TerminatePaymentMethodEnum.BANK;

  constructor(
    readonly transactionService: TransactionService,
    readonly documentService: DocumentService,
    readonly addEstService: AddEstablishmentService,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly location: Location,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly storageService: StorageService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService,
    readonly terminateService: TerminateEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.tnxId = EstablishmentTransEnum.CLOSE_ESTABLISHMENT_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.documentTransactionKey = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
      this.documentTransactionType = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
      this.getEstablishmentDetails(this.estRegNo);
      this.getCloseEstData();
      this.getCloseEstDocs();
      this.getClosureData(this.estRegNo);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  //modified close est
  getCloseEstData() {
    if (!this.isTransactionCompleted) {
      this.getCloseEstFromTransient();
    } else {
      this.getCloseEstForCompletedData();
    }
  }
  getCloseEstForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo, true)
      .pipe(tap(this.getCurrentAndModifiedCloseEstData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getCloseEstFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo, true)
      .pipe(tap(this.getCurrentAndModifiedCloseEstData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  @Autobind
  getCurrentAndModifiedCloseEstData(CloseEstData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = CloseEstData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (
      this.establishment?.establishmentAccount?.bankAccount?.ibanAccountNo !==
      this.estToValidate.establishmentAccount?.bankAccount?.ibanAccountNo
    ) {
      this.isIbanAccountNo = true;
    }
    if (
      this.establishment?.establishmentAccount?.bankAccount?.bankName !==
      this.estToValidate.establishmentAccount?.bankAccount?.bankName
    ) {
      this.isBankName = true;
    }
  }
  getCloseEstDocs() {
    this.changeGroupEstablishmentService
      .getDocuments(this.documentTransactionKey, this.documentTransactionType, this.estRegNo, this.referenceNo)
      .subscribe(
        res => (
          (this.documentList = res.filter(item => item?.documentContent != null)),
          err => {
            this.alertService.showError(err?.error?.message);
          }
        )
      );
  }
  /**
   * method to fetch the closues details of the establishment
   * @param registrationNo
   */
  getClosureData(registrationNo) {
    if (this.transaction.status.english !== TransactionStatus.TRANSACTION_COMPLETED) {
      this.terminateService
      .terminateEstablishment(registrationNo, null, [
        {
          queryKey: EstablishmentQueryKeysEnum.MODE,
          queryValue: EstablishmentQueryKeysEnum.DRAFT_MODE
        }
      ])
      .subscribe(
        res => {
          this.closeEstDetails = res;
          // this.hasDebit = res?.debit;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
    }
  }

  /**
   * method to navigate to bill dashborad
   */
  naviagteBillDashboard() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      const url = '#' + EstablishmentConstants.COLLECTION_DASHBOARD_ROUTE(this.estRegNo);
      window.open(url, '_blank');
    } else {
      this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, this.estRegNo);
      const url = '#' + EstablishmentRoutesEnum.BILL_DASHBOARD_ROUTE;
      window.open(url, '_blank');
    }
  }
}
