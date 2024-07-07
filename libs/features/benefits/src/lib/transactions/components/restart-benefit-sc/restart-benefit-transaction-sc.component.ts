/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import {
  AlertService,
  CoreAdjustmentService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  LanguageToken,
  DocumentItem,
  ApplicationTypeToken,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  CoreBenefitService,
  formatDate,
  ApplicationTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import {
  BankService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  UITransactionType,
  SanedBenefitService,
  UiBenefitsService,
  ModifyBenefitService,
  HoldBenefitDetails,
  Contributor,
  BenefitPropertyService,
  BenefitConstants,
  ActiveBenefits,
  RecalculationConstants,
  getIdentityLabel
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';

import {
  AnnuityResponseDto,
  AttorneyDetailsWrapper,
  BenefitDetails,
  BenefitType,
  BenefitValues
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { PersonalInformation } from '@gosi-ui/features/payment/lib/shared/models/personal-information';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-txn-restart-benefit-sc',
  templateUrl: './restart-benefit-transaction-sc.component.html',
  styleUrls: ['./restart-benefit-transaction-sc.component.scss']
})
export class RestartBenefitTransactionScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benReqId: number;
  lang = 'en';
  annuityBenefitDetails: AnnuityResponseDto;
  benefitType: BenefitType.restartbenefit;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  benefitCalculation: BenefitDetails;
  directDisabled: boolean;
  checkBenefitType = BenefitType.restartbenefit;
  nin: number;
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  authPersonId: number;
  personalDetails: PersonalInformation;
  requestType: string;
  checkForm: FormGroup;
  oldBenefitDetails: BenefitDetails[];
  transactionKey: string;
  transactionType: string;
  reqList: DocumentItem[];
  requestId: number;
  businessId: number;
  restartDetails: HoldBenefitDetails;
  restartCalculations: HoldBenefitDetails;
  contributorDetails: Contributor;
  identity: CommonIdentity | null;
  restartTransactionType;
  benefitValuesConstants = BenefitValues;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  identityLabel = '';
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly authTokenService: AuthTokenService,
    readonly fb: FormBuilder,
    readonly modifyBenefitService: ModifyBenefitService,
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
    this.requestType = BenefitType.restartbenefit;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transaction = this.transactionService.getTransactionDetails();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.transaction.params.SIN;
      this.businessId = this.transaction.params.BUSINESS_ID;
      this.benReqId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.fetchDocuments();
      this.getRestartBenefitDetails();
      this.getRestartCalcDetails();
      this.getBenefitCalculationDetails(this.sin, this.benReqId);
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
    }
  }
  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_RESTART_TRANSACTION;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentDetails(this.transactionKey, this.transactionType, this.benReqId, this.referenceNumber);
  }
  // getHeirDetails(sin: number, benefitRequestId: number, referenceNo: number) {
  //   const status = [
  //     HeirStatusType.ACTIVE,
  //     HeirStatusType.STOPPED,
  //     HeirStatusType.ON_HOLD,
  //     HeirStatusType.WAIVED_TOWARDS_GOSI,
  //     HeirStatusType.WAIVED_TOWARDS_HEIR
  //   ];

  getAuthorizedPersonDetails(isModifyBenefit: boolean) {
    if (this.benReqId && this.sin) {
      this.manageBenefitService.getSelectedAuthPerson(this.sin, this.benReqId).subscribe(res => {
        this.preSelectedAuthperson = res;
        if (this.preSelectedAuthperson[0]) {
          if (this.preSelectedAuthperson[0].personId) {
            this.authPersonId = this.preSelectedAuthperson[0].personId;
            this.getBankDetails(this.authPersonId?.toString(), isModifyBenefit);
            this.benefitPropertyService.setPersonId(this.authPersonId);
          }
        }
      });
    }
  }

  // fetch stop benefit details
  getRestartBenefitDetails() {
    this.modifyBenefitService.getRestartDetails(this.sin, this.benReqId, this.referenceNumber).subscribe(
      res => {
        this.restartDetails = res;
        this.contributorDetails = res?.contributor;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.identityLabel = getIdentityLabel(this.identity);
        this.annuityBenefitDetails = new AnnuityResponseDto();
        this.annuityBenefitDetails.age = this.contributorDetails.age;
        this.annuityBenefitDetails.dateOfBirth = this.contributorDetails.dateOfBirth;
        this.annuityBenefitDetails.requestDate = this.restartDetails.requestDate;
        this.personNameEnglish = this.contributorDetails.name?.english;
        this.personNameArabic = this.contributorDetails.name?.arabic;
        this.getRestartCalcDetails();

        //this.checkForm.get('checkBoxFlag').setValue(this.restartDetails?.isDirectPaymentOpted);
      },
      err => this.showError(err)
    );
  }
  getBenefitCalculationDetails(sin: number, benefitRequestId: number) {
    if (sin && benefitRequestId) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId)
        .subscribe(calculation => {
          this.benefitCalculation = calculation;
        });
    }
  }

  getRestartCalcDetails() {
    this.modifyBenefitService.getRestartCalculation(this.sin, this.benReqId, this.referenceNumber).subscribe(
      res => {
        this.restartCalculations = res;
        //this.checkForm.get('checkBoxFlag').setValue(this.restartCalculations?.isDirectPaymentOpted);
      },
      err => this.showError(err)
    );
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  hideModal() {
    this.commonModalRef.hide();
  }
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  onViewBenefitDetails() {
    //this.modifyPensionService.setActiveBenefit();
    const data = new ActiveBenefits(
      this.sin,
      this.benReqId,
      this.restartDetails?.pension?.annuityBenefitType,
      this.referenceNumber
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  navigateToPrevAdjustment() {
    this.adjustmentService.identifier = this.restartDetails?.modifyPayee?.personId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.RESTART_CONTRIBUTOR }
    });
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
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
