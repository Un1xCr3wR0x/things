import { Component, HostListener, OnInit, TemplateRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import {
  AlertService,
  BilingualText,
  GosiCalendar,
  LookupService,
  WizardItem,
  DocumentItem,
  DocumentService,
  scrollToTop,
  RouterData,
  RouterDataToken,
  Role,
  BPMUpdateRequest,
  WorkFlowActions,
  RouterConstants,
  LanguageToken,
  CoreBenefitService,
  CoreAdjustmentService,
  LovList,
  SamaVerificationStatus,
  ContactDetails
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentConstants } from '@gosi-ui/features/payment/lib/shared/constants';
import {
  MiscellaneousPayment,
  BilingualMessageWrapper,
  MiscPaymentRequest,
  NewBankAccountRequest,
  MiscellaneousPaymentRequest
} from '../../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PaymentMethodDcComponent, PaymentService, showErrorMessage } from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { BankService } from '@gosi-ui/features/benefits/lib/shared/services/bank.service';
import { AttorneyDetailsWrapper, BankAccountList } from '@gosi-ui/features/benefits/lib/shared/models';
import { getAuthorizedGuardianDetails } from '@gosi-ui/features/benefits/lib/shared/utils/heirOrDependentUtils';
import { BenefitConstants, BenefitValues, ManageBenefitService } from '@gosi-ui/features/benefits/lib/shared';
import { PersonBankDetails } from '@gosi-ui/features/contributor';

@Component({
  selector: 'pmt-return-lumpsum-sc',
  templateUrl: './misc-payment-sc.component.html',
  styleUrls: ['./misc-payment-sc.component.scss']
})
export class MiscPaymentScComponent implements OnInit, OnDestroy {
  benefitType: string;
  nin: number;
  bankResponse: BilingualMessageWrapper;
  benefitRequestId: number;
  identifier: number;
  isEditMode = true;
  isEligibleUser = false;
  lang = 'en';
  gccFlag = false;
  mofFlag = false;
  isPaymentSaved = false;
  isSmallScreen: boolean;
  isUserHaveBankDetails = false;
  paymentType: string;
  commonModalRef: BsModalRef;
  paymentConstants: PaymentConstants;
  currentTab = 0;
  documents: DocumentItem[];
  paymentWizards: WizardItem[] = [];
  payDetails: MiscellaneousPayment;
  parentForm: FormGroup;
  netAmount: number;
  documentForm: FormGroup = new FormGroup({});
  bankName: BilingualText;
  bankDetails;
  paymentSuccessResponse;
  referenceNumber;
  isSaveDisabled = true;
  transactionId = 201515;
  paymentSuccessMsg;
  bankAccountList: BankAccountList;
  payeeList: LovList = new LovList([]);
  paymentMethodList$: Observable<LovList>;
  attorneyDetailsWrapper = <AttorneyDetailsWrapper[]>[];
  guardianList = <AttorneyDetailsWrapper[]>[];
  paymentForm: FormGroup;
  systemRunDate: GosiCalendar;
  personId: Number;
  savedPayeType: BilingualText;
  savedPayMethod: BilingualText;
  BenefitValues = BenefitValues;
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  //571461 International
  valNonsaudiBankDetails: PersonBankDetails = new PersonBankDetails();
  contactDetails: ContactDetails;
  
  @ViewChild('miscPayWizard', { static: false })
  miscPayWizard: ProgressWizardDcComponent;
  @ViewChild('paymentDetailsTab', { static: false })
  paymentDetailsTab: TabsetComponent;
  @ViewChild('paymentDetailsComponent', { static: false })
  paymentDetailsComponent: PaymentMethodDcComponent;
  modalRef: BsModalRef<Object>;
  transactionNumber;
  registrationNo;
  miscPaymentId;
  taskId: string;
  user: string;
  validatorDetails;
  fromValidator: Boolean = false;
  role;
  isDocError: Boolean = false;
  sin: number;
  listYesNo$: Observable<LovList>;
  showError=false;

  constructor(
    private location: Location,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly paymentService: PaymentService,
    readonly bankService: BankService,
    public route: ActivatedRoute,
    readonly manageBenefitService: ManageBenefitService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreAdjustmentService: CoreAdjustmentService
  ) {}

  ngOnInit(): void {
    this.parentForm = new FormGroup({});
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initializeWizard();
    this.getScreenSize();
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.paymentForm = new FormGroup({});
    this.getSystemRunDate();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    this.initialisePayeeType();
    this.initPaymentMethod();
    // get the identifier from the query param
    this.route.queryParams.subscribe(params => {
      if (params.from === 'validator') {
        this.fromValidator = true;
        this.initialiseView(this.routerData);
        this.getValidatorDetailService();
      } else {
        this.identifier = params.identifier;
        this.sin = this.coreAdjustmentService?.sin;
        this.getPaymentDetails(this.identifier);
      }
    });
  }
  /** Method to assign router data */
  initialiseView(routerData) {
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.identifier = +this.routerData.idParams.get('id');
      this.transactionNumber = this.routerData.idParams.get('referenceNo');
      this.miscPaymentId = this.routerData.idParams.get('miscPaymentId');
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.role = payload.assignedRole;
      this.sin = payload.payeeSourceId;
    }
  }
  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(
      res => {
        this.systemRunDate = res;
        // this.maxDate = moment(res.gregorian).toDate();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  /** Method to initialise progress wizard */
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(PaymentConstants.PAYMENT_DETAILS, 'file-invoice-dollar')); //TODO: change icon
    wizardItems.push(new WizardItem(PaymentConstants.DOCUMENTS, 'file-alt'));
    this.paymentWizards = wizardItems;
    this.paymentWizards[this.currentTab].isActive = true;
    this.paymentWizards[this.currentTab].isDisabled = false;
  }

  /**this method will toggle the payment method */
  paymentTypeChange(paymentType) {
    if (paymentType === 'sadad') {
      this.paymentType = 'sadad';
    } else if (paymentType === 'other') {
      this.paymentType = 'other';
    }
  }
  /**The method to call the Contributor details */
  getValidatorDetailService() {
    this.paymentService.validatorDetails(this.identifier, this.miscPaymentId, this.sin).subscribe(
      data => {
        this.setData(data);
        this.setPaymentFormValues(data);
        this.getAttorneyDetailsById(this.identifier);
        // this.bankDetails = this.payDetails?.bankAccountList.filter(list => !list.ibanSamaVerified)[0];
        this.paymentService.bankDetails = this.bankDetails;
      },
      err => {
        this.setError(err);
      }
    );
  }
  setPaymentFormValues(data: MiscellaneousPaymentRequest) {
    if (
      data?.agentType?.english === BenefitValues.authorizedPerson ||
      data?.agentType?.english === BenefitValues.guardian
    ) {
      this.savedPayeType = data?.agentType;
    } else {
      this.savedPayeType = { english: 'Self', arabic: 'نفسه' };
    }
    this.savedPayMethod = { english: 'Bank Transfer', arabic: 'تحويل للبنك' };
    //571461 International
    const isNonSaudiNewIban = data?.bankAccountList?.find(eachBank=> eachBank?.isNonSaudiIBAN === true)
    if(isNonSaudiNewIban){
      this.valNonsaudiBankDetails = isNonSaudiNewIban;
    }else if(data?.newIban){
      this.valNonsaudiBankDetails = data?.bankAccountList[0];
    }
    this.contactDetails = data?.contactDetail;
  }
  /** this method get the benefitList and  bankAccountList using the miscellaneous-payment API*/
  getPaymentDetails(identifier: number) {
    this.paymentService.fetchPaymentdetails(identifier, this.sin).subscribe(
      res => {
        this.setData(res);
        this.getAttorneyDetailsById(this.identifier);
      },
      err => {
        this.setError(err);
      }
    );
  }
  /** Method to assign payment details */
  setData(res) {
    this.payDetails = res;
    this.netAmount = this.payDetails.netAmount;
    this.personId = this.payDetails?.person?.personId;
    this.isEligibleUser = true;
    if (this.payDetails.bankAccountList) {
      this.isUserHaveBankDetails = true;
    }
    this.contactDetails = res?.contactDetail;
  }
  /** Method to set error message */
  setError(err) {
    if (err.status === 500 || err.status === 422 || err.status === 400) {
      this.isEligibleUser = false;
      this.showErrorMessage(err);
    }
  }
  /** Method to set bank deails */
  setBankRequest(request) {
    this.bankDetails = request;
  }
  /** Method to get bank name and set bank details request */
  // saveBankDetails(requestData) {
  //   this.lookupService.getBankForIban(requestData?.newBankAccount?.bankCode).subscribe(res => {
  //     this.bankName = res.items[0]?.value;
  //     if (this.bankName) this.isSaveDisabled = false;
  //     else this.isSaveDisabled = true;
  //   });
  //   this.setBankRequest(requestData);
  // }
  /** this function execute when user clicks on the save and next button  */
  saveAndNext() {
    // if (!Object(this.bankDetails).hasOwnProperty('bankAccountId') && !this.bankDetails?.newBankAccount?.bankName) {
    //   this.bankDetails.newBankAccount.bankName = this.bankName;
    // }
    const paymentPayload = this.setPaymentRequestPayload();
    if (this.paymentSuccessResponse || this.miscPaymentId) {
      paymentPayload.referenceNo = this.paymentSuccessResponse?.referenceNo || this.transactionNumber;
      this.paymentService
        .editPaymentDetails(
          paymentPayload,
          this.identifier,
          this.paymentSuccessResponse?.miscPaymentId || this.miscPaymentId,
          this.sin
        )
        .subscribe(res => {
          this.paymentSuccessMsg = res.message;
          this.getRequiredDocument('MISCELLANEOUS_PAYMENT', 'MISCELLANEOUS_PAYMENT_REQUEST', true);
          this.nextTab();
        },
        err =>   {
          this.showError = true;
          this.showErrorMessage(err);
        }
        );
    } else {
      this.paymentService.submitPaymentDetails(paymentPayload, this.identifier, this.sin).subscribe(res => {
        this.paymentSuccessResponse = res;
        this.getRequiredDocument('MISCELLANEOUS_PAYMENT', 'MISCELLANEOUS_PAYMENT_REQUEST', true);
        this.nextTab();
      },
      err =>  {
        this.showError = true;
        this.showErrorMessage(err);
      }
      );
    }
  }
  // ContactDetails(contact: ContactDetails){
  //  this.contactDetails = contact;
  // }
  setPaymentRequestPayload() {
    const payload = new MiscPaymentRequest();
    const payeeForm = this.paymentForm.get('payeeForm');
    if (payeeForm.get('payeeType')?.get('english')?.value === BenefitValues.authorizedPerson) {
      payload.agentId = payeeForm.get('authorizedPersonId')?.value;
      payload.agentType = { english: 'Authorized Person', arabic: 'وكيل' };
    }
    if (payeeForm.get('payeeType')?.get('english')?.value === BenefitValues.guardian) {
      payload.agentId = payeeForm.get('guardianPersonId')?.value;
      payload.agentType = { english: 'Guardian', arabic: 'ولي' };
    }
    if (payeeForm.get('bankAccount')?.get('isNewlyAdded')?.value) {
      payload.newBankAccount = new NewBankAccountRequest();
      payload.newBankAccount.bankName = payeeForm.get('bankAccount')?.get('bankName')?.value;
      payload.newBankAccount.ibanBankAccountNo = payeeForm.get('bankAccount')?.get('ibanBankAccountNo').value;
      payload.newBankAccount.isNonSaudiIBAN = payeeForm.get('bankAccount')?.get('nationality').get('english')?.value === BenefitValues.yes ? false: true;
      //payeeForm.get('bankAccount')?.get('isNonSaudiIBAN')?.value;
      payload.newBankAccount.swiftCode = payeeForm.get('bankAccount')?.get('swiftCode')?.value;
      payload.newIban = true;
    } else {
      payload.bankAccountId = payeeForm.get('bankAccount')?.get('bankAccountId')?.value;
      payload.ibanBankAccountNo = payeeForm.get('bankAccount')?.get('ibanBankAccountNo').value;
    }
    this.contactDetails = this.paymentDetailsComponent?.setAdressRelatedValues();
    if (this.contactDetails) payload.contactDetail = this.contactDetails;
    if(!this.paymentDetailsComponent?.addressComponent?.parentForm?.pristine) payload.isNewContactDetails = true;
    return payload;
  }
  /*** ----------------------------Helper Functions --------------------- */

  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }
  checkAddessDetails(address) {
    return address ? true : false;
  }
  initialiseCityLookup() {
    this.cityList$ = this.lookupService.getCityList();
  }

  /** Initializing countryList variable */
  initialiseCountryLookup() {
    this.countryList$ = this.lookupService.getCountryList();
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }

  /*** -------------tab relatedfunctions----------------- */

  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /** Method to navigate to next tab */
  nextTab() {
    scrollToTop();
    this.currentTab = 1;
    this.alertService.clearAlerts();
    this.miscPayWizard.setNextItem(this.currentTab);
    if (this.isDocError) {
      this.alertService.showMandatoryDocumentsError();
    }
  }
  /** Method to navigate to previous tab */
  navigateToPreviousTab() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 0;
    this.miscPayWizard.setPreviousItem(this.currentTab);
  }
  /***----------Pop Up functions---------------  */
  /** This method is to show Modal */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    if (this.identifier && this.miscPaymentId && this.transactionNumber && this.paymentSuccessMsg?.english)
      this.paymentService
        .revertPayment(this.identifier, this.miscPaymentId, this.transactionNumber, this.sin)
        .subscribe();
    this.location.back();
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  /** Method to get required document list. */
  getRequiredDocument(transactionId: string, transactionType: string, isRefreshRequired = false) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(res => {
      this.documents = res;
      if (isRefreshRequired)
        this.documents.forEach(doc => {
          this.refreshDocument(doc);
        });
    });
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.paymentSuccessResponse?.miscPaymentId || this.miscPaymentId,
          'MISCELLANEOUS_PAYMENT',
          'MISCELLANEOUS_PAYMENT_REQUEST',
          this.paymentSuccessResponse?.referenceNo || this.transactionNumber
        )
        .subscribe(res => {
          doc = res;
        });
    }
  }
  /** Method to navigate on cancel btn click in doc upload */
  navigateToPaymentSearch() {
    this.paymentService
      .revertPayment(
        this.identifier,
        this.paymentSuccessResponse?.miscPaymentId || this.miscPaymentId,
        this.paymentSuccessResponse?.referenceNo || this.transactionNumber,
        this.sin
      )
      .subscribe();
    this.location.back();
  }
  /** Method to submit documents */
  onSubmitDocuments() {
    if (this.documentService.checkMandatoryDocuments(this.documents)) {
      this.isDocError = false;
      this.paymentService
        .patchPaymentDetails(
          this.identifier,
          this.paymentSuccessResponse?.miscPaymentId || this.miscPaymentId,
          this.paymentSuccessResponse?.referenceNo || this.transactionNumber,
          this.parentForm.get('documentsForm').get('comments').value,
          this.sin
        )
        .subscribe(res => {
          if (res) {
            if (this.role && this.role === Role.VALIDATOR_1) {
              this.saveWorkFlowInEdit();
            } else {
              this.setSuccess(res);
            }
          }
        },
        err =>  {
          this.showError = true;
          this.showErrorMessage(err)
        }
        );
    } else {
      this.isDocError = true;
      this.alertService.showMandatoryDocumentsError();
    }
  }
  /** Method to disable save */
  // ibanTypeChange(isdisable) {
  //   this.isSaveDisabled = isdisable;
  // }
  /** Method to set success message */
  setSuccess(res) {
    this.alertService.showSuccess(res.message);
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)]);
    //this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /** Method to save workflow by validator */
  saveWorkFlowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = this.parentForm.get('documentsForm').get('comments').value || '';
    this.paymentService.handleAnnuityWorkflowActions(workflowData).subscribe(response => {
      if (response) {
        this.alertService.showSuccessByKey('PAYMENT.TRANSACTION-SUBMIT-MESSAGE');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }
    });
  }
  ngOnDestroy() {
    this.alertService.clearAllWarningAlerts();
  }
  /** Payment Related Functions */
  getAttorneyDetailsById(id: number, agentId?: number, getGuardianDetails?: boolean) {
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      // this.attorneyDetailsWrapper = res;
      this.attorneyDetailsWrapper = getAuthorizedGuardianDetails(res, this.systemRunDate).authorizedPersonDetails;
      this.guardianList = getAuthorizedGuardianDetails(res, this.systemRunDate).guardianPersonDetails;
    });
  }
  getBankDetails(identity) {
    if (identity) {
      this.bankService.getBankAccountList(+identity, null).subscribe(bankList => {
        if (bankList)
          this.bankAccountList = {
            ...bankList,
            bankAccountList: bankList.bankAccountList.filter(
              account => account?.isNonSaudiIBAN ? true : account.verificationStatus === SamaVerificationStatus.VERIFIED
            )
          };
      });
    }
  }
  getBankName(bankCode: number) {
    this.lookupService.getBank(bankCode).subscribe(
      res => {
        if (res.items[0]) {
          this.bankName = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  initialisePayeeType() {
    this.lookupService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }
  initPaymentMethod() {
    this.paymentMethodList$ = this.lookupService.initialisePaymentMode();
  }
}
