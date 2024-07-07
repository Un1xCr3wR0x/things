import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterDataToken,
  RouterData,
  Channel,
  AlertService,
  ChannelConstants
} from '@gosi-ui/core';
import { throwError, noop, Observable } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import {
  DocumentTransactionId,
  VicEngagementDetails,
  PurposeOfRegsitrationEnum,
  DocumentTransactionType,
  Contributor
} from '../../../shared';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-transactions-add-vic-sc',
  templateUrl: './transactions-add-vic-sc.component.html',
  styleUrls: ['./transactions-add-vic-sc.component.scss']
})
export class TransactionsAddVicScComponent extends TransactionBaseScComponent implements OnInit {
  vicEngagementDetails: VicEngagementDetails;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router
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
    super.getTransactionDetails();
    if (this.socialInsuranceNo && this.engagementId) this.initializeValidatorPage();
  }
  /** Method to initialize the validator view. */
  initializeValidatorPage(): void {
    this.getVicContributorDetails()
      .pipe(
        switchMap(() => {
          return this.getRegisterVicDetails();
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.REGISTER_VIC_CONTRIBUTOR,
            this.checkDocumentTransactionType(this.vicEngagementDetails.purposeOfRegistration.english),
            this.engagementId,
            this.referenceNo
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get vic contributor details. */
  getVicContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(this.socialInsuranceNo, new Map().set('checkBeneficiaryStatus', true))
      .pipe(tap(res => ((this.contributor = res), (this.isBeneficiary = this.contributor.isBeneficiary))));
  }

  /** Method to get register vic details. */
  getRegisterVicDetails(): Observable<VicEngagementDetails> {
    return this.addVicService
      .getVicEngagementDetails(this.socialInsuranceNo, this.engagementId, new Map().set('isTransactionView', true))
      .pipe(tap(res => (this.vicEngagementDetails = res)));
  }

  /** Method to check document transaction type  based on purpose of registration. */
  checkDocumentTransactionType(purposeOfRegistration: string): string[] {
    const documentType: string[] = [];
    switch (purposeOfRegistration) {
      case PurposeOfRegsitrationEnum.WORKING_OUTSIDE_SAUDI:
        documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI);
        break;
      case PurposeOfRegsitrationEnum.GOV_EMP_NOT_UNDER_PPA:
        documentType.push(DocumentTransactionType.REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA);
        break;
      case PurposeOfRegsitrationEnum.EMP_INT_POL_MIL:
        documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS);
        break;
      case PurposeOfRegsitrationEnum.FREELANCER:
          case PurposeOfRegsitrationEnum.PROFESSIONAL:
            if(this.channel.english === Channel.TAMINATY ||
              this.channel.english ===  Channel.TAMINATY_INDIVIDUAL ||
              this.channel.english === Channel.TAMINATY_VALUE || 
              this.channel.english === Channel.TAMINATY_APP) documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER);
            else documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL);
            break;
    }
    documentType.push(DocumentTransactionType.REGISTER_VIC_DOCTOR_MODIFY);
    if(this.channel.english === Channel.TAMINATY ||
      this.channel.english ===  Channel.TAMINATY_INDIVIDUAL ||
      this.channel.english === Channel.TAMINATY_VALUE || 
      this.channel.english === Channel.TAMINATY_APP) documentType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_GOL)
    else{
    // isFO is used to check weather value is Field office instead of field-office
    const isFO = ChannelConstants.CHANNELS_FILTER_TRANSACTIONS?.find(item => item.english === this.channel.english)
    documentType.push(
      (this.channel.english === Channel.FIELD_OFFICE)||(this.channel.english === isFO.english)
        ? DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FO
        : DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_GOL
    );
  }
    return documentType;
  }
}
