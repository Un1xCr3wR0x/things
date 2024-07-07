/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, OnDestroy, Inject } from '@angular/core';
import {
  BenefitConstants,
  BenefitType,
  createDetailForm,
  createModalForm,
  bindQueryParamsToForm,
  UITransactionType,
  UiBenefitsService,
  ManageBenefitService,
  SanedBenefitService,
  ReturnLumpsumService,
  DependentService,
  ModifyBenefitService,
  FuneralBenefitService,
  BenefitDocumentService,
  BankService,
  WizardService,
  HeirBenefitService,
  AdjustmentService,
  BenefitRequestsService,
  QuestionControlService,
  BenefitActionsService,
  BypassReassessmentService,
  ContributorService,
  BenefitPropertyService,
  HeirActiveService
} from '../../../shared';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReturnLumpsumDetails } from '../../../shared/models';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreContributorService,
  DocumentService,
  LanguageToken,
  LookupService,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  RouterService,
  StorageService,
  Transaction,
  TransactionService,
  UuidGeneratorService,
  formatDate,
  CalendarService,
  NotificationService,
  AuthTokenService,
  MenuService
} from '@gosi-ui/core';
import { ValidatorHelperBaseScComponent } from '../../base/validator-helper-sc.base-component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { PriorityListConstants } from '@gosi-ui/features/complaints/lib/shared/constants';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'bnt-transactions-return-lumpsum-sc',
  templateUrl: './transactions-return-lumpsum-sc.component.html',
  styleUrls: ['./transactions-return-lumpsum-sc.component.scss']
})
export class TransactionsReturnLumpsumScComponent extends ValidatorHelperBaseScComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  comments: null;
  nin: number;
  returnBenefitDetails: ReturnLumpsumDetails;
  returnLumpsumForm: FormGroup;
  returnLumpsumModal: FormGroup;
  commonModalRef: BsModalRef;
  heading: string;
  isValidatorScreen = true;
  isValidatorCanEditPayment = false;
  isJailedLumpsum = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isNonOcc = false;
  isWomenLumpsum = false;
  enabledRestoration: Boolean;
  isSadad: Boolean;
  enableLumpsumRepaymentId: number;
  reqDocList = [];
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];

  /**
   *
   * @param uiBenefitService
   * @param alertService
   * @param modalService
   * @param documentService
   * @param fb
   * @param manageBenefitService
   * @param sanedBenefitService
   * @param returnLumpsumService
   * @param dependentService
   * @param modifyBenefitService
   * @param benefitDocumentService
   * @param bankService
   * @param wizardService
   * @param heirBenefitService
   * @param heirActiveService
   * @param uuidGeneratorService
   * @param location
   * @param lookUpService
   * @param contributorService
   * @param storageService
   * @param router
   * @param route
   * @param translate
   * @param modifyPensionService
   * @param adjustmentService
   * @param manageService
   * @param appToken
   * @param language
   * @param routerData
   * @param routerService
   * @param benefitActionService
   */
  constructor(
    readonly uiBenefitService: UiBenefitsService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly manageBenefitService: ManageBenefitService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly dependentService: DependentService,
    readonly modifyBenefitService: ModifyBenefitService,
    readonly funeralBenefitService: FuneralBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly bankService: BankService,
    readonly wizardService: WizardService,
    readonly heirBenefitService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly location: Location,
    readonly lookUpService: LookupService,
    public contributorService: CoreContributorService,
    readonly storageService: StorageService,
    readonly router: Router,
    public route: ActivatedRoute,
    readonly translate: TranslateService,
    public modifyPensionService: ModifyBenefitService,
    readonly adjustmentService: AdjustmentService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    public manageService: ManagePersonService,
    readonly qcs: QuestionControlService,
    readonly authTokenService: AuthTokenService,
    public benefitRequestsService: BenefitRequestsService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly routerService: RouterService,
    readonly benefitActionService: BenefitActionsService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    public contributorDomainService: ContributorService,
    readonly coreBenefitService: CoreBenefitService,
    readonly transactionService: TransactionService,
    benefitPropertyService: BenefitPropertyService,
    readonly calendarService: CalendarService,
    readonly ohService: OhService,
    readonly notificationService: NotificationService,
    readonly menuService: MenuService
  ) {
    super(
      uiBenefitService,
      alertService,
      modalService,
      documentService,
      fb,
      manageBenefitService,
      sanedBenefitService,
      returnLumpsumService,
      dependentService,
      modifyBenefitService,
      funeralBenefitService,
      benefitDocumentService,
      bankService,
      wizardService,
      heirBenefitService,
      heirActiveService,
      uuidGeneratorService,
      location,
      lookUpService,
      contributorService,
      storageService,
      router,
      route,
      translate,
      modifyPensionService,
      adjustmentService,
      adjustmentPaymentService,
      manageService,
      qcs,
      authTokenService,
      benefitRequestsService,
      appToken,
      language,
      routerData,
      routerService,
      bypassReaassessmentService,
      contributorDomainService,
      coreBenefitService,
      benefitPropertyService,
      calendarService,
      ohService,
      notificationService,
      menuService,
      transactionService
    );
  }

  /**
   *
   * This method is to initialize the component
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();

    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    // this.returnLumpsumForm = createDetailForm(this.fb);
    // this.returnLumpsumModal = createModalForm(this.fb);
    // bindQueryParamsToForm(this.routerData, this.returnLumpsumForm);
    // this.intialiseTheView(this.routerData);
    // super.getRejectionReason(this.returnLumpsumForm);
    if (this.transaction) {
      this.referenceNo = this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.sin = this.transaction.params.SIN;
      this.repayId = this.transaction.params.REPAY_ID;
      this.requestId = this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.channel = this.transaction.channel.english;
      // this.fetchDocuments();
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
    }
    this.getLumpsumRepaymentDetails(this.sin, this.requestId, this.repayId);
  }

  /**
   * this function will redirect validator to return lumpsum amount screen
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }
  /**
   * this function will redirect validator to restore lumpsum screen
   */
  navigateToRestore() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }

  /**
   * Method to show approve modal.
   * @param templateRef
   */
  showTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * Approving by the validator.
   */
  confirmApproveLumpsum() {
    this.confirmApprove(this.returnLumpsumForm);
  }
  /**
   * While rejecting from validator
   */
  confirmRejectLumpsum() {
    this.confirmReject(this.returnLumpsumForm);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnLumpsum() {
    this.confirmReturn(this.returnLumpsumForm);
  }
  /**
   * Method to fetch the return lumpsum  details
   */
  getLumpsumRepaymentDetails(sin: number, benefitRequestId: number, repayID: number) {
    this.returnLumpsumService.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID).subscribe(
      res => {
        this.returnBenefitDetails = res;
        this.nin = this.returnBenefitDetails.nin;
        this.benefitType = this.returnBenefitDetails.benefitType.english;
        this.enabledRestoration = this.returnBenefitDetails.enabledRestoration;
        this.enableLumpsumRepaymentId = this.returnBenefitDetails.enableLumpsumRepaymentId;
        this.isSadad = this.returnBenefitDetails.repaymentDetails.paymentMethod.english === 'SADAD';
        if (!this.isSadad) {
          this.fetchDocumentsForOtherPayment();
          this.canValidatorCanEditPayment();
        }
        if (this.enabledRestoration) {
          this.fetchDocumentsForRestore(benefitRequestId);
        }
        this.returnLumpsumService.setRepayId(repayID);
        this.returnLumpsumService.setBenefitReqId(benefitRequestId);
        this.setBenefitVariables(this.benefitType);
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**to fetch documents */
  fetchDocumentsForOtherPayment() {
    this.transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE || this.channel === 'Field Office'
        ? UITransactionType.FO_REQUEST_SANED
        : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForOtherPayment(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNo
    );
  }

  getDocumentsForOtherPayment(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNo)
      .subscribe(res => {
        this.documentList = res;
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  fetchDocumentsForRestore(enableLumpsumRepaymentId: number) {
    this.transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentsForRestore(this.transactionKey, this.transactionType, enableLumpsumRepaymentId);
  }
  getDocumentsForRestore(transactionKey: string, transactionType: string, businessId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(businessId, transactionKey, transactionType)
      .subscribe(response => {
        this.documentList = response.filter(eachDoc => eachDoc.documentContent !== null);
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  setBenefitVariables(benefitType: string) {
    if (benefitType === BenefitType.hazardousLumpsum) {
      this.isHazardous = true;
    } else if (benefitType === BenefitType.jailedContributorLumpsum) {
      this.isJailedLumpsum = true;
    } else if (benefitType === BenefitType.occLumpsum) {
      this.isOcc = true;
    } else if (benefitType === BenefitType.nonOccLumpsumBenefitType) {
      this.isNonOcc = true;
    } else if (benefitType === BenefitType.womanLumpsum) {
      this.isWomenLumpsum = true;
    } else if (benefitType === BenefitType.heirLumpsum) {
      this.isHeir = true;
    }
  }

  canValidatorCanEditPayment() {
    if (
      this.returnBenefitDetails?.repaymentDetails?.receiptMode.english === 'Account Transfer' ||
      this.returnBenefitDetails?.repaymentDetails?.receiptMode.english === 'Cash Deposit'
    ) {
      this.isValidatorCanEditPayment = true;
    }
    if (this.rejectAccess) {
      this.isValidatorCanEditPayment = true;
    }
  }
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
  }

  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
