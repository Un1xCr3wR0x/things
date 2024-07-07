/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  CoreAdjustmentService,
  DocumentService,
  Transaction,
  TransactionService,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  LookupService,
  DocumentItem,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../../base';
import {
  ManageBenefitService,
  AnnuityResponseDto,
  showErrorMessage,
  HeirBenefitService,
  BankService,
  DependentService,
  BenefitDocumentService,
  isDocumentsValid,
  ImprisonmentDetails,
  BenefitDetails,
  BenefitType,
  BenefitsAdjustmentWrapper,
  UiBenefitsService,
  SanedBenefitService,
  UITransactionType,
  BenefitConstants,
  BenefitPropertyService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-request-retirement-lumpsum-sc',
  templateUrl: './request-retirement-lumpsum-sc.component.html',
  styleUrls: ['./request-retirement-lumpsum-sc.component.scss']
})
export class RequestRetirementLumpsumScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  contributorDetails: AnnuityResponseDto;
  transactionKey: string;
  transactionType: string;
  reqList: DocumentItem[];
  imprisonmentDetails: ImprisonmentDetails;
  oldBenefitDetails: BenefitDetails[];
  isJailedLumpsum = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isNonOcc = false;
  isWomanLumpsum = false;
  lumpsumAdjustments: BenefitsAdjustmentWrapper;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    public route: ActivatedRoute,
    readonly uiBenefitService: UiBenefitsService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly authTokenService: AuthTokenService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    // this.transactionKey = 'REQUEST_RETIREMENT_LUMPSUM';
    // this.transactionType = 'REQUEST_BENEFIT_FO';
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedLumpsum = params.jailedlumpsum === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isWomanLumpsum = params.womanlumpsum === 'true';
    });
    //setting the benefitType according to the queryparam received
    if (this.isNonOcc) {
      this.benefitType = BenefitType.nonOccLumpsumBenefitType;
    } else if (this.isJailedLumpsum) {
      this.benefitType = BenefitType.jailedContributorLumpsum;
    } else if (this.isJailedLumpsum) {
      this.benefitType = BenefitType.jailedContributorLumpsum;
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousLumpsum;
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirLumpsum;
    } else if (this.isOcc) {
      this.benefitType = BenefitType.occLumpsum;
    } else if (this.isWomanLumpsum) {
      this.benefitType = BenefitType.womanLumpsum;
    }
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
      if (this.isJailedLumpsum) {
        this.fetchImprisonmentDetails();
      }
      this.fetchAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNumber);
      this.fetchAnnuityCalculation(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNumber);
      // this.manageBenefitService
      //   .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
      //   .subscribe(
      //     res => {
      //       this.contributorDetails = res;
      //     },
      //     err => {
      //       if (err.status === 500 || err.status === 422 || err.status === 400) {
      //         this.showErrorMessages(err);
      //         this.goToTop();
      //       }
      //     }
      //   );
      this.getLumpsumBenefitAdjustment();

      if (this.transactionId.toString() === BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_LUMPSUM) {
        this.transactionKey = UITransactionType.REQUEST_NON_OCC_LUMPSUM_TRANSACTION;
      } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_JAILED_LUMPSUM) {
        this.transactionKey = UITransactionType.REQUEST_JAILED_LUMPSUM_TRANSACTION;
      } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_HAZARDS_LUMPSUM) {
        this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_LUMPSUM_TRANSACTION;
      } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_OCC_LUMPSUM) {
        this.transactionKey = UITransactionType.REQUEST_OCC_LUMPSUM_TRANSACTION;
      } else if (this.transactionId.toString() === BenefitConstants.TRANSACTION_WOMAN_LUMPSUM) {
        this.transactionKey = UITransactionType.REQUEST_WOMAN_LUMPSUM_BENEFIT;
      }
      this.getDocuments(this.transactionKey, this.transactionType, this.benefitRequestId, this.referenceNumber);
    }
  }

  getLumpsumBenefitAdjustment() {
    this.lumpsumAdjustments = this.uiBenefitService.getlumpsumBenefitAdjustments();
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
      this.dependentService.getBenefitHistory(this.socialInsuranceNo, this.benefitrequestId).subscribe(
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
    this.dependentService.getDependentHistory(this.socialInsuranceNo, this.benefitrequestId, personId).subscribe(
      history => {
        this.dependentHistory = history;
      },
      err => {
        this.showError(err);
      }
    );
  }

  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number, referenceNo: number) {
    this.benefitDocumentService
      .getValidatorDocuments(this.sin, benefitRequestId, referenceNo, transactionKey, transactionType)
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documents = this.reqList;
        }
      });
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
}
