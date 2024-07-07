import { Location } from '@angular/common';
import { Directive, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  LovList,
  Role,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  WizardItem,
  WorkFlowActions,
  CoreBenefitService,
  CoreActiveBenefits,
  AddressTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentDcComponent } from '../../shared/component';
import { BenefitConstants, BenefitsRoutingConstants } from '../../shared/constants';
import { ProcessType, BenefitType, BenefitValues } from '../../shared/enum';
import { SamaArabic, SamaStatus, VerificationStatus } from '../../shared/enum/sama-status';
import {
  ActiveBenefits,
  ModifyPaymentDetails,
  BenefitResponse,
  PaymentDetail,
  HeirsDetails,
  DependentDetails,
  BenefitPaymentDetails,
  AttorneyDetailsWrapper,
  DependentSetValues
} from '../../shared/models';
import {
  BankService,
  BenefitActionsService,
  BenefitDocumentService,
  ManageBenefitService,
  ModifyBenefitService,
  WizardService,
  UiBenefitsService
} from '../../shared/services';
import { clearAlerts, isTabSlctdInWizard, showErrorMessage } from '../../shared/utils';
@Directive()
export class CommitmentBaseComponent extends BaseComponent implements OnInit {
  /*
   * Local Variables
   */
  requiredDocs: DocumentItem[];
  modalRef: BsModalRef;
  benefitType: string;
  benefitRequestId: number;
  referenceNo: number;
  transactionTraceId: number;
  momentObj = moment;
  benefitPaymentDetails: PaymentDetail = new PaymentDetail();
  uiConst = BenefitConstants;
  lang = 'en';
  processType = 'apply';
  isAppPrivate = false;
  sin: number;
  currentTab = 0;
  rolesEnum = Role;
  activeBenefit: CoreActiveBenefits;
  showOtpError: boolean;
  referenceNumber: number;
  submitResponse: BenefitResponse;
  documentuuid: string;
  doctransactionType: string;
  isEditMode = false;
  isExistingIban: boolean;
  dependentBenefit: DependentSetValues;
  documentForm: FormGroup = new FormGroup({});
  isSmallScreen: boolean;
  isRemove = false;
  isInvalidIban = false;
  role: string;
  wizardItems: WizardItem[] = [];
  transactionId: string;
  paymentDetails = new HeirsDetails();
  commitmentPaymentDetails = new DependentDetails(null);
  benefitPayDetails = new BenefitPaymentDetails();
  bankHoldDate: GosiCalendar = new GosiCalendar();
  modifyCommitmentDetails: ModifyPaymentDetails;
  verificationStatus: BilingualText = new BilingualText();
  personId: number;
  benefitResponse: BenefitResponse = new BenefitResponse();
  isIndividualApp: boolean;
  benefitText: string;
  authorizationId: number;
  isDead = false;

  //LovList Varibles
  payeeList: LovList = new LovList([]);
  paymentModeList$: Observable<LovList>;
  listYesNo$ = new Observable<LovList>();
  nationalityList$ = new Observable<LovList>();
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;

  //viewChild Components
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('documentComponent', { static: false })
  readonly documentComponent: DocumentDcComponent;
  /**
   *
   * @param alertService
   * @param modalService
   * @param documentService
   * @param benefitDocumentService
   * @param location
   * @param route
   * @param router
   * @param bankService
   * @param lookUpService
   * @param wizardService
   * @param manageBenefitService
   * @param modifyPensionService
   * @param benefitActionsService
   * @param uuidGeneratorService
   * @param appToken
   * @param language
   * @param routerData
   */
  constructor(
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly location: Location,
    public route: ActivatedRoute,
    readonly router: Router,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly wizardService: WizardService,
    public manageBenefitService: ManageBenefitService,
    public modifyPensionService: ModifyBenefitService,
    public benefitActionsService: BenefitActionsService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreBenefitService: CoreBenefitService,
    readonly uiBenefitsService: UiBenefitsService
  ) {
    super();
  }
  ngOnInit(): void {}
  /**Method to initialise view */
  initialiseView() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.documentuuid = this.uuidGeneratorService.getUuid();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.doctransactionType = this.isAppPrivate
      ? BenefitConstants.REQUEST_BENEFIT_FO
      : BenefitConstants.REQUEST_BENEFIT_GOL;
    this.route.queryParams.subscribe(params => {
      if (params) this.isEditMode = params.edit === 'true';
    });
    this.isDead = this.modifyPensionService.getIsDead();
    if (this.isEditMode && this.routerData.payload) {
      const payload = JSON.parse(this.routerData.payload);
      if (this.routerData.resourceType === BenefitConstants.TRANSACTION_REMOVE_BANK_COMMITMENT) this.isRemove = true;
      else this.isRemove = false;
      this.initialiseViewForEdit(payload);
      if (payload?.benefitType === BenefitType.ui) {
        this.getUiModifyCommitmentDetails();
        this.benefitText = BenefitsRoutingConstants.UI;
      } else {
        this.getModifyCommitmentDetails(this.isRemove);
        this.benefitText = BenefitsRoutingConstants.BENEFIT;
      }
    } else {
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      this.setActiveBenefitValues();
      if (this.benefitType === BenefitType.ui) {
        this.getUiPaymentDetails(this.sin, this.benefitRequestId);
        this.benefitText = BenefitsRoutingConstants.UI;
      } else {
        this.getPaymentDetails(this.sin, this.benefitRequestId);
        this.benefitText = BenefitsRoutingConstants.BENEFIT;
      }
    }
  }

  /** Method to fetch payment details **/
  getPaymentDetails(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getPaymentDetails(sin, benefitRequestId).subscribe(res => {
      this.bankHoldDate = res?.bankHoldDate;
      this.benefitPayDetails = res?.benefitDetails;
      this.verificationStatus = res?.samaVerification;
      this.personId = res?.benefitDetails.personId;
      this.setPaymentRelatedValues(this.benefitPayDetails);
      if(!this.benefitPayDetails?.contactDetail) this.commitmentPaymentDetails.contactDetail = res?.contactDetail;
    });
  }
  getUiPaymentDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitsService.getUiPaymentDetails(sin, benefitRequestId).subscribe(res => {
      this.benefitPaymentDetails = res;
      this.bankHoldDate = res?.bankHoldDate;
      this.benefitPayDetails = res?.benefitDetails;
      // this.verificationStatus = res?.samaVerification;
      if (!this.isIndividualApp) {
        this.verificationStatus = res.samaVerification;
      } else {
        this.setSamaStatus(res.samaVerification.english);
      }
      this.personId = res?.benefitDetails.personId;
      this.setPaymentRelatedValues(this.benefitPayDetails);
    });
  }
  /********** Payment method related functions ***********/

  setPaymentRelatedValues(response: BenefitPaymentDetails) {
    if (response) {
      this.commitmentPaymentDetails.payeeType = response.payeeType;
      this.commitmentPaymentDetails.paymentMode = response.paymentMethod;
      this.commitmentPaymentDetails.bankAccount = response.bankAccount;
      this.commitmentPaymentDetails.contactDetail = response.contactDetail;
      //this.checkAddressDetails(this.commitmentPaymentDetails);
      this.commitmentPaymentDetails.identity = response.personIdentifier;
      if (!this.commitmentPaymentDetails.attorneyDetails)
        this.commitmentPaymentDetails.attorneyDetails = new AttorneyDetailsWrapper();
      this.commitmentPaymentDetails.attorneyDetails.personId = response.authorizedPersonId;
      this.commitmentPaymentDetails.personId = response.personId;
    }
  }
  checkAddressDetails(commitmentPaymentDetails: DependentDetails) {
    commitmentPaymentDetails?.contactDetail?.addresses.forEach(address => {
      if (address?.type !== AddressTypeEnum.OVERSEAS) {
        this.commitmentPaymentDetails.enableEditAddress = false;
      } else {
        this.commitmentPaymentDetails.enableEditAddress = true;
      }
    });
  }
  /***Method to get bank details in workflow */
  getModifyCommitmentDetails(isRemove: boolean) {
    this.benefitActionsService
      .getModifyCommitmentDetails(this.sin, this.benefitRequestId, this.referenceNo, isRemove)
      .subscribe(res => {
        this.modifyCommitmentDetails = res;
        if(this.modifyCommitmentDetails?.deathDatePresent) this.isDead = true;
        if (!this.isIndividualApp) {
          this.verificationStatus = res.samaVerification;
        } else {
          this.setSamaStatus(res.samaVerification.english);
        }
        this.bankHoldDate = res?.modifyPayee?.bankAccount?.holdStartDate;
        this.setPaymentRelatedValuesForEdit(res.modifyPayee);
        this.commitmentPaymentDetails.identity = res?.contributor?.identity;
      });
  }
  getUiModifyCommitmentDetails() {
    this.benefitActionsService
      .getUiCommitmentDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNo, this.isRemove)
      .subscribe(res => {
        this.modifyCommitmentDetails = res;
        if(this.modifyCommitmentDetails?.deathDatePresent) this.isDead = true;
        if (!this.isIndividualApp) {
          this.verificationStatus = res.samaVerification;
        } else {
          this.setSamaStatus(res.samaVerification.english);
        }
        this.bankHoldDate = res?.modifyPayee?.bankAccount?.holdStartDate;
        this.setPaymentRelatedValuesForEdit(res.modifyPayee);
        this.commitmentPaymentDetails.identity = res?.contributor?.identity;
      });
  }
  setSamaStatus(samaStatus: string) {
    if (samaStatus == SamaStatus.samaVerified) {
      this.verificationStatus.english = VerificationStatus.VERIFIED;
      this.verificationStatus.arabic = SamaArabic.verifiedAr;
    } else if (samaStatus == SamaStatus.samaFailed) {
      this.verificationStatus.english = VerificationStatus.REJECTED;
      this.verificationStatus.arabic = SamaArabic.rejectedAr;
    } else if (samaStatus == SamaStatus.samaPending) {
      this.verificationStatus.english = VerificationStatus.PENDING;
      this.verificationStatus.arabic = SamaArabic.pendingAr;
    } else if (samaStatus == SamaStatus.samaNotVerified) {
      this.verificationStatus.english = VerificationStatus.REVERIFICATION;
      this.verificationStatus.arabic = SamaArabic.reverificationAr;
    }
  }
  /**Method to set payment related values */
  setPaymentRelatedValuesForEdit(response: HeirsDetails) {
    if (response) {
      this.commitmentPaymentDetails.payeeType = response.payeeType;
      this.commitmentPaymentDetails.paymentMode = response.paymentMode;
      this.commitmentPaymentDetails.bankAccount = response.bankAccount;
      this.commitmentPaymentDetails.contactDetail = response.contactDetail;
      //this.checkAddressDetails(this.commitmentPaymentDetails);
      if (!this.commitmentPaymentDetails.attorneyDetails)
        this.commitmentPaymentDetails.attorneyDetails = new AttorneyDetailsWrapper();
      this.commitmentPaymentDetails.attorneyDetails.personId = response.authorizedPersonId;
      this.commitmentPaymentDetails.personId = response.personId;
    }
  }
  //Method to initialise variables during edit flow
  initialiseViewForEdit(payload) {
    if (this.isIndividualApp) {
      this.sin = this.authTokenService.getIndividual();
    } else {
      this.sin = payload.socialInsuranceNo;
    }
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.role = payload.assignedRole;
  }
  setActiveBenefitValues() {
    if (this.activeBenefit) {
      if (this.isIndividualApp) {
        this.sin = this.authTokenService.getIndividual();
      } else {
        this.sin = this.activeBenefit?.sin;
      }
      this.benefitRequestId = this.activeBenefit?.benefitRequestId;
      this.benefitType = this.activeBenefit?.benefitType?.english;
      this.referenceNo = this.activeBenefit?.referenceNo;
    }
  }
  /******* Look up services **********/
  initialisePayeeType() {
    this.lookUpService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }
  /** Initializing cityList variable */
  initialiseCityLookup() {
    this.cityList$ = this.lookUpService.getCityList();
  }
  /** Initializing countryList variable */
  initialiseCountryLookup() {
    const countylistRaw = this.lookUpService.getCountryList();
    this.countryList$ = countylistRaw.pipe(
      map(countryList => {
        return new LovList(countryList.items.filter(country => country.value.english !== 'Saudi Arabia'));
      })
    );
  }
  /********************/
  /** Method to handle cancellation of transaction. */
  cancelTransactions() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.showModal(this.cancelTemplate);
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  /** This method is to show the modal reference */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.modalRef = this.modalService.show(
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
  showFormValidation() {
    if (this.isEditMode && this.appToken === ApplicationTypeEnum.PUBLIC && this.processType === ProcessType.REOPEN) {
      this.alertService.clearAlerts();
    } else {
      this.alertService.clearAlerts();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   * Method to check form validity
   * @param form form control */
  checkDocumentValidity(form: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.requiredDocs)) {
      this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (form) {
      return form.valid;
    } else {
      return true;
    }
  }
  /**
   * Method to get required docs
   * @param transactionId
   * @param modifyTransactionType
   */
  getModifyRequiredDocs(transactionId, modifyTransactionType) {
    this.documentService.getRequiredDocuments(transactionId, modifyTransactionType).subscribe(documents => {
      this.requiredDocs = documents;
      this.requiredDocs.forEach(doc => {
        doc.canDelete = true;
      });
    });
  }
  /*
   * This method is to fetch uploaded documents
   */
  getUploadedDocuments(benefitRequestId: number, transactionId: string, doctransactionType: string) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionId, doctransactionType, this.referenceNo)
      .subscribe(
        res => (this.requiredDocs = res),
        err => this.alertService.showErrorByKey(err.error.message)
      );
  }
  /**
   * Method to refresh doc
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.benefitRequestId,
          this.transactionId,
          this.doctransactionType,
          !this.isRemove ? this.referenceNumber : this.referenceNo,
          undefined,
          this.documentComponent.uuid
        )
        .subscribe(res => {
          if (res) document = res;
        });
    }
  }
  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comments) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.comments = comments.comments;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  //This method is to decline cancellation of transaction
  decline() {
    this.modalRef.hide();
  }
  // BACK BUTTON Route while displaying an injury
  routeBack() {
    this.location.back();
  }
  /** Wrapper method to scroll to top of modal*/
  goToTop() {
    scrollToTop();
  }
  isTabSlctdInWizard(key: string, currentTab: number, wizardItems: WizardItem[]) {
    return isTabSlctdInWizard(key, currentTab, wizardItems);
  }
}
