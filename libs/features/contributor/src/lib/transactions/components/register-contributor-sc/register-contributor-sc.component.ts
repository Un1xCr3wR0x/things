import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterData,
  RouterDataToken,
  checkBilingualTextNull,
  AlertService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { iif, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import {
  ContributorConstants,
  ContributorTypesEnum,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementDetails,
  EngagementService,
  EstablishmentService,
  getGccIdentity,
  getTransactionType
} from '../../../shared';
import { ContributorService } from '../../../shared/services/contributor.service';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-register-contributor-sc',
  templateUrl: './register-contributor-sc.component.html',
  styleUrls: ['./register-contributor-sc.component.scss']
})
export class RegisterContributorScComponent extends TransactionBaseScComponent implements OnInit {
  engagement: EngagementDetails;
  isContractRequired = false;
  legalEntityChanged = false;
  isIndividualApp = false;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
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
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    super.getTransactionDetails();
    super.getSystemParameters();
    // To do : remove the check for individual app, individual app API changes not implemented for contributor transaction screens
    if (!this.isIndividualApp) {
      this.getDataForView();
    }
  }
  /** Method to retrieve data for view. */
  getDataForView() {
    if (this.registrationNo && this.socialInsuranceNo)
      super
        .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
        .pipe(tap(() => (this.contributor = getGccIdentity(this.contributor, this.contributor.contributorType))))
        .pipe(
          switchMap(() => {
            if (this.engagementId) return this.getEngagementDetails();
          }),
          switchMap(() => {
            return super.getDocuments(
              DocumentTransactionId.REGISTER_CONTRIBUTOR,
              [
                getTransactionType(
                  this.engagement.establishmentLegalEntity?.english,
                  this.contributor.person,
                  this.contributor.contributorType,
                  this.establishment?.gccEstablishment?.gccCountry
                ),
                DocumentTransactionType.BANK_UPDATE
              ],
              this.engagementId,
              this.routerDataToken.transactionId
            );
          })
        )
        .subscribe({
          complete: () => {
            if (this.engagementId) this.checkContractPreviewRequired();
            // this.checkPenaltyIndicator(this.engagement);
            // if (this.legalEntityChanged) this.showModal(this.legalEntityChangetTemplate, false, true);
          }
        });
  }

    /** Method to get engagement details. */
    getEngagementDetails() {
      return this.getEngagement(this.contributor.contributorType !== ContributorTypesEnum.SAUDI, true).pipe(
        tap(res => this.checkChangeInLegalEntity(res.establishmentLegalEntity?.english)),
        switchMap(res =>
          iif(
            () => !this.legalEntityChanged && this.contributor.contributorType === ContributorTypesEnum.SAUDI,
            this.getEngagement(true,true),
            of(res)
          )
        ),
        tap(res => this.setEngagementDetails(res))
      );
    }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
/** Method to get engagement. */
    getEngagement(isCoverageRequired: boolean, isTransactionView?: boolean) {
      return this.engagementService.getEngagementDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        undefined,
        isCoverageRequired,
        isTransactionView
      );
    }

  /** Method to check change in legal entity of establishment. */
  checkChangeInLegalEntity(legalEntity: string) {
    // To check whether establishment legal entity changed from private to government or semi government
    if (legalEntity && ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(legalEntity) === -1) {
      if (
        this.establishment.legalEntity.english !== legalEntity &&
        ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.establishment.legalEntity.english) !== -1
      )
        this.legalEntityChanged = true;
    }
  }

  /** Method to set engagement details. */
  setEngagementDetails(engagement: EngagementDetails) {
    this.engagement = engagement;
    this.engagement.isContributorActive = this.engagement.leavingDate?.gregorian ? false : true; //api removed this property so workaround
  }
  /*
   * This methode is to View contract details in new tab
   */
  onViewContractsClick() {
    const url =
      '#' +
      `/validator/preview/${this.registrationNo}/${this.socialInsuranceNo}/${this.engagementId}?param=` +
      encodeURIComponent(this.engagement.contractId);
    window.open(url, '_blank');
  }

  /** Method to check whether contract preview is required. */
  checkContractPreviewRequired() {  
    //show contract if contributor contributor is active and establishment legal entity is not govt and semi govt
    //if legal entity changed from private to government and contributor is active show contract
    if (
      this.engagement?.isContributorActive &&
      !this.establishment?.gccEstablishment?.gccCountry &&
      this.contributor?.contributorType === ContributorTypesEnum.SAUDI &&
      ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.engagement?.establishmentLegalEntity?.english) ===
        -1 &&
      !this.engagement?.backdatingIndicator && 
      this.engagement.contractId
    ) {
      this.isContractRequired = true;
    }
  }
}
