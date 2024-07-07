/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  RouterService,
  scrollToTop,
  StorageService,
  UuidGeneratorService,
  WizardItem,
  CoreActiveBenefits,
  CoreAdjustmentService,
  CoreBenefitService,
  AddressTypeEnum,
  CalendarService,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  NotificationService,
  AuthTokenService,
  MenuService, TransactionService
} from '@gosi-ui/core';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentMethodDetailsDcComponent } from '../../../shared/component';
import { BenefitConstants } from '../../../shared/constants';
import {
  ActiveBenefits,
  AttorneyDetails,
  AttorneyDetailsWrapper,
  AuthorizationDetailsDto,
  BenefitPaymentDetails,
  BenefitResponse,
  DependentDetails,
  HeirsDetails,
  HoldBenefit,
  HoldBenefitDetails,
  RestartBenefitHeading,
  RestartHoldDetails,
  StopSubmitRequest
} from '../../../shared/models';
import {
  BankService,
  BenefitActionsService,
  BenefitDocumentService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  ModifyBenefitService,
  ReturnLumpsumService,
  SanedBenefitService,
  UiBenefitsService,
  WizardService,
  QuestionControlService,
  FuneralBenefitService,
  BypassReassessmentService,
  AdjustmentService,
  BenefitRequestsService,
  ContributorService,
  BenefitPropertyService,
  HeirActiveService
} from '../../../shared/services';
import {
  checkAddressDetails,
  clearAlerts,
  getAuthorizedGuardianDetails,
  getServiceType,
  showErrorMessage,
  showModal
} from '../../../shared/utils';
import { RestartBenefitHelperComponent } from './restart-benefit-helper';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-restart-benefit-sc',
  templateUrl: './restart-benefit-sc.component.html',
  styleUrls: ['./restart-benefit-sc.component.scss']
})
export class RestartBenefitScComponent
  extends RestartBenefitHelperComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  //Local Variables
  restartWizards: WizardItem[] = [];
  restartHoldDetails: RestartHoldDetails = new RestartHoldDetails();
  restartEditdetails: HoldBenefitDetails = new HoldBenefitDetails();
  restartCalculations: HoldBenefitDetails = new HoldBenefitDetails();
  activeBenefit: CoreActiveBenefits;
  contributorPaymentDetails: DependentDetails = new DependentDetails(null);
  isSubmitDisabled: boolean;
  restartHeading: string;
  submitResponse: BenefitResponse;
  momentObj = moment;
  restartBenefitForm: FormGroup = new FormGroup({});
  benefitPaymentDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  paymentDetails: HeirsDetails = new HeirsDetails();
  restartTransactionConstant = BenefitConstants.RESTART_TRANSACTION_CONSTANT;
  isPrevClicked = false;
  //Observables
  paymentModeList$: Observable<LovList>;
  listYesNo$ = new Observable<LovList>();
  restartReasonList$ = new Observable<LovList>();
  //ViewChild component
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  @ViewChild('restartBenefitWizard', { static: false })
  restartBenefitWizard: ProgressWizardDcComponent;
  @ViewChild('paymentDetailsComponent', { static: false })
  paymentDetailsComponent: PaymentMethodDetailsDcComponent;
  @ViewChild('brdcmb', { static: false })
  restartBenefitBrdcmb: BreadcrumbDcComponent;
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
    readonly benefitPropertyService: BenefitPropertyService,
    readonly calendarService: CalendarService,
    readonly ohService: OhService,
    readonly notificationService: NotificationService,
    readonly menuService: MenuService,
    readonly transactionService: TransactionService
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
      // benefitActionService,
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
   * Method to initialsie tasks
   */
  ngOnInit(): void {
    this.getSystemRunDate();
    this.initializeWizardDetails();
    this.getLookUpValues();
    this.route.queryParams.subscribe(params => {
      this.inEditMode = params.edit === 'true';
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.transactionId = BenefitConstants.RESTART_BENEFIT;
    this.restartTransactionType = this.isAppPrivate
      ? BenefitConstants.REQUEST_BENEFIT_FO
      : BenefitConstants.REQUEST_BENEFIT_GOL;
    if (!this.inEditMode) {
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      this.setBenefitValues();
      this.restartHeading = new RestartBenefitHeading(this.benefitType).getHeading();
    } else {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.initialiseViewForEdit(payload);
        this.getRestartEditDetails();
      }
    }
    this.getRestartholdDetails();
  }
  ngAfterViewInit() {
    if (this.route.routeConfig) {
      this.route.routeConfig.data = { breadcrumb: this.restartHeading };
      this.restartBenefitBrdcmb.breadcrumbs = this.restartBenefitBrdcmb.buildBreadCrumb(this.route.root);
    }
  }
  getRestartEditDetails() {
    this.modifyBenefitService.getRestartDetails(this.sin, this.benefitRequestId, this.referenceNo).subscribe(
      res => {
        if (this.isValidator) {
          this.benefitPropertyService.validatorEditCall(this.sin, this.benefitRequestId, this.referenceNo).subscribe();
        }
        this.restartEditdetails = res;
        this.restartHeading = new RestartBenefitHeading(
          this.restartEditdetails?.pension?.annuityBenefitType?.english
        ).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.restartHeading };
          this.restartBenefitBrdcmb.breadcrumbs = this.restartBenefitBrdcmb.buildBreadCrumb(this.route.root);
        }
        this.setPaymentRelatedValuesForEdit(res.modifyPayee);
        this.contributorPaymentDetails.identity = res?.contributor?.identity;
      },
      err => this.showError(err)
    );
  }
  //Method to initialise variables during edit flow
  initialiseViewForEdit(payload) {
    this.sin = payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
  }
  /**
   * Method to set benefit values
   */
  setBenefitValues() {
    if (this.activeBenefit) {
      this.sin = this.activeBenefit.sin;
      this.benefitRequestId = this.activeBenefit.benefitRequestId;
      this.referenceNo = this.activeBenefit.referenceNo;
      this.benefitType = this.activeBenefit.benefitType?.english;
    }
  }
  /**
   * Method to get restart hold values
   */
  getRestartholdDetails() {
    this.benefitActionService.getRestartholdDetails(this.benefitRequestId, this.sin).subscribe(
      res => {
        this.restartHoldDetails = res;
      },
      err => this.alertService.showError(err.error?.message)
    );
  }
  initializeWizardDetails() {
    this.restartWizards = this.wizardService.getRestartWizardItems();
    this.restartWizards[0].isActive = true;
    this.restartWizards[0].isDisabled = false;
  }
  //Method to select wizard
  selectedWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /**
   * Method to save request details
   */
  saveRequestDetails() {
    if (!this.inEditMode) markFormGroupTouched(this.restartBenefitForm);
    this.restartBenefitForm.updateValueAndValidity();
    if (this.restartBenefitForm.valid) {
      const holdBenefit = new HoldBenefit();
      holdBenefit.notes = this.restartBenefitForm.get('requestDetails')?.value?.notes;
      holdBenefit.requestDate = this.restartBenefitForm.get('requestDetails')?.value?.requestDate;
      holdBenefit.reason = this.restartBenefitForm.get('requestDetails')?.value?.requestReason;
      holdBenefit.referenceNo = this.referenceNo;
      if (!this.inEditMode) {
        this.benefitActionService.saveRestartBenefitDetails(holdBenefit, this.benefitRequestId, this.sin).subscribe(
          res => {
            this.benefitPaymentDetails = res;
            this.setPaymentRelatedValues(res);
            this.getRestartCalcDetails();
            this.nextForm();
          },
          err => {
            if (err.error.details && err.error.details.length > 0) {
              this.alertService.showError(null, err.error.details);
            } else {
              this.alertService.showError(err.error.message);
            }
          }
        );
      } else {
        holdBenefit.referenceNo = this.referenceNo;
        this.benefitActionService.updateRestartBenefitDetails(holdBenefit, this.benefitRequestId, this.sin).subscribe(
          res => {
            this.benefitPaymentDetails = res;
            this.referenceNumber = res.referenceNo;
            this.getRestartCalcDetails();
            this.nextForm();
          },
          err => this.alertService.showError(err?.error?.message)
        );
      }
    } else this.alertService.showMandatoryErrorMessage();
  }
  getRestartCalcDetails() {
    this.modifyBenefitService.getRestartCalculation(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
      res => {
        this.restartCalculations = res;
      },
      err => this.showError(err)
    );
  }
  /**
   * Method to go to next page
   */
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab++;
    this.restartWizards[1].isImage = true;

    if (this.restartBenefitWizard) this.restartBenefitWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
  navigateRestartDocWizard() {
    if (!this.inEditMode && !this.isPrevClicked) {
      this.documentService.getRequiredDocuments(this.transactionId, this.restartTransactionType).subscribe(res => {
        this.requiredDocs = res;
        this.requiredDocs?.forEach(doc => {
          doc.canDelete = true;
        });
      });
    }
    if (this.inEditMode) this.getUploadedDocuments(this.benefitRequestId);
  }
  /*
   * This method is to fetch uploaded documents
   */
  getUploadedDocuments(benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, this.transactionId, this.restartTransactionType, this.referenceNo)
      .subscribe(
        res => (this.requiredDocs = res),
        err => this.alertService.showErrorByKey(err.error.message)
      );
  }
  /**
   * Method to go to previous page
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    this.restartWizards[1].isImage = true;

    if (this.restartBenefitWizard) this.restartBenefitWizard.setPreviousItem(this.currentTab);
    scrollToTop();
    this.isPrevClicked = true;
  }
  savePayeeDetails() {
    let transactionTraceId;
    this.invokePaymentDetailsEvent();
    if (this.checkPaymentFormValidity()) {
      transactionTraceId = this.contributorPaymentDetails.referenceNo;
      if (this.inEditMode) transactionTraceId = this.referenceNumber;
      this.benefitActionService
        .savePayeeDetails(this.paymentDetails, this.benefitRequestId, this.sin, transactionTraceId)
        .subscribe(
          res => {
            this.referenceNumber = res?.referenceNo;
            this.nextForm();
            this.navigateRestartDocWizard();
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
    } else this.alertService.showMandatoryErrorMessage();
  }
  invokePaymentDetailsEvent() {
    this.paymentDetailsComponent.markFormsAsTouched();
    this.paymentDetailsComponent.setPayeeDetails();
  }
  checkPaymentFormValidity() {
    return !this.inEditMode ? this.paymentDetailsComponent.checkFormValidity().formValid : true;
  }
  /********** Payment method related functions ***********/
  setPaymentRelatedValues(response: BenefitPaymentDetails) {
    if (response) {
      this.contributorPaymentDetails.payeeType = response.payeeType;
      this.contributorPaymentDetails.paymentMode = response.paymentMode;
      this.contributorPaymentDetails.bankAccount = response.bankAccount;
      this.contributorPaymentDetails.contactDetail = response.contactDetail;
      if (this.contributorPaymentDetails.contactDetail) checkAddressDetails(this.contributorPaymentDetails);
      this.contributorPaymentDetails.referenceNo = response.referenceNo;
      this.contributorPaymentDetails.identity = response.identity;
      this.referenceNumber = response.referenceNo;
      if (!this.contributorPaymentDetails.attorneyDetails)
        this.contributorPaymentDetails.attorneyDetails = new AttorneyDetailsWrapper();
      this.contributorPaymentDetails.attorneyDetails.personId = response.authorizedPersonId;
      this.contributorPaymentDetails.personId = response.personId;
    }
  }
  setPaymentRelatedValuesForEdit(response: HeirsDetails) {
    if (response) {
      this.contributorPaymentDetails.payeeType = response.payeeType;
      this.contributorPaymentDetails.paymentMode = response.paymentMode;
      this.contributorPaymentDetails.bankAccount = response.bankAccount;
      this.contributorPaymentDetails.contactDetail = response.contactDetail;
      if (this.contributorPaymentDetails.contactDetail) checkAddressDetails(this.contributorPaymentDetails);
      if (!this.contributorPaymentDetails.attorneyDetails)
        this.contributorPaymentDetails.attorneyDetails = new AttorneyDetailsWrapper();
      this.contributorPaymentDetails.attorneyDetails.personId = response.authorizedPersonId;
      this.contributorPaymentDetails.personId = response.personId;
    }
  }
  setPaymentDetails(paymentDetails: HeirsDetails) {
    this.paymentDetails.payeeType = paymentDetails?.payeeType;
    this.paymentDetails.paymentMode = paymentDetails?.paymentMode;
    this.paymentDetails.bankAccount = paymentDetails?.bankAccount;
    this.paymentDetails.authorizedPersonId = paymentDetails?.authorizedPersonId;
    this.paymentDetails.authorizationDetailsId = paymentDetails?.authorizedPersonId;
    this.paymentDetails.guardianPersonId = paymentDetails?.guardianPersonId;
    this.paymentDetails.guardianPersonIdentity = paymentDetails?.guardianPersonIdentity;
    this.paymentDetails.guardianPersonName = paymentDetails?.guardianPersonName;
    this.paymentDetails.contactDetail = paymentDetails?.contactDetail;
    this.paymentDetails.personId = this.contributorPaymentDetails?.personId;
  }
  checkAddessDetails(address) {
    return address ? true : false;
  }

  getAttorneyListById(id: number) {
    // this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(
    //   personDetails => {
    //     const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      this.contributorPaymentDetails.authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
      this.contributorPaymentDetails.guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
      this.contributorPaymentDetails.authorizedPersonDetails = getAuthorizedGuardianDetails(
        res,
        this.systemRunDate
      ).authorizedPersonDetails;
      this.contributorPaymentDetails.guardianPersonDetails = getAuthorizedGuardianDetails(
        res,
        this.systemRunDate
      ).guardianPersonDetails;
      // this.setAuthorizedPersonDetails(
      //   this.contributorPaymentDetails.authorizedPersonDetails,
      //   this.contributorPaymentDetails.guardianPersonDetails,
      //   res
      // );
    });
    // });
  }
  setAuthorizedPersonDetails(
    authorizedPersonDetails: AttorneyDetailsWrapper[],
    guardianPersonDetails: AttorneyDetailsWrapper[],
    authorizationDetails: AuthorizationDetailsDto
  ) {
    authorizationDetails.authorizationList.forEach(val => {
      if (
        val.authorizationType?.english === 'Attorney' &&
        (!val?.endDate || this.momentObj().diff(this.momentObj(val?.endDate?.gregorian), 'days') < 0) &&
        val?.isBeneficiarysAuthorisedPerson
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        //setting attorney details
        // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
        authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
        authorizedPersonDetail.name = val?.agent?.name;
        authorizedPersonDetail.identity = val?.agent?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        authorizedPersonDetails.push(authorizedPersonDetail);
      } else if (
        val.authorizationType?.english === 'Custody' &&
        (!val?.endDate || this.momentObj().diff(this.momentObj(val?.endDate?.gregorian), 'days') < 0) &&
        (val?.status?.english !== 'Expired' || val?.isActive)
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        authorizedPersonDetail.personId = val?.custodian?.id ? Number(val?.custodian?.id) : null;
        authorizedPersonDetail.name = val.custodian?.name;
        authorizedPersonDetail.identity = val.custodian?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        guardianPersonDetails.push(authorizedPersonDetail);
      }
    });
  }
  getBankList(identity) {
    if (identity) {
      const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
      this.bankService.getBankList(+identity.personId, serviceType).subscribe(bankRes => {
        if (bankRes) this.contributorPaymentDetails.bankList = bankRes;
      });
    } else {
      this.contributorPaymentDetails.bankList = [];
    }
  }
  saveBankDetails(requestData) {
    this.lookUpService.getBankForIban(requestData?.newBankAccount?.bankCode).subscribe(res => {
      if (requestData?.newBankAccount?.isNonSaudiIBAN) {
        this.paymentDetailsComponent.newNonSaudiBankName = res.items[0]?.value;
        this.paymentDetailsComponent.setNonSaudibankName();
      } else {
        this.contributorPaymentDetails.bankName = res.items[0]?.value;
      }
    });
  }
  getLookUpValues(): void {
    this.paymentModeList$ = this.lookUpService.getTransferModeDetails();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.restartReasonList$ = this.lookUpService.getRestartReasonList();
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
  }
  /*************** Document related functions ****************/
  submitRestartDetails(comments) {
    const submitValues: StopSubmitRequest = {
      comments: comments.comments,
      referenceNo: this.referenceNumber
    };
    if (!this.inEditMode) {
      this.benefitActionService
        .submitRestartDetails(this.sin, this.benefitRequestId, this.referenceNumber, submitValues)
        .subscribe(res => {
          this.submitResponse = res;
          if (this.submitResponse?.message !== null) this.alertService.showSuccess(this.submitResponse.message);
          this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
        });
    } else {
      this.benefitActionService
        .submitRestartDetails(this.sin, this.benefitRequestId, this.referenceNumber, submitValues)
        .subscribe(
          res => {
            this.submitResponse = res;
            if (
              this.role &&
              (this.role === this.rolesEnum.VALIDATOR_1 ||
                this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                this.role === 'Contributor')
            ) {
              this.saveWorkflowInEdit(comments);
            }
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessages(err);
              this.goToTop();
            }
          }
        );
    }
  }
  /** Method to confirm cancellation of the form. */
  confirm() {
    //need to change revert api
    if (this.sin && this.benefitRequestId && this.referenceNumber) {
      this.benefitActionService
        .revertRestartBenefit(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(() => {
          this.commonModalRef.hide();
          if (!this.inEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          else this.routeBack();
          this.alertService.clearAlerts();
        });
    } else {
      this.commonModalRef.hide();
      if (!this.inEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      else this.routeBack();
      this.alertService.clearAlerts();
    }
  }
  /** Method to handle cancellation of transaction. */
  cancelTransactions() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(this.modalService, this.cancelTemplate);
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.sin,
      this.benefitRequestId,
      this.inEditMode ? this.restartEditdetails?.pension?.annuityBenefitType : this.activeBenefit?.benefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  /** Method to handle clearing alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
