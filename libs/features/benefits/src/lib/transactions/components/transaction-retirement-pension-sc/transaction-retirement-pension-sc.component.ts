import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  Channel,
  ChannelConstants,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BehaviorSubject } from 'rxjs';
import {
  BenefitDocumentService,
  BenefitType,
  getTransactionTypeOrId,
  HeirStatus,
  isDocumentsValid,
  ManageBenefitService,
  showErrorMessage,
  UIPayloadKeyEnum,
  UITransactionType
} from '../../../shared';

@Component({
  selector: 'bnt-transaction-retirement-pension-sc',
  templateUrl: './transaction-retirement-pension-sc.component.html',
  styleUrls: ['./transaction-retirement-pension-sc.component.scss']
})
export class TransactionRetirementPensionScComponent implements OnInit {
  transaction: Transaction;
  lang = 'en';
  systemParameter: SystemParameter;
  transactionId: number;
  channel: BilingualText;
  sin: number;
  businessId: number;
  documents: DocumentItem[];
  referenceNumber: number;
  benReqId: number;
  requestId: number;
  transactionName: string;
  transactionType: string;
  status: BilingualText;
  transactionNumber: string;
  reqList: DocumentItem[];
  transactionKey: string;
  benefitType: string;
  requestType: string;

  isJailedLumpsum = false;
  isRPALumpsum = false;
  isEarlyRetirement = false;
  isNonOcc = false;
  isNonOccDisabilityAssessment = false;
  isJailedPension = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isAddModifyBenefit = false;
  isModifyBackdated: boolean;
  isAddModifyHeir = false;
  isHoldBenefit = false;
  isStopBenefit = false;
  isRestartBenefit = false;
  isStartBenefitWaive = false;
  isStopBenefitWaive = false;
  isBackDated = false;

  getReqPensionDocsIds = [302002, 302041, 302006, 302007, 302005];
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly manageBenefitService: ManageBenefitService,
    public route: ActivatedRoute,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang; //required
    });
    this.getSystemParam(); //required
    this.setValues();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transaction = this.transactionService.getTransactionDetails();
    this.getDocumentRelatedValues();
    //if (this.transaction?.status?.english === 'Completed') {
    this.getTransactionCompletedDocuments();
    //} else {
    //this.fetchDocuments();
    //}
  }

  getDocumentRelatedValues() {
    this.channel = this.transaction.channel;
    this.referenceNumber = this.transaction.transactionRefNo;
    this.transactionId = this.transaction.transactionId;
    this.sin = this.transaction.params.SIN;
    this.benReqId = this.transaction.params.BENEFIT_REQUEST_ID;
    this.businessId = this.transaction.params.BUSINESS_ID;
    this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    this.status = this.transaction.status;
  }

  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNumber, this.benReqId).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documents = this.reqList;
      }
    });
  }

  // isBackDated is to be true for all the request benefits and for add/modify heir and dep
  // isBackDated is false for hold, restart etc.
  fetchDocuments() {
    this.isBackDated = true;
    if (this.getIsType()) {
      this.transactionKey = UITransactionType.REQUEST_MODIFY_BENEFIT;
      const actionType = this.isHoldBenefit
        ? HeirStatus.HOLD
        : this.isStopBenefit
        ? HeirStatus.STOP
        : this.isRestartBenefit
        ? HeirStatus.RESTART
        : this.isStartBenefitWaive
        ? HeirStatus.START_WAIVE
        : this.isStopBenefitWaive
        ? HeirStatus.STOP_WAIVE
        : null;
      this.transactionKey = getTransactionTypeOrId(this.isHeir, actionType, true);
      this.isBackDated = false;
    } else if (this.isAddModifyBenefit) {
      this.transactionKey = UITransactionType.MODIFY_DEPENDENT;
    } else if (this.isAddModifyHeir) {
      this.transactionKey = UITransactionType.MODIFY_HEIR;
    } else if (this.isEarlyRetirement) {
      this.transactionKey = UITransactionType.REQUEST_EARLY_RETIREMENT_PENSION;
    } else if (this.isNonOcc) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_PENSION_TRANSACTION;
    } else if (this.isJailedPension) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_PENSION_TRANSACTION;
    } else if (this.isHazardous) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_PENSION_TRANSACTION;
    } else if (this.isOcc) {
      this.transactionKey = UITransactionType.REQUEST_OCC_PENSION_TRANSACTION;
    } else if (this.isNonOccDisabilityAssessment) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_DISABILITY_TRANSACTION;
    } else if (this.isHeir) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_PENSION_TRANSACTION;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_BENEFIT;
    }
    this.transactionType =
      this.channel.english === Channel.FIELD_OFFICE ||
      this.channel.english === ChannelConstants.CHANNELS_FILTER_TRANSACTIONS[1].english
        ? UITransactionType.FO_REQUEST_SANED
        : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.benReqId, this.referenceNumber, this.isBackDated);
  }

  getDocuments(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number,
    isBackDated = false
  ) {
    this.benefitDocumentService
      .getValidatorDocuments(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, benefitRequestId, referenceNo, transactionKey, transactionType, isBackDated)
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documents = this.reqList;
        }
      });
  }

  /*set benefit type and request types*/
  setValues() {
    this.route.queryParams.subscribe(params => {
      this.isEarlyRetirement = params.earlyretirement === 'true';
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedPension = params.jailedpension === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isNonOccDisabilityAssessment = params.disabilityAssessment === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isAddModifyBenefit = this.isModifyBackdated = params.addModifyDep === 'true';
      this.isAddModifyHeir = params.addModifyHeir === 'true';
      this.isHoldBenefit = params.hold === 'true';
      this.isStopBenefit = params.stop === 'true';
      this.isRestartBenefit = params.restart === 'true';
      this.isStartBenefitWaive = params.startBenefitWaive === 'true';
      this.isStopBenefitWaive = params.stopBenefitWaive === 'true';
    });
    // this.setParam();
    this.getBenefitType();
    this.getRequestType();
  }
  // setParam() {
  //   if (this.isEarlyRetirement) {
  //     this.paramValue = 'isEarlyRetirement';
  //   } else if (this.isNonOcc) {
  //     this.paramValue = 'isNonOcc';
  //   } else if (this.isJailedPension) {
  //     this.paramValue = 'isJailedPension';
  //   } else if (this.isHazardous) {
  //     this.paramValue = 'isHazardous';
  //   } else if (this.isNonOccDisabilityAssessment) {
  //     this.paramValue = 'isNonOccDisabilityAssessment';
  //   } else if (this.isHeir) {
  //     this.paramValue = 'isHeir';
  //   } else if (this.isOcc) {
  //     this.paramValue = 'isOcc';
  //   }
  // }
  getIsRetirement() {
    return (
      !this.isEarlyRetirement &&
      !this.isNonOcc &&
      !this.isJailedPension &&
      !this.isHazardous &&
      !this.isNonOccDisabilityAssessment &&
      !this.isHeir &&
      !this.isOcc &&
      !this.isAddModifyBenefit &&
      !this.isAddModifyHeir &&
      !this.isHoldBenefit &&
      !this.isStopBenefit &&
      !this.isRestartBenefit &&
      !this.isStartBenefitWaive &&
      !this.isStopBenefitWaive
    );
  }

  getBenefitType() {
    if (this.isEarlyRetirement) {
      this.benefitType = BenefitType.earlyretirement;
    } else if (this.isNonOcc) {
      this.benefitType = BenefitType.nonOccPensionBenefitType;
    } else if (this.isAddModifyBenefit) {
      this.benefitType = BenefitType.retirementPension;
    } else if (this.isJailedPension) {
      this.benefitType = BenefitType.jailedContributorPension;
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousPension;
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirPension;
    } else if (this.isOcc) {
      this.benefitType = BenefitType.occPension;
    } else if (this.isNonOccDisabilityAssessment) {
      this.benefitType = BenefitType.NonOccDisabilityBenefitsType;
    } else if (this.getIsRetirement()) {
      this.benefitType = BenefitType.retirementPensionType;
    }
  }

  getRequestType() {
    if (this.isAddModifyBenefit) {
      this.requestType = BenefitType.addModifyBenefit;
    } else if (this.isAddModifyHeir) {
      this.requestType = BenefitType.addModifyHeir;
    } else if (this.isHoldBenefit) {
      this.requestType = BenefitType.holdbenefit;
    } else if (this.isStopBenefit) {
      this.requestType = BenefitType.stopbenefit;
    } else if (this.isRestartBenefit) {
      this.requestType = BenefitType.restartbenefit;
    } else if (this.isStartBenefitWaive) {
      this.requestType = BenefitType.startBenefitWaive;
    } else if (this.isStopBenefitWaive) {
      this.requestType = BenefitType.stopBenefitWaive;
    } else if (this.isNonOcc) {
      this.requestType = BenefitType.nonOccPensionBenefitType;
    }
  }
  getIsType() {
    return (
      this.isHoldBenefit ||
      this.isStopBenefit ||
      this.isRestartBenefit ||
      this.isStartBenefitWaive ||
      this.isStopBenefitWaive
    );
  }

  getSystemParam() {
    this.manageBenefitService.getSystemParams().subscribe(
      res => {
        this.systemParameter = new SystemParameter().fromJsonToObject(res);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
}
