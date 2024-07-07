import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  UpdatedWageListResponse,
  EngagementDetails,
  ValidateWageUpdateService,
  EngagementService,
  EstablishmentService,
  ContributorService,
  DocumentTransactionId
} from '../../../shared';
import {
  BilingualText,
  RouterDataToken,
  RouterData,
  AlertService,
  TransactionService,
  DocumentService,
  LookupService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { Router } from '@angular/router';
import { TransactionBaseScComponent } from '../shared';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, noop } from 'rxjs';

@Component({
  selector: 'cnt-add-bank-sc',
  templateUrl: './add-bank-sc.component.html',
  styleUrls: ['./add-bank-sc.component.scss']
})
export class AddBankScComponent extends TransactionBaseScComponent implements OnInit, OnDestroy {
  updatedWageListResponse: UpdatedWageListResponse;
  engagement: EngagementDetails;
  errorMessage: BilingualText = new BilingualText();
  individualApp: boolean;
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly router: Router,
    public changePersonService: ChangePersonService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.getTransactionDetails();
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.individualApp = true;
    }
    //this.getDataForView();
    !this.individualApp ? this.getScannedDocument(this.transaction.transactionRefNo) : null;
    // this.fetchEngagementDataForView
  }

  // getDataForView() {
  //   super
  //     .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
  //     .pipe(
  //       switchMap(() => {
  //         return super.getDocuments(
  //           DocumentTransactionId.MANAGE_WAGE,
  //           DocumentTransactionType.MANAGE_WAGE,
  //           this.engagementId,
  //           this.routerDataToken.transactionId
  //         );
  //       }),
  //       catchError(err => {
  //         super.handleError(err, true);
  //         return throwError(err);
  //       })
  //     )
  //     .subscribe(noop, noop);
  // }

  /** get scanned documents */
  getScannedDocument(referenceNo) {
    this.documentService.getAllDocuments(null, referenceNo).subscribe(
      res => {
        this.documents = res;
      },
      err => {
        //this.showErrorMessage(err);
      }
    );
  }
}
