import { Component, Inject, OnInit } from '@angular/core';
import { ContributorCountDetails, TransferAllContributorDetails } from '../../../shared/models';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  TransactionService
} from '@gosi-ui/core';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ContributorService,
  ContributorWageParams,
  ContributorsWageService,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementService,
  EstablishmentService,
  TransferContributorService
} from '../../../shared';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { Router } from '@angular/router';
import { TransferableEngagements } from '../../../shared/models/transferableEngagements';


@Component({
  selector: 'cnt-multiple-transfer-mytrans-sc',
  templateUrl: './multiple-transfer-mytrans-sc.component.html',
  styleUrls: ['./multiple-transfer-mytrans-sc.component.scss']
})
export class MultipleTransferMytransScComponent extends TransactionBaseScComponent implements OnInit {
  /** Local variables */
  transferAllDetails: TransferAllContributorDetails;
  comments: TransactionReferenceData[] = [];
  requestId: number;
  isDescending = false;
  contributorList:TransferableEngagements[] = [];
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  constructor(readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly transferContributorService: TransferContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly contributorWageService: ContributorsWageService,
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string) {
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
    this.readTransactionDataFromToken(this.routerData);
    super.getTransactionDetails();
      if (this.registrationNo) this.getDataToDisplay();
  }


  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.requestId) this.requestId = payload.requestId;
      if (payload.comments)  this.comments = payload.comments;
    }
  }
  /** Method to get data to display on page load. */
  getDataToDisplay() {
    this.getTransferAllDetails();
    this.getContributorDetails();
  }

  /** Method to get transfer all details. */
  getTransferAllDetails(){
    this.transferContributorService
      .getTransferAllDetails(this.registrationNo, this.tRequestId)
      .subscribe(res => (this.transferAllDetails = res)
      );
  }

  getContributorDetails(){
    this.contributorWageService
    .getTransferMultipleContributorDetails(this.registrationNo, this.tRequestId,this.assembleContributorWageParams(this.pageDetails.currentPage,10), true)
    .subscribe(
        res => (
          this.contributorList = res.transferableEngagements)
    );
  }

      /** Method to assemble contributor wage params. */
      assembleContributorWageParams(
        pageNo?: number,
        pageSize?: number
      ): ContributorWageParams {
        return new ContributorWageParams(
          null,
          null,
          null,
          pageNo,
          pageSize,
        );
      }
  

  /** Method to reset page. */
  resetPage() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
  }

 
  paginateContributors(pageNumber: number): void {
    this.pageDetails.currentPage = pageNumber;
    this.getContributorDetails();
  }

}
