/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  Channel,
  CoreAdjustmentService,
  CoreContributorService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  BankService,
  BenefitConstants,
  BenefitDetails,
  BenefitDocumentService,
  BenefitValues,
  DependentService,
  FuneralBenefitService,
  HeirBenefitService,
  ImprisonmentDetails,
  ManageBenefitService,
  SanedBenefitService,
  UiBenefitsService,
  UITransactionType,
  TransactionType,
  BenefitType,
  isUiBenefit,
  BenefitPropertyService,
  isOccBenefit
} from '../../../shared';
import { FuneralGrantBeneficiaryResponse } from '../../../shared/models/funeral-grant-beneficiary-response';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-request-retirement-pension-sc',
  templateUrl: './request-retirement-pension-sc.component.html',
  styleUrls: ['./request-retirement-pension-sc.component.scss']
})
export class RequestRetirementPensionScComponent extends TransactionBaseScComponent implements OnInit {
  channel = 'field-office';
  referenceNumber: number;
  transactionId: number;
  lang = 'en';
  socialInsuranceNo: number;
  benefitrequestId: number;
  sin: number;
  imprisonmentDetails: ImprisonmentDetails;
  oldBenefitDetails: BenefitDetails[];
  funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  benefitValuesConstants = BenefitValues;
  benefitTypes = BenefitType;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly funeralBenefitService: FuneralBenefitService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    public contributorService: CoreContributorService,
    readonly authTokenService: AuthTokenService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly benefitDocumentService: BenefitDocumentService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly ohService: OhService
  ) {
    super(
      documentService,
      manageBenefitService,
      dependentService,
      alertService,
      bankService,
      lookUpService,
      heirBenefitService,
      adjustmentService,
      sanedBenefitService,
      uiBenefitService,
      modalService,
      router,
      fb,
      routerData,
      benefitPropertyService,
      ohService
    );
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.benefitrequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.requestType = this.transactionId ? TransactionType[this.transactionId] : null;
      if (this.socialInsuranceNo && this.benefitrequestId && this.referenceNumber) {
        this.fetchAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.benefitrequestId, this.referenceNumber);
      }
      this.getDocs();
    }
    this.fetchOldDependentDetails();
    this.fetchImprisonmentDetails();
  }
  fetchImprisonmentDetails() {
    if (this.socialInsuranceNo && this.benefitrequestId) {
      this.dependentService.getImprisonmentDetails(this.socialInsuranceNo, this.benefitrequestId).subscribe(
        res => {
          if (res) {
            this.imprisonmentDetails = res;
            this.dependentService.imprisonmentDetails = this.imprisonmentDetails;
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  fetchOldDependentDetails() {
    if (this.socialInsuranceNo && this.benefitrequestId) {
      this.dependentService.getBenefitHistory(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.benefitrequestId).subscribe(
        res => {
          this.oldBenefitDetails = res;
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  fetchDependentHistory(personId: number) {
    this.dependentService.getDependentHistory(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.benefitrequestId, personId).subscribe(
      history => {
        this.dependentHistory = history;
      },
      err => {
        this.showError(err);
      }
    );
  }
  getDocs() {
    let transactionKey = UITransactionType.REQUEST_PENSION_BENEFIT;
    if (this.transactionId.toString() === BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_PENSION) {
      transactionKey = UITransactionType.REQUEST_NON_OCC_PENSION_TRANSACTION;
    } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_JAILED_PENSION) {
      transactionKey = UITransactionType.REQUEST_JAILED_PENSION_TRANSACTION;
    } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_HAZARDS_RETIRMENT) {
      transactionKey = UITransactionType.REQUEST_HAZARDOUS_PENSION_TRANSACTION;
    } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_OCC_PENSION) {
      transactionKey = UITransactionType.REQUEST_OCC_PENSION_TRANSACTION;
    } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_EARLY_RETIREMENT_PENSION) {
      transactionKey = UITransactionType.REQUEST_EARLY_RETIREMENT_PENSION;
    } else if (TransactionType[this.transactionId] === BenefitType.stopBenefitWaive) {
      transactionKey = UITransactionType.STOP_BENEFIT_WAIVE_PENSION;
    } else if (TransactionType[this.transactionId] === BenefitType.addModifyHeir) {
      transactionKey = UITransactionType.MODIFY_HEIR;
    } else if (TransactionType[this.transactionId] === BenefitType.startBenefitWaive) {
      transactionKey = UITransactionType.START_BENEFIT_WAIVE;
    }

    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;

    this.benefitDocumentService
      .getValidatorDocuments(
        this.socialInsuranceNo,
        this.benefitrequestId,
        this.referenceNumber,
        transactionKey,
        transactionType
      )
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }
  getBeneficiaryDetails() {
    if (this.socialInsuranceNo && this.benefitrequestId && this.referenceNumber) {
      this.funeralBenefitService
        .getBeneficiaryRequestDetails(this.socialInsuranceNo, this.benefitrequestId, this.referenceNumber)
        .subscribe(
          res => {
            this.funeralBeneficiaryDetails = res;
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  navigateToBenefitsHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    if (isUiBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          uihistory: true
        }
      });

      // } else if (isNonoccBenefit(this.benefitType)) {
      //   this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      //     queryParams: {
      //       occupational: true
      //     }
      //   });
      // For non occ, View Benefit History hyperlink redirect should user to annuities history instead of saned benefit history
      // Defect 463879
    } else if (isOccBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          occ: true
        }
      });
    } else {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          annuity: true
        }
      });
    }
  }
}
