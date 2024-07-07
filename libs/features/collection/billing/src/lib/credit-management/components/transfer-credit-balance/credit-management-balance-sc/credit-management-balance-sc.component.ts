import { Component, Inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  EstablishmentDetails,
  BranchDetails,
  PaymentResponse,
  CreditBalanceDetails,
  CreditManagmentRequest,
  RecipientAmountDetails
} from '../../../../shared/models';
import {
  ApplicationTypeToken,
  RouterDataToken,
  LanguageToken,
  RouterData,
  StorageService,
  ApplicationTypeEnum,
  AlertService,
  WizardItem,
  scrollToTop,
  DocumentItem,
  DocumentService,
  UuidGeneratorService,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  WorkflowService,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BehaviorSubject, throwError, noop, of } from 'rxjs';
import { BillingConstants, RouteConstants } from '../../../../shared/constants';
import {
  EstablishmentService,
  CreditManagementService,
  BillingRoutingService,
  ContributionPaymentService
} from '../../../../shared/services';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreditManagmentBalanceBaseScComponent } from '../../../../shared/components/base/credit-managment-balance-base-sc.component';

@Component({
  selector: 'blg-credit-management-balance-sc',
  templateUrl: './credit-management-balance-sc.component.html',
  styleUrls: ['./credit-management-balance-sc.component.scss']
})
export class CreditManagementBalanceScComponent extends CreditManagmentBalanceBaseScComponent implements OnInit {
  /*-------------------Local Variables-------------------------- */
  lang = '';
  isAppPrivate: boolean;
  regNumber: number;
  searchResult = true;
  creditManagementWizardItems: WizardItem[] = [];
  currentTab = 0;
  fieldArray = [];
  creditDetailsReq: CreditManagmentRequest;
  paymentResponse: PaymentResponse = new PaymentResponse();
  isSuccess = false;
  branchDetails: BranchDetails[] = [];
  documentList: DocumentItem[] = [];
  successMessages: BilingualText;
  successMessageValue: BilingualText;
  uuid: string;
  modalRef: BsModalRef;
  branchValues = [];
  creditBalanceDetails: CreditBalanceDetails;
  currentBalance: CreditBalanceDetails;
  isValid = false;
  errorFlag = false;
  isSave = false;
  establishmentValues: EstablishmentDetails;
  isPrivateEstablishment = false;
  isPrivateSearch = true;
  isNotPrivateSearch = true;
  isBranchSearch = false;
  isGov = false;
  isMain = false;
  isAddDetils = false;
  inWorkflow = false;
  receiptNumber: number;
  requestNo: number;
  referenceNumber: number;
  currentBalanceList = [];
  recipientDetail: RecipientAmountDetails[];
  isGcc = false;
  /** Constants */
  documentTransactionId = BillingConstants.CREDIT_MANAGEMENT_DOCUMENT_TRANSACTION_ID;
  creditManagmentMainForm: FormGroup = new FormGroup({});
  /** Child components */
  @ViewChild('creditManagementWizard', { static: false })
  creditManagementWizard: ProgressWizardDcComponent;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly storageService: StorageService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly router: Router,
    private uuidGeneratorService: UuidGeneratorService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    readonly routingService: BillingRoutingService,
    readonly creditManagementService: CreditManagementService,
    readonly workflowService: WorkflowService
  ) {
    super(establishmentService, alertService, creditManagementService, documentService, routingService, route);
  }
  // Method to initailialise task
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    /** Method to identify the mode of transaction. */
    this.identifyModeOfTransaction();
    //Check whether edit mode or not.
    if (this.inWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.requestNo = payload.requestId ? Number(payload.requestId) : null;
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.initialiseViewForEdit(payload);
        this.initializeWizardDetails();
      }
    } else {
      this.uuid = this.uuidGeneratorService.getUuid();
      this.regNumber = this.establishmentRegistrationNo.value;
      this.getEstablishmentDetail(this.regNumber);

      this.initializeWizardDetails();
    }
  }
  /**
   * This method is used to search establishment details.
   * @param idNumber
   * @param branchRequired
   */
  getEstablishmentDetail(regNumber: number) {
    this.regNumber = regNumber;
    this.establishmentService.getEstablishment(regNumber).subscribe(
      establishment => {
        this.establishmentDetails = establishment;
        this.isGcc = this.establishmentDetails?.gccCountry;
        if (establishment.status !== null && establishment.status !== undefined) {
          if (
            establishment.status.english === BillingConstants.REG_STATUS ||
            establishment.status.english === BillingConstants.REOPENED_STATUS
          ) {
            this.contributionPaymentService.getWorkFlowStatus(regNumber).subscribe(res => {
              res.forEach(value => {
                if (value && !this.isGcc) {
                  if (value.type === BillingConstants.LEGAL_ENTITY_CHANGE) {
                    this.alertService.showErrorByKey('BILLING.CHANGE-IN-LEGAL-ENTITY');
                    this.searchResult = true;
                  } else if (value.type === BillingConstants.DELINK_BRANCH_CHANGE) {
                    this.alertService.showErrorByKey('BILLING.CHANGE-IN-DELINK');
                    this.searchResult = true;
                  } else if (value.type === BillingConstants.CHANGE_OWNER) {
                    this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                    this.searchResult = true;
                  } else {
                    this.searchResult = false;
                    this.getDetails();
                  }
                } else {
                  this.getDetails();
                }
              });
              this.getDetails();
            });
          } else {
            this.searchResult = true;
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
          }
        }
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  getDetails() {
    this.alertService.clearAlerts();
    if (
      this.establishmentDetails.legalEntity.english === BillingConstants.SEMI_GOVERNMENT ||
      this.establishmentDetails.legalEntity.english === BillingConstants.GOVERNMENT
    ) {
      this.isPrivateEstablishment = false;
      if (this.establishmentDetails.establishmentType.english === 'Main') this.isMain = true;
      else this.isMain = false;
    } else {
      this.isPrivateEstablishment = true;
      if (this.establishmentDetails.establishmentType.english === 'Main') this.isMain = true;
      else this.isMain = false;
    }
    if (this.establishmentDetails.establishmentType.english === 'Main') this.isMain = true;
    else this.isMain = false;
    this.searchResult = false;
    this.getAvailableBalanceDetails(this.regNumber);
    this.getBranchDetails(this.regNumber);
  }
  /**
   * This method is used to search establishment details.
   * @param idNumber
   */
  getBranchDetails(regNumber: number) {
    this.establishmentService.getBranchDetails(regNumber).subscribe(
      branches => {
        this.branchDetails = branches;
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  /* Method to intialise the view in edit mode */
  initialiseViewForEdit(payload) {
    this.regNumber = payload.registrationNo;
    this.receiptNumber = payload.id;
    this.searchResult = false;
    this.getEstablishmentDetail(this.regNumber);
    this.getAllcreditDetails(this.regNumber, this.referenceNumber);
  }

  /** Method to initialize the navigation wizards. */
  initializeWizardDetails() {
    this.creditManagementWizardItems = this.getWizards();
    this.creditManagementWizardItems[0].isActive = true;
    this.creditManagementWizardItems[0].isDisabled = false;
  }
  /** Method to get wizard items */
  getWizards() {
    const wizardItem: WizardItem[] = [];
    wizardItem.push(new WizardItem(BillingConstants.TRANSFER_CREDIT_DETAILS, 'hand-holding-usd'));
    if (this.isAppPrivate) {
      wizardItem.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    }
    if (!this.isAppPrivate) {
      wizardItem.push(new WizardItem(BillingConstants.TERMS_CONDITIONS, 'file-signature'));
    }
    return wizardItem;
  }
  /** Method to search branch details. */
  searchBranches(registerNumber: string) {
    this.isPrivateSearch = false;
    this.isNotPrivateSearch = false;
    this.isBranchSearch = false;
    this.alertService.clearAlerts();
    this.fieldArray = [];
    if (this.isPrivateEstablishment) {
      if (Number(this.regNumber) === Number(registerNumber)) {
        this.isPrivateSearch = false;
      } else {
        this.branchDetails.forEach(res => {
          if (res.registrationNo === Number(registerNumber) && this.regNumber !== Number(registerNumber)) {
            this.getBranch(res);
            this.isPrivateSearch = true;
          }
          if (!this.isMain) {
            if (res.registrationNo === Number(registerNumber)) {
              this.isBranchSearch = true;
            }
          }
        });
      }
      if (!this.isPrivateSearch) {
        this.alertService.showErrorByKey('BILLING.ESTABLISHEMNT-CANNOT-ADDED-TO-TRANSFER-CREDIT');
      }
    } else {
      this.branchDetails.forEach(res => {
        if (res.registrationNo === Number(registerNumber)) {
          this.isBranchSearch = false;
          this.isNotPrivateSearch = true;
        } else this.isBranchSearch = true;
        if (!this.isMain) {
          if (res.registrationNo === Number(registerNumber)) {
            this.isBranchSearch = true;
          }
        }
      });
      this.establishmentService.getEstablishment(Number(registerNumber)).subscribe(
        estbalishemnt => {
          this.establishmentValues = estbalishemnt;
          if (!this.establishmentDetails?.ppaEstablishment && this.establishmentValues?.ppaEstablishment) {
            this.alertService.showErrorByKey('BILLING.GOSI-TO-PPA-ERROR');
          } else if (this.establishmentDetails?.ppaEstablishment && !this.establishmentValues?.ppaEstablishment) {
            this.alertService.showErrorByKey('BILLING.GOSI-TO-PPA-ERROR');
          } else if (
            this.establishmentValues.gccEstablishment &&
            this.establishmentValues.gccEstablishment.gccCountry === true
          ) {
            this.alertService.showErrorByKey('BILLING.ESTABLISHEMNT-CANNOT-ADDED-TO-TRANSFER-CREDIT');
          } else if (Number(registerNumber) === Number(this.regNumber)) {
            this.alertService.showErrorByKey('BILLING.ESTABLISHEMNT-CANNOT-ADDED-TO-TRANSFER-CREDIT');
          } else if (this.establishmentValues?.status?.english === 'Closed') {
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
          } else {
            if (this.establishmentValues) {
              this.getBranch(this.establishmentValues);
            }
          }
        },
        err => this.alertService.showError(err.error.message)
      );
    }
  }
  /** Method to save details. */
  saveCreditDetails() {
    if (this.creditManagmentMainForm.controls.branchBreakupForm.value.length !== 0) {
      this.creditManagementService.setPenalityWaiverReason(true);
      this.isSave = true;
      this.creditDetailsReq = bindToObject(
        new CreditManagmentRequest(),
        this.creditManagmentMainForm.get('branchBreakupForm').value
      );
      this.creditDetailsReq.recipientDetail = this.creditManagmentMainForm.get('branchBreakupForm').value;
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  checkFormValidity(form: AbstractControl) {
    if (form) {
      return form.valid;
    }
    return false;
  }
  /** Method to navigate to document page. */
  confirmToDocumentPage() {
    this.currentTab = 1;
    if (!this.inWorkflow) this.retrieveScannedDocument();
    else {
      this.nextForm();
    }
  }
  selectedBranchList(list) {
    this.isAddDetils = true;
    this.fieldArray = [];
    this.branchValues = [];
    for (let i = 0; i < list.length; i++) {
      this.getBranch(list[i]);
    }
  }
  /** Method to navigate back to previous sections. */
  previousFormDetails() {
    this.isSave = false;
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.creditManagementWizard.setPreviousItem(this.currentTab);
  }
  /** Method to cancel document upload. */
  cancelCreditUpload() {
    if (this.inWorkflow) {
      this.creditManagementService.revertDocumentDetails(this.regNumber, this.requestNo).subscribe(
        () => this.navigateToBack(this.isAppPrivate),
        err => this.alertService.showError(err.error.message)
      );
    } else if (!this.inWorkflow) this.cancelDetails();
  }
  /** Method to cancel available credit page. */
  cancelAvailableCreditPage() {
    if (this.inWorkflow) this.navigateToBack(this.isAppPrivate);
    else this.cancelDetails();
  }
  /** Method tonavigate back to home screen*/
  cancelDetails() {
    if (!this.isAppPrivate) this.router.navigate(['/home/contributor']);
    else this.router.navigate(['home']);
  }
  /**
   * Method to retrieve scanned documents based on receipt mode.
   * @param receiptMode recept mode
   */
  retrieveScannedDocument() {
    this.getDocuments().subscribe((document: DocumentItem[]) => {
      this.documentList = document;
      this.documentList.forEach(doc => {
        this.refreshDocuments(doc);
      });
      this.nextForm();
    });
  }
  /**
   * Method to fetch the required document for scanning.
   */
  getDocuments() {
    return this.documentService
      .getRequiredDocuments(
        BillingConstants.CREDIT_MANAGEMENT_ID,
        this.isAppPrivate
          ? BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE
          : BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error)),
        tap(resp => (this.documentList = resp))
      );
  }

  submitDocumentPage() {
    if (this.checkMandatoryDocuments()) {
      this.alertService.clearAlerts();
      if (!this.isAppPrivate) {
        this.currentTab = 2;
        this.creditManagementWizard.setNextItem(this.currentTab);
        scrollToTop();
      } else {
        this.createFormData();
        this.submitCreditTransferDetails();
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  // Method to submit credit deatils
  submittPage(template: TemplateRef<HTMLElement>, size: string) {
    this.createFormData();
    if (!this.isValid) {
      const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
      this.modalRef = this.modalService.show(template, config);
    } else {
      this.submitCreditTransferDetails();
    }
  }
  // Method to submit transfer credit deatils
  submitCreditTransferDetails() {
    this.alertService.clearAlerts();
    this.creditDetailsReq = bindToObject(this.creditDetailsReq, this.creditManagmentMainForm.get('commentForm').value);
    this.creditDetailsReq.uuid = this.uuid;
    if (!this.inWorkflow) {
      this.creditManagementService
        .submitCreditMangmentDetails(this.regNumber, this.creditDetailsReq)
        .pipe(
          tap(response => {
            this.paymentResponse.fromJsonToObject(response);
            this.successMessages = this.paymentResponse.message; //Setting success messages
            if (this.isAppPrivate) {
              this.searchResult = true;
              this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.regNumber)]);
            }
            if (this.successMessages) {
              this.isSuccess = true;
            }
            this.alertService.showSuccess(this.successMessages, null, 10);
          }),
          catchError(errs => {
            this.alertService.showError(errs.error.message);
            return throwError(errs);
          })
        )
        .subscribe(noop, noop);
    } else {
      this.creditManagementService
        .updateCreditMangmentDetails(this.regNumber, this.requestNo, this.creditDetailsReq)
        .pipe(
          tap(res => {
            this.paymentResponse.fromJsonToObject(res);
            this.successMessageValue = this.paymentResponse.message; //Setting success message
            if (this.successMessageValue) {
              this.isSuccess = true;
              if (this.isAppPrivate) {
                this.searchResult = true;
                this.router.navigate(['home/billing/credit-transfer/establishment-credit-transfer/request']);
              }
            }
            this.alertService.showSuccess(this.successMessageValue, null, 10);
          }),
          catchError(err => {
            this.alertService.showError(err.error.message);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
      this.handleWorkflowActions();
    }
  }
  handleWorkflowActions() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.isExternalComment = !this.isAppPrivate && this.inWorkflow ? true : false;
    bpmUpdateRequest.commentScope = 'BPM';
    if (
      this.creditManagmentMainForm &&
      this.creditManagmentMainForm.value &&
      this.creditManagmentMainForm.value.commentForm
    )
      bpmUpdateRequest.comments = this.creditManagmentMainForm.value.commentForm.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
      () => this.navigateBackToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
  // * Method to cancel the cancel modals
  popupCancel() {
    if (this.isSerach) this.getBranchDetails(this.regNumber);
  }
}
