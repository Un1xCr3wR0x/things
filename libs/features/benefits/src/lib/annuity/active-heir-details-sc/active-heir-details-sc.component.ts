/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  checkIqamaOrBorderOrPassport,
  DocumentItem,
  LanguageToken,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService as TransactionRoutingService,
  Transaction,
  TransactionStatus,
  CoreAdjustmentService,
  CoreContributorService,
  CommonIdentity,
  IdentityTypeEnum,
  BilingualText,
  CoreActiveBenefits,
  RoleIdEnum,
  BenefitsGosiShowRolesConstants,
  AuthTokenService
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ActiveBenefits,
  ActiveHeirData,
  ActiveHeirDetails,
  AdjustmentDetailsDto,
  BenefitConstants,
  BenefitDocumentService,
  BenefitType,
  DependentDetails,
  DependentService,
  HeirActiveService,
  HeirBenefitService,
  HeirStatus,
  HeirStatusType,
  isHeirBenefit,
  ManageBenefitService,
  ModifyBenefitService,
  PaymentDetail,
  PaymentHistoryFilter,
  TransactionHistoryDetails,
  TransactionHistoryFilter,
  TransactionsDetails,
  UiBenefitsService,
  BenefitDetails,
  RecalculationConstants,
  AdjustmentService,
  BenefitPropertyService,
  AdjustmentPopupDcComponent,
  SimisBenefit,
  MainframeBenefit,
  BypassReassessmentService,
  AdjustmentStatus,
  SimisSanedPaymentHistory,
  PersonAdjustmentDetails,
  SanedBenefitService
} from '../../shared';
import { ActiveHeirBase } from '../base/active-heir.base';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'bnt-active-heir-details-sc',
  templateUrl: './active-heir-details-sc.component.html',
  styleUrls: ['./active-heir-details-sc.component.scss']
})
export class ActiveHeirDetailsScComponent extends ActiveHeirBase implements OnInit {
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  accessForActionPublic = BenefitsGosiShowRolesConstants.CREATE_INDIVIDUAL;
  directPaymentHistory = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_HISTORY;

  heading: string;
  lang = 'en';
  actionButtonDisabled = true;
  activeBenefitObj: BenefitDetails;
  benefeciaryStatus: string;
  activeHeirData: ActiveHeirData;
  activeHeirDetails: ActiveHeirDetails;
  adjustmentDetailsData: AdjustmentDetailsDto;
  paymentEventsList$: Observable<LovList>;
  paymentStatusList$: Observable<LovList>;
  transactionStatusList$: Observable<LovList>;
  benefitPaymentDetails: PaymentDetail;
  transactionHistoryDetails: TransactionHistoryDetails;
  transactions: TransactionsDetails[];
  scannedDocuments: DocumentItem[];
  documentList: DocumentItem[] = [];
  benefitHistoryDetails: BenefitDetails;
  simisPaymentHistory$: Observable<Array<SimisBenefit>>;
  mainframePaymentHistory$: Observable<Array<MainframeBenefit>>;
  simisSanedPaymentHistory$: Observable<SimisSanedPaymentHistory>;
  ifTransactionHistory = false;
  isIndividualApp = false;
  adjustmentDetails: PersonAdjustmentDetails;

  constructor(
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly dependentService: DependentService,
    readonly heirService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly manageBenefitService: ManageBenefitService,
    readonly modifyPensionService: ModifyBenefitService,
    readonly modalService: BsModalService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly location: Location,
    readonly router: Router,
    readonly bypassReaassessmentService: BypassReassessmentService,
    readonly txnService: TransactionRoutingService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly uiBenefitsService: UiBenefitsService,
    readonly contributorService: CoreContributorService,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly paymentAdjustmentService: AdjustmentService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly changePersonService: ChangePersonService
  ) {
    super(
      alertService,
      benefitDocumentService,
      dependentService,
      heirService,
      heirActiveService,
      manageBenefitService,
      modifyPensionService,
      modalService,
      sanedBenefitService,
      location,
      router,
      bypassReaassessmentService,
      appToken,
      language,
      routerData,
      adjustmentService,
      uiBenefitsService
    );
  }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    // this.getDocumentsForViewBank();
    this.getSystemParamAndRundate();
    this.activeHeirDetails = this.heirActiveService.getActiveHeirDetails();
    if (this.activeHeirDetails) {
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.activeHeirDetails.sin;
      this.benefitRequestId = this.activeHeirDetails.benefitRequestId;
      this.personId = this.activeHeirDetails.personId;
      this.benefitType = this.activeHeirDetails?.benefitType;
      this.isHeir = true;
      this.getHeirDetails(this.sin, this.benefitRequestId, this.personId);
      this.getPaymentDetails(this.sin, this.benefitRequestId, this.personId);
      this.getHerirAdjustmentDetails(this.sin, this.benefitRequestId, this.personId);
      this.getAdjustmentDetails(this.sin, this.benefitRequestId, true);
      this.getCalculationDetails(this.sin, this.benefitRequestId);
      this.setActiveAdjustments();
      this.onPaymentHistoryTabSelected();
      this.simisPaymentHistory$ = this.manageBenefitService.getSimisPaymentHistory(
        this.sin,
        this.benefitRequestId,
        this.personId
      );
      this.mainframePaymentHistory$ = this.manageBenefitService.getMainframePaymentHistory(
        this.sin,
        this.benefitRequestId
      );
      this.simisSanedPaymentHistory$ = this.uiBenefitsService.getSimisSanedPaymentHistory(
        this.sin,
        this.benefitRequestId
      );
    }
  }
  navigateToAddModify() {
    this.adjustmentService.type = null;
    this.adjustmentService.identifier = this.personId;
    this.adjustmentService.benefitRequestId = this.benefitRequestId;
    this.router.navigate(['/home/adjustment/add-modify']);
  }
  navigateToAddAdjustment() {
    this.adjustmentService.type = null;
    this.adjustmentService.identifier = this.personId;
    this.router.navigate(['/home/adjustment/create']);
  }
  navigateToAdjustment(adjustmentId: number) {
    this.adjustmentService.identifier = this.personId;
    this.adjustmentService.sin = this.sin;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }
  viewHeirDetails(id: number) {
    //this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.sin)]);
    this.changePersonService._socialInsuranceNo.next(null);
    this.changePersonService.setPersonInformation(null);
    this.changePersonService._personInfo.next(null);
    this.router.navigate([`/home/profile/individual/internal/${id}/overview`]);
  }
  /** Method to set Active Adjustment */
  setActiveAdjustments() {
    this.paymentAdjustmentService
      .getAdjustmentsByDualStatus(
        this.contributorService.personId || this.personId,
        RecalculationConstants.ACTIVE,
        RecalculationConstants.NEW,
        this.sin
      )
      .subscribe(adjustmentDetail => {
        if (adjustmentDetail && adjustmentDetail.adjustments && adjustmentDetail.adjustments.length)
          this.activeAdjustmentsExist = true;
      });
  }
  getHeirDetails(sin: number, benefitRequestId: number, personId: number) {
    this.heirActiveService.getHeirDetails(sin, benefitRequestId, personId).subscribe(res => {
      this.activeHeirData = res;
      if (this.activeHeirData?.identity)
        this.activeHeirData.heirIdentity = checkIqamaOrBorderOrPassport(this.activeHeirData?.identity);
      if (!this.activeBenefitObj) this.activeBenefitObj = new BenefitDetails();
      this.activeBenefitObj.requestDate = this.activeHeirData?.requestDate;
      this.activeBenefitObj.benefitType = this.activeHeirData?.benefitType;
      this.activeBenefitObj.benefitStartDate = this.activeHeirData?.firstBenefitStartDate;
      this.activeBenefitObj.deathDate = this.activeHeirData?.deathDate;
      this.activeBenefitObj.status = this.activeHeirData?.status;
      this.activeBenefitObj.amount = this.activeHeirData?.currentBenefitAmount;
      this.activeBenefitObj.holdStopDetails.eventDate = this.activeHeirData?.holdStopDetails?.eventDate;
      this.activeBenefitObj.holdStopDetails.reason = this.activeHeirData?.holdStopDetails?.reason;
      this.benefeciaryStatus = this.activeHeirData?.status?.english;
      this.getPaymentEligibility();
    });
  }
  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NATIONAL-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    } else {
      label = 'BENEFITS.NATIONAL-ID';
    }
    return label;
  }
  /**
   * Dependents/ Heirs status available
   * @param lists
   */
  setAvailableStatus(lists: DependentDetails[]) {
    this.actionButtonDisabled = false;
    if (lists && lists?.length) {
      lists.forEach(eachItem => {
        this.dependentHeirStatusCount[eachItem.status?.english]++;
      });
    }
  }

  // Fetch transactionHistoryDetails
  getHerirAdjustmentDetails(sin: number, benefitRequestId: number, personId: number) {
    this.benefitPropertyService.getHeirAdjustmentDetails(sin, benefitRequestId, personId).subscribe(
      res => {
        this.adjustmentDetailsData = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  getFilteredAdjustment(adjustments) {
    return adjustments.filter(
      adjustment =>
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.NEW ||
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.ACTIVE ||
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.ON_HOLD
    );
  }
  getCalculationDetails(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getBenefitCalculationDetailsByRequestId(sin, benefitRequestId).subscribe(calculation => {
      this.benefitCalculation = calculation;
    });
  }

  /** This method getscalled when selecting the payment details tab */
  onPaymentHistoryTabSelected() {
    this.getPaymentDetails(this.sin, this.benefitRequestId, this.activeHeirDetails?.personId);
    this.paymentEventsList$ = this.manageBenefitService.getPaymentFilterEventType();
    this.paymentStatusList$ = this.manageBenefitService.getPaymentFilterStatusType();
  }
  navigateToAdjustmentDetails() {
    this.adjustmentService.identifier = this.benefitPaymentDetails?.benefitDetails?.personId || this.personId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.HEIR_ACTIVE }
    });
  }

  /** Method to fetch payment details **/
  getPaymentDetails(sin: number, benefitRequestId: number, identifier: number) {
    this.heirActiveService.getPaymentDetails(sin, benefitRequestId, identifier).subscribe(res => {
      this.benefitPaymentDetails = res;
    });
  }

  /** Method to filter payment history */
  filterPaymentHistory(paymentHistoryFilter: PaymentHistoryFilter) {
    this.manageBenefitService.filterPaymentHistory(this.sin, this.benefitRequestId, paymentHistoryFilter).subscribe(
      res => {
        this.benefitPaymentDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /** Method to benefit eligibility history */
  onEligibilityTabSelected() {}

  /** This method getscalled when selecting the transaction details tab */
  onTransactionTabSelected() {
    this.getTransactionHistoryDetails(this.sin, this.benefitRequestId, this.personId);
    this.transactionStatusList$ = this.benefitPropertyService.getTransactionStatus();
  }

  // Fetch transactionHistoryDetails
  getTransactionHistoryDetails(sin: number, benefitRequestId: number, personId: number) {
    this.benefitPropertyService.getTransactionHistoryDetails(sin, benefitRequestId, personId).subscribe(
      res => {
        this.transactionHistoryDetails = res;
        this.transactions = this.transactionHistoryDetails.transactions;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  transactionHistoryFilter(transactionHistoryFilter: TransactionHistoryFilter) {
    this.benefitPropertyService
      .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
      .subscribe(
        res => {
          this.transactionHistoryDetails = res;
          this.transactions = this.transactionHistoryDetails.transactions;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
  }

  //Method to search a transaction from transaction history table
  onSearchTransactionId(transactionHistoryFilter: TransactionHistoryFilter) {
    this.benefitPropertyService
      .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
      .subscribe(
        res => {
          this.transactionHistoryDetails = res;
          this.transactions = this.transactionHistoryDetails.transactions;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
  }

  /** This method getscalled when selecting the document tab */
  onDocumentTabSelected() {
    this.getScannedDocument(this.benefitRequestId);
    this.getDocswithTxnId(this.benefitRequestId);
  }

  /** get scanned documents */
  getScannedDocument(benefitRequestId) {
    this.benefitDocumentService.getActiveHeirDocs(this.activeHeirData?.heirIdentity?.id, benefitRequestId).subscribe(
      res => {
        this.scannedDocuments = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  getDocswithTxnId(benefitRequestId) {
    this.benefitDocumentService.getDocswithTxnId(benefitRequestId).subscribe(
      res => {
        if (res?.length > 0) {
          this.scannedDocuments = this.scannedDocuments?.concat(res.filter(x => !x.identifier));
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // getScannedDocument(benefitRequestId) {
  //   this.benefitDocumentService.getAllDocuments(benefitRequestId).subscribe(
  //     res => {
  //       this.scannedDocuments = res.filter(doc =>
  //         doc.identifier ? +doc.identifier === this.activeHeirData?.heirIdentity?.id : true
  //       );
  //     },
  //     err => {
  //       this.showErrorMessage(err);
  //     }
  //   );
  // }

  navigateToAddDocuments() {
    this.router.navigate([BenefitConstants.ROUTE_ADD_DOCUMENTS]);
  }
  // getDocumentsForViewBank() {
  //   this.benefitDocumentService
  //     .getUploadedDocuments(1003880624, 'RESTART_BENEFIT', 'REQUEST_BENEFIT_FO')
  //     .subscribe(res => {
  //       this.documentList = res;
  //     });
  // }

  /**
   *
   * @param document
   */
  openImage(document) {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + document.documentContent;
    const w = window.open('');
    w.document.write(img.outerHTML);
  }

  navigateToModifyCommitment() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_COMMITMENT]);
  }
  removeCommitment() {
    this.router.navigate([BenefitConstants.ROUTE_REMOVE_COMMITMENT]);
  }
  showCommitment(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  confirmAddCommitemnt() {
    this.router.navigate([BenefitConstants.ROUTE_ADD_COMMITMENT]);
    this.commonModalRef.hide();
  }

  goToTransaction(transaction: Transaction) {
    // param is TransactionDetails
    if (transaction.status.english.toUpperCase() !== TransactionStatus.DRAFT.toUpperCase()) {
      this.txnService.navigate(transaction);
    }
  }
  viewAdjustmentModal(eachHistory) {
    this.commonModalRef = this.modalService.show(AdjustmentPopupDcComponent, Object.assign({}, { class: 'modal-lg' }));
    this.commonModalRef.content.paymentHistory = eachHistory;
    this.commonModalRef.content.close.subscribe(() => this.commonModalRef.hide());
    this.commonModalRef.content.onAdjustmentClicked.subscribe(adjustmentId => {
      this.commonModalRef.hide();
      this.navigateToAdjustment(adjustmentId);
    });
    this.commonModalRef.content.onBenefitTypeClicked.subscribe(benefitAdjustment => {
      this.commonModalRef.hide();
      this.navigateToBenefitDetails(benefitAdjustment);
    });
  }
  navigateToBenefitDetails(benefit) {
    this.adjustmentService.benefitType = benefit?.benefitType?.english;
    this.adjustmentService.benefitDetails = benefit;
    this.contributorService.personId = this.getIdentifier();
    this.heirActiveService.setActiveHeirDetails(
      new CoreActiveBenefits(benefit?.sin, benefit?.benefitRequestId, benefit?.benefitType, null)
    );
    this.ngOnInit();
  }
  getIdentifier() {
    return this.contributorService.personId || this.personId;
  }
  navigateToPayOnline() {
    this.router.navigate([BenefitConstants.ROUTE_PAY_ONLINE], {
      queryParams: { identifier: this.activeHeirData?.heirIdentity?.id }
    });
  }
  /** Method to navigate to direct Payment */
  directPaymentNavigate() {
    this.router.navigate([BenefitConstants.ROUTE_DIRECT_PAYMENT_TIMELINE], {
      queryParams: { identifier: this.activeHeirData?.heirIdentity?.id }
    });
  }
  getPaymentEligibility() {
    this.uiBenefitService
      .getPaymentEligiblity(this.activeHeirData?.heirIdentity?.id, this.sin)
      .subscribe(res => (this.adjustmentDetails = res));
  }
}
