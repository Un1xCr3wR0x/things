import { Component, Inject, OnInit } from '@angular/core';
import { UiBenefitsService } from '../../../shared/services/ui-benefits.service';
import { switchMap, tap } from 'rxjs/operators';
import { noop } from 'rxjs';
import { AnnuityResponseDto } from '../../../shared/models/annuity-responsedto';
import { SuspendSanedDetails } from '../../../shared/models/suspend-saned';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  CoreBenefitService,
  DocumentItem,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  convertToYYYYMMDD
} from '@gosi-ui/core';
import { CalculatedAdjustment } from '../../../shared/models/calculated-adjustment';
import { UITransactionType } from '../../../shared/enum';
import { BenefitDocumentService } from '../../../shared/services/benefit-document.service';
import { BenefitConstants } from '../../../shared/constants/benefit-constants';
import { Router } from '@angular/router';
import { ActiveBenefits } from '../../../shared/models/active-benefits';
import { BenefitType } from '@gosi-ui/features/payment/lib/shared';
import { UIPayloadKeyEnum } from '@gosi-ui/features/customer-information/lib/shared/enums/benefits';

@Component({
  selector: 'bnt-transaction-suspend-saned-sc',
  templateUrl: './transaction-suspend-saned-sc.component.html',
  styleUrls: ['./transaction-suspend-saned-sc.component.scss']
})
export class TransactionSuspendSanedScComponent implements OnInit {
  referenceNo: number;
  transactionId: number;
  socialInsuranceNo: number;
  benefitRequestId: number;
  referenceNumber: number;
  benefitDetails: AnnuityResponseDto;
  // uiEligibility: Benefits;
  // transactionType: UITransactionType;
  // channel: Channel;
  documentList: DocumentItem[];
  transaction: Transaction;
  isIndividualApp: boolean;
  suspendDetails: SuspendSanedDetails;
  adjustmentDetails: CalculatedAdjustment;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue = 100;
  limit = this.limitvalue;

  constructor(
    readonly uiBenefitService: UiBenefitsService,
    readonly transactionService: TransactionService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly authTokenService: AuthTokenService,
    readonly router: Router,
    readonly coreBenefitService: CoreBenefitService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    // this.transactionType = UITransactionType.FO_REQUEST_SANED;
    // if (this.channel === Channel.GOSI_ONLINE) {
    //   this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    // }
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.isIndividualApp
        ? this.authTokenService.getIndividual()
        : this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      // this.getUIEligibilityDetails(this.socialInsuranceNo, BenefitType.ui);
    }
    if (this.socialInsuranceNo && this.benefitRequestId) {
      this.uiBenefitService
        .getUiBenefitRequestDetail(this.socialInsuranceNo, this.benefitRequestId, null)
        .pipe(
          switchMap(res => {
            this.benefitDetails = res;
            if(this.transaction?.status?.english !== 'Completed'){
              return this.uiBenefitService.getSuspendSanedDetails(this.socialInsuranceNo, this.benefitRequestId);
            }
          }),
          switchMap(res => {
            this.suspendDetails = res;
            return this.uiBenefitService.calculateSanedSuspendAdjustments(
              this.socialInsuranceNo,
              this.benefitRequestId,
              convertToYYYYMMDD(res.suspendDate.gregorian.toString())
            );
          }),
          switchMap(res => {
            this.adjustmentDetails = res;

            return this.benefitDocumentService.getUploadedDocuments(
              this.benefitRequestId,
              UITransactionType.SUSPEND_UNEMPLOYMENT_BENEFIT,
              UITransactionType.FO_REQUEST_SANED,
              this.referenceNo
            );
          }),
          tap(res => {
            this.documentList = res;
          })
        )
        .subscribe(noop);
    }
  }

  viewContributorDetails() {
    this.routerData.stopNavigationToValidator = true;
    this.routerData.assignedRole = null;
    this.routerData.idParams.set(UIPayloadKeyEnum.SIN, this.socialInsuranceNo);
    // this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.benefitRequestId,
      { arabic: null, english: BenefitType.ui },
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
}
